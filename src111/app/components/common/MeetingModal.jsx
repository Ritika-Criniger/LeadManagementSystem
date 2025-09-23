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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  });

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
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const d = new Date(time);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
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

    onSave(formData);
    onClose();
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
    });
    setShowMoreOptions(false);
    onClose();
  };

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
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Meeting' : 'Add New Meeting'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Required Fields */}
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Client Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.clientName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, clientName: text }))}
                  placeholder="Enter client name"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
                  <Icon name="event" size={20} color="#9c27b0" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.mobileNumber}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, mobileNumber: text }))}
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Meeting *</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={styles.timeText}>
                    {formData.startTime ? formatTime(formData.startTime) : 'Select Start Meeting Time'}
                  </Text>
                  <Icon name="access-time" size={20} color="#9c27b0" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Meeting *</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={styles.timeText}>
                    {formData.endTime ? formatTime(formData.endTime) : 'Select End Meeting Time'}
                  </Text>
                  <Icon name="access-time" size={20} color="#9c27b0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* More Options Button */}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => setShowMoreOptions(!showMoreOptions)}
              activeOpacity={0.7}
            >
              <Text style={styles.moreButtonText}>
                {showMoreOptions ? 'Less Options' : 'More Options'}
              </Text>
              <Icon 
                name={showMoreOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={20} 
                color="#9c27b0" 
              />
            </TouchableOpacity>

            {/* Additional Fields - Only show when more options is expanded */}
            {showMoreOptions && (
              <>
                <View style={styles.formRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Meeting Type</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.meetingType}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, meetingType: text }))}
                      placeholder="Enter meeting type"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>PAN Number</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.panNumber}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, panNumber: text }))}
                      placeholder="Enter PAN number"
                      autoCapitalize="characters"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Meeting Agenda</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.meetingAgenda}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, meetingAgenda: text }))}
                      placeholder="Enter meeting agenda"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Remark</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.remark}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, remark: text }))}
                    placeholder="Enter any remarks"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location</Text>
                  <View style={styles.formRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.subLabel}>From:</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.fromLocation}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, fromLocation: text }))}
                        placeholder="Enter from location"
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                      <Text style={styles.subLabel}>To:</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.toLocation}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, toLocation: text }))}
                        placeholder="Enter to location"
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
              <LinearGradient
                colors={['#9c27b0', '#64b5f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isEdit ? 'Update' : 'Submit'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setFormData(prev => ({ ...prev, date: selectedDate }));
                }
              }}
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              value={formData.startTime ? new Date(formData.startTime) : new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setFormData(prev => ({ ...prev, startTime: selectedTime }));
                }
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={formData.endTime ? new Date(formData.endTime) : new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
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
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 400,
    padding: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  dateText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  timeText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  submitButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9c27b0',
    marginRight: 8,
  },
});

export default MeetingModal;
