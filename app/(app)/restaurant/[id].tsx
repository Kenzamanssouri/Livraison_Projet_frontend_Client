import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Animated
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  MapPin, 
  Heart, 
  Share,
  Plus,
  Info
} from 'lucide-react-native';

// Mock restaurant data
const restaurantData = {
  id: '1',
  name: 'Restaurant Al Mounia',
  coverImage: 'https://images.pexels.com/photos/6546024/pexels-photo-6546024.jpeg?auto=compress&cs=tinysrgb&w=800',
  logo: 'https://images.pexels.com/photos/14417527/pexels-photo-14417527.jpeg?auto=compress&cs=tinysrgb&w=800',
  rating: 4.7,
  reviewCount: 254,
  cuisineType: 'Marocain traditionnel',
  priceRange: '$$',
  address: '25 Rue Oued El Makhazine, Casablanca',
  deliveryTime: '25-35',
  deliveryFee: '15 DH',
  distance: '1.5 km',
  openingHours: '10:00 - 23:00',
  description: 'Restaurant traditionnel marocain servant des plats authentiques dans un cadre élégant et chaleureux.',
};

// Mock menu data
const menuCategories = [
  {
    id: 'starters',
    name: 'menuSections.starters',
    dishes: [
      {
        id: '1',
        name: 'Salade marocaine',
        description: 'Tomates, concombres, oignons et poivrons assaisonnés à l\'huile d\'olive et aux épices marocaines',
        price: 40,
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
        popular: true,
      },
      {
        id: '2',
        name: 'Briouates au fromage',
        description: 'Délicieux triangles feuilletés farcis au fromage frais et persil',
        price: 45,
        image: 'https://images.pexels.com/photos/9792457/pexels-photo-9792457.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ],
  },
  {
    id: 'mains',
    name: 'menuSections.mains',
    dishes: [
      {
        id: '3',
        name: 'Tajine de poulet aux olives',
        description: 'Tajine traditionnel de poulet aux olives et citron confit, servi avec du pain marocain',
        price: 95,
        image: 'https://images.pexels.com/photos/5409021/pexels-photo-5409021.jpeg?auto=compress&cs=tinysrgb&w=800',
        popular: true,
        customizable: [
          { name: 'Sans piment', price: 0 },
          { name: 'Ajouter des frites', price: 10 },
        ],
      },
      {
        id: '4',
        name: 'Couscous Royal',
        description: 'Couscous aux sept légumes servi avec agneau, poulet et merguez',
        price: 120,
        image: 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg?auto=compress&cs=tinysrgb&w=800',
        customizable: [
          { name: 'Sans merguez', price: 0 },
          { name: 'Portion supplémentaire de viande', price: 30 },
        ],
      },
    ],
  },
  {
    id: 'desserts',
    name: 'menuSections.desserts',
    dishes: [
      {
        id: '5',
        name: 'Pastilla au lait',
        description: 'Feuilles de brick croustillantes fourrées à la crème et aux amandes, parfumées à la fleur d\'oranger',
        price: 35,
        image: 'https://images.pexels.com/photos/2363803/pexels-photo-2363803.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ],
  },
  {
    id: 'drinks',
    name: 'menuSections.drinks',
    dishes: [
      {
        id: '6',
        name: 'Thé à la menthe',
        description: 'Thé vert traditionnel à la menthe fraîche et au sucre',
        price: 15,
        image: 'https://images.pexels.com/photos/1493080/pexels-photo-1493080.jpeg?auto=compress&cs=tinysrgb&w=800',
        customizable: [
          { name: 'Sans sucre', price: 0 },
          { name: 'Très sucré', price: 0 },
        ],
      },
    ],
  },
];

// Mock reviews
const reviews = [
  {
    id: '1',
    name: 'Fatima E.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 5,
    date: 'Il y a 2 jours',
    comment: 'Le tajine était délicieux et authentique. J\'ai adoré l\'ambiance et le service rapide.',
  },
  {
    id: '2',
    name: 'Mohammed A.',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4,
    date: 'Il y a 1 semaine',
    comment: 'Très bon restaurant, mais un peu cher. La nourriture est excellente et authentique.',
  },
];

export default function RestaurantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t, isRTL } = useLocalization();
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('starters');
  const [menuExpanded, setMenuExpanded] = useState<string[]>([]);

  const toggleExpandMenu = (categoryId: string) => {
    if (menuExpanded.includes(categoryId)) {
      setMenuExpanded(menuExpanded.filter(id => id !== categoryId));
    } else {
      setMenuExpanded([...menuExpanded, categoryId]);
    }
  };

  const isCategoryExpanded = (categoryId: string) => {
    return menuExpanded.includes(categoryId);
  };

  const handleAddToCart = (dishId: string) => {
    // In a real app, add to cart logic would go here
    console.log(`Added dish ${dishId} to cart`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView stickyHeaderIndices={[1]}>
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: restaurantData.coverImage }}
            style={styles.coverImage}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: restaurantData.logo }}
              style={styles.logo}
            />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'menu' && styles.activeTab
              ]}
              onPress={() => setActiveTab('menu')}
            >
              <Text 
                style={[
                  styles.tabText,
                  activeTab === 'menu' && styles.activeTabText
                ]}
              >
                {t('menu')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'reviews' && styles.activeTab
              ]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text 
                style={[
                  styles.tabText,
                  activeTab === 'reviews' && styles.activeTabText
                ]}
              >
                {t('reviews')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'info' && styles.activeTab
              ]}
              onPress={() => setActiveTab('info')}
            >
              <Text 
                style={[
                  styles.tabText,
                  activeTab === 'info' && styles.activeTabText
                ]}
              >
                {t('information')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.restaurantName}>{restaurantData.name}</Text>
            
            <View style={styles.restaurantMeta}>
              <View style={styles.ratingContainer}>
                <Star size={16} color={Colors.accent.default} fill={Colors.accent.default} />
                <Text style={styles.rating}>{restaurantData.rating}</Text>
                <Text style={styles.reviewCount}>({restaurantData.reviewCount})</Text>
              </View>
              
              <View style={styles.metaDot} />
              
              <Text style={styles.cuisineType}>{restaurantData.cuisineType}</Text>
              
              <View style={styles.metaDot} />
              
              <Text style={styles.priceRange}>{restaurantData.priceRange}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={Colors.neutral[600]} />
                <Text style={styles.infoText}>{restaurantData.deliveryTime} min</Text>
              </View>
              
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.neutral[600]} />
                <Text style={styles.infoText}>{restaurantData.distance}</Text>
              </View>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Share size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
          </View>

          {activeTab === 'menu' && (
            <View style={styles.menuContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                {menuCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.selectedCategoryButton
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id && styles.selectedCategoryButtonText
                      ]}
                    >
                      {t(category.name)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {menuCategories.map((category) => (
                category.id === selectedCategory && (
                  <View key={category.id} style={styles.categoryDishes}>
                    {category.dishes.map((dish) => (
                      <View key={dish.id} style={styles.dishCard}>
                        <View style={styles.dishInfo}>
                          <View style={styles.dishHeader}>
                            <Text style={styles.dishName}>{dish.name}</Text>
                            {dish.popular && (
                              <View style={styles.popularBadge}>
                                <Text style={styles.popularText}>Populaire</Text>
                              </View>
                            )}
                          </View>
                          
                          <Text style={styles.dishDescription}>{dish.description}</Text>
                          
                          {dish.customizable && (
                            <TouchableOpacity 
                              style={styles.customizeButton}
                              onPress={() => console.log('Customize dish')}
                            >
                              <Text style={styles.customizeText}>Personnaliser</Text>
                            </TouchableOpacity>
                          )}
                          
                          <View style={styles.dishBottom}>
                            <Text style={styles.dishPrice}>{dish.price} DH</Text>
                            
                            <TouchableOpacity 
                              style={styles.addButton}
                              onPress={() => handleAddToCart(dish.id)}
                            >
                              <Plus size={18} color={Colors.white} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                        <Image 
                          source={{ uri: dish.image }}
                          style={styles.dishImage}
                        />
                      </View>
                    ))}
                  </View>
                )
              ))}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <View style={styles.ratingOverview}>
                <Text style={styles.ratingLarge}>{restaurantData.rating}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      color={Colors.accent.default} 
                      fill={i <= Math.floor(restaurantData.rating) ? Colors.accent.default : 'none'} 
                    />
                  ))}
                </View>
                <Text style={styles.reviewCountLarge}>
                  {restaurantData.reviewCount} {t('reviews')}
                </Text>
              </View>
              
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image 
                      source={{ uri: review.avatar }}
                      style={styles.reviewerAvatar}
                    />
                    
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    
                    <View style={styles.reviewRating}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          color={Colors.accent.default} 
                          fill={i <= review.rating ? Colors.accent.default : 'none'} 
                        />
                      ))}
                    </View>
                  </View>
                  
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'info' && (
            <View style={styles.infoContainer}>
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Adresse</Text>
                <Text style={styles.infoValue}>{restaurantData.address}</Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Heures d'ouverture</Text>
                <Text style={styles.infoValue}>{restaurantData.openingHours}</Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Livraison</Text>
                <Text style={styles.infoValue}>
                  {restaurantData.deliveryTime} min • {restaurantData.deliveryFee}
                </Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>À propos</Text>
                <Text style={styles.infoValue}>{restaurantData.description}</Text>
              </View>
            </View>
          )}
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
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    paddingTop: 10,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary.default,
  },
  tabText: {
    ...Typography.labelMedium,
    color: Colors.neutral[600],
  },
  activeTabText: {
    color: Colors.primary.default,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  header: {
    marginBottom: Layout.spacing.lg,
    paddingTop: 20,
  },
  restaurantName: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...Typography.labelMedium,
    color: Colors.neutral[900],
    marginLeft: 4,
  },
  reviewCount: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    marginLeft: 2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.neutral[400],
    marginHorizontal: 6,
  },
  cuisineType: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
  },
  priceRange: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuContainer: {
    flex: 1,
  },
  categoriesScroll: {
    marginBottom: Layout.spacing.md,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.neutral[100],
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary.default,
  },
  categoryButtonText: {
    ...Typography.labelMedium,
    color: Colors.neutral[700],
  },
  selectedCategoryButtonText: {
    color: Colors.white,
  },
  categoryDishes: {
    flex: 1,
  },
  dishCard: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  dishInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dishName: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.neutral[900],
    flex: 1,
  },
  popularBadge: {
    backgroundColor: Colors.accent.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.full,
  },
  popularText: {
    ...Typography.labelSmall,
    color: Colors.accent.dark,
  },
  dishDescription: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  customizeButton: {
    marginBottom: 10,
  },
  customizeText: {
    ...Typography.labelSmall,
    color: Colors.primary.default,
  },
  dishBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  dishPrice: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: Layout.borderRadius.md,
  },
  reviewsContainer: {
    flex: 1,
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Layout.borderRadius.md,
  },
  ratingLarge: {
    ...Typography.displayLarge,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.sm,
  },
  reviewCountLarge: {
    ...Typography.bodyMedium,
    color: Colors.neutral[700],
  },
  reviewCard: {
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Layout.spacing.sm,
  },
  reviewerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewerName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  reviewDate: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    ...Typography.bodyMedium,
    color: Colors.neutral[800],
  },
  infoContainer: {
    flex: 1,
  },
  infoSection: {
    marginBottom: Layout.spacing.lg,
  },
  infoTitle: {
    ...Typography.labelLarge,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.xs,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.neutral[700],
  },
});