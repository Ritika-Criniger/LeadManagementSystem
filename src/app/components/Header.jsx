import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Header = ({ onBackPress, onNotificationsPress }) => {
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Optimized header height calculation - reduced gaps
  const headerHeight = Platform.OS === 'ios' ? 44 : 48;
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  const totalTopPadding = Platform.OS === 'ios' ? insets.top : 0; // Remove extra padding on Android

  // Dynamic logo sizing based on screen dimensions
  const getLogoSize = () => {
    if (screenWidth < 350) {
      // Small screens (like iPhone SE)
      return { width: 90, height: 35 };
    } else if (screenWidth < 400) {
      // Medium small screens
      return { width: 110, height: 42 };
    } else if (screenWidth < 450) {
      // Medium screens
      return { width: 130, height: 50 };
    } else {
      // Large screens
      return { width: 150, height: 58 };
    }
  };

  const logoSize = getLogoSize();

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} translucent={Platform.OS === 'android'} />
      <View
        style={[styles.header, { 
          paddingTop: totalTopPadding,
          height: headerHeight + totalTopPadding 
        }]}
      >
        <View style={[styles.content, { height: headerHeight }]}>
          {/* Logo - responsive size based on screen dimensions */}
          <Image 
            source={require('../../assets/logo.png')} 
            style={[styles.logo, logoSize]} 
          />

          {/* Right side: notification + profile */}
          <View style={styles.right}>
            <TouchableOpacity 
              onPress={onNotificationsPress} 
              style={styles.iconButton} 
              activeOpacity={0.7}
            >
              <Icon name="notifications" size={screenWidth < 350 ? 18 : 20} color={colors.accent} />
              <View style={styles.dot} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={toggleMenu} 
              style={[styles.profile, { 
                width: screenWidth < 350 ? 26 : 28,
                height: screenWidth < 350 ? 26 : 28,
                borderRadius: screenWidth < 350 ? 13 : 14 
              }]} 
              activeOpacity={0.7}
            >
              <Text style={[styles.profileText, { fontSize: screenWidth < 350 ? 11 : 12 }]}>R</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dropdown menu */}
      {menuVisible && (
        <Animated.View style={[styles.menu, { 
          opacity: fadeAnim,
          top: headerHeight + totalTopPadding + 8,
          width: screenWidth < 350 ? 110 : screenWidth * 0.35,
        }]}>
          {[
            'My Profile',
            'Client Profile',
            'Add Subscriber',
            'Conveyance Report',
            'Sync',
            'Logout',
          ].map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.menuItem,
                index === 5 && styles.lastMenuItem // Remove border from last item
              ]}
              activeOpacity={0.7}
              onPress={() => {
                console.log(item);
                toggleMenu();
              }}
            >
              <Text style={[styles.menuText, { fontSize: screenWidth < 350 ? 11 : 12 }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  logo: {
    resizeMode: 'contain',
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
  profile: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  menu: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    paddingVertical: 2,
    maxWidth: 140,
    minWidth: 120,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default Header;