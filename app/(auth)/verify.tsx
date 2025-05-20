import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function VerifyOTP() {
  const router = useRouter();
  const { t, isRTL } = useLocalization();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Focus the first input when the screen loads
    setTimeout(() => {
      inputs.current[0]?.focus();
    }, 100);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    // In a real app, we would verify the OTP
    router.replace('/(app)/(tabs)');
  };

  const handleResendOTP = () => {
    // In a real app, we would request a new OTP
    console.log('Resend OTP');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.neutral[700]} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {t('verifyPhone')}
          </Text>
          
          <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
            {t('enterOTP')}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputs.current[index] = ref}
                style={styles.otpInput}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
            <Text style={styles.verifyButtonText}>{t('verifyPhone')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendContainer} onPress={handleResendOTP}>
            <Text style={styles.resendText}>Je n'ai pas reçu de code</Text>
            <Text style={styles.resendLink}>Renvoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.xxl,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.xxl,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xxl,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.md,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary.default,
  },
  verifyButton: {
    backgroundColor: Colors.primary.default,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
  },
  verifyButtonText: {
    ...Typography.labelLarge,
    color: Colors.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  resendText: {
    ...Typography.bodyMedium,
    color: Colors.neutral[600],
    marginRight: Layout.spacing.xs,
  },
  resendLink: {
    ...Typography.bodyMedium,
    color: Colors.primary.default,
    fontWeight: '600',
  },
});