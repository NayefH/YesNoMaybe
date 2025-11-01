/**
 * App-Dokumentation
 *
 * Überblick
 * - Flow: Start (welcome) → Namen (names) → Partner A (p1) → Partner B (p2) → Vergleich (compare)
 * - Datenquelle: Kategorien + Items aus JSON (`./data/kinks.json`)
 * - Matching: Es werden nur gemeinsame „Mag ich“/„Ausprobieren“ angezeigt (siehe `useMatches`)
 *
 * Nützliche Links
 * - Expo StatusBar: https://docs.expo.dev/versions/latest/sdk/status-bar/
 * - SafeAreaView: https://reactnative.dev/docs/safeareaview
 * - ScrollView: https://reactnative.dev/docs/scrollview
 * - TextInput: https://reactnative.dev/docs/textinput
 * - React useMemo (Ableitungen memoisieren): https://react.dev/reference/react/useMemo
 * - Custom Hook für Matches: ./hooks/useMatches.ts
 */
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles, COLORS } from "./styles";
import kinksData from "./data/kinks.json";
import type { Category, Item, Answers, Choice } from "./types";
import Questionnaire from "./components/Questionnaire";
import SwipeQuestionnaire from "./components/SwipeQuestionnaire";
import { labelFor, colorFor } from "./utils/choice";
import { useMatches } from "./hooks/useMatches";

/**
 * App-Überblick
 * Flow: Start (welcome) → Namen (names) → Partner A (p1) → Partner B (p2) → Vergleich (compare)
 * Daten: Kategorien + Items aus JSON (./data/kinks.json)
 * Ziel: Nur gemeinsame „Mag ich“/„Ausprobieren“ werden im Vergleich angezeigt
 */
export default function App() {
  // Kategorien (Sektionen) aus JSON laden
  const SECTIONS: Category[] = useMemo(() => kinksData as Category[], []);
  // Abgeleitete Gesamtliste aller Einzel-Items (für Validierung & Vergleich)
  const ALL_ITEMS: Item[] = useMemo(
    () => SECTIONS.flatMap((s) => s.items),
    [SECTIONS]
  );

  // UI-Schrittsteuerung (State Machine für den Ablauf)
  const [step, setStep] = useState<
    "welcome" | "names" | "p1" | "p2" | "compare"
  >("welcome");
  // Namen der beiden Partner und deren Antworten
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [answersA, setAnswersA] = useState<Answers>({});
  const [answersB, setAnswersB] = useState<Answers>({});

  // Setzt alle Eingaben zurück und springt zum Startbildschirm
  const resetAll = () => {
    setStep("welcome");
    setNameA("");
    setNameB("");
    setAnswersA({});
    setAnswersB({});
  };

  // Gemeinsame Auswahl beider Partner (nur „like“ und „try“)
  const matches = useMatches(ALL_ITEMS, answersA, answersB);

  // Darstellungshilfen (Label/Farbe) für Choices
  // Anzeige der Choices via Utils

  return (
    <SafeAreaView style={styles.container}>
      {step === "welcome" && (
        <View style={styles.content}>
          {/* Startbildschirm: Intro + CTA */}
          <View style={styles.header}>
            <Image source={require("./assets/icon.png")} style={styles.logo} />
            <Text style={styles.title}>YesNoMaybe</Text>
            <Text style={styles.subtitle}>Gemeinsam Kinks entdecken</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => setStep("names")}
            >
              <Text style={styles.buttonPrimaryText}>Los geht's</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with Expo</Text>
          </View>
        </View>
      )}

      {step === "names" && (
        <View style={styles.screenPad}>
          {/* Namen erfassen */}
          <View style={styles.headerSmall}>
            <Text style={styles.title}>Namen</Text>
            <Text style={styles.subtitle}>Wie heißt ihr?</Text>
          </View>
          <View style={{ gap: 16 }}>
            <TextInput
              style={styles.input}
              placeholder="Name 1"
              placeholderTextColor={COLORS.subtext}
              value={nameA}
              onChangeText={setNameA}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Name 2"
              placeholderTextColor={COLORS.subtext}
              value={nameB}
              onChangeText={setNameB}
              autoCapitalize="words"
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                !nameA.trim() || !nameB.trim() ? styles.buttonDisabled : null,
              ]}
              onPress={() => setStep("p1")}
              disabled={!nameA.trim() || !nameB.trim()}
            >
              <Text style={styles.buttonPrimaryText}>Weiter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === "p1" && (
        <SwipeQuestionnaire
          title={`${nameA || "Partner:in"} - wische deine Auswahl`}
          sections={SECTIONS}
          answers={answersA}
          onChange={(id, c) => setAnswersA((s) => ({ ...s, [id]: c }))}
          onNext={() => setStep("p2")}
        />
      )}

      {step === "p2" && (
        <SwipeQuestionnaire
          title={`${nameB || "Partner:in"} - wische deine Auswahl`}
          sections={SECTIONS}
          answers={answersB}
          onChange={(id, c) => setAnswersB((s) => ({ ...s, [id]: c }))}
          onNext={() => setStep("compare")}
        />
      )}

      {step === "compare" && (
        <View style={styles.screenPad}>
          {/* Vergleichsansicht */}
          <View style={styles.headerSmall}>
            <Text style={styles.title}>Eure Matches</Text>
            <Text style={styles.subtitle}>
              Gemeinsame „Mag ich“ oder „Ausprobieren“
            </Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {matches.length === 0 ? (
              <Text
                style={[
                  styles.subtitle,
                  { textAlign: "center", marginTop: 24 },
                ]}
              >
                Keine Überschneidungen gefunden.
              </Text>
            ) : (
              matches.map((k) => (
                <View key={k.id} style={styles.matchItem}>
                  <Text style={styles.matchText}>{k.label}</Text>
                  <View style={styles.choicesRow}>
                    <View
                      style={[
                        styles.pill,
                        { borderColor: colorFor(answersA[k.id]) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: colorFor(answersA[k.id]) },
                        ]}
                      >
                        {nameA || "A"}: {labelFor(answersA[k.id])}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.pill,
                        { borderColor: colorFor(answersB[k.id]) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: colorFor(answersB[k.id]) },
                        ]}
                      >
                        {nameB || "B"}: {labelFor(answersB[k.id])}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={resetAll}
            >
              <Text style={styles.buttonPrimaryText}>Neu starten</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}
