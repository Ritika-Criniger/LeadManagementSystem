import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive calculations
const isTablet = screenWidth > 768;
const isLargePhone = screenWidth > 400;
const isSmallScreen = screenWidth < 350;

const scale = (size) => {
  if (isSmallScreen) return size * 0.9;
  if (isLargePhone) return size * 1.05;
  if (isTablet) return size * 1.2;
  return size;
};

const MeetingModal = ({
  visible,
  onClose,
  onSave,
  leadData,
  isEdit = false,
  meetingData = null,
}) => {
  const [formData, setFormData] = useState({
    clientName: '',
    date: new Date(),
    mobileNumber: '',
    startTime: '',
    endTime: '',
    meetingType: 'New',
    panNumber: '',
    meetingAgenda: 'New Business',
    remark: '',
    fromLocation: '',
    toLocation: '',
    clientAddress: '',
  });

  const [showMeetingTypeDropdown, setShowMeetingTypeDropdown] = useState(false);
  const [showMeetingAgendaDropdown, setShowMeetingAgendaDropdown] = useState(false);

  const meetingTypeOptions = ['New', 'Existing', 'Event', 'Online', 'Phone Call', 'From LMS'];
  const meetingAgendaOptions = ['New Business', 'Portfolio', 'Services', 'Task by BA'];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    if (visible) {
      if (isEdit && meetingData) {
        setFormData({
          clientName: meetingData.clientName || '',
          date: meetingData.date ? new Date(meetingData.date) : new Date(),
          mobileNumber: meetingData.mobileNumber || '',
          startTime: meetingData.startTime || '',
          endTime: meetingData.endTime || '',
          meetingType: meetingData.meetingType || 'New',
          panNumber: meetingData.panNumber || '',
          meetingAgenda: meetingData.meetingAgenda || 'New Business',
          remark: meetingData.remark || '',
          fromLocation: meetingData.fromLocation || '',
          toLocation: meetingData.toLocation || '',
          clientAddress: meetingData.clientAddress || '',
        });
      } else if (leadData) {
        setFormData(prev => ({
          ...prev,
          clientName: leadData.name || '',
          mobileNumber: leadData.phone || '',
        }));
      }
    }
  }, [visible, isEdit, meetingData, leadData]);

  const formatDate = (date) => {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const d = new Date(time);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getMinimumDateTime = () => {
    const now = new Date();
    const selectedDate = new Date(formData.date);
    const today = new Date();
    
    // Reset time parts for date comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    // If selected date is today, return current time + 30 minutes
    if (selectedDate.getTime() === today.getTime()) {
      const minTime = new Date();
      minTime.setMinutes(minTime.getMinutes() + 30);
      return minTime;
    }
    
    // If selected date is future, return start of day
    const futureDateTime = new Date(formData.date);
    futureDateTime.setHours(9, 0, 0, 0); // Default to 9 AM for future dates
    return futureDateTime;
  };

  const handleSave = () => {
    // Validation
    if (!formData.clientName.trim()) {
      Alert.alert('Error', 'Client Name is required');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      Alert.alert('Error', 'Mobile Number is required');
      return;
    }
    if (!formData.startTime) {
      Alert.alert('Error', 'Start Meeting Time is required');
      return;
    }
    if (!formData.endTime) {
      Alert.alert('Error', 'End Meeting Time is required');
      return;
    }

    // Validate time is in future (critical validation)
    const now = new Date();
    const startTime = new Date(formData.startTime);
    const selectedDate = new Date(formData.date);
    const today = new Date();
    
    // Check if meeting is scheduled for today and time has passed
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() === today.getTime() && startTime <= now) {
      Alert.alert('Error', 'Meeting time should be in future. Please select a later time.');
      return;
    }
    
    // Check if meeting date is in past
    if (selectedDate.getTime() < today.getTime()) {
      Alert.alert('Error', 'Meeting date cannot be in the past. Please select today or a future date.');
      return;
    }

    // Validate end time is after start time
    const endTime = new Date(formData.endTime);
    if (endTime <= startTime) {
      Alert.alert('Error', 'End time should be at least 30 minutes after start time');
      return;
    }
    
    // Check minimum meeting duration (15 minutes)
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
    if (duration < 15) {
      Alert.alert('Error', 'Meeting duration should be at least 15 minutes');
      return;
    }

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      clientName: '',
      date: new Date(),
      mobileNumber: '',
      startTime: '',
      endTime: '',
      meetingType: 'New',
      panNumber: '',
      meetingAgenda: 'New Business',
      remark: '',
      fromLocation: '',
      toLocation: '',
      clientAddress: '',
    });
    setShowMoreOptions(false);
    setShowMeetingTypeDropdown(false);
    setShowMeetingAgendaDropdown(false);
    onClose();
  };

  const getModalDimensions = () => {
    const modalWidth = isTablet ? screenWidth * 0.7 : screenWidth * 0.95;
    const maxHeight = screenHeight * 0.9;
    return { modalWidth, maxHeight };
  };

  const { modalWidth, maxHeight } = getModalDimensions();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalContent, { width: modalWidth, maxHeight }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Meeting' : 'Add New Meeting'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={scale(24)} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalBody} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Required Fields */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Text style={styles.required}>*</Text> Client Name
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, formData.clientName ? styles.inputFilled : null]}
                    value={formData.clientName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, clientName: text }))}
                    placeholder="Enter client name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Fixed Row Layout for Date and Mobile */}
              <View style={styles.fixedRow}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    <Text style={styles.required}>*</Text> Date
                  </Text>
                  <TouchableOpacity
                    style={[styles.dateInput, formData.date ? styles.inputFilled : null]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
                    <Icon name="event" size={scale(20)} color="#9c27b0" />
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    <Text style={styles.required}>*</Text> Mobile Number
                  </Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, formData.mobileNumber ? styles.inputFilled : null]}
                      value={formData.mobileNumber}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, mobileNumber: text }))}
                      placeholder="Enter mobile number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>

              {/* Fixed Row Layout for Start and End Time */}
              <View style={styles.fixedRow}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    <Text style={styles.required}>*</Text> Start Meeting
                  </Text>
                  <TouchableOpacity
                    style={[styles.timeInput, formData.startTime ? styles.inputFilled : null]}
                    onPress={() => setShowStartTimePicker(true)}
                  >
                    <Text style={[
                      styles.timeText, 
                      !formData.startTime && styles.placeholderText
                    ]}>
                      {formData.startTime ? formatTime(formData.startTime) : 'Select Start Time'}
                    </Text>
                    <Icon name="access-time" size={scale(20)} color="#9c27b0" />
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    <Text style={styles.required}>*</Text> End Meeting
                  </Text>
                  <TouchableOpacity
                    style={[styles.timeInput, formData.endTime ? styles.inputFilled : null]}
                    onPress={() => setShowEndTimePicker(true)}
                  >
                    <Text style={[
                      styles.timeText, 
                      !formData.endTime && styles.placeholderText
                    ]}>
                      {formData.endTime ? formatTime(formData.endTime) : 'Select End Time'}
                    </Text>
                    <Icon name="access-time" size={scale(20)} color="#9c27b0" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* More Options Toggle - Only show when not expanded */}
            {!showMoreOptions && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setShowMoreOptions(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.moreButtonText}>More Options</Text>
                <Icon 
                  name="keyboard-arrow-down" 
                  size={scale(20)} 
                  color="#9c27b0" 
                />
              </TouchableOpacity>
            )}

            {/* Expanded Options */}
            {showMoreOptions && (
              <View style={styles.expandedSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Meeting Type</Text>
                  <TouchableOpacity
                    style={[styles.dropdownInput, formData.meetingType ? styles.inputFilled : null]}
                    onPress={() => setShowMeetingTypeDropdown(!showMeetingTypeDropdown)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownText, !formData.meetingType && styles.placeholderText]}>
                      {formData.meetingType || 'Select meeting type'}
                    </Text>
                    <Icon 
                      name={showMeetingTypeDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={scale(20)} 
                      color="#9c27b0" 
                    />
                  </TouchableOpacity>
                  
                  {showMeetingTypeDropdown && (
                    <View style={styles.dropdownOptions}>
                      <ScrollView 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        style={styles.dropdownScrollView}
                      >
                        {meetingTypeOptions.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.dropdownOption,
                              formData.meetingType === option && styles.selectedOption,
                              index === meetingTypeOptions.length - 1 && styles.lastOption
                            ]}
                            onPress={() => {
                              setFormData(prev => ({ ...prev, meetingType: option }));
                              setShowMeetingTypeDropdown(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[
                              styles.optionText,
                              formData.meetingType === option && styles.selectedOptionText
                            ]}>
                              {option}
                            </Text>
                            {formData.meetingType === option && (
                              <Icon name="check" size={scale(18)} color="#9c27b0" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PAN Number</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, formData.panNumber ? styles.inputFilled : null]}
                      value={formData.panNumber}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, panNumber: text }))}
                      placeholder="Enter PAN number"
                      placeholderTextColor="#999"
                      autoCapitalize="characters"
                      maxLength={10}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Client Address</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, formData.clientAddress ? styles.inputFilled : null]}
                      value={formData.clientAddress}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, clientAddress: text }))}
                      placeholder="Enter client address"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Meeting Agenda</Text>
                  <TouchableOpacity
                    style={[styles.dropdownInput, formData.meetingAgenda ? styles.inputFilled : null]}
                    onPress={() => setShowMeetingAgendaDropdown(!showMeetingAgendaDropdown)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownText, !formData.meetingAgenda && styles.placeholderText]}>
                      {formData.meetingAgenda || 'Select meeting agenda'}
                    </Text>
                    <Icon 
                      name={showMeetingAgendaDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={scale(20)} 
                      color="#9c27b0" 
                    />
                  </TouchableOpacity>
                  
                  {showMeetingAgendaDropdown && (
                    <View style={styles.dropdownOptions}>
                      <ScrollView 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        style={styles.dropdownScrollView}
                      >
                        {meetingAgendaOptions.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.dropdownOption,
                              formData.meetingAgenda === option && styles.selectedOption,
                              index === meetingAgendaOptions.length - 1 && styles.lastOption
                            ]}
                            onPress={() => {
                              setFormData(prev => ({ ...prev, meetingAgenda: option }));
                              setShowMeetingAgendaDropdown(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[
                              styles.optionText,
                              formData.meetingAgenda === option && styles.selectedOptionText
                            ]}>
                              {option}
                            </Text>
                            {formData.meetingAgenda === option && (
                              <Icon name="check" size={scale(18)} color="#9c27b0" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Remark</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.textArea, formData.remark ? styles.inputFilled : null]}
                      value={formData.remark}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, remark: text }))}
                      placeholder="Enter any remarks"
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location:</Text>
                  <View style={styles.fixedRow}>
                    <View style={[styles.locationGroup, styles.halfWidth]}>
                      <Text style={styles.subLabel}>From:</Text>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={[styles.input, formData.fromLocation ? styles.inputFilled : null]}
                          value={formData.fromLocation}
                          onChangeText={(text) => setFormData(prev => ({ ...prev, fromLocation: text }))}
                          placeholder="Enter from location"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>
                    
                    <View style={[styles.locationGroup, styles.halfWidth]}>
                      <Text style={styles.subLabel}>To:</Text>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={[styles.input, formData.toLocation ? styles.inputFilled : null]}
                          value={formData.toLocation}
                          onChangeText={(text) => setFormData(prev => ({ ...prev, toLocation: text }))}
                          placeholder="Enter to location"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <LinearGradient
                  colors={['#9c27b0', '#64b5f6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              {showMoreOptions && (
                <TouchableOpacity 
                  style={styles.lessOptionsButton}
                  onPress={() => setShowMoreOptions(false)}
                >
                  <Text style={styles.lessOptionsText}>Less Options</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Date Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate && event.type === 'set') {
                  setFormData(prev => ({ ...prev, date: selectedDate }));
                }
              }}
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              value={formData.startTime ? new Date(formData.startTime) : getMinimumDateTime()}
              mode="time"
              display="default"
              minimumDate={getMinimumDateTime()}
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (selectedTime && event.type === 'set') {
                  // Validate selected time is in future for today's date
                  const now = new Date();
                  const selectedDate = new Date(formData.date);
                  const today = new Date();
                  
                  today.setHours(0, 0, 0, 0);
                  selectedDate.setHours(0, 0, 0, 0);
                  
                  if (selectedDate.getTime() === today.getTime() && selectedTime <= now) {
                    Alert.alert('Invalid Time', 'Please select a future time for today\'s meeting');
                    return;
                  }
                  
                  setFormData(prev => ({ ...prev, startTime: selectedTime, endTime: '' }));
                }
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={formData.endTime ? new Date(formData.endTime) : 
                (formData.startTime ? new Date(new Date(formData.startTime).getTime() + 30*60*1000) : getMinimumDateTime())}
              mode="time"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={formData.startTime ? new Date(new Date(formData.startTime).getTime() + 15*60*1000) : getMinimumDateTime()}
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(Platform.OS === 'ios');
                if (selectedTime && event.type === 'set') {
                  // Validate end time is after start time
                  if (formData.startTime && selectedTime <= new Date(formData.startTime)) {
                    Alert.alert('Invalid Time', 'End time should be after start time');
                    return;
                  }
                  
                  setFormData(prev => ({ ...prev, endTime: selectedTime }));
                }
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10),
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: scale(4),
  },
  modalBody: {
    maxHeight: screenHeight * 0.6,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
  },
  formSection: {
    marginBottom: scale(20),
  },
  expandedSection: {
    paddingTop: scale(4),
  },
  fixedRow: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: scale(20),
  },
  inputGroup: {
    marginBottom: scale(18),
  },
  halfWidth: {
    flex: 1,
  },
  locationGroup: {
    flex: 1,
  },
  label: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: scale(8),
  },
  subLabel: {
    fontSize: scale(12),
    fontWeight: '500',
    color: '#7f8c8d',
    marginBottom: scale(6),
  },
  required: {
    color: '#f44336',
    fontSize: scale(16),
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingHorizontal: scale(4),
    paddingVertical: Platform.OS === 'ios' ? scale(14) : scale(10),
    fontSize: scale(14),
    color: '#2c3e50',
    backgroundColor: 'transparent',
  },
  inputFilled: {
    borderBottomColor: '#9c27b0',
  },
  textArea: {
    height: scale(80),
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    backgroundColor: '#f8f9fa',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingHorizontal: scale(4),
    paddingVertical: Platform.OS === 'ios' ? scale(14) : scale(10),
    backgroundColor: 'transparent',
  },
  dateText: {
    fontSize: scale(14),
    color: '#2c3e50',
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingHorizontal: scale(4),
    paddingVertical: Platform.OS === 'ios' ? scale(14) : scale(10),
    backgroundColor: 'transparent',
  },
  timeText: {
    fontSize: scale(14),
    color: '#2c3e50',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    marginVertical: scale(12),
    backgroundColor: '#f8f9fa',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  moreButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#9c27b0',
    marginRight: scale(8),
  },
  modalFooter: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: scale(12),
    alignItems: 'center',
  },
  submitButton: {
    flex: isSmallScreen ? undefined : 2,
    borderRadius: scale(8),
    overflow: 'hidden',
    minWidth: isSmallScreen ? '100%' : undefined,
  },
  submitGradient: {
    paddingVertical: scale(14),
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    flex: isSmallScreen ? undefined : 1,
    paddingVertical: scale(14),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
    minWidth: isSmallScreen ? '100%' : undefined,
  },
  cancelButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#7f8c8d',
  },
  lessOptionsButton: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: scale(80),
  },
  lessOptionsText: {
    fontSize: scale(11),
    color: '#9c27b0',
    fontWeight: '500',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#9c27b0',
    paddingHorizontal: scale(4),
    paddingVertical: Platform.OS === 'ios' ? scale(14) : scale(10),
    backgroundColor: 'transparent',
    minHeight: scale(44),
  },
  dropdownText: {
    fontSize: scale(14),
    color: '#2c3e50',
    flex: 1,
  },
  dropdownOptions: {
    position: 'absolute',
    top: scale(72),
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
    maxHeight: scale(250),
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f8f4ff',
  },
  optionText: {
    fontSize: scale(14),
    color: '#2c3e50',
    flex: 1,
  },
  selectedOptionText: {
    color: '#9c27b0',
    fontWeight: '600',
  },
  dropdownScrollView: {
    maxHeight: scale(240),
  },
  lastOption: {
    borderBottomWidth: 0,
  },
});

export default MeetingModal;