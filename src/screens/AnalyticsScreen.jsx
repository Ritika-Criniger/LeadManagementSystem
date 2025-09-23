import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';

const AnalyticsScreen = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <SafeAreaView style={styles.container}>
        <Header title="Analytice"/>
        <View style={styles.content}>
          <Text style={styles.heading}>Analyitcs </Text>
        </View>
        <BottomBar 
          active="Business Analytics"
          onNavigate={(key) => {
            if (key === 'Dashboard') navigation.navigate('Dashboard');
            if (key === 'Business Analytics') navigation.navigate('Business Analytics');
            if (key === 'Meeting Suggestion') navigation.navigate('Meeting Suggestion');
            if (key === 'LMS') navigation.navigate('LMS');
            if (key === 'QMS') navigation.navigate('QMS');
          }} 
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  heading: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333'
  }
});

export default AnalyticsScreen;