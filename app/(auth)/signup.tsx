import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Phone, Lock, MapPin, Globe } from 'lucide-react-native';

const cities = [
  'Casablanca', 
  'Rabat', 
  'Kenitra',
  'Marrakech',  
  'Fes', 
  'Tanger', 
  'Agadir', 
  'Meknes', 
  'Oujda'
];

export default function Signup() {
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocalization();

  const [prenom, setFirstName] = useState('');
  const [nom, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setPhone] = useState('');
  const [motDePasse, setPassword] = useState('');
  const [ville, setCity] = useState('');
  const [adresse, setAdresse] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [errors, setErrors] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    ville: '',
    adresse: '',
  });

  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      prenom: prenom ? '' : 'Le prénom est obligatoire.',
      nom: nom ? '' : 'Le nom est obligatoire.',
      email: email
        ? (emailRegex.test(email) ? '' : 'Format de l\'email invalide.')
        : 'L\'email est obligatoire.',
      telephone: telephone ? '' : 'Le numéro de téléphone est obligatoire.',
      motDePasse: motDePasse ? '' : 'Le mot de passe est obligatoire.',
      ville: ville ? '' : 'La ville est obligatoire.',
      adresse: adresse ? '' : 'L\'adresse est obligatoire.',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom,
          nom,
          email,
          telephone,
          motDePasse,
          ville,
          adresse,
          role: 0,
        }),
      });

      if (response.status === 409) {
        const message = await response.text();
        setErrors(prev => ({ ...prev, email: message || "Cet email est déjà utilisé." }));
        return;
      }

      if (!response.ok) {
        throw new Error('Inscription échouée');
      }

      Alert.alert('Succès', 'Inscription réussie');
      // router.push('/(auth)/verify');
      router.replace('/(auth)/login');

    } catch (error) {
      Alert.alert('Erreur', (error as Error).message);
    }
  };

  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCityDropdown(false);
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

          <Text style={[styles.title, isRTL && styles.rtlText]}>{t('signup')}</Text>

          <View style={styles.form}>
            {/* Inputs */}
            {[
              { icon: User, placeholder: t('firstName'), value: prenom, setter: setFirstName, error: errors.prenom, field: 'prenom' },
              { icon: User, placeholder: t('lastName'), value: nom, setter: setLastName, error: errors.nom, field: 'nom' },
              { icon: Mail, placeholder: t('email'), value: email, setter: setEmail, error: errors.email, field: 'email', keyboardType: 'email-address' },
              { icon: Phone, placeholder: t('phone'), value: telephone, setter: setPhone, error: errors.telephone, field: 'telephone', keyboardType: 'phone-pad' },
              { icon: Lock, placeholder: t('password'), value: motDePasse, setter: setPassword, error: errors.motDePasse, field: 'motDePasse', secureTextEntry: true },
            ].map(({ icon: Icon, placeholder, value, setter, error, keyboardType, secureTextEntry }, index) => (
              <View style={styles.field} key={index}>
                <View style={[styles.inputContainer, error && styles.errorInputContainer]}>
                  <Icon size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, isRTL && styles.rtlInput]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.neutral[400]}
                    value={value}
                    onChangeText={setter}
                    textAlign={isRTL ? 'right' : 'left'}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
            ))}

            {/* Ville */}
            <View style={styles.field}>
              <TouchableOpacity style={[styles.inputContainer, errors.ville && styles.errorInputContainer]} onPress={() => setShowCityDropdown(!showCityDropdown)}>
                <MapPin size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
                <Text style={[styles.input, isRTL && styles.rtlInput, !ville && { color: Colors.neutral[400] }]}>
                  {ville || t('city')}
                </Text>
              </TouchableOpacity>
              {errors.ville ? <Text style={styles.errorText}>{errors.ville}</Text> : null}
              {showCityDropdown && (
                <View style={styles.dropdown}>
                  {cities.map((cityItem, index) => (
                    <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => selectCity(cityItem)}>
                      <Text style={styles.dropdownItemText}>{cityItem}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Adresse */}
            <View style={styles.field}>
              <View style={[styles.inputContainer, errors.adresse && styles.errorInputContainer]}>
                <MapPin size={20} color={Colors.neutral[500]} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isRTL && styles.rtlInput]}
                  placeholder={t('adresse')}
                  placeholderTextColor={Colors.neutral[400]}
                  value={adresse}
                  onChangeText={setAdresse}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              {errors.adresse ? <Text style={styles.errorText}>{errors.adresse}</Text> : null}
            </View>

            {/* Signup Button */}
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>{t('signup')}</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('alreadyHaveAccount')}</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>{t('login')}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { flexGrow: 1, paddingBottom: Layout.spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Layout.spacing.lg, marginTop: Layout.spacing.md },
  backButton: { padding: Layout.spacing.xs },
  langButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[100], paddingHorizontal: 12, paddingVertical: 8, borderRadius: Layout.borderRadius.full },
  langText: { ...Typography.labelMedium, marginLeft: 8, color: Colors.neutral[700] },
  title: { ...Typography.headingLarge, color: Colors.neutral[900], marginTop: Layout.spacing.xl, marginBottom: Layout.spacing.xl, textAlign: 'center' },
  rtlText: { textAlign: 'right' },
  form: { paddingHorizontal: Layout.spacing.xl },
  field: { marginBottom: Layout.spacing.lg },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.neutral[300], borderRadius: Layout.borderRadius.md, height: 56, paddingHorizontal: Layout.spacing.md },
  errorInputContainer: { borderColor: Colors.error.default },
  inputIcon: { marginRight: Layout.spacing.sm },
  input: { flex: 1, ...Typography.bodyMedium, color: Colors.neutral[900] },
  rtlInput: { textAlign: 'right' },
  errorText: { color: Colors.error.default, marginTop: 4, fontSize: 12 },
  dropdown: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.neutral[300], borderRadius: Layout.borderRadius.md, marginTop: -Layout.spacing.lg, marginBottom: Layout.spacing.lg, maxHeight: 200, zIndex: 1000 },
  dropdownItem: { paddingVertical: Layout.spacing.sm, paddingHorizontal: Layout.spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.neutral[200] },
  dropdownItemText: { ...Typography.bodyMedium, color: Colors.neutral[900] },
  signupButton: { backgroundColor: Colors.primary.default, borderRadius: Layout.borderRadius.md, paddingVertical: Layout.spacing.md, alignItems: 'center', marginTop: Layout.spacing.md },
  signupButtonText: { ...Typography.labelLarge, color: Colors.white },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Layout.spacing.xl },
  footerText: { ...Typography.bodyMedium, color: Colors.neutral[700] },
  loginLink: { ...Typography.bodyMedium, color: Colors.primary.default, fontWeight: '600' },
});
