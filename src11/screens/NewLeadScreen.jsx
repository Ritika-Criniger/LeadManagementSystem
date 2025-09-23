import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { UserContext } from '../context/UserContext.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions
const isTablet = width > 768;
const isLargePhone = width > 400;
const isSmallScreen = width < 350;
const isTinyScreen = width < 320;

// Responsive scaling functions
const scale = (size) => {
  if (isTinyScreen) return size * 0.85;
  if (isSmallScreen) return size * 0.9;
  if (isLargePhone) return size * 1.1;
  if (isTablet) return size * 1.3;
  return size;
};

const moderateScale = (size, factor = 0.5) => scale(size) + (scale(size) - size) * factor;

// Separate InputField component to prevent re-renders
const InputField = React.memo(({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  required = false, 
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'words',
  icon,
  field
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <View style={styles.labelRow}>
          {icon && (
            <Icon name={icon} size={moderateScale(14)} color="#9c27b0" style={styles.labelIcon} />
          )}
          <Text style={styles.inputLabel}>
            {label}
            {required && <Text style={styles.asterisk}> *</Text>}
          </Text>
        </View>
      </View>
      
      <View style={[
        styles.inputWrapper,
        multiline && styles.textAreaWrapper
      ]}>
        <TextInput
          style={[styles.textInput, multiline && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={(text) => onChangeText(field, text)}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={multiline ? 'default' : 'next'}
          blurOnSubmit={!multiline}
          // These props help maintain focus
          autoCorrect={false}
          spellCheck={false}
        />
      </View>
    </View>
  );
});

const NewLeadScreen = ({ navigation }) => {
  const [leadData, setLeadData] = useState({
    leadId: 'LD00205',
    leadName: '',
    email: '',
    mobile: '',
    leadSource: '',
    leadDetails: '',
  });
  const { UserId } = useContext(UserContext);

  // Stable handleInputChange function that won't cause re-renders
  const handleInputChange = useCallback((field, value) => {
    setLeadData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  // Memoize validation function
  const validateForm = useCallback(() => {
    if (!leadData.leadName.trim()) {
      Alert.alert('Validation Error', 'Please enter client name');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadData.email.trim()) {
      Alert.alert('Validation Error', 'Please enter email address');
      return false;
    }
    if (!emailRegex.test(leadData.email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!leadData.mobile.trim()) {
      Alert.alert('Validation Error', 'Please enter mobile number');
      return false;
    }
    if (leadData.mobile.trim().length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    
    if (!leadData.leadDetails.trim()) {
      Alert.alert('Validation Error', 'Please enter lead details');
      return false;
    }
    return true;
  }, [leadData]);

  useEffect(() => {
    // Generate lead ID only once
    const generateLeadId = () => {
      const randomId = Math.floor(Math.random() * 1000) + 200;
      setLeadData(prev => ({ ...prev, leadId: `LD00${randomId}` }));
    };
    generateLeadId();
  }, []);

  const handleSaveNext = useCallback(async () => {
    if (!validateForm()) return;
    
    // Simulate API success with dummy data
    setTimeout(() => {
      const nextLeadData = { 
        ...leadData, 
        id: Math.floor(Math.random() * 1000) + 1,
        status: 'Created'
      };
      
      Alert.alert('Success', 'Lead created successfully!', [
        { text: 'Continue', onPress: () => navigation.navigate('AssignLead', { leadData: nextLeadData }) }
      ]);
    }, 1000);
  }, [leadData, validateForm, navigation]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Cancel', onPress: () => navigation.goBack(), style: 'destructive' }
      ]
    );
  }, [navigation]);

  // Memoize ProgressIndicator to prevent re-renders
  const ProgressIndicator = useMemo(() => (
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#ff9800', '#f57c00']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="person-add" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.activeStepText]}>New Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.inactiveStep]}>
            <Icon name="assignment-ind" size={moderateScale(18)} color="#999" />
          </View>
          <Text style={styles.stepText}>Assign Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.inactiveStep]}>
            <Icon name="check-circle" size={moderateScale(18)} color="#999" />
          </View>
          <Text style={styles.stepText}>Status</Text>
        </View>
      </View>
    </View>
  ), []);

  // Memoize bottom bar navigation
  const handleBottomNavigation = useCallback((key) => {
    switch(key) {
      case 'Dashboard':
        navigation.navigate('Dashboard');
        break;
      case 'Business Analytics':
        navigation.navigate('Business Analytics');
        break;
      case 'Meeting Suggestion':
        navigation.navigate('Meeting Suggestion');
        break;
      case 'LMS':
        navigation.navigate('LMS');
        break;
      case 'QMS':
        navigation.navigate('QMS');
        break;
    }
  }, [navigation]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
        
        {/* Header */}
        <Header title="Create New Lead" />
        
        {/* Progress Indicator */}
        {ProgressIndicator}
        
        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
        >
        <View style={styles.formContainer}>
          {/* Lead ID Section */}
          <View style={styles.leadIdCard}>
            <View style={styles.leadIdHeader}>
              <View style={styles.leadIdIconWrapper}>
                <Icon name="fingerprint" size={moderateScale(20)} color="#9c27b0" />
              </View>
              <Text style={styles.leadIdLabel}>Auto-Generated Lead ID</Text>
            </View>
            <View style={styles.leadIdDisplay}>
              <Text style={styles.leadIdText}>{leadData.leadId}</Text>
              <View style={styles.autoChip}>
                <Text style={styles.autoChipText}>AUTO</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Lead Information</Text>
              <Text style={styles.formSubtitle}>Please fill in all required details below</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.fieldsContainer}>
              <InputField
                field="leadName"
                label="Client Name"
                placeholder="Enter full client name"
                value={leadData.leadName}
                onChangeText={handleInputChange}
                required
                icon="person"
                autoCapitalize="words"
              />

              <InputField
                field="email"
                label="Email Address"
                placeholder="example@email.com"
                value={leadData.email}
                onChangeText={handleInputChange}
                required
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
              />

              <InputField
                field="mobile"
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={leadData.mobile}
                onChangeText={handleInputChange}
                required
                keyboardType="phone-pad"
                autoCapitalize="none"
                icon="phone"
              />

              <InputField
                field="leadSource"
                label="Lead Source"
                placeholder="Website, Social Media, Referral, etc."
                value={leadData.leadSource}
                onChangeText={handleInputChange}
                icon="source"
                autoCapitalize="words"
              />

              <InputField
                field="leadDetails"
                label="Lead Details"
                placeholder="Describe requirements, budget, timeline, or additional information..."
                value={leadData.leadDetails}
                onChangeText={handleInputChange}
                required
                multiline
                icon="description"
                autoCapitalize="sentences"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9c27b0', '#e91e63']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <Icon name="save" size={moderateScale(16)} color="#fff" />
                  <Text style={styles.saveButtonText}>Save & Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
              </ScrollView>

        {/* Bottom Navigation */}
        <BottomBar active="LMS" onNavigate={handleBottomNavigation} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Progress Indicator Styles
  progressContainer: {
    backgroundColor: 'transparent',
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
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
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(6),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeStep: {
    // Gradient applied in component
  },
  inactiveStep: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  stepText: {
    fontSize: moderateScale(10),
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeStepText: {
    color: '#ff9800',
    fontWeight: 'bold',
    fontSize: moderateScale(11),
  },
  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: scale(8),
    borderRadius: 1,
  },
  inactiveLine: {
    backgroundColor: '#e0e0e0',
  },
  // Scroll View Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(120), // Extra space for keyboard
  },
  formContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
  },
  // Lead ID Card
  leadIdCard: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(18),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0',
  },
  leadIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  leadIdIconWrapper: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  leadIdLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#333',
  },
  leadIdDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leadIdText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#9c27b0',
  },
  autoChip: {
    backgroundColor: '#9c27b0',
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(12),
  },
  autoChipText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  // Form Section
  formSection: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: scale(24),
  },
  formTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: scale(6),
  },
  formSubtitle: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
  },
  // Input Fields - Simple and clean
  fieldsContainer: {
    gap: scale(16),
  },
  inputContainer: {
    marginBottom: 4,
  },
  labelContainer: {
    marginBottom: scale(8),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: scale(6),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: '600',
  },
  asterisk: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(6),
    backgroundColor: '#fff',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
  },
  textAreaWrapper: {
    paddingVertical: scale(10),
    minHeight: scale(80),
  },
  textInput: {
    fontSize: moderateScale(14),
    color: '#333',
    padding: 0,
    textAlignVertical: 'center',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: scale(60),
  },
  // Action Buttons
  buttonContainer: {
    flexDirection: 'row',
    marginTop: scale(32),
    gap: scale(12),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: scale(6),
    paddingVertical: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    borderRadius: scale(6),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveGradient: {
    paddingVertical: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(6),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});

export default NewLeadScreen;