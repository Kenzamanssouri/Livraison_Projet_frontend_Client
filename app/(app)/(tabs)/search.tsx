import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ArrowLeft, Mic, X, Tag } from 'lucide-react-native';

// Mock data
const popularTags = [
  { id: '1', name: 'Tajine' },
  { id: '2', name: 'Couscous' },
  { id: '3', name: 'Halal' },
  { id: '4', name: 'Harira' },
  { id: '5', name: 'Pastilla' },
  { id: '6', name: 'Thé à la menthe' },
  { id: '7', name: 'Msemen' },
  { id: '8', name: 'Rfissa' },
];

const recentSearches = [
  { id: '1', term: 'Restaurant végétarien' },
  { id: '2', term: 'Livraison gratuite' },
  { id: '3', term: 'Pâtisseries marocaines' },
];

const searchResults = [
  {
    id: '1',
    type: 'restaurant',
    name: 'Restaurant Al Mounia',
    image: 'https://images.pexels.com/photos/6546024/pexels-photo-6546024.jpeg?auto=compress&cs=tinysrgb&w=800',
    info: '4.7 ★ • Traditionnel • 1.5 km',
  },
  {
    id: '2',
    type: 'restaurant',
    name: 'Café Maure',
    image: 'https://images.pexels.com/photos/4577379/pexels-photo-4577379.jpeg?auto=compress&cs=tinysrgb&w=800',
    info: '4.5 ★ • Café, Pâtisserie • 0.8 km',
  },
  {
    id: '3',
    type: 'dish',
    name: 'Tajine de poulet aux olives',
    image: 'https://images.pexels.com/photos/5409021/pexels-photo-5409021.jpeg?auto=compress&cs=tinysrgb&w=800',
    info: 'Chez Restaurant Al Mounia • 95 DH',
  },
  {
    id: '4',
    type: 'dish',
    name: 'Couscous Royal',
    image: 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg?auto=compress&cs=tinysrgb&w=800',
    info: 'Chez Tajine Express • 120 DH',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const { t, isRTL } = useLocalization();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setActiveSearch(true);
    } else {
      setActiveSearch(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch(false);
  };

  const navigateToRestaurant = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const activateVoiceSearch = () => {
    // In a real app, we would integrate with voice recognition
    console.log('Voice search activated');
  };

  const renderSearchResults = () => (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.resultItem}
          onPress={() => navigateToRestaurant(item.id)}
        >
          <Image source={{ uri: item.image }} style={styles.resultImage} />
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultMeta}>{item.info}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  const renderSearchHome = () => (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>Recherches récentes</Text>
        {recentSearches.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.recentSearchItem}
            onPress={() => handleSearch(item.term)}
          >
            <Search size={16} color={Colors.neutral[600]} />
            <Text style={styles.recentSearchText}>{item.term}</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => console.log('Remove recent search')}
            >
              <X size={14} color={Colors.neutral[400]} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>Tags populaires</Text>
        <View style={styles.tagsContainer}>
          {popularTags.map((tag) => (
            <TouchableOpacity 
              key={tag.id} 
              style={styles.tagButton}
              onPress={() => handleSearch(tag.name)}
            >
              <Tag size={14} color={Colors.neutral[600]} />
              <Text style={styles.tagText}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.neutral[700]} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.neutral[500]} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtlInput]}
            placeholder={t('search')}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            clearButtonMode="while-editing"
            textAlign={isRTL ? 'right' : 'left'}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color={Colors.neutral[500]} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.voiceButton}
          onPress={activateVoiceSearch}
        >
          <Mic size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeSearch ? renderSearchResults() : renderSearchHome()}
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
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: Layout.spacing.xs,
    marginRight: Layout.spacing.xs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.neutral[900],
  },
  rtlInput: {
    textAlign: 'right',
  },
  clearButton: {
    padding: Layout.spacing.xs,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Layout.spacing.sm,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    ...Typography.headingSmall,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
  },
  rtlText: {
    textAlign: 'right',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  recentSearchText: {
    ...Typography.bodyMedium,
    color: Colors.neutral[800],
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  removeButton: {
    padding: Layout.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.full,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  tagText: {
    ...Typography.labelMedium,
    color: Colors.neutral[700],
    marginLeft: 6,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: Layout.borderRadius.md,
  },
  resultInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
    justifyContent: 'center',
  },
  resultName: {
    ...Typography.bodyLarge,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  resultMeta: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
});