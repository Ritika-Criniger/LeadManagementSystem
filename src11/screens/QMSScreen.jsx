import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';

const QMSScreen= ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <View style={styles.content}>
          <Text style={styles.heading}>QMS Screen </Text>
        </View>
        <BottomBar 
          active="Suggestion"
          onNavigate={(key) => {
            if (key === 'Business Analytics') navigation.navigate('Business Analytics');
            if (key === 'Dashboard')navigation.navigate('Dashboard');
            if (key === 'LMS') navigation.navigate('LMS');
if (key === 'Meeting Suggestion')navigation.navigate('Meeting Suggestion');

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

export default QMSScreen;