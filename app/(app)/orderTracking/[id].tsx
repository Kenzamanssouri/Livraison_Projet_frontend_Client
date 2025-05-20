import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  X,
  ArrowUpRight
} from 'lucide-react-native';

// Mock order data
const orderData = {
  id: '1',
  restaurant: {
    name: 'Restaurant Al Mounia',
    address: '25 Rue Oued El Makhazine, Casablanca',
    coordinates: {
      latitude: 33.589886,
      longitude: -7.603869,
    },
  },
  courier: {
    name: 'Mohammed',
    phone: '+212 612-345678',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: {
      latitude: 33.591886,
      longitude: -7.599869,
    },
  },
  customer: {
    name: 'Karim Belarbi',
    address: 'Apt 3B, 25 Rue Mohammed V, Casablanca',
    coordinates: {
      latitude: 33.594886,
      longitude: -7.595869,
    },
  },
  status: 'onTheWay', // preparing, onTheWay, delivered
  estimatedTime: '15 min',
};

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t, isRTL } = useLocalization();
  const [mapExpanded, setMapExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(orderData.status);
  
  const mapHeight = useRef(new Animated.Value(300)).current;
  
  useEffect(() => {
    // Simulate order status updates in a real application
    if (currentStatus === 'preparing') {
      const timer = setTimeout(() => {
        setCurrentStatus('onTheWay');
      }, 10000);
      return () => clearTimeout(timer);
    } else if (currentStatus === 'onTheWay') {
      const timer = setTimeout(() => {
        setCurrentStatus('delivered');
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);

  const toggleMapExpand = () => {
    const toValue = mapExpanded ? 300 : height * 0.6;
    Animated.spring(mapHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
    setMapExpanded(!mapExpanded);
  };

  const getStatusText = (status: string) => {
    return t(`orderStatus.${status}`);
  };

  const callCourier = () => {
    if (Platform.OS === 'web') {
      Linking.openURL(`tel:${orderData.courier.phone}`);
    } else {
      Linking.openURL(`tel:${orderData.courier.phone}`);
    }
  };

  const messageCourier = () => {
    if (Platform.OS === 'web') {
      Linking.openURL(`sms:${orderData.courier.phone}`);
    } else {
      Linking.openURL(`sms:${orderData.courier.phone}`);
    }
  };

  const cancelOrder = () => {
    // In a real app, we would implement order cancellation logic
    router.replace('/');
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
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('orderTracking')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: orderData.restaurant.coordinates.latitude,
            longitude: orderData.restaurant.coordinates.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          toolbarEnabled={false}
        >
          {/* Restaurant marker */}
          <Marker
            coordinate={orderData.restaurant.coordinates}
            title={orderData.restaurant.name}
          >
            <View style={[styles.customMarker, { backgroundColor: Colors.accent.default }]}>
              <Text style={styles.markerEmoji}>🍽️</Text>
            </View>
          </Marker>

          {/* Customer marker */}
          <Marker
            coordinate={orderData.customer.coordinates}
            title="Your location"
          >
            <View style={[styles.customMarker, { backgroundColor: Colors.primary.default }]}>
              <Text style={styles.markerEmoji}>📍</Text>
            </View>
          </Marker>

          {/* Courier marker (only shown when status is onTheWay) */}
          {currentStatus === 'onTheWay' && (
            <Marker
              coordinate={orderData.courier.coordinates}
              title={`${orderData.courier.name} - ${t('courierLocation')}`}
            >
              <View style={[styles.customMarker, { backgroundColor: Colors.secondary.default }]}>
                <Text style={styles.markerEmoji}>🛵</Text>
              </View>
            </Marker>
          )}

          {/* Route line from restaurant to customer */}
          <Polyline
            coordinates={[
              orderData.restaurant.coordinates,
              currentStatus === 'onTheWay' ? orderData.courier.coordinates : orderData.customer.coordinates,
              ...(currentStatus === 'onTheWay' ? [orderData.customer.coordinates] : []),
            ]}
            strokeWidth={3}
            strokeColor={Colors.primary.default}
            lineDashPattern={[1, 3]}
          />
        </MapView>

        <TouchableOpacity 
          style={styles.expandMapButton}
          onPress={toggleMapExpand}
        >
          <Text style={styles.expandMapButtonText}>
            {mapExpanded ? 'Réduire la carte' : 'Agrandir la carte'}
          </Text>
          {mapExpanded ? (
            <ArrowUpRight size={16} color={Colors.neutral[600]} style={{ transform: [{ rotate: '180deg' }] }} />
          ) : (
            <ArrowUpRight size={16} color={Colors.neutral[600]} />
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              {getStatusText(currentStatus)}
            </Text>
            {currentStatus !== 'delivered' && (
              <View style={styles.estimatedTimeContainer}>
                <Clock size={16} color={Colors.primary.default} />
                <Text style={styles.estimatedTime}>
                  {orderData.estimatedTime}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statusTimeline}>
            <View style={[
              styles.statusStep,
              { opacity: currentStatus === 'preparing' || currentStatus === 'onTheWay' || currentStatus === 'delivered' ? 1 : 0.5 }
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: currentStatus === 'preparing' || currentStatus === 'onTheWay' || currentStatus === 'delivered' ? Colors.primary.default : Colors.neutral[400] }
              ]} />
              <Text style={styles.statusStepText}>{t('orderStatus.preparing')}</Text>
            </View>

            <View style={[
              styles.statusLine,
              { backgroundColor: currentStatus === 'onTheWay' || currentStatus === 'delivered' ? Colors.primary.default : Colors.neutral[300] }
            ]} />

            <View style={[
              styles.statusStep,
              { opacity: currentStatus === 'onTheWay' || currentStatus === 'delivered' ? 1 : 0.5 }
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: currentStatus === 'onTheWay' || currentStatus === 'delivered' ? Colors.primary.default : Colors.neutral[400] }
              ]} />
              <Text style={styles.statusStepText}>{t('orderStatus.onTheWay')}</Text>
            </View>

            <View style={[
              styles.statusLine,
              { backgroundColor: currentStatus === 'delivered' ? Colors.primary.default : Colors.neutral[300] }
            ]} />

            <View style={[
              styles.statusStep,
              { opacity: currentStatus === 'delivered' ? 1 : 0.5 }
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: currentStatus === 'delivered' ? Colors.primary.default : Colors.neutral[400] }
              ]} />
              <Text style={styles.statusStepText}>{t('orderStatus.delivered')}</Text>
            </View>
          </View>
        </View>

        {currentStatus === 'onTheWay' && (
          <View style={styles.courierCard}>
            <Image source={{ uri: orderData.courier.avatar }} style={styles.courierAvatar} />
            
            <View style={styles.courierInfo}>
              <Text style={styles.courierName}>{orderData.courier.name}</Text>
              <Text style={styles.courierRole}>Livreur</Text>
            </View>
            
            <View style={styles.courierActions}>
              <TouchableOpacity 
                style={[styles.courierAction, { backgroundColor: Colors.primary.light }]}
                onPress={callCourier}
              >
                <Phone size={20} color={Colors.primary.default} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.courierAction, { backgroundColor: Colors.secondary.light }]}
                onPress={messageCourier}
              >
                <MessageSquare size={20} color={Colors.secondary.default} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailsTitle}>Détails de la commande</Text>
          
          <View style={styles.orderDetailsRow}>
            <View style={styles.orderDetailsIcon}>
              <MapPin size={16} color={Colors.primary.default} />
            </View>
            <View style={styles.orderDetailsTexts}>
              <Text style={styles.orderDetailsLabel}>Restaurant</Text>
              <Text style={styles.orderDetailsValue}>{orderData.restaurant.name}</Text>
              <Text style={styles.orderDetailsAddress}>{orderData.restaurant.address}</Text>
            </View>
          </View>
          
          <View style={styles.orderDetailsDivider} />
          
          <View style={styles.orderDetailsRow}>
            <View style={styles.orderDetailsIcon}>
              <MapPin size={16} color={Colors.secondary.default} />
            </View>
            <View style={styles.orderDetailsTexts}>
              <Text style={styles.orderDetailsLabel}>Adresse de livraison</Text>
              <Text style={styles.orderDetailsValue}>{orderData.customer.name}</Text>
              <Text style={styles.orderDetailsAddress}>{orderData.customer.address}</Text>
            </View>
          </View>
        </View>

        {currentStatus !== 'delivered' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={cancelOrder}
          >
            <X size={18} color={Colors.error.default} />
            <Text style={styles.cancelButtonText}>{t('cancelOrder')}</Text>
          </TouchableOpacity>
        )}
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
  mapContainer: {
    height: 300,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  markerEmoji: {
    fontSize: 20,
  },
  expandMapButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandMapButtonText: {
    ...Typography.labelSmall,
    color: Colors.neutral[700],
    marginRight: 4,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  statusContainer: {
    marginBottom: Layout.spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  statusTitle: {
    ...Typography.headingMedium,
    color: Colors.neutral[900],
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.light + '30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
  },
  estimatedTime: {
    ...Typography.labelMedium,
    color: Colors.primary.default,
    marginLeft: 4,
  },
  statusTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusStep: {
    alignItems: 'center',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  statusStepText: {
    ...Typography.labelSmall,
    color: Colors.neutral[700],
    textAlign: 'center',
    maxWidth: 80,
  },
  statusLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  courierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  courierAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Layout.spacing.md,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  courierRole: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  courierActions: {
    flexDirection: 'row',
  },
  courierAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Layout.spacing.sm,
  },
  orderDetails: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  orderDetailsTitle: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
  },
  orderDetailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  orderDetailsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  orderDetailsTexts: {
    flex: 1,
  },
  orderDetailsLabel: {
    ...Typography.labelSmall,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  orderDetailsValue: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  orderDetailsAddress: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
  },
  orderDetailsDivider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: Layout.spacing.sm,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.error.light,
    borderRadius: Layout.borderRadius.md,
  },
  cancelButtonText: {
    ...Typography.labelMedium,
    color: Colors.error.default,
    marginLeft: 8,
  },
});