import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProgressBar = ({ 
  label, 
  percentage, 
  color = ['#9c27b0', '#64b5f6'],
  showPercentage = true,
  height = 6,
  labelWidth = 70
}) => {
  return (
    <View style={styles.progressContainer}>
      <Text style={[styles.progressLabel, { width: labelWidth }]}>{label}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBg, { height }]}>
          <LinearGradient
            colors={percentage > 0 ? color : ['#e0e0e0', '#e0e0e0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${percentage}%`, height }]}
          />
        </View>
      </View>
      {showPercentage && (
        <Text style={styles.progressPercent}>{percentage}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBg: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 3,
  },
  progressPercent: {
    width: 40,
    textAlign: 'right',
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
});

export default ProgressBar;
