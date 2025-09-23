import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Responsive scaling
const isTablet = width > 768;
const isLargePhone = width > 400;
const isSmallScreen = width < 350;
const isTinyScreen = width < 320;

const scale = (size) => {
  if (isTinyScreen) return size * 0.85;
  if (isSmallScreen) return size * 0.9;
  if (isLargePhone) return size * 1.1;
  if (isTablet) return size * 1.3;
  return size;
};

const moderateScale = (size, factor = 0.5) => scale(size) + (scale(size) - size) * factor;

const StatusScreen = ({ navigation, route }) => {
  const { leadData, assignData } = route.params || {};
  
  const [statusData, setStatusData] = useState({
    leadStatus: 'Assigned',
    remark: '',
  });
  
  const [showStatusList, setShowStatusList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Status options
  const statusOptions = ['Assigned', 'InProgress', 'Completed', 'Pending', 'Cancelled'];

  const handleInputChange = useCallback((field, value) => {
    setStatusData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!statusData.leadStatus) {
      Alert.alert('Validation Error', 'Please select lead status');
      return false;
    }
    if (!statusData.remark.trim()) {
      Alert.alert('Validation Error', 'Please enter remark');
      return false;
    }
    return true;
  }, [statusData]);

  const handleUpdateStatus = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success', 
        'Lead created and assigned successfully!', 
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('LMS') 
          }
        ]
      );
    }, 500);
  }, [statusData, navigation, validateForm]);

  const handlePrevious = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Progress Indicator Component
  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.completedStep]}>
            <Icon name="check" size={moderateScale(18)} color="#fff" />
          </View>
          <Text style={[styles.stepText, styles.completedStepText]}>New Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.activeLine]} />
         <View style={styles.progressStep}>
          <LinearGradient
            colors={['#ff9800', '#ff5722']}          // orange gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.stepCircle, styles.completedStepGradient]}
          >
            <Icon name="assignment-ind" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.completedStepText]}>Assign Lead</Text>
        </View>
        
        
        <View style={[styles.progressLine, styles.activeLine]} />
        
        <View style={styles.progressStep}>
          <LinearGradient
                      colors={['#9c27b0', '#64b5f6']}
                      style={[styles.stepCircle, styles.activeStep]}
                    >
            <Icon name="check-circle" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.activeStepText]}>Status</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <Header title="Lead Status" />

      <ProgressIndicator />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.sectionTitle}>Lead Status</Text>
            <Text style={styles.sectionSubtitle}>Review and finalize lead creation</Text>
          </View>

          {/* Lead Status Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Lead Status
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowStatusList(!showStatusList)}
            >
              <Text style={[styles.selectText, !statusData.leadStatus && styles.placeholder]}>
                {statusData.leadStatus || 'Select Status'}
              </Text>
              <Icon name="keyboard-arrow-down" size={moderateScale(24)} color="#9c27b0" />
            </TouchableOpacity>
            
            {showStatusList && (
              <View style={styles.dropdownList}>
                {statusOptions.map(status => (
                  <TouchableOpacity 
                    key={status} 
                    style={styles.dropdownItem}
                    onPress={() => { 
                      handleInputChange('leadStatus', status); 
                      setShowStatusList(false); 
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Remark Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Remark
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Enter your remark about the lead status"
              value={statusData.remark}
              onChangeText={(value) => handleInputChange('remark', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          {/* Summary Section */}
          {leadData && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryHeader}>
                <Icon name="summarize" size={moderateScale(20)} color="#9c27b0" />
                <Text style={styles.summaryTitle}>Lead Summary</Text>
              </View>
              
              <View style={styles.summaryContent}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Lead ID:</Text>
                  <Text style={styles.summaryValue}>{leadData.leadId || 'LD00205'}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Lead Name:</Text>
                  <Text style={styles.summaryValue}>{leadData.leadName || 'N/A'}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Email:</Text>
                  <Text style={styles.summaryValue}>{leadData.email || 'N/A'}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Mobile:</Text>
                  <Text style={styles.summaryValue}>{leadData.mobile || 'N/A'}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Assigned To:</Text>
                  <Text style={styles.summaryValue}>
                    {assignData?.assignToRM ? `RM ${assignData.assignToRM}` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Priority:</Text>
                  <View style={[styles.priorityBadge, 
                    assignData?.priority === 'Hot' && styles.hotPriority,
                    assignData?.priority === 'Warm' && styles.warmPriority,
                    assignData?.priority === 'Cold' && styles.coldPriority
                  ]}>
                    <Text style={styles.priorityText}>{assignData?.priority || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Current Status:</Text>
                  <Text style={[styles.summaryValue, styles.statusValue]}>{statusData.leadStatus}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handlePrevious}
              disabled={isLoading}
            >
              <LinearGradient
  colors={['#9c27b0', '#64b5f6']}
  start={{ x: 0, y: 0.5 }}   // start from left
  end={{ x: 1, y: 0.5 }}     // end at right
  style={styles.gradientButton}
>
  <Text style={styles.buttonText}>Previous</Text>
</LinearGradient>

            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.updateButton]} 
              onPress={handleUpdateStatus}
              disabled={isLoading}
            >
              <LinearGradient
  colors={isLoading ? ['#ccc', '#999'] : ['#9c27b0', '#64b5f6']}
  start={{ x: 0, y: 0.5 }}   // start from left
  end={{ x: 1, y: 0.5 }}     // end at right
  style={styles.gradientButton}
