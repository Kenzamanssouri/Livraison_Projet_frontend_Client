import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { X, Check } from 'lucide-react-native';

type FilterOption = {
  id: string;
  label: string;
};

const cuisineTypes: FilterOption[] = [
  { id: 'traditional', label: 'Traditionnel' },
  { id: 'modern', label: 'Moderne' },
  { id: 'fusion', label: 'Fusion' },
  { id: 'street', label: 'Street Food' },
  { id: 'pastry', label: 'Pâtisserie' },
];

const priceRanges: FilterOption[] = [
  { id: '$', label: 'Économique' },
  { id: '$$', label: 'Modéré' },
  { id: '$$$', label: 'Premium' },
];

export function FilterModal({
  visible,
  onClose,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}) {
  const { colors } = useTheme();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [freeDelivery, setFreeDelivery] = useState<boolean>(false);

  const toggleCuisine = (id: string) => {
    setSelectedCuisines(current =>
      current.includes(id)
        ? current.filter(c => c !== id)
        : [...current, id]
    );
  };

  const handleApply = () => {
    onApply({
      cuisines: selectedCuisines,
      priceRange: selectedPriceRange,
      minRating,
      freeDelivery,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Filtres</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuisine</Text>
          <View style={styles.optionsGrid}>
            {cuisineTypes.map(cuisine => (
              <TouchableOpacity
                key={cuisine.id}
                style={[
                  styles.optionButton,
                  selectedCuisines.includes(cuisine.id) && styles.optionButtonSelected,
                  { borderColor: colors.border }
                ]}
                onPress={() => toggleCuisine(cuisine.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCuisines.includes(cuisine.id) && styles.optionTextSelected,
                    { color: colors.text }
                  ]}
                >
                  {cuisine.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Prix</Text>
          <View style={styles.priceButtons}>
            {priceRanges.map(range => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.priceButton,
                  selectedPriceRange === range.id && styles.priceButtonSelected,
                  { borderColor: colors.border }
                ]}
                onPress={() => setSelectedPriceRange(range.id)}
              >
                <Text
                  style={[
                    styles.priceButtonText,
                    selectedPriceRange === range.id && styles.priceButtonTextSelected,
                    { color: colors.text }
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.optionRow, { borderColor: colors.border }]}
          onPress={() => setFreeDelivery(!freeDelivery)}
        >
          <Text style={[styles.optionLabel, { color: colors.text }]}>
            Livraison gratuite
          </Text>
          <View
            style={[
              styles.checkbox,
              freeDelivery && styles.checkboxSelected,
              { borderColor: colors.border }
            ]}
          >
            {freeDelivery && <Check size={16} color={Colors.white} />}
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: colors.border }]}
            onPress={() => {
              setSelectedCuisines([]);
              setSelectedPriceRange('');
              setMinRating(0);
              setFreeDelivery(false);
            }}
          >
            <Text style={[styles.resetButtonText, { color: colors.text }]}>
              Réinitialiser
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Layout.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  title: {
    ...Typography.headingLarge,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    ...Typography.headingSmall,
    marginBottom: Layout.spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  optionButton: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary.default,
    borderColor: Colors.primary.default,
  },
  optionText: {
    ...Typography.labelMedium,
  },
  optionTextSelected: {
    color: Colors.white,
  },
  priceButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  priceButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  priceButtonSelected: {
    backgroundColor: Colors.primary.default,
    borderColor: Colors.primary.default,
  },
  priceButtonText: {
    ...Typography.labelMedium,
  },
  priceButtonTextSelected: {
    color: Colors.white,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
  },
  optionLabel: {
    ...Typography.bodyMedium,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary.default,
    borderColor: Colors.primary.default,
  },
  footer: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: 'auto',
    paddingTop: Layout.spacing.lg,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    ...Typography.labelMedium,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary.default,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...Typography.labelMedium,
    color: Colors.white,
  },
});