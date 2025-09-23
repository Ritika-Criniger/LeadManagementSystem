import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Dimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const BottomBar = ({ active = 'Dashboard', onNavigate }) => {
  const insets = useSafeAreaInsets();
  
  const items = [
    { key: 'Dashboard', icon: 'dashboard', label: 'Dashboard' },
    { key: 'Business Analytics', icon: 'analytics', label: 'Analytics' },
    { key: 'Meeting Suggestion', icon: 'lightbulb', label: 'Meetings' },
    { key: 'LMS', icon: 'people', label: 'LMS' },
    { key: 'QMS', icon: 'help_outline', label: 'QMS' }
  ];

  // Responsive sizing
  const isSmallScreen = screenWidth < 350;
  const iconSize = isSmallScreen ? 18 : 20;
  const fontSize = isSmallScreen ? 9 : 10;
  const activeIconSize = isSmallScreen ? 28 : 32;

  return (
    <View style={[
      styles.container,
      { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8 }
    ]}>
      <View style={styles.innerContainer}>
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.item}
              onPress={() => onNavigate?.(item.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                {isActive ? (
                  <LinearGradient
                    colors={['#9c27b0', '#64b5f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.activeIcon, { 
                      width: activeIconSize, 
                      height: activeIconSize,
                      borderRadius: activeIconSize / 2 
                    }]}
                  >
                    <Icon name={item.icon} size={iconSize} color="#fff" />
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveIconWrapper}>
                    <Icon name={item.icon} size={iconSize} color="#666" />
                  </View>
                )}
              </View>
              <Text style={[
                styles.label, 
                isActive && styles.activeLabel,
                { fontSize }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconWrapper: {
    marginBottom: 4,
    height: 32, // Fixed height to prevent layout shift
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveIconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  label: {
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
  activeLabel: {
    color: '#9c27b0',
    fontWeight: '700',
  },
});

export default BottomBar;