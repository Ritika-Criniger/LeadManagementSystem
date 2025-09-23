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
  field,
  isViewMode = false
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
          autoCorrect={false}
          spellCheck={false}
          editable={!isViewMode}
        />
      </View>
    </View>
  );
});

const NewLeadScreen = ({ navigation, route }) => {
  const { leadData: routeLeadData, isViewMode = false } = route?.params || {};
  
  const [leadData, setLeadData] = useState({
    leadId: '',
    leadName: '',
    email: '',
    mobile: '',
    leadSource: '',
    leadDetails: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadSourceList, setShowLeadSourceList] = useState(false);
  const { UserId } = useContext(UserContext);

  // Lead Source options
  const leadSourceOptions = [
    'Website',
    'Mobile',
    'Referrals', 
    'Email Forms',
    'Others'
  ];

  // Initialize data - autofill karna hai agar view mode hai
  useEffect(() => {
    if (isViewMode && routeLeadData) {
      // Autofill with existing lead data
      setLeadData({
        leadId: routeLeadData.id ? `LD00${routeLeadData.id}` : '',
        leadName: routeLeadData.name || '',
        email: routeLeadData.email || '',
        mobile: routeLeadData.phone || '',
        leadSource: routeLeadData.leadSource || 'Website',
        leadDetails: routeLeadData.leadDetails || `Details for ${routeLeadData.name || 'this lead'}`,
      });
    } else {
      // Generate lead ID for new lead
      const generateLeadId = () => {
        const randomId = Math.floor(Math.random() * 1000) + 200;
        setLeadData(prev => ({ ...prev, leadId: `LD00${randomId}` }));
      };
      generateLeadId();
    }
  }, [isViewMode, routeLeadData]);

  // Stable handleInputChange function
  const handleInputChange = useCallback((field, value) => {
    setLeadData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  // Validation function
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

  const handleSaveNext = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const nextLeadData = { 
        ...leadData, 
        id: Math.floor(Math.random() * 1000) + 1,
        status: 'Created'
      };
      
      // Navigate to AssignLead screen with lead data
      navigation.navigate('AssignLead', { leadData: nextLeadData });
    }, 500);
  }, [leadData, validateForm, navigation]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Cancel', onPress: () => navigation.navigate('LMS'), style: 'destructive' }
      ]
    );
  }, [navigation]);

  // Progress Indicator Component - exactly same as before
  const ProgressIndicator = useMemo(() => (
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#9c27b0', '#64b5f6']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="person-add" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.activeStepText]}>New Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#9c27b0', '#64b5f6']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="assignment-ind" size={moderateScale(18)} color="#fff" />
          </LinearGradient>
          <Text style={styles.stepText}>Assign Lead</Text>
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
  ), []);

  // Bottom bar navigation
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
        
        <Header title="Create New Lead" />
        
        {ProgressIndicator}
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {/* Lead ID Section - exactly same as before */}
            <View style={styles.leadIdCard}>
              <View style={styles.leadIdHeader}>
                <View style={styles.leadIdIconWrapper}>
                  <Icon name="fingerprint" size={moderateScale(20)} color="#9c27b0" />
                </View>
                <Text style={styles.leadIdLabel}>Lead ID (Auto-generated)</Text>
              </View>
              <View style={styles.leadIdDisplay}>
                <Text style={styles.leadIdText}>{leadData.leadId}</Text>
                <View style={styles.autoChip}>
                  <Text style={styles.autoChipText}>AUTO</Text>
                </View>
              </View>
            </View>

            {/* Form Section - exactly same as before */}
            <View style={styles.formSection}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Lead Information</Text>
                <Text style={styles.formSubtitle}>Please fill in all required details</Text>
              </View>

              <View style={styles.fieldsContainer}>
                <InputField
                  field="leadName"
                  label="Lead Name"
                  placeholder="Enter client name"
                  value={leadData.leadName}
                  onChangeText={handleInputChange}
                  required
                  icon="person"
                  isViewMode={isViewMode}
                />

                <InputField
                  field="email"
                  label="Email"
                  placeholder="Enter email"
                  value={leadData.email}
                  onChangeText={handleInputChange}
                  required
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="email"
                  isViewMode={isViewMode}
                />

                <InputField
                  field="mobile"
                  label="Mobile"
                  placeholder="Enter mobile number"
                  value={leadData.mobile}
                  onChangeText={handleInputChange}
                  required
                  keyboardType="phone-pad"
                  icon="phone"
                  isViewMode={isViewMode}
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Lead Source</Text>
                  <TouchableOpacity 
                    style={styles.selectInput} 
                    onPress={() => setShowLeadSourceList(!showLeadSourceList)}
                  >
                    <Text style={[styles.selectText, !leadData.leadSource && styles.placeholder]}>
                      {leadData.leadSource || 'Select lead source'}
                    </Text>
                    <Icon name="keyboard-arrow-down" size={moderateScale(24)} color="#9c27b0" />
                  </TouchableOpacity>
                  
                  {showLeadSourceList && (
                    <View style={styles.dropdownList}>
                      {leadSourceOptions.map(source => (
                        <TouchableOpacity 
                          key={source} 
                          style={styles.dropdownItem}
                          onPress={() => { 
                            handleInputChange('leadSource', source); 
                            setShowLeadSourceList(false); 
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{source}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <InputField
                  field="leadDetails"
                  label="Lead Details"
                  placeholder="Enter lead details"
                  value={leadData.leadDetails}
                  onChangeText={handleInputChange}
                  required
                  multiline
                  icon="description"
                  isViewMode={isViewMode}
                />
              </View>

              {/* Action Buttons - exactly same as before */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancel}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.saveButton, isLoading && styles.disabledButton]} 
                  onPress={handleSaveNext}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <LinearGradient
  colors={isLoading ? ['#ccc', '#999'] : ['#9c27b0', '#64b5f6']}
  start={{ x: 0, y: 0.5 }}   // left
  end={{ x: 1, y: 0.5 }}     // right
  style={styles.saveGradient}
>
  {isLoading ? (
    <Text style={styles.saveButtonText}>Loading...</Text>
  ) : (
    <Text style={styles.saveButtonText}>Save & Next</Text>
  )}
</LinearGradient>

                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

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
  inactiveLine: {
    backgroundColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(20),
  },
  formContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
  },
  leadIdCard: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(20),
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
  fieldsContainer: {
    gap: scale(20),
  },
  inputContainer: {
    marginBottom: scale(4),
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
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingVertical: scale(8),
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    minHeight: scale(80),
  },
  textInput: {
    fontSize: moderateScale(16),
    color: '#333',
    padding: 0,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: scale(60),
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
    elevation: 3,
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: scale(32),
    gap: scale(12),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: scale(8),
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
    borderRadius: scale(8),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveGradient: {
    paddingVertical: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(8),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});

export default NewLeadScreen;