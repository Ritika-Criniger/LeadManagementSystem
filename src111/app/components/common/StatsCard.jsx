import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  gradient = ['#9c27b0', '#64b5f6'],
  size = 'medium',
  onPress 
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          cardPadding: 12,
          iconSize: 20,
          valueSize: 18,
          titleSize: 10,
          minHeight: 80
        };
      case 'large':
        return {
          cardPadding: 20,
          iconSize: 28,
          valueSize: 28,
          titleSize: 14,
          minHeight: 120
        };
      default: // medium
        return {
          cardPadding: 16,
          iconSize: 24,
          valueSize: 24,
          titleSize: 12,
          minHeight: 100
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.statsCard, { minHeight: sizeStyles.minHeight }]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCardGradient}
      >
        <View style={styles.statsHeader}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Icon name={icon} size={sizeStyles.iconSize} color="#fff" />
          </View>
        </View>
        <Text style={[styles.statsValue, { fontSize: sizeStyles.valueSize }]}>{value}</Text>
        <Text style={[styles.statsTitle, { fontSize: sizeStyles.titleSize }]}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  statsCardGradient: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  statsHeader: {
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statsTitle: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default StatsCard;
