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
  const matches = useMemo(() => {
    const accept = new Set<Choice>(["like", "try"]);
    return ALL_ITEMS.filter(
      (k) =>
        accept.has(answersA[k.id] as Choice) &&
        accept.has(answersB[k.id] as Choice)
    );
  }, [answersA, answersB, ALL_ITEMS]);

  // Darstellungshilfen (Label/Farbe) für Choices
  const labelFor = (c: Choice | undefined) =>
    c === "like" ? "Mag ich" : c === "try" ? "Ausprobieren" : "Mag ich nicht";
  const colorFor = (c: Choice | undefined) =>
    c === "like" ? COLORS.yes : c === "try" ? COLORS.maybe : COLORS.no;

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
        <Questionnaire
          title={`${nameA || "Partner:in"} - deine Auswahl`}
          sections={SECTIONS}
          answers={answersA}
          onChange={(id, c) => setAnswersA((s) => ({ ...s, [id]: c }))}
          onNext={() => setStep("p2")}
        />
      )}

      {step === "p2" && (
        <Questionnaire
          title={`${nameB || "Partner:in"} - deine Auswahl`}
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

// Datentypen
type Choice = "like" | "try" | "dislike"; // Auswahl pro Frage
type Item = { id: string; label: string }; // Einzelne Frage (Kink)
type Category = { id: string; label: string; items: Item[] }; // Kategorie mit Fragen
type Answers = Record<string, Choice | undefined>; // Antworten-Map (key = Item-ID)

/**
 * Questionnaire – rendert eine Liste kategorisierter Fragen
 * Aktiviert den Weiter-Button erst, wenn alle beantwortet sind
 */
function Questionnaire({
  title,
  sections,
  answers,
  onChange,
  onNext,
}: {
  title: string;
  sections: Category[];
  answers: Answers;
  onChange: (id: string, c: Choice) => void;
  onNext: () => void;
}) {
  // Alle Items ableiten und prüfen, ob alle beantwortet wurden
  const allItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const allAnswered = allItems.every((i) => !!answers[i.id]);

  return (
    <View style={styles.screenPad}>
      <View style={styles.headerSmall}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Bitte pro Frage wählen</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {sections.map((sec) => (
          <View key={sec.id}>
            {/* Abschnittstitel */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sec.label}</Text>
            </View>
            {/* Fragen der Kategorie */}
            {sec.items.map((item) => (
              <View key={item.id} style={styles.qCard}>
                <Text style={styles.qLabel}>{item.label}</Text>
                <View style={styles.qOptionsRow}>
                  <Option
                    label="Mag ich"
                    active={answers[item.id] === "like"}
                    color={COLORS.yes}
                    onPress={() => onChange(item.id, "like")}
                  />
                  <Option
                    label="Ausprobieren"
                    active={answers[item.id] === "try"}
                    color={COLORS.maybe}
                    onPress={() => onChange(item.id, "try")}
                  />
                  <Option
                    label="Mag ich nicht"
                    active={answers[item.id] === "dislike"}
                    color={COLORS.no}
                    onPress={() => onChange(item.id, "dislike")}
                  />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          styles.buttonPrimary,
          !allAnswered ? styles.buttonDisabled : null,
        ]}
        disabled={!allAnswered}
        onPress={onNext}
      >
        <Text style={styles.buttonPrimaryText}>Weiter</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Option – Button-Pill für eine Auswahl pro Frage
 */
function Option({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optBtn,
        { borderColor: color },
        active ? { backgroundColor: color } : null,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.optText, active ? { color: "#0b132b" } : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
