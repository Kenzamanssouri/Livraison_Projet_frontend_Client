import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { ChevronRight, Globe } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/5409021/pexels-photo-5409021.jpeg?auto=compress&cs=tinysrgb&w=800',
    titleKey: 'onboarding.step1Title',
    textKey: 'onboarding.step1Text',
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/4050990/pexels-photo-4050990.jpeg?auto=compress&cs=tinysrgb&w=800',
    titleKey: 'onboarding.step2Title',
    textKey: 'onboarding.step2Text',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/10793616/pexels-photo-10793616.jpeg?auto=compress&cs=tinysrgb&w=800',
    titleKey: 'onboarding.step3Title',
    textKey: 'onboarding.step3Text',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocalization();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode);
  };

  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  const renderDot = (index: number) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [8, 20, 8],
      extrapolate: 'clamp',
    });
    
    const backgroundColor = scrollX.interpolate({
      inputRange,
      outputRange: [Colors.neutral[300], Colors.primary.default, Colors.neutral[300]],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        key={index} 
        style={[
          styles.dot,
          { width: dotWidth, backgroundColor },
        ]} 
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.languageSelector}>
        <TouchableOpacity 
          style={styles.langButton}
          onPress={() => handleLanguageChange(locale === 'fr' ? 'ar' : 'fr')}
        >
          <Globe size={20} color={Colors.neutral[700]} />
          <Text style={styles.langText}>
            {locale === 'fr' ? 'العربية' : 'Français'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Delivrya</Text>
        <Text style={styles.welcomeText}>{t('welcome')}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>{t(item.titleKey)}</Text>
              <Text style={[styles.description, isRTL && styles.rtlText]}>{t(item.textKey)}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.paginationContainer}>
        <View style={styles.dotsContainer}>
          {onboardingSteps.map((_, index) => renderDot(index))}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>{t('skip')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingSteps.length - 1 ? t('getStarted') : t('continue')}
          </Text>
          <ChevronRight size={20} color="white" />
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
  languageSelector: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.full,
  },
  langText: {
    ...Typography.labelMedium,
    marginLeft: 8,
    color: Colors.neutral[700],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Layout.spacing.xxxl,
    marginBottom: Layout.spacing.xl,
  },
  logo: {
    ...Typography.displayMedium,
    color: Colors.primary.default,
    marginBottom: Layout.spacing.xs,
  },
  welcomeText: {
    ...Typography.headingSmall,
    color: Colors.neutral[700],
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  textContainer: {
    width: width * 0.8,
    marginTop: Layout.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...Typography.headingLarge,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
    color: Colors.neutral[900],
  },
  description: {
    ...Typography.bodyMedium,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
  rtlText: {
    textAlign: 'right',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    marginTop: Layout.spacing.xxl,
    marginBottom: Layout.spacing.xl,
  },
  skipButton: {
    ...Typography.labelMedium,
    color: Colors.neutral[600],
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.default,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    ...Typography.labelMedium,
    color: Colors.white,
    marginRight: 4,
  },
});