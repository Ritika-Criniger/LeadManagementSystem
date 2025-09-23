import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { closeLead } from '../utils/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatusScreen = ({ navigation, route }) => {
  const { leadData, assignData } = route.params || {};
  
  const [statusData, setStatusData] = useState({
    leadStatus: 'Assigned',
    remark: '',
  });

  const handleInputChange = (field, value) => {
    setStatusData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUpdateStatus = async () => {
    if (!statusData.remark.trim()) {
      Alert.alert('Error', 'Please enter remark');
      return;
    }
    try {
      const leadId = route.params?.leadData?.id || route.params?.leadData?.lead?.id;
      const requestData = {
        leadStatus: statusData.leadStatus === 'Completed' ? 5 : statusData.leadStatus === 'Cancelled' ? 6 : 3,
        completedRemark: statusData.leadStatus === 'Completed' ? statusData.remark : null,
        progressRemark: statusData.leadStatus === 'InProgress' ? statusData.remark : null
      };
      const code = await closeLead({ leadId, requestData });
      if (code === 200) {
        Alert.alert('Success', 'Lead status updated successfully!', [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]);
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressStep}>
        <View style={[styles.stepCircle, styles.completedStep]}>
          <Icon name="person-add" size={20} color="#fff" />
        </View>
        <Text style={[styles.stepText, styles.completedStepText]}>New Lead</Text>
      </View>
      
      <View style={[styles.progressLine, styles.activeLine]} />
      
      <View style={styles.progressStep}>
        <View style={[styles.stepCircle, styles.completedStep]}>
          <Icon name="assignment-ind" size={20} color="#fff" />
        </View>
        <Text style={[styles.stepText, styles.completedStepText]}>Assign Lead</Text>
      </View>
      
      <View style={[styles.progressLine, styles.activeLine]} />
      
      <View style={styles.progressStep}>
        <View style={[styles.stepCircle, styles.activeStep]}>
          <Icon name="check-circle" size={20} color="#fff" />
        </View>
        <Text style={[styles.stepText, styles.activeStepText]}>Status</Text>
      </View>
    </View>
  );

  const StatusSelector = () => (
    <View style={styles.statusContainer}>
      <Text style={styles.statusLabel}>Lead Status</Text>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{statusData.leadStatus}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Lead Status" />

      {/* Progress Indicator */}
      <ProgressIndicator />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Lead Status */}
          <StatusSelector />

          {/* Remark Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Remark</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter your remark"
              value={statusData.remark}
              onChangeText={(value) => handleInputChange('remark', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handlePrevious}>
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatus}>
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Update Status</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Summary Section */}
          {leadData && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Lead Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Lead ID:</Text>
                <Text style={styles.summaryValue}>LD00205</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Lead Name:</Text>
                <Text style={styles.summaryValue}>{leadData.leadName}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Email:</Text>
                <Text style={styles.summaryValue}>{leadData.email}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Mobile:</Text>
                <Text style={styles.summaryValue}>{leadData.mobile}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Status:</Text>
                <Text style={[styles.summaryValue, styles.statusValue]}>{statusData.leadStatus}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomBar active="LMS" onNavigate={(key) => { if (key === 'Dashboard') navigation.navigate('Dashboard'); if (key === 'LMS') navigation.navigate('LMS'); }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#9c27b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedStep: {
    backgroundColor: '#4caf50',
  },
  activeStep: {
    backgroundColor: '#9c27b0',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  completedStepText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  activeStepText: {
    color: '#9c27b0',
    fontWeight: 'bold',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: '#4caf50',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusContainer: {
    marginBottom: 25,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusBox: {
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingBottom: 12,
  },
  statusText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingVertical: 12,
    paddingHorizontal: 4,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 0.4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  updateButton: {
    flex: 0.55,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  statusValue: {
    color: '#9c27b0',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#9c27b0',
    marginTop: 5,
  },
});

export default StatusScreen;