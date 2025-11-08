import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Voice from '@react-native-voice/voice';

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

const AssignLeadScreen = ({ navigation, route }) => {
  const { leadData } = route.params || {};
  
  const [assignData, setAssignData] = useState({
    assignToRM: '',
    assignDate: null,
    priority: '',
    remark: '',
  });
  
  const [showAssignPicker, setShowAssignPicker] = useState(false);
  const [showRmList, setShowRmList] = useState(false);
  const [showPriorityList, setShowPriorityList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice-to-Text States
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dummy RM options
  const rmOptions = [
    { id: 1, username: "RM One" },
    { id: 2, username: "RM Two" },
    { id: 3, username: "RM Three" },
    { id: 4, username: "RM Four" },
  ];

  const priorityOptions = ['Hot', 'Warm', 'Cold'];

  // Voice Recognition Setup
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    console.log('Speech started', e);
    setIsRecording(true);
  };

  const onSpeechEnd = (e) => {
    console.log('Speech ended', e);
    setIsRecording(false);
    setIsProcessing(false);
  };

  const onSpeechResults = (e) => {
    console.log('Speech results', e);
    if (e.value && e.value.length > 0) {
      const spokenText = e.value[0];
      // Append to existing remark
      setAssignData(prevState => ({
        ...prevState,
        remark: prevState.remark ? `${prevState.remark} ${spokenText}` : spokenText,
      }));
    }
  };

  const onSpeechError = (e) => {
    console.log('Speech error', e);
    setIsRecording(false);
    setIsProcessing(false);
    Alert.alert('Error', 'Could not recognize speech. Please try again.');
  };

  // Request Microphone Permission (Android)
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone for voice input.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permission automatically
  };

  // Start Voice Recording
  const startVoiceRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant microphone permission to use voice input.'
      );
      return;
    }

    try {
      setIsProcessing(true);
      await Voice.start('en-US'); // You can change to 'hi-IN' for Hindi
    } catch (e) {
      console.error('Error starting voice recognition', e);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
    }
  };

  // Stop Voice Recording
  const stopVoiceRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      setIsProcessing(false);
    } catch (e) {
      console.error('Error stopping voice recognition', e);
    }
  };

  // Toggle Voice Recording
  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleInputChange = useCallback((field, value) => {
    setAssignData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!assignData.assignToRM) {
      Alert.alert('Validation Error', 'Please select RM');
      return false;
    }
    if (!assignData.assignDate) {
      Alert.alert('Validation Error', 'Please select assign date');
      return false;
    }
    if (!assignData.priority) {
      Alert.alert('Validation Error', 'Please select priority');
      return false;
    }
    if (!assignData.remark.trim()) {
      Alert.alert('Validation Error', 'Please enter remark');
      return false;
    }
    return true;
  }, [assignData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const completeLeadData = {
        ...leadData,
        assignData
      };
      
      // Navigate to StatusScreen with complete data
      navigation.navigate('Status', { 
        leadData: completeLeadData, 
        assignData 
      });
    }, 500);
  }, [assignData, leadData, navigation, validateForm]);

  const handlePrevious = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to cancel? All progress will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Cancel', onPress: () => navigation.navigate('LMS'), style: 'destructive' }
      ]
    );
  }, [navigation]);

  // Progress Indicator Component
  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#ff9800', '#ff5722']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.stepCircle, styles.completedStepGradient]}
          >
            <Icon name="person-add" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.completedStepText]}>New Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.activeLine]} />
        
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#9c27b0', '#64b5f6']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="assignment-ind" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.activeStepText]}>Assign Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#9c27b0', '#64b5f6']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="check-circle" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={styles.stepText}>Status</Text>
        </View>
      </View>
    </View>
  );

  const DropdownField = ({ label, value, options, onSelect, placeholder, required = false }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <TouchableOpacity 
        style={styles.selectInput} 
        onPress={() => {
          if (label === 'Assign to RM') setShowRmList(!showRmList);
          if (label === 'Priority') setShowPriorityList(!showPriorityList);
        }}
      >
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Icon name="keyboard-arrow-down" size={moderateScale(24)} color="#9c27b0" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <Header title="Assign Lead" />

      <ProgressIndicator />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.sectionTitle}>Assign to RM</Text>
            <Text style={styles.sectionSubtitle}>Complete the lead assignment details</Text>
          </View>

          {/* RM Dropdown */}
          <DropdownField
            label="Assign to RM"
            value={rmOptions.find(x => x.id === assignData.assignToRM)?.username}
            placeholder="Select RM"
            required
          />
          
          {showRmList && (
            <View style={styles.dropdownList}>
              {rmOptions.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.dropdownItem}
                  onPress={() => { 
                    handleInputChange('assignToRM', item.id); 
                    setShowRmList(false); 
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.username}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Assign Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Assign Date
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dateInput}
              onPress={() => setShowAssignPicker(true)}
            >
              <Text style={[styles.dateText, !assignData.assignDate && styles.placeholder]}>
                {assignData.assignDate ? formatDate(assignData.assignDate) : "mm/dd/yyyy"}
              </Text>
              <Icon name="event" size={moderateScale(20)} color="#9c27b0" />
            </TouchableOpacity>
          </View>

          {/* Priority Dropdown */}
          <DropdownField
            label="Priority"
            value={assignData.priority}
            placeholder="Select Priority"
            required
          />
          
          {showPriorityList && (
            <View style={styles.dropdownList}>
              {priorityOptions.map(priority => (
                <TouchableOpacity 
                  key={priority} 
                  style={styles.dropdownItem}
                  onPress={() => { 
                    handleInputChange('priority', priority); 
                    setShowPriorityList(false); 
                  }}
                >
                  <Text style={styles.dropdownItemText}>{priority}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Remark with Voice Input */}
          <View style={styles.inputContainer}>
            <View style={styles.remarkHeader}>
              <Text style={styles.inputLabel}>
                Remark
                <Text style={styles.asterisk}> *</Text>
              </Text>
              <TouchableOpacity 
                style={[
                  styles.micButton,
                  isRecording && styles.micButtonActive,
                  isProcessing && styles.micButtonProcessing
                ]}
                onPress={toggleVoiceRecording}
                disabled={isProcessing && !isRecording}
              >
                {isProcessing && !isRecording ? (
                  <ActivityIndicator size="small" color="#9c27b0" />
                ) : (
                  <Icon 
                    name={isRecording ? "mic" : "mic-none"} 
                    size={moderateScale(24)} 
                    color={isRecording ? "#fff" : "#9c27b0"} 
                  />
                )}
              </TouchableOpacity>
            </View>
            
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Listening...</Text>
              </View>
            )}
            
            <TextInput
              style={styles.textAreaInput}
              placeholder="Enter your remark or use voice input"
              value={assignData.remark}
              onChangeText={(value) => handleInputChange('remark', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handlePrevious}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleCancel}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#757575', '#9e9e9e']}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#ccc', '#999'] : ['#9c27b0', '#64b5f6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientButton}
              >
                {isLoading ? (
                  <Text style={styles.buttonText}>Loading...</Text>
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showAssignPicker && (
        <DateTimePicker
          value={assignData.assignDate ? new Date(assignData.assignDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowAssignPicker(Platform.OS === 'ios');
            if (selectedDate) handleInputChange('assignDate', selectedDate);
          }}
        />
      )}

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
    backgroundColor: '#f8f9fa' 
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
  inactiveStep: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  stepText: { 
    fontSize: moderateScale(12), 
    color: '#666', 
    textAlign: 'center',
    fontWeight: '500',
  },
  completedStepText: { 
    color: '#ff9800', 
    fontWeight: 'bold' 
  },
  activeStepText: { 
    color: '#666', 
    fontWeight: 'bold' 
  },
  progressLine: { 
    height: 2,
    flex: 0.5,
    marginHorizontal: scale(10),
    borderRadius: 1,
  },
  activeLine: { 
    backgroundColor: '#ff9800' 
  },
  inactiveLine: {
    backgroundColor: '#e0e0e0',
  },
  content: { 
    flex: 1 
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
  inputContainer: { 
    marginBottom: scale(20) 
  },
  inputLabel: { 
    fontSize: moderateScale(16), 
    marginBottom: scale(8), 
    fontWeight: '600',
    color: '#333',
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
    color: '#333' 
  },
  placeholder: { 
    color: '#999' 
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingVertical: scale(12),
  },
  dateText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  // Remark with Voice Input Styles
  remarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  micButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  micButtonActive: {
    backgroundColor: '#9c27b0',
    elevation: 4,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  micButtonProcessing: {
    backgroundColor: '#e0e0e0',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    marginBottom: scale(8),
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  recordingDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#f44336',
    marginRight: scale(8),
  },
  recordingText: {
    fontSize: moderateScale(14),
    color: '#ff9800',
    fontWeight: '600',
  },
  textAreaInput: {
    fontSize: moderateScale(16),
    color: '#333',
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: scale(8), 
    padding: scale(12), 
    minHeight: scale(100),
    textAlignVertical: 'top',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: scale(30),
    gap: scale(8),
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
  saveButton: {
    flex: 1.2,
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
    fontWeight: 'bold' 
  },
});

export default AssignLeadScreen;
