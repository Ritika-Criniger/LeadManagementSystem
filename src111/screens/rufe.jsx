import React, { useContext, useEffect, useState } from 'react';
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
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { getLastLeadId, createLead } from '../utils/api';
import { UserContext } from '../context/UserContext.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width > 768;

const NewLeadScreen = ({ navigation }) => {
  const [leadData, setLeadData] = useState({
    leadId: 'LD00000',
    leadName: '',
    email: '',
    mobile: '',
    leadSource: '',
    leadDetails: '',
  });
  const { UserId } = useContext(UserContext);

  const handleInputChange = (field, value) => {
    setLeadData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = () => {
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
  };

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const lastId = await getLastLeadId();
        setLeadData(prev => ({ ...prev, leadId: `LD00${String(lastId + 1).padStart(3, '0')}` }));
      } catch (e) {
        // fallback keeps default id
      }
    };
    fetchLastId();
  }, []);

  const handleSaveNext = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        id: 0,
        clientName: leadData.leadName,
        mobileNumber: leadData.mobile,
        email: leadData.email,
        leadSource: leadData.leadSource || 'Not Selected',
        leadRemark: leadData.leadDetails,
        leadStatus: 1,
        createdBy: UserId || 0,
        leadCost: 0.0
      };
      const created = await createLead(payload);
      const nextLeadData = { ...leadData, id: created?.id };
      Alert.alert('Success', 'Lead created successfully!', [
        { text: 'Continue', onPress: () => navigation.navigate('AssignLead', { leadData: nextLeadData }) }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to create lead');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Cancel', onPress: () => navigation.goBack(), style: 'destructive' }
      ]
    );
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#9c27b0', '#e91e63']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="person-add" size={isTablet ? 22 : 18} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.activeStepText]}>New Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.inactiveStep]}>
            <Icon name="assignment-ind" size={isTablet ? 22 : 18} color="#999" />
          </View>
          <Text style={styles.stepText}>Assign Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.inactiveStep]}>
            <Icon name="check-circle" size={isTablet ? 22 : 18} color="#999" />
          </View>
          <Text style={styles.stepText}>Status</Text>
        </View>
      </View>
    </View>
  );

  const InputField = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    required = false, 
    multiline = false,
    keyboardType = 'default',
    autoCapitalize = 'words',
    icon
  }) => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <View style={styles.labelRow}>
            {icon && (
              <Icon name={icon} size={isTablet ? 16 : 14} color="#9c27b0" style={styles.labelIcon} />
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
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            returnKeyType={multiline ? 'default' : 'next'}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      
      {/* Header */}
      <Header title="Create New Lead" />
      
      {/* Progress Indicator */}
      <ProgressIndicator />
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Lead ID Section */}
          <View style={styles.leadIdCard}>
            <View style={styles.leadIdHeader}>
              <View style={styles.leadIdIconWrapper}>
                <Icon name="fingerprint" size={isTablet ? 24 : 20} color="#9c27b0" />
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
                label="Client Name"
                placeholder="Enter full client name"
                value={leadData.leadName}
                onChangeText={(value) => handleInputChange('leadName', value)}
                required
                icon="person"
                autoCapitalize="words"
              />

              <InputField
                label="Email Address"
                placeholder="example@email.com"
                value={leadData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                required
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
              />

              <InputField
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={leadData.mobile}
                onChangeText={(value) => handleInputChange('mobile', value)}
                required
                keyboardType="phone-pad"
                autoCapitalize="none"
                icon="phone"
              />

              <InputField
                label="Lead Source"
                placeholder="Website, Social Media, Referral, etc."
                value={leadData.leadSource}
                onChangeText={(value) => handleInputChange('leadSource', value)}
                icon="source"
                autoCapitalize="words"
              />

              <InputField
                label="Lead Details"
                placeholder="Describe requirements, budget, timeline, or additional information..."
                value={leadData.leadDetails}
                onChangeText={(value) => handleInputChange('leadDetails', value)}
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
                  <Icon name="save" size={isTablet ? 18 : 16} color="#fff" />
                  <Text style={styles.saveButtonText}>Save & Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
  // Progress Indicator Styles
  progressContainer: {
    backgroundColor: 'transparent',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 32 : 20,
  },
  progressWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: isTablet ? 500 : 300,
    alignSelf: 'center',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
    borderRadius: isTablet ? 22 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 8 : 6,
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
    fontSize: isTablet ? 12 : 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeStepText: {
    color: '#9c27b0',
    fontWeight: 'bold',
    fontSize: isTablet ? 13 : 11,
  },
  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: isTablet ? 12 : 8,
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
    paddingBottom: isTablet ? 32 : 20,
  },
  formContainer: {
    paddingHorizontal: isTablet ? 32 : 16,
    paddingTop: isTablet ? 24 : 16,
  },
  // Lead ID Card
  leadIdCard: {
    backgroundColor: '#fff',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 18,
    marginBottom: isTablet ? 24 : 20,
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
    marginBottom: isTablet ? 16 : 12,
  },
  leadIdIconWrapper: {
    width: isTablet ? 36 : 32,
    height: isTablet ? 36 : 32,
    borderRadius: isTablet ? 18 : 16,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 12 : 10,
  },
  leadIdLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#333',
  },
  leadIdDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leadIdText: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: 'bold',
    color: '#9c27b0',
  },
  autoChip: {
    backgroundColor: '#9c27b0',
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 6 : 5,
    borderRadius: isTablet ? 14 : 12,
  },
  autoChipText: {
    color: '#fff',
    fontSize: isTablet ? 11 : 10,
    fontWeight: 'bold',
  },
  // Form Section
  formSection: {
    backgroundColor: '#fff',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 28 : 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: isTablet ? 32 : 24,
  },
  formTitle: {
    fontSize: isTablet ? 24 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isTablet ? 8 : 6,
  },
  formSubtitle: {
    fontSize: isTablet ? 15 : 14,
    color: '#666',
    textAlign: 'center',
  },
  // Input Fields - Simple and clean
  fieldsContainer: {
    gap: isTablet ? 20 : 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  labelContainer: {
    marginBottom: isTablet ? 10 : 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: isTablet ? 8 : 6,
  },
  inputLabel: {
    fontSize: isTablet ? 15 : 14,
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
    borderRadius: isTablet ? 8 : 6,
    backgroundColor: '#fff',
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 12 : 10,
  },
  textAreaWrapper: {
    paddingVertical: isTablet ? 12 : 10,
    minHeight: isTablet ? 100 : 80,
  },
  textInput: {
    fontSize: isTablet ? 15 : 14,
    color: '#333',
    padding: 0,
    textAlignVertical: 'center',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: isTablet ? 76 : 60,
  },
  // Action Buttons
  buttonContainer: {
    flexDirection: 'row',
    marginTop: isTablet ? 40 : 32,
    gap: isTablet ? 16 : 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: isTablet ? 8 : 6,
    paddingVertical: isTablet ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    borderRadius: isTablet ? 8 : 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveGradient: {
    paddingVertical: isTablet ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: isTablet ? 8 : 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: isTablet ? 15 : 14,
    fontWeight: 'bold',
  },
});

