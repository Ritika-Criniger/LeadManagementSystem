import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  gradient = ['#9c27b0', '#64b5f6'], 
  onPress 
}) => {
  // Responsive dimensions calculation
  const getCardDimensions = () => {
    const horizontalPadding = 20; // Container padding
    const cardGap = 14; // Gap between cards
    const totalHorizontalSpace = horizontalPadding * 2 + cardGap;
    const cardWidth = (screenWidth - totalHorizontalSpace) / 2;
    
    // Responsive heights based on screen size
    let cardHeight;
    if (screenWidth < 350) {
      cardHeight = 110; // Very small phones
    } else if (screenWidth < 400) {
      cardHeight = 125; // Small phones
    } else if (screenWidth < 450) {
      cardHeight = 135; // Medium phones
    } else {
      cardHeight = 145; // Large phones/tablets
    }
    
    return { cardWidth, cardHeight };
  };

  // Responsive font and icon sizes
  const getResponsiveSizes = () => {
    if (screenWidth < 350) {
      return {
        iconSize: 24,
        titleSize: 12,
        valueSize: 24,
        padding: 12
      };
    } else if (screenWidth < 400) {
      return {
        iconSize: 26,
        titleSize: 13,
        valueSize: 28,
        padding: 15
      };
    } else if (screenWidth < 450) {
      return {
        iconSize: 28,
        titleSize: 14,
        valueSize: 32,
        padding: 18
      };
    } else {
      return {
        iconSize: 30,
        titleSize: 15,
        valueSize: 36,
        padding: 20
      };
    }
  };

  const { cardWidth, cardHeight } = getCardDimensions();
  const { iconSize, titleSize, valueSize, padding } = getResponsiveSizes();

  const CardContent = () => (
    <View style={[
      styles.statsCard, 
      { 
        width: cardWidth,
        height: cardHeight,
        padding: padding
      }
    ]}>
      {/* Gradient Top Border */}
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      />
      
      {/* Icon at top center */}
      <View style={styles.iconContainer}>
        <Icon name={icon} size={iconSize} color={gradient[0]} />
      </View>
      
      {/* Title in center */}
      <Text style={[styles.statsTitle, { fontSize: titleSize }]} numberOfLines={2}>
        {title}
      </Text>
      
      {/* Value at bottom center */}
      <Text style={[styles.statsValue, { color: gradient[0], fontSize: valueSize }]}>
        {value}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// Usage Example with proper spacing
const StatsExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lead Management System</Text>
      
      {/* Stats Grid with proper spacing */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatsCard
            title="Total Leads"
            value="3"
            icon="people"
            gradient={['#9c27b0', '#64b5f6']}
          />
          <StatsCard
            title="Hot Leads"
            value="2"
            icon="local-fire-department"
            gradient={['#f44336', '#ff9800']}
          />
        </View>
        
        <View style={styles.statsRow}>
          <StatsCard
            title="Pending Leads"
            value="5"
            icon="schedule"
            gradient={['#ff9800', '#ffc107']}
          />
          <StatsCard
            title="Completed Leads"
            value="7"
            icon="check-circle"
            gradient={['#4caf50', '#8bc34a']}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
  },
  title: {
    fontSize: screenWidth < 400 ? 22 : 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'left',
  },
  statsGrid: {
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14, // Fixed gap between cards
    marginBottom: 4,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    shadowRadius: Platform.OS === 'ios' ? 3 : 0,
    alignItems: 'center',
    justifyContent: 'space-evenly', // Even distribution of space
    overflow: 'hidden', // Important for gradient border
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statsTitle: {
    color: '#5a6c7d',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
    flex: 0.8,
    textAlignVertical: 'center',
  },
  statsValue: {
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
});

export default StatsCard;
export { StatsExample };