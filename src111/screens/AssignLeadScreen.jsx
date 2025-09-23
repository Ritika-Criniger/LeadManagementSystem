import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AssignLeadScreen = ({ navigation }) => {
  // 🔹 Dummy Lead Data
  const leadData = { id: 101, name: "Dummy Lead" };

  const [assignData, setAssignData] = useState({
    assignToRM: '',
    assignDate: null,
    priority: '',
    remark: '',
  });
  const [showAssignPicker, setShowAssignPicker] = useState(false);
  const [showRmList, setShowRmList] = useState(false);
  const [showPriorityList, setShowPriorityList] = useState(false);

  // 🔹 Dummy RM options
  const rmOptions = [
    { id: 1, username: "RM One" },
    { id: 2, username: "RM Two" },
    { id: 3, username: "RM Three" },
  ];

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

  const handleSave = () => {
    if (!validateForm()) return;
    console.log("✅ Dummy Save Data:", assignData);
    Alert.alert("Success", "Lead assigned successfully (dummy)");
    navigation.navigate('Dashboard');
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.navigate('Dashboard');
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Assign Lead" />

      {/* Progress Indicator */}
      <ProgressIndicator />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Assign to RM</Text>

          {/* RM Dropdown */}
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
                  <TouchableOpacity 
                    key={item.id} 
                    style={{ padding: 12 }} 
                    onPress={() => { handleInputChange('assignToRM', item.id); setShowRmList(false); }}
                  >
                    <Text>{item.username}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Assign Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Assign Date</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.inputWrapper, styles.dateInput]}
              onPress={() => setShowAssignPicker(true)}
            >
              <Text style={[styles.dateText, !assignData.assignDate && styles.placeholder]}>
                {assignData.assignDate ? formatDate(assignData.assignDate) : "dd-mm-yyyy"}
              </Text>
              <Icon name="event" size={20} color="#9c27b0" />
            </TouchableOpacity>
          </View>

          {/* Priority Dropdown */}
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
                  <TouchableOpacity 
                    key={p} 
                    style={{ padding: 12 }} 
                    onPress={() => { handleInputChange('priority', p); setShowPriorityList(false); }}
                  >
                    <Text>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Remark */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Remark</Text>
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handlePrevious}>
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleCancel}>
              <LinearGradient
                colors={['#757575', '#9e9e9e']}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Save</Text>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  progressStep: { alignItems: 'center' },
  stepCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedStep: { backgroundColor: '#4caf50' },
  activeStep: { backgroundColor: '#9c27b0' },
  stepText: { fontSize: 12, color: '#666', textAlign: 'center' },
  completedStepText: { color: '#4caf50', fontWeight: 'bold' },
  activeStepText: { color: '#9c27b0', fontWeight: 'bold' },
  progressLine: { width: 60, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 10 },
  activeLine: { backgroundColor: '#4caf50' },
  content: { flex: 1 },
  formContainer: {
    backgroundColor: '#fff', margin: 20, borderRadius: 12, padding: 20, elevation: 2,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#9c27b0',
  },
  textInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  textArea: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, minHeight: 100,
  },
  selectInput: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: '#9c27b0', paddingVertical: 12,
  },
  selectText: { fontSize: 16, color: '#333' },
  placeholder: { color: '#999' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  actionButton: { flex: 0.3, borderRadius: 8, overflow: 'hidden', marginHorizontal: 4 },
  gradientButton: { paddingVertical: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default AssignLeadScreen;