export default NewLeadScreen;


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
          active="Analytics"
          onNavigate={(key) => {
            if (key === 'Meeting Suggestion')navigation.navigate('Meeting Suggestion');
            if (key === 'Dashboard')navigation.navigate('Dashboard');
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

import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { UserContext } from '../context/UserContext.jsx';
import { getUsersByArn, saveLeadTracker } from '../utils/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AssignLeadScreen = ({ navigation, route }) => {
  const { leadData } = route.params || {};
  const { Arn, UserToken } = useContext(UserContext);
  
  const [assignData, setAssignData] = useState({
    assignToRM: '',
    assignDate: null,
    priority: '',
    remark: '',
  });
  const [showAssignPicker, setShowAssignPicker] = useState(false);
  const [rmOptions, setRmOptions] = useState([]);
  const [showRmList, setShowRmList] = useState(false);
  const [showPriorityList, setShowPriorityList] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleInputChange = (field, value) => {
    setAssignData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!assignData.assignToRM) {
      Alert.alert('Error', 'Please select RM');
      return false;
    }
    if (!assignData.assignDate) {
      Alert.alert('Error', 'Please select assign date');
      return false;
    }
    if (!assignData.remark.trim()) {
      Alert.alert('Error', 'Please enter remark');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        id: 0,
        leadId: leadData?.id || 0,
        assignedTo: assignData.assignToRM,
        assignedDate: new Date(assignData.assignDate).toISOString(),
        assignedBy: 0,
        remark: assignData.remark,
        priority: assignData.priority || ''
      };
      const existingTracker = leadData?.latestLeadTracker;
      const status = await saveLeadTracker({ leadId: payload.leadId, payload, existingTracker });
      if (status === 201 || status === 204) {
        navigation.navigate('Status', { leadData: { ...leadData, latestLeadTracker: { ...existingTracker, ...payload } } });
      } else {
        Alert.alert('Error', 'Failed to save assignment');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to save assignment');
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.navigate('Dashboard');
  };

  useEffect(() => {
    const loadRms = async () => {
      try {
        const list = await getUsersByArn({ Arn, token: UserToken });
        setRmOptions(list || []);
      } catch (e) {
        setRmOptions([]);
      }
    };
    loadRms();
  }, [Arn, UserToken]);

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
        <View style={[styles.stepCircle, styles.activeStep]}>
          <Icon name="assignment-ind" size={20} color="#fff" />
        </View>
        <Text style={[styles.stepText, styles.activeStepText]}>Assign Lead</Text>
      </View>
      
      <View style={styles.progressLine} />
      
      <View style={styles.progressStep}>
        <View style={styles.stepCircle}>
          <Icon name="check-circle" size={20} color="#ccc" />
        </View>
        <Text style={styles.stepText}>Status</Text>
      </View>
    </View>
  );

  const InputField = ({ label, placeholder, value, onChangeText, required = false, isDateField = false }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {required && <Text style={styles.required}>* </Text>}
        {label}
      </Text>
      {isDateField ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.inputWrapper, styles.dateInput]}
          onPress={() => setShowAssignPicker(true)}
        >
          <Text style={[styles.dateText, !value && styles.placeholder]}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <Icon name="event" size={20} color="#9c27b0" />
        </TouchableOpacity>
      ) : (
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#999"
          />
        </View>
      )}
    </View>
  );

  const SelectField = ({ label, placeholder, value, onChangeText }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.selectInput}>
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Icon name="keyboard-arrow-down" size={24} color="#9c27b0" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Assign Lead" />

      {/* Progress Indicator */}
      <ProgressIndicator />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Assign to RM</Text>

          {/* Form Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Assign to RM</Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowRmList(!showRmList)}>
              <Text style={[styles.selectText, !assignData.assignToRM && styles.placeholder]}>
                {rmOptions.find(x => x.id === assignData.assignToRM)?.username || 'Select RM'}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#9c27b0" />
            </TouchableOpacity>
            {showRmList && (
              <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 8 }}>
                {rmOptions.map(item => (
                  <TouchableOpacity key={item.id} style={{ padding: 12 }} onPress={() => { handleInputChange('assignToRM', item.id); setShowRmList(false); }}>
                    <Text>{item.username}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <InputField
            label="Assign Date"
            placeholder="dd-mm-yyyy"
            value={assignData.assignDate}
            onChangeText={(value) => handleInputChange('assignDate', value)}
            required
            isDateField
          />

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Priority</Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowPriorityList(!showPriorityList)}>
              <Text style={[styles.selectText, !assignData.priority && styles.placeholder]}>
                {assignData.priority || 'Select Priority'}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#9c27b0" />
            </TouchableOpacity>
            {showPriorityList && (
              <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 8 }}>
                {['Hot','Warm','Cold'].map(p => (
                  <TouchableOpacity key={p} style={{ padding: 12 }} onPress={() => { handleInputChange('priority', p); setShowPriorityList(false); }}>
                    <Text>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              <Text style={styles.required}>* </Text>
              Remark
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter your remark"
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

            <TouchableOpacity style={styles.actionButton} onPress={handleCancel}>
              <LinearGradient
                colors={['#757575', '#9e9e9e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
        if (key === 'LMS') navigation.navigate('LMS');
      }} />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#f44336',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
  },
  textInput: {
    flex: 1,
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
  calendarIcon: {
    padding: 8,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionButton: {
    flex: 0.3,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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

export default AssignLeadScreen;

import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';

const DashboardScreen = ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <View style={styles.content}>
          <Text style={styles.heading}>Dashboard</Text>
        </View>
        <BottomBar 
          active="Dashboard" 
          onNavigate={(key) => {
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

export default DashboardScreen;

import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { UserContext } from '../context/UserContext.jsx';
import { getLeadStats, getLeadSourcesProgress, getLeadsWithTracker } from '../utils/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

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

const LMSScreen = ({ navigation }) => {
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const { UserId, userRole, Arn } = useContext(UserContext);
  const [leadData, setLeadData] = useState([]);
  const [stats, setStats] = useState({ totalLeads: 0, hotLeads: 0, pendingMeetings: 0, completedLeads: 0 });
  const [sources, setSources] = useState({ website: 0, socialMedia: 0, emailForms: 0, referrals: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (!UserId || !userRole || !Arn) return;
        const [s, src, leads] = await Promise.all([
          getLeadStats({ UserId, userRole, Arn }),
          getLeadSourcesProgress({ UserId, userRole, Arn }),
          getLeadsWithTracker({ UserId, userRole, Arn })
        ]);
        setStats(s);
        setSources(src);
        const mapped = (leads || []).map((l, idx) => ({
          id: l?.lead?.id ?? idx,
          name: l?.lead?.clientName ?? 'N/A',
          status: l?.lead?.leadStatus ?? 'N/A',
          assignedTo: l?.assignedToName ?? 'Not Assigned',
          email: l?.lead?.email ?? '',
          phone: l?.lead?.mobileNumber ?? ''
        }));
        setLeadData(mapped);
      } catch (e) {
        console.log('Failed to load dashboard data', e);
        setLeadData([]);
      }
    };
    fetchAll();
  }, [UserId, userRole, Arn]);

  // Responsive stats card component
  const StatsCard = ({ title, value, icon, color, gradient }) => (
    <View style={styles.statsCard}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCardGradient}
      >
        <View style={styles.statsHeader}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Icon name={icon} size={moderateScale(24)} color="#fff" />
          </View>
        </View>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </LinearGradient>
    </View>
  );

  const ProgressBar = ({ label, percentage, color }) => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={percentage > 0 ? color : ['#e0e0e0', '#e0e0e0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${percentage}%` }]}
          />
        </View>
      </View>
      <Text style={styles.progressPercent}>{percentage}%</Text>
    </View>
  );

  const LeadItem = ({ lead, index }) => (
    <View style={[styles.leadItem, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      <View style={styles.leadCard}>
        <View style={styles.leadHeader}>
          <View style={styles.leadNameContainer}>
            <Text style={styles.leadName} numberOfLines={1}>{lead.name}</Text>
            <Text style={styles.leadEmail} numberOfLines={1}>{lead.email}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, getStatusStyle(lead.status)]}>
              <Text style={[styles.statusText, { color: getStatusTextColor(lead.status) }]}>
                {lead.status}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.leadFooter}>
          <View style={styles.assignedInfo}>
            <Text style={styles.phoneText} numberOfLines={1}>{lead.phone}</Text>
            <Text style={styles.assignedLabel} numberOfLines={1}>Assigned to: {lead.assignedTo}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
              <Icon name="add" size={moderateScale(18)} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewButton} activeOpacity={0.7}>
              <Icon name="visibility" size={moderateScale(18)} color="#9c27b0" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'InProgress':
        return { backgroundColor: '#fff3e0' };
      case 'Completed':
        return { backgroundColor: '#e8f5e8' };
      case 'Assigned':
        return { backgroundColor: '#e3f2fd' };
      case 'Pending':
        return { backgroundColor: '#fce4ec' };
      default:
        return { backgroundColor: '#f5f5f5' };
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'InProgress':
        return '#ff9800';
      case 'Completed':
        return '#4caf50';
      case 'Assigned':
        return '#2196f3';
      case 'Pending':
        return '#e91e63';
      default:
        return '#666';
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <SafeAreaView style={styles.container}>
        <Header title="Lead Management System" />

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enhanced Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Lead Management System</Text>
            <Text style={styles.subtitle}>Track and manage your leads efficiently</Text>
          </View>

          {/* Enhanced Stats Cards - 2x2 Grid */}
          <View style={styles.statsGridContainer}>
            <View style={styles.statsRow}>
              <StatsCard
                title="Total Leads"
                value={String(stats.totalLeads || 0)}
                icon="people"
                gradient={['#9c27b0', '#64b5f6']}
              />
              <StatsCard
                title="Hot Leads"
                value={String(stats.hotLeads || 0)}
                icon="local-fire-department"
                gradient={['#f44336', '#ff9800']}
              />
            </View>
            <View style={styles.statsRow}>
              <StatsCard
                title="Pending"
                value={String(stats.pendingMeetings || 0)}
                icon="hourglass-bottom"
                gradient={['#ff9800', '#ffc107']}
              />
              <StatsCard
                title="Completed"
                value={String(stats.completedLeads || 0)}
                icon="check-circle"
                gradient={['#4caf50', '#8bc34a']}
              />
            </View>
          </View>

          {/* Enhanced Lead Sources */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="bar-chart" size={moderateScale(20)} color="#9c27b0" />
              <Text style={styles.sectionTitle}>Lead Sources</Text>
            </View>
            <View style={styles.sourcesContainer}>
              <ProgressBar label="Website" percentage={Number(sources.website || 0)} color={['#9c27b0', '#64b5f6']} />
              <ProgressBar
                label="Social Media"
                percentage={Number(sources.socialMedia || 0)}
                color={['#e91e63', '#f48fb1']}
              />
              <ProgressBar
                label="Email Forms"
                percentage={Number(sources.emailForms || 0)}
                color={['#ff9800', '#ffb74d']}
              />
              <ProgressBar
                label="Referrals"
                percentage={Number(sources.referrals || 0)}
                color={['#4caf50', '#81c784']}
              />
            </View>
          </View>

          {/* Enhanced New Lead Button */}
          <TouchableOpacity 
            style={styles.newLeadButton}
            onPress={() => navigation.navigate('NewLead')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9c27b0', '#64b5f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Icon name="add" size={moderateScale(20)} color="#fff" />
              <Text style={styles.newLeadButtonText}>Create New Lead</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Enhanced Search Section */}
          <View style={styles.searchCard}>
            <View style={styles.searchHeader}>
              <Icon name="search" size={moderateScale(20)} color="#9c27b0" />
              <Text style={styles.searchTitle}>Filter Leads</Text>
            </View>
            
            <View style={styles.searchContent}>
              <View style={styles.searchRow}>
                <View style={styles.inputContainer}>
                  <Icon name="person" size={moderateScale(18)} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Enter Name"
                    value={searchName}
                    onChangeText={setSearchName}
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Icon name="flag" size={moderateScale(18)} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Select Status"
                    value={searchStatus}
                    onChangeText={setSearchStatus}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              
              <View style={styles.searchRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.dateInputContainer}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Icon name="event" size={moderateScale(18)} color="#666" style={styles.inputIcon} />
                  <Text style={[styles.dateText, !startDate && styles.placeholderText]}>
                    {startDate ? formatDate(startDate) : 'Start Date'}
                  </Text>
                  <Icon name="arrow-drop-down" size={moderateScale(18)} color="#9c27b0" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.dateInputContainer}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Icon name="event" size={moderateScale(18)} color="#666" style={styles.inputIcon} />
                  <Text style={[styles.dateText, !endDate && styles.placeholderText]}>
                    {endDate ? formatDate(endDate) : 'End Date'}
                  </Text>
                  <Icon name="arrow-drop-down" size={moderateScale(18)} color="#9c27b0" />
                </TouchableOpacity>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate ? new Date(startDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(Platform.OS === 'ios');
                    if (selectedDate) setStartDate(selectedDate);
                  }}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={endDate ? new Date(endDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(Platform.OS === 'ios');
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              )}
              
              <View style={styles.searchButtonContainer}>
                <TouchableOpacity 
                  style={styles.clearButton} 
                  activeOpacity={0.7}
                  onPress={() => {
                    setSearchName('');
                    setSearchStatus('');
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.searchButton} 
                  activeOpacity={0.8}
                  onPress={() => console.log('Search pressed')}
                >
                  <LinearGradient
                    colors={['#9c27b0', '#64b5f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.searchGradientButton}
                  >
                    <Icon name="search" size={moderateScale(18)} color="#fff" />
                    <Text style={styles.searchButtonText}>Search</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Enhanced Leads Section */}
          <View style={styles.leadsSection}>
            <View style={styles.leadsHeader}>
              <Text style={styles.leadsSectionTitle}>Recent Leads</Text>
              <View style={styles.leadCount}>
                <Text style={styles.leadCountText}>{leadData.length}</Text>
              </View>
            </View>

            <View style={styles.leadsContainer}>
              {leadData.map((lead, index) => (
                <LeadItem key={lead.id} lead={lead} index={index} />
              ))}
            </View>

            <View style={styles.paginationContainer}>
              <TouchableOpacity style={styles.paginationButton} activeOpacity={0.7}>
                <Icon name="chevron-left" size={moderateScale(18)} color="#9c27b0" />
              </TouchableOpacity>
              <View style={styles.currentPage}>
                <Text style={styles.currentPageText}>1</Text>
              </View>
              <TouchableOpacity style={styles.paginationButton} activeOpacity={0.7}>
                <Icon name="chevron-right" size={moderateScale(18)} color="#9c27b0" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomBar active="LMS" onNavigate={(key) => {
          if (key === 'Dashboard') navigation.navigate('Dashboard');
          if (key === 'Business Analytics') navigation.navigate('Business Analytics');
          if (key === 'Meeting Suggestion') navigation.navigate('Meeting Suggestion');
          if (key === 'QMS') navigation.navigate('QMS');
        }} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(20),
  },
  titleContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: '#7f8c8d',
    marginTop: scale(4),
    textAlign: 'center',
  },
  // 2x2 Stats Grid Styles
  statsGridContainer: {
    paddingHorizontal: scale(16),
    marginBottom: scale(16),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  statsCard: {
    flex: 1,
    marginHorizontal: scale(6),
    borderRadius: scale(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  statsCardGradient: {
    paddingVertical: scale(16),
    paddingHorizontal: scale(12),
    alignItems: 'center',
    minHeight: scale(100),
    justifyContent: 'space-between',
  },
  statsHeader: {
    marginBottom: scale(8),
  },
  iconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statsTitle: {
    fontSize: moderateScale(12),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    borderRadius: scale(12),
    padding: scale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: scale(8),
    flex: 1,
  },
  // Enhanced leads section header
  leadsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leadsSectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  leadCount: {
    backgroundColor: '#9c27b0',
    borderRadius: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    minWidth: scale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadCountText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sourcesContainer: {
    gap: scale(12),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  progressLabel: {
    width: isTablet ? scale(80) : scale(70),
    fontSize: moderateScale(12),
    color: '#2c3e50',
    fontWeight: '500',
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBg: {
    height: scale(6),
    backgroundColor: '#ecf0f1',
    borderRadius: scale(3),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: scale(3),
  },
  progressPercent: {
    width: scale(40),
    textAlign: 'right',
    fontSize: moderateScale(12),
    color: '#7f8c8d',
    fontWeight: '600',
  },
  newLeadButton: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    borderRadius: scale(12),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  gradientButton: {
    paddingVertical: scale(14),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(8),
  },
  newLeadButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  searchCard: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    borderRadius: scale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: scale(8),
  },
  searchContent: {
    padding: scale(16),
  },
  searchRow: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: scale(12),
    marginBottom: scale(12),
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    backgroundColor: '#f8f9fa',
    minHeight: scale(44),
  },
  inputIcon: {
    paddingHorizontal: scale(12),
  },
  searchInput: {
    flex: 1,
    paddingVertical: scale(12),
    paddingRight: scale(12),
    fontSize: moderateScale(13),
    color: '#2c3e50',
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    backgroundColor: '#f8f9fa',
    paddingVertical: scale(12),
    paddingHorizontal: scale(12),
    minHeight: scale(44),
  },
  dateText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: '#2c3e50',
    marginLeft: scale(8),
  },
  placeholderText: {
    color: '#95a5a6',
  },
  searchButtonContainer: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: scale(8),
  },
  clearButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clearButtonText: {
    color: '#7f8c8d',
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  searchButton: {
    flex: 2,
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  searchGradientButton: {
    paddingVertical: scale(12),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(6),
  },
  searchButtonText: {
    color: '#fff',
    fontSize: moderateScale(13),
    fontWeight: 'bold',
  },
  leadsSection: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    borderRadius: scale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  leadsContainer: {
    paddingBottom: scale(8),
  },
  leadItem: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(4),
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  leadCard: {
    backgroundColor: '#fff',
    borderRadius: scale(10),
    padding: scale(12),
    marginVertical: scale(4),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#9c27b0',
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(10),
  },
  leadNameContainer: {
    flex: 1,
    marginRight: scale(8),
  },
  leadName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: scale(2),
  },
  leadEmail: {
    fontSize: moderateScale(11),
    color: '#7f8c8d',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignedInfo: {
    flex: 1,
    marginRight: scale(8),
  },
  phoneText: {
    fontSize: moderateScale(11),
    color: '#34495e',
    marginBottom: scale(2),
    fontWeight: '500',
  },
  assignedLabel: {
    fontSize: moderateScale(10),
    color: '#7f8c8d',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scale(8),
  },
  addButton: {
    backgroundColor: '#9c27b0',
    borderRadius: scale(16),
    width: scale(32),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  viewButton: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    width: scale(32),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9c27b0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(16),
    gap: scale(12),
  },
  paginationButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  currentPage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#9c27b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPageText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});
export default LMSScreen;

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

import React, { useContext, useEffect, useState } from 'react';
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
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { getLastLeadId, createLead } from '../utils/api';
import { UserContext } from '../context/UserContext.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width > 768;

const NewLeadScreen = ({ navigation }) => {
  const [leadData, setLeadData] = useState({
    leadId: 'LD00000',
    leadName: '',
    email: '',
    mobile: '',
    leadSource: '',
    leadDetails: '',
  });
  const { UserId } = useContext(UserContext);

  const handleInputChange = (field, value) => {
    setLeadData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = () => {
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
  };

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const lastId = await getLastLeadId();
        setLeadData(prev => ({ ...prev, leadId: `LD00${String(lastId + 1).padStart(3, '0')}` }));
      } catch (e) {
        // fallback keeps default id
      }
    };
    fetchLastId();
  }, []);

  const handleSaveNext = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        id: 0,
        clientName: leadData.leadName,
        mobileNumber: leadData.mobile,
        email: leadData.email,
        leadSource: leadData.leadSource || 'Not Selected',
        leadRemark: leadData.leadDetails,
        leadStatus: 1,
        createdBy: UserId || 0,
        leadCost: 0.0
      };
      const created = await createLead(payload);
      const nextLeadData = { ...leadData, id: created?.id };
      Alert.alert('Success', 'Lead created successfully!', [
        { text: 'Continue', onPress: () => navigation.navigate('AssignLead', { leadData: nextLeadData }) }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to create lead');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Cancel', onPress: () => navigation.goBack(), style: 'destructive' }
      ]
    );
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressStep}>
          <LinearGradient
            colors={['#9c27b0', '#e91e63']}
            style={[styles.stepCircle, styles.activeStep]}
          >
            <Icon name="person-add" size={isTablet ? 22 : 18} color="#fff" />
          </LinearGradient>
          <Text style={[styles.stepText, styles.activeStepText]}>New Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.inactiveStep]}>
            <Icon name="assignment-ind" size={isTablet ? 22 : 18} color="#999" />
          </View>
          <Text style={styles.stepText}>Assign Lead</Text>
        </View>
        
        <View style={[styles.progressLine, styles.inactiveLine]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.inactiveStep]}>
            <Icon name="check-circle" size={isTablet ? 22 : 18} color="#999" />
          </View>
          <Text style={styles.stepText}>Status</Text>
        </View>
      </View>
    </View>
  );

  const InputField = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    required = false, 
    multiline = false,
    keyboardType = 'default',
    autoCapitalize = 'words',
    icon
  }) => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <View style={styles.labelRow}>
            {icon && (
              <Icon name={icon} size={isTablet ? 16 : 14} color="#9c27b0" style={styles.labelIcon} />
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
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            returnKeyType={multiline ? 'default' : 'next'}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      
      {/* Header */}
      <Header title="Create New Lead" />
      
      {/* Progress Indicator */}
      <ProgressIndicator />
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Lead ID Section */}
          <View style={styles.leadIdCard}>
            <View style={styles.leadIdHeader}>
              <View style={styles.leadIdIconWrapper}>
                <Icon name="fingerprint" size={isTablet ? 24 : 20} color="#9c27b0" />
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
                label="Client Name"
                placeholder="Enter full client name"
                value={leadData.leadName}
                onChangeText={(value) => handleInputChange('leadName', value)}
                required
                icon="person"
                autoCapitalize="words"
              />

              <InputField
                label="Email Address"
                placeholder="example@email.com"
                value={leadData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                required
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
              />

              <InputField
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={leadData.mobile}
                onChangeText={(value) => handleInputChange('mobile', value)}
                required
                keyboardType="phone-pad"
                autoCapitalize="none"
                icon="phone"
              />

              <InputField
                label="Lead Source"
                placeholder="Website, Social Media, Referral, etc."
                value={leadData.leadSource}
                onChangeText={(value) => handleInputChange('leadSource', value)}
                icon="source"
                autoCapitalize="words"
              />

              <InputField
                label="Lead Details"
                placeholder="Describe requirements, budget, timeline, or additional information..."
                value={leadData.leadDetails}
                onChangeText={(value) => handleInputChange('leadDetails', value)}
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
                  <Icon name="save" size={isTablet ? 18 : 16} color="#fff" />
                  <Text style={styles.saveButtonText}>Save & Next</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
  // Progress Indicator Styles
  progressContainer: {
    backgroundColor: 'transparent',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 32 : 20,
  },
  progressWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: isTablet ? 500 : 300,
    alignSelf: 'center',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
    borderRadius: isTablet ? 22 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 8 : 6,
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
    fontSize: isTablet ? 12 : 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeStepText: {
    color: '#9c27b0',
    fontWeight: 'bold',
    fontSize: isTablet ? 13 : 11,
  },
  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: isTablet ? 12 : 8,
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
    paddingBottom: isTablet ? 32 : 20,
  },
  formContainer: {
    paddingHorizontal: isTablet ? 32 : 16,
    paddingTop: isTablet ? 24 : 16,
  },
  // Lead ID Card
  leadIdCard: {
    backgroundColor: '#fff',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 18,
    marginBottom: isTablet ? 24 : 20,
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
    marginBottom: isTablet ? 16 : 12,
  },
  leadIdIconWrapper: {
    width: isTablet ? 36 : 32,
    height: isTablet ? 36 : 32,
    borderRadius: isTablet ? 18 : 16,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 12 : 10,
  },
  leadIdLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#333',
  },
  leadIdDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leadIdText: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: 'bold',
    color: '#9c27b0',
  },
  autoChip: {
    backgroundColor: '#9c27b0',
    paddingHorizontal: isTablet ? 12 : 10,
    paddingVertical: isTablet ? 6 : 5,
    borderRadius: isTablet ? 14 : 12,
  },
  autoChipText: {
    color: '#fff',
    fontSize: isTablet ? 11 : 10,
    fontWeight: 'bold',
  },
  // Form Section
  formSection: {
    backgroundColor: '#fff',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 28 : 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: isTablet ? 32 : 24,
  },
  formTitle: {
    fontSize: isTablet ? 24 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isTablet ? 8 : 6,
  },
  formSubtitle: {
    fontSize: isTablet ? 15 : 14,
    color: '#666',
    textAlign: 'center',
  },
  // Input Fields - Simple and clean
  fieldsContainer: {
    gap: isTablet ? 20 : 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  labelContainer: {
    marginBottom: isTablet ? 10 : 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: isTablet ? 8 : 6,
  },
  inputLabel: {
    fontSize: isTablet ? 15 : 14,
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
    borderRadius: isTablet ? 8 : 6,
    backgroundColor: '#fff',
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 12 : 10,
  },
  textAreaWrapper: {
    paddingVertical: isTablet ? 12 : 10,
    minHeight: isTablet ? 100 : 80,
  },
  textInput: {
    fontSize: isTablet ? 15 : 14,
    color: '#333',
    padding: 0,
    textAlignVertical: 'center',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: isTablet ? 76 : 60,
  },
  // Action Buttons
  buttonContainer: {
    flexDirection: 'row',
    marginTop: isTablet ? 40 : 32,
    gap: isTablet ? 16 : 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: isTablet ? 8 : 6,
    paddingVertical: isTablet ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    borderRadius: isTablet ? 8 : 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveGradient: {
    paddingVertical: isTablet ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: isTablet ? 8 : 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: isTablet ? 15 : 14,
    fontWeight: 'bold',
  },
});

export default NewLeadScreen;






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


import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';

const SuggestionScreen= ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <View style={styles.content}>
          <Text style={styles.heading}>Meeting</Text>
        </View>
        <BottomBar 
          active="Suggestion"
          onNavigate={(key) => {
            if (key === 'Business Analytics') navigation.navigate('Business Analytics');
            if (key === 'Dashboard')navigation.navigate('Dashboard');
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

export default SuggestionScreen;