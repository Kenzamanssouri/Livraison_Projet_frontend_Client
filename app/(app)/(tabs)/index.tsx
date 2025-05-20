import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Mic, Filter, Star, Clock } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

// Mock data
const promos = [
  {
    id: '1',
    title: 'Ramadan Kareem',
    subtitle: '30% sur les pâtisseries après Iftar',
    image: 'https://images.pexels.com/photos/4110101/pexels-photo-4110101.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: Colors.accent.default,
  },
  {
    id: '2',
    title: 'Livraison Gratuite',
    subtitle: 'Pour les commandes de plus de 100 DH',
    image: 'https://images.pexels.com/photos/7363671/pexels-photo-7363671.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: Colors.secondary.default,
  },
];

const categories = [
  { id: '1', name: 'all', icon: '🍽️' },
  { id: '2', name: 'tajine', icon: '🍲' },
  { id: '3', name: 'couscous', icon: '🥘' },
  { id: '4', name: 'streetFood', icon: '🥙' },
  { id: '5', name: 'pastry', icon: '🍰' },
  { id: '6', name: 'drinks', icon: '🍹' },
];

const restaurants = [
  {
    id: '1',
    name: 'Restaurant Al Mounia',
    image: 'https://images.pexels.com/photos/6546024/pexels-photo-6546024.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    deliveryTime: '25-35',
    deliveryFee: '15 DH',
    cuisine: 'Traditionnel',
    distance: '1.5 km',
    category: 'all', // Added category field for filtering
    coordinates: {
      latitude: 33.589886,
      longitude: -7.603869,
    },
  },
  {
    id: '2',
    name: 'Café Maure',
    image: 'https://images.pexels.com/photos/4577379/pexels-photo-4577379.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    deliveryTime: '15-25',
    deliveryFee: 'Gratuit',
    cuisine: 'Café, Pâtisserie',
    distance: '0.8 km',
    category: 'pastry',
    coordinates: {
      latitude: 33.592886,
      longitude: -7.608869,
    },
  },
  {
    id: '3',
    name: 'Tajine Express',
    image: 'https://images.pexels.com/photos/5409021/pexels-photo-5409021.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.2,
    deliveryTime: '30-45',
    deliveryFee: '20 DH',
    cuisine: 'Tajine, Marocain',
    distance: '2.1 km',
    category: 'tajine',
    coordinates: {
      latitude: 33.586886,
      longitude: -7.598869,
    },
  },
];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t, locale, isRTL } = useLocalization();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [mapExpanded, setMapExpanded] = useState(false);
  const mapHeight = useRef(new Animated.Value(150)).current;

  const toggleMapExpand = () => {
    const toValue = mapExpanded ? 150 : 300;
    Animated.spring(mapHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
    setMapExpanded(!mapExpanded);
  };

  const navigateToRestaurant = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  // Filter restaurants by category (if selectedCategory !== '1' i.e. not all)
  const filteredRestaurants = selectedCategory === '1' 
    ? restaurants 
    : restaurants.filter(r => r.category === categories.find(c => c.id === selectedCategory)?.name);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color={Colors.primary.default} />
              <Text style={styles.location}>Casablanca, Maroc</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            accessibilityRole="imagebutton"
            accessibilityLabel="Profil utilisateur"
          >
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/search')}
          accessibilityRole="button"
          accessibilityLabel={t('search')}
        >
          <Search size={20} color={Colors.neutral[500]} />
          <Text style={styles.searchPlaceholder}>{t('search')}</Text>
          <TouchableOpacity 
            style={styles.voiceSearchButton}
            accessibilityRole="button"
            accessibilityLabel="Recherche vocale"
          >
            <Mic size={20} color={Colors.primary.default} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.mapContainer}>
          <Animated.View style={[styles.map, { height: mapHeight }]}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 33.589886,
                longitude: -7.603869,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              {filteredRestaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  coordinate={restaurant.coordinates}
                  title={restaurant.name}
                  description={restaurant.cuisine}
                  onPress={() => navigateToRestaurant(restaurant.id)}
                >
                  <View style={styles.mapMarker}>
                    <Text style={styles.mapMarkerText}>🍽️</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
            <TouchableOpacity 
              style={styles.expandMapButton}
              onPress={toggleMapExpand}
              accessibilityRole="button"
              accessibilityLabel={mapExpanded ? 'Réduire la carte' : 'Agrandir la carte'}
            >
              <Text style={styles.expandMapButtonText}>
                {mapExpanded ? 'Réduire la carte' : 'Agrandir la carte'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.promosContainer}>
          <FlatList
            data={promos}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.promoCard, { backgroundColor: item.color }]}
                accessibilityRole="button"
                accessibilityLabel={`${item.title} - ${item.subtitle}`}
              >
                <View style={styles.promoTextContainer}>
                  <Text style={styles.promoTitle}>{item.title}</Text>
                  <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
                </View>
                <Image source={{ uri: item.image }} style={styles.promoImage} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.promosList}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t('categories.title') /* Make sure you have this translation key */}
          </Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(item.id)}
                accessibilityRole="button"
                accessibilityLabel={t(`categories.${item.name}`)}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text 
                  style={[
                    styles.categoryName,
                    selectedCategory === item.id && styles.categoryNameActive
                  ]}
                >
                  {t(`categories.${item.name}`)}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.restaurantsContainer}>
          <View style={styles.restaurantsHeader}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('nearbyRestaurants')}
            </Text>
            <TouchableOpacity 
              style={styles.filterButton}
              accessibilityRole="button"
              accessibilityLabel={t('filter')}
            >
              <Filter size={16} color={Colors.neutral[700]} />
              <Text style={styles.filterText}>{t('filter')}</Text>
            </TouchableOpacity>
          </View>

          {filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => navigateToRestaurant(restaurant.id)}
              accessibilityRole="button"
              accessibilityLabel={`${restaurant.name}, ${restaurant.cuisine}, note ${restaurant.rating}`}
            >
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={Colors.accent.default} fill={Colors.accent.default} />
                    <Text style={styles.rating}>{restaurant.rating}</Text>
                  </View>
                  <View style={styles.metaDot} />
                  <Text style={styles.cuisineType}>{restaurant.cuisine}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.distance}>{restaurant.distance}</Text>
                </View>
                <View style={styles.restaurantDelivery}>
                  <View style={styles.deliveryTimeContainer}>
                    <Clock size={14} color={Colors.neutral[600]} />
                    <Text style={styles.deliveryTime}>{restaurant.deliveryTime} min</Text>
                  </View>
                  <Text style={styles.deliveryFee}>{restaurant.deliveryFee}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
  },
  greeting: {
    ...Typography.headingMedium,
    color: Colors.neutral[900],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary.light,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: Layout.borderRadius.full,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
  },
  searchPlaceholder: {
    ...Typography.bodyMedium,
    color: Colors.neutral[500],
    flex: 1,
    marginLeft: Layout.spacing.sm,
  },
  voiceSearchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  map: {
    width: '100%',
    height: 150,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  mapMarker: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.primary.default,
  },
  mapMarkerText: {
    fontSize: 16,
  },
  expandMapButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.white,
    paddingVertical: 6,
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
    color: Colors.neutral[800],
  },
  promosContainer: {
    marginBottom: Layout.spacing.lg,
  },
  promosList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  promoCard: {
    width: width * 0.8,
    height: 140,
    borderRadius: Layout.borderRadius.lg,
    marginRight: Layout.spacing.lg,
    padding: Layout.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  promoTitle: {
    ...Typography.headingSmall,
    color: Colors.white,
    marginBottom: 4,
  },
  promoSubtitle: {
    ...Typography.bodySmall,
    color: Colors.white,
  },
  promoImage: {
    width: 110,
    height: '100%',
    borderRadius: Layout.borderRadius.lg,
  },
  categoriesContainer: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.headingMedium,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    color: Colors.neutral[900],
  },
  rtlText: {
    textAlign: 'right',
  },
  categoriesList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  categoryButton: {
    backgroundColor: Colors.neutral[100],
    borderRadius: Layout.borderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: Layout.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary.light,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryName: {
    ...Typography.bodyMedium,
    color: Colors.neutral[700],
  },
  categoryNameActive: {
    color: Colors.primary.default,
    fontWeight: '600',
  },
  restaurantsContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  restaurantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    ...Typography.bodySmall,
    marginLeft: 4,
    color: Colors.neutral[700],
  },
  restaurantCard: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.neutral[50],
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 120,
    height: 120,
  },
  restaurantInfo: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  restaurantName: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: Colors.accent.default,
    ...Typography.bodySmall,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral[500],
    marginHorizontal: 8,
  },
  cuisineType: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
  },
  distance: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
  },
  restaurantDelivery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTime: {
    marginLeft: 4,
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  deliveryFee: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
});
