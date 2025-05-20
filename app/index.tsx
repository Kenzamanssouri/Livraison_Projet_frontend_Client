import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Globe, ChevronRight } from 'lucide-react-native';
import { MoroccanPattern } from '@/components/MoroccanPattern';
import { Logo } from '@/components/Logo';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocalization();
  const { theme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <MoroccanPattern />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => setLocale(locale === 'fr' ? 'ar' : 'fr')}
        >
          <Globe size={20} color={colors.text} />
          <Text style={[styles.langText, { color: colors.text }]}>
            {locale === 'fr' ? 'العربية' : 'Français'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Logo size="large" />

        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/image_page_acc.webp')}
            style={styles.image}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {t('welcome')}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t('decouvrerRestau')}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.primaryButtonText}>{t('login')}</Text>
            <ChevronRight size={20} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              {t('createAccount')}
            </Text>
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={() => router.push('/(app)/(tabs)')}
          >
            <Text style={[styles.tertiaryButtonText, { color: colors.textSecondary }]}>
              Continuer en tant qu'invité
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Layout.spacing.lg,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.full,
  },
  langText: {
    ...Typography.labelMedium,
    marginLeft: 8,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl, // bottom padding for scroll content spacing
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    marginVertical: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...Typography.displayMedium,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  description: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  buttonsContainer: {
    width: '100%',
    gap: Layout.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary.default,
  },
  primaryButtonText: {
    ...Typography.labelLarge,
    color: Colors.white,
    marginRight: Layout.spacing.xs,
  },
  secondaryButton: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
  },
  secondaryButtonText: {
    ...Typography.labelLarge,
    marginRight: Layout.spacing.xs,
  },
  tertiaryButton: {
    backgroundColor: Colors.transparent,
  },
  tertiaryButtonText: {
    ...Typography.labelMedium,
  },
});
