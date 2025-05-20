import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Clock, Users, ChevronRight } from 'lucide-react-native';

// Mock data
const cartItems = [
  {
    id: '1',
    name: 'Tajine de poulet aux olives',
    price: 95,
    image: 'https://images.pexels.com/photos/5409021/pexels-photo-5409021.jpeg?auto=compress&cs=tinysrgb&w=800',
    restaurant: 'Restaurant Al Mounia',
    quantity: 1,
    options: ['Sans piment'],
  },
  {
    id: '2',
    name: 'Salade marocaine',
    price: 40,
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    restaurant: 'Restaurant Al Mounia',
    quantity: 1,
    options: [],
  },
  {
    id: '3',
    name: 'Thé à la menthe',
    price: 15,
    image: 'https://images.pexels.com/photos/1493080/pexels-photo-1493080.jpeg?auto=compress&cs=tinysrgb&w=800',
    restaurant: 'Restaurant Al Mounia',
    quantity: 2,
    options: ['Sucré'],
  },
];

export default function CartScreen() {
  const router = useRouter();
  const { t, isRTL } = useLocalization();
  const [items, setItems] = useState(cartItems);
  const [scheduledDelivery, setScheduledDelivery] = useState(false);
  const [splitBill, setSplitBill] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 20;
  const total = subtotal + deliveryFee;

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5769371/pexels-photo-5769371.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
            style={styles.emptyImage} 
          />
          <Text style={styles.emptyTitle}>{t('emptyCart')}</Text>
          <Text style={styles.emptyText}>Votre panier de livraison est vide</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>{t('addItems')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('yourCart')}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
              
              {item.options.length > 0 && (
                <Text style={styles.itemOptions}>{item.options.join(', ')}</Text>
              )}
              
              <View style={styles.itemBottom}>
                <Text style={styles.itemPrice}>{item.price * item.quantity} DH</Text>
                
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => {
                      if (item.quantity === 1) {
                        removeItem(item.id);
                      } else {
                        updateQuantity(item.id, -1);
                      }
                    }}
                  >
                    <Minus size={16} color={Colors.neutral[600]} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Plus size={16} color={Colors.neutral[600]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionRow}
          onPress={() => setSplitBill(!splitBill)}
        >
          <View style={styles.optionIconContainer}>
            <Users size={18} color={Colors.white} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{t('splitBill')}</Text>
            <Text style={styles.optionDescription}>Partagez cette commande avec des amis</Text>
          </View>
          <Switch
            value={splitBill}
            onValueChange={setSplitBill}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary.light }}
            thumbColor={splitBill ? Colors.primary.default : Colors.neutral[100]}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionRow}
          onPress={() => setScheduledDelivery(!scheduledDelivery)}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: Colors.secondary.default }]}>
            <Clock size={18} color={Colors.white} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{t('scheduleOrder')}</Text>
            <Text style={styles.optionDescription}>Planifiez votre livraison pour plus tard</Text>
          </View>
          <Switch
            value={scheduledDelivery}
            onValueChange={setScheduledDelivery}
            trackColor={{ false: Colors.neutral[300], true: Colors.secondary.light }}
            thumbColor={scheduledDelivery ? Colors.secondary.default : Colors.neutral[100]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>{t('orderSummary')}</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
          <Text style={styles.summaryValue}>{subtotal} DH</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('deliveryFee')}</Text>
          <Text style={styles.summaryValue}>{deliveryFee} DH</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>{t('total')}</Text>
          <Text style={styles.totalValue}>{total} DH</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={proceedToCheckout}
        >
          <Text style={styles.checkoutButtonText}>{t('checkout')}</Text>
          <ChevronRight size={20} color={Colors.white} />
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
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
  },
  rtlText: {
    textAlign: 'right',
  },
  cartList: {
    padding: Layout.spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.md,
  },
  itemDetails: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  itemName: {
    ...Typography.bodyLarge,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  itemRestaurant: {
    ...Typography.labelSmall,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  itemOptions: {
    ...Typography.bodySmall,
    color: Colors.neutral[500],
    fontStyle: 'italic',
    marginBottom: 8,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemPrice: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginHorizontal: Layout.spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  optionDescription: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  summaryContainer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
  },
  summaryTitle: {
    ...Typography.headingSmall,
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
    marginBottom: Layout.spacing.lg,
  },
  totalLabel: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
  },
  totalValue: {
    ...Typography.headingSmall,
    color: Colors.primary.default,
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.default,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    ...Typography.labelLarge,
    color: Colors.white,
    marginRight: Layout.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: Layout.borderRadius.full,
    marginBottom: Layout.spacing.xl,
  },
  emptyTitle: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: Colors.primary.default,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
  },
  browseButtonText: {
    ...Typography.labelLarge,
    color: Colors.white,
  },
});