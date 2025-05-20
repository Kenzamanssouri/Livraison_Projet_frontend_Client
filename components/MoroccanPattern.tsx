import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export function MoroccanPattern({ style }: { style?: any }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.patternRow}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.patternElement} />
        ))}
      </View>
      <View style={[styles.patternRow, styles.offsetRow]}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.patternElement} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    overflow: 'hidden',
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  offsetRow: {
    marginLeft: 30,
  },
  patternElement: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary.default,
    transform: [{ rotate: '45deg' }],
    borderRadius: 8,
  },
});