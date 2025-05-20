import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

import { 
  User, 
  History, 
  MapPin, 
  CreditCard, 
  Award, 
  Settings,
  Moon, 
  Bell, 
  Globe, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocalization();
  
  // In a real app, these would come from a state management system
  const userName = 'Karim Belarbi';
  const userPhone = '+212 698-765432';
  const userEmail = 'karim.b@example.com';
  const loyaltyPoints = 255;
  
  const handleLanguageChange = () => {
    setLocale(locale === 'fr' ? 'ar' : 'fr');
  };
  
  // const handleLogout = () => {
  //   router.replace('/(auth)/login');
  // };
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('userToken');
    } else {
      await SecureStore.deleteItemAsync('userToken');
    }
  
    router.replace('/(auth)/login');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {t('profile')}
          </Text>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.neutral[700]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.profileImage}
            />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileContact}>{userPhone}</Text>
            <Text style={styles.profileContact}>{userEmail}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t('editProfile')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyContent}>
            <Award size={24} color={Colors.accent.default} />
            <View style={styles.loyaltyTextContainer}>
              <Text style={styles.loyaltyTitle}>{t('loyaltyPoints')}</Text>
              <Text style={styles.loyaltyPoints}>{loyaltyPoints} points</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.loyaltyButton}>
            <Text style={styles.loyaltyButtonText}>Utiliser</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <History size={20} color={Colors.primary.default} />
            </View>
            <Text style={styles.menuText}>{t('orderHistory')}</Text>
            <ChevronRight size={18} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <MapPin size={20} color={Colors.primary.default} />
            </View>
            <Text style={styles.menuText}>{t('savedAddresses')}</Text>
            <ChevronRight size={18} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <CreditCard size={20} color={Colors.primary.default} />
            </View>
            <Text style={styles.menuText}>{t('paymentMethods')}</Text>
            <ChevronRight size={18} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Moon size={20} color={Colors.accent.default} />
            </View>
            <Text style={styles.menuText}>{t('darkMode')}</Text>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary.light }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={Colors.accent.default} />
            </View>
            <Text style={styles.menuText}>{t('notifications')}</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary.light }}
              thumbColor={Colors.primary.default}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLanguageChange}
          >
            <View style={styles.menuIconContainer}>
              <Globe size={20} color={Colors.accent.default} />
            </View>
            <Text style={styles.menuText}>{t('language')}</Text>
            <Text style={styles.menuValue}>
              {locale === 'fr' ? 'Français' : 'العربية'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error.default} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.neutral[900],
  },
  rtlText: {
    textAlign: 'right',
  },
  settingsButton: {
    padding: Layout.spacing.xs,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    margin: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary.light,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  profileName: {
    ...Typography.headingMedium,
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.xs,
  },
  profileContact: {
    ...Typography.bodyMedium,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  editButton: {
    backgroundColor: Colors.neutral[100],
    borderRadius: Layout.borderRadius.full,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    alignSelf: 'center',
  },
  editButtonText: {
    ...Typography.labelMedium,
    color: Colors.neutral[700],
  },
  loyaltyCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loyaltyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loyaltyTextContainer: {
    marginLeft: Layout.spacing.md,
  },
  loyaltyTitle: {
    ...Typography.bodyMedium,
    color: Colors.neutral[700],
  },
  loyaltyPoints: {
    ...Typography.headingSmall,
    color: Colors.accent.default,
  },
  loyaltyButton: {
    backgroundColor: Colors.accent.light,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.full,
  },
  loyaltyButtonText: {
    ...Typography.labelMedium,
    color: Colors.accent.dark,
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  menuText: {
    ...Typography.bodyMedium,
    color: Colors.neutral[800],
    flex: 1,
  },
  menuValue: {
    ...Typography.bodyMedium,
    color: Colors.neutral[500],
    marginRight: Layout.spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xxl,
    marginTop: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutText: {
    ...Typography.labelLarge,
    color: Colors.error.default,
    marginLeft: Layout.spacing.sm,
  },
});