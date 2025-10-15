import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#0B132B',
  card: '#1C2541',
  primary: '#5EFCA5',
  text: '#E6E8F0',
  subtext: '#99A1B3',
  yes: '#22c55e',
  no: '#ef4444',
  maybe: '#f59e0b',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Centers inner content and adds left/right space on wide screens
  content: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 16,
    marginTop: 6,
  },
  actions: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  screenPad: {
    flex: 1,
    paddingVertical: 24,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    color: '#0b132b',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSmall: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  badge: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  badgeYes: {
    borderWidth: 1,
    borderColor: COLORS.yes,
  },
  badgeMaybe: {
    borderWidth: 1,
    borderColor: COLORS.maybe,
  },
  badgeNo: {
    borderWidth: 1,
    borderColor: COLORS.no,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.subtext,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  qCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  qLabel: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  qOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionTitle: {
    color: COLORS.subtext,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  optBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.subtext,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  optText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  matchItem: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  matchText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  choicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: COLORS.subtext,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  pillText: {
    color: COLORS.subtext,
    fontWeight: '600',
    fontSize: 12,
  },
});