>
  {isLoading ? (
    <Text style={styles.buttonText}>Processing...</Text>
  ) : (
    <Text style={styles.buttonText}>Update Status</Text>
  )}
</LinearGradient>

            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomBar active="LMS" onNavigate={(key) => {
        if (key === 'Dashboard') navigation.navigate('Dashboard');
        if (key === 'Business Analytics') navigation.navigate('Business Analytics');
        if (key === 'Meeting Suggestion') navigation.navigate('Meeting Suggestion');
        if (key === 'LMS') navigation.navigate('LMS');
        if (key === 'QMS') navigation.navigate('QMS');
      }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    backgroundColor: '#fff',
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: scale(300),
    alignSelf: 'center',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  completedStep: {
    backgroundColor: '#ff9800',
    elevation: 2,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activeStep: {
    elevation: 3,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepText: {
    fontSize: moderateScale(12),
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  completedStepText: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  activeStepText: {
    color: '#666',
    fontWeight: 'bold',
  },
  progressLine: {
    height: 2,
    flex: 0.5,
    marginHorizontal: scale(10),
    borderRadius: 1,
  },
  activeLine: {
    backgroundColor: '#ff9800',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: scale(20),
    borderRadius: scale(12),
    padding: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: scale(6),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: scale(24),
  },
  statusLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scale(12),
  },
  statusBox: {
    borderWidth: 2,
    borderColor: '#9c27b0',
    borderRadius: scale(8),
    padding: scale(16),
    backgroundColor: 'rgba(156, 39, 176, 0.05)',
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: moderateScale(18),
    color: '#9c27b0',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: scale(12),
  },
  statusBadge: {
    backgroundColor: '#9c27b0',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: scale(20),
  },
  inputLabel: {
    fontSize: moderateScale(16),
    color: '#333',
    marginBottom: scale(8),
    fontWeight: '600',
  },
  asterisk: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingVertical: scale(12),
  },
  selectText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: scale(8),
    marginTop: scale(8),
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  textAreaInput: {
    fontSize: moderateScale(16),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    paddingHorizontal: scale(15),
    paddingVertical: scale(12),
    textAlignVertical: 'top',
    minHeight: scale(100),
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: scale(20),
    marginBottom: scale(24),
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  summaryTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: scale(8),
  },
  summaryContent: {
    gap: scale(12),
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    backgroundColor: '#f8f9fa',
    borderRadius: scale(6),
  },
  summaryLabel: {
    fontSize: moderateScale(14),
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginLeft: scale(12),
  },
  statusValue: {
    color: '#9c27b0',
  },
  priorityBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    backgroundColor: '#6c757d',
  },
  hotPriority: {
    backgroundColor: '#dc3545',
  },
  warmPriority: {
    backgroundColor: '#fd7e14',
  },
  coldPriority: {
    backgroundColor: '#6f42c1',
  },
  priorityText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    borderRadius: scale(8),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  updateButton: {
    flex: 2,
    borderRadius: scale(8),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(6),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});

export default StatusScreen;