import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

export function Logo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const { colors } = useTheme();

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return Typography.headingMedium.fontSize;
      case 'large':
        return Typography.displayLarge.fontSize;
      default:
        return Typography.displayMedium.fontSize;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[
        styles.text,
        { fontSize: getFontSize(), color: colors.text }
      ]}>
        Delivrya
      </Text>
      <View style={[
        styles.accent,
        { backgroundColor: Colors.accent.default }
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins_700Bold',
    color: Colors.primary.default,
  },
  accent: {
    width: 24,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});