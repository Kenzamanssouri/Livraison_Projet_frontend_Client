import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Chrome as Home, Briefcase, MapPin, Plus, CreditCard, Banknote, Wallet, Check } from 'lucide-react-native';

// Mock data for addresses
const savedAddresses = [
  {
    id: '1',
    type: 'home',
    name: 'Maison',
    address: 'Apt 3B, 25 Rue Mohammed V, Casablanca',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'Bureau',
    address: 'Twin Center, Tour Ouest, 12ème étage, Casablanca',
    isDefault: false,
  },
];

// Mock data for payment methods
const paymentMethods = [
  {
    id: 'card',
    name: 'cardPayment',
    icon: <CreditCard size={24} color={Colors.neutral[700]} />,
    description: 'CIH, Attijari, etc.',
  },
  {
    id: 'cash',
    name: 'cashOnDelivery',
    icon: <Banknote size={24} color={Colors.neutral[700]} />,
    description: 'Max 500 MAD',
  },
  {
    id: 'wallet',
    name: 'wallet',
    icon: <Wallet size={24} color={Colors.neutral[700]} />,
    description: 'PayPal, etc.',
  },
];

// Order summary data
const orderSummary = {
  subtotal: 150,
  deliveryFee: 20,
  total: 170,
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { t, isRTL } = useLocalization();
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [note, setNote] = useState('');

  const placeOrder = () => {
    // In a real app, we would process the order
    router.push(`/orderTracking/1`);
  };

  const renderAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color={Colors.white} />;
      case 'work':
        return <Briefcase size={20} color={Colors.white} />;
      default:
        return <MapPin size={20} color={Colors.white} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.neutral[700]} />
        </TouchableOpacity>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('checkout')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t('deliveryAddress')}
          </Text>
          
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id && styles.selectedCard
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View 
                style={[
                  styles.addressIconContainer,
                  selectedAddress === address.id ? { backgroundColor: Colors.primary.default } : { backgroundColor: Colors.neutral[400] }
                ]}
              >
                {renderAddressIcon(address.type)}
              </View>
              
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressName}>{t(address.type)}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Par défaut</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
              </View>
              
              {selectedAddress === address.id && (
                <View style={styles.checkCircle}>
                  <Check size={14} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color={Colors.primary.default} />
            <Text style={styles.addButtonText}>{t('addNewAddress')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t('paymentMethod')}
          </Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.id && styles.selectedCard
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentIcon}>
                {method.icon}
              </View>
              
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{t(method.name)}</Text>
                <Text style={styles.paymentDescription}>{method.description}</Text>
              </View>
              
              {selectedPayment === method.id && (
                <View style={styles.checkCircle}>
                  <Check size={14} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.delivryaPayButton}>
            <Image 
              source={{ uri: 'https://www.pexels.com/photo/money-gold-coins-259100/' }} 
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <Text style={styles.delivryaPayText}>{t('delivryaPay')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>Note</Text>
          <TextInput
            style={[styles.noteInput, isRTL && styles.rtlInput]}
            placeholder="Instructions pour le livreur"
            placeholderTextColor={Colors.neutral[400]}
            value={note}
            onChangeText={setNote}
            multiline
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        <View style={styles.summarySection}>
          <Text style={[styles.summaryTitle, isRTL && styles.rtlText]}>
            {t('orderSummary')}
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
            <Text style={styles.summaryValue}>{orderSummary.subtotal} DH</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('deliveryFee')}</Text>
            <Text style={styles.summaryValue}>{orderSummary.deliveryFee} DH</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('total')}</Text>
            <Text style={styles.totalValue}>{orderSummary.total} DH</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={placeOrder}
        >
          <Text style={styles.placeOrderText}>{t('checkout')} • {orderSummary.total} DH</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
  },
  rtlText: {
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  sectionTitle: {
    ...Typography.headingMedium,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: Colors.primary.default,
    backgroundColor: Colors.primary.light + '10',
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginRight: Layout.spacing.sm,
  },
  defaultBadge: {
    backgroundColor: Colors.neutral[200],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.full,
  },
  defaultText: {
    ...Typography.labelSmall,
    color: Colors.neutral[700],
  },
  addressText: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary.default,
    borderRadius: Layout.borderRadius.md,
  },
  addButtonText: {
    ...Typography.labelMedium,
    color: Colors.primary.default,
    marginLeft: 6,
  },
  paymentCard: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  paymentDescription: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  delivryaPayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.accent.light,
    borderRadius: Layout.borderRadius.md,
  },
  delivryaPayText: {
    ...Typography.labelMedium,
    color: Colors.accent.dark,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    ...Typography.bodyMedium,
    color: Colors.neutral[900],
    height: 100,
    textAlignVertical: 'top',
  },
  rtlInput: {
    textAlign: 'right',
  },
  summarySection: {
    padding: Layout.spacing.lg,
  },
  summaryTitle: {
    ...Typography.headingMedium,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  summaryLabel: {
    ...Typography.bodyMedium,
    color: Colors.neutral[600],
  },
  summaryValue: {
    ...Typography.bodyMedium,
    color: Colors.neutral[900],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: Layout.spacing.md,
    marginTop: Layout.spacing.md,
  },
  totalLabel: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
  },
  totalValue: {
    ...Typography.headingSmall,
    color: Colors.primary.default,
  },
  footer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  placeOrderButton: {
    backgroundColor: Colors.primary.default,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
  },
  placeOrderText: {
    ...Typography.labelLarge,
    color: Colors.white,
  },
});