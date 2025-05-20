import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail, Lock, Globe } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocalization();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // reset error first
    try {
      const response = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          motDePasse: password,
          role:0,
        }),
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      console.log('Token reçu du backend :', data.token);

      try {
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('userToken', data.token);
        } else {
          await SecureStore.setItemAsync('userToken', data.token);
        }
      } catch (err) {
        console.error("Erreur lors de l'enregistrement du token :", err);
        Alert.alert("Attention", "Le token n'a pas pu être enregistré localement.");
      }

      Alert.alert('Bienvenue', 'Connexion réussie !');
      router.replace('/(app)/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    router.replace('/(app)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={Colors.neutral[700]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.langButton} onPress={() => setLocale(locale === 'fr' ? 'ar' : 'fr')}>
              <Globe size={20} color={Colors.neutral[700]} />
              <Text style={styles.langText}>
                {locale === 'fr' ? 'العربية' : 'Français'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Delivrya</Text>
          </View>

          <Text style={[styles.title, isRTL && styles.rtlText]}>{t('login')}</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                placeholder={t('email')}
                placeholderTextColor={Colors.neutral[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                placeholder={t('password')}
                placeholderTextColor={Colors.neutral[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>{t('login')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Google')}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>{t('loginWithGoogle')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Facebook')}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>{t('loginWithFacebook')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('noAccount')}</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>{t('createAccount')}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Layout.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
  },
  backButton: {
    padding: Layout.spacing.xs,
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
    color: Colors.neutral[700],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
  },
  logo: {
    ...Typography.displayMedium,
    color: Colors.primary.default,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
    marginTop: Layout.spacing.xxl,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  form: {
    paddingHorizontal: Layout.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
    height: 56,
    paddingHorizontal: Layout.spacing.md,
  },
  inputIcon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.neutral[900],
  },
  rtlInput: {
    textAlign: 'right',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
    ...Typography.bodyMedium,
  },
  loginButton: {
    backgroundColor: Colors.primary.default,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    marginTop: Layout.spacing.md,
  },
  loginButtonText: {
    ...Typography.labelLarge,
    color: Colors.white,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[300],
  },
  orText: {
    ...Typography.labelMedium,
    color: Colors.neutral[500],
    marginHorizontal: Layout.spacing.md,
  },
  socialButtons: {
    paddingHorizontal: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: Layout.spacing.sm,
  },
  socialButtonText: {
    ...Typography.labelMedium,
    color: Colors.neutral[700],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
  },
  footerText: {
    ...Typography.bodyMedium,
    color: Colors.neutral[700],
  },
  signupLink: {
    ...Typography.bodyMedium,
    color: Colors.primary.default,
    fontWeight: '600',
    marginLeft: 4,
  },
});
