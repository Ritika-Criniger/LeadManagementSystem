import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

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

// Read-only InputField component
const ViewField = ({ label, value, icon, multiline = false }) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <View style={styles.labelRow}>
          {icon && (
            <Icon name={icon} size={moderateScale(14)} color="#9c27b0" style={styles.labelIcon} />
          )}
          <Text style={styles.inputLabel}>{label}</Text>
        </View>
      </View>
      
      <View style={[
        styles.inputWrapper,
        multiline && styles.textAreaWrapper
      ]}>
        <Text style={[styles.textDisplay, multiline && styles.textAreaDisplay]}>
          {value || 'N/A'}
        </Text>
      </View>
    </View>
  );
};

const ViewLeadScreen = ({ navigation, route }) => {
  const { leadData } = route.params || {};

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

  const handleGoBack = useCallback(() => {
    navigation.navigate('LMS');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#9c27b0" />
      
      <Header title="View Lead Details" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Lead ID Section */}
          <View style={styles.leadIdCard}>
            <View style={styles.leadIdHeader}>
              <View style={styles.leadIdIconWrapper}>
                <Icon name="visibility" size={moderateScale(20)} color="#9c27b0" />
              </View>
              <Text style={styles.leadIdLabel}>Lead Details (Read Only)</Text>
            </View>
            <View style={styles.leadIdDisplay}>
              <Text style={styles.leadIdText}>{leadData?.id ? `LD00${leadData.id}` : 'N/A'}</Text>
              <View style={styles.viewChip}>
                <Text style={styles.viewChipText}>VIEW</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Lead Information</Text>
              <Text style={styles.formSubtitle}>View all lead details</Text>
            </View>

            <View style={styles.fieldsContainer}>
              <ViewField
                label="Lead Name"
                value={leadData?.name}
                icon="person"
              />

              <ViewField
                label="Email"
                value={leadData?.email}
                icon="email"
              />

              <ViewField
                label="Mobile"
                value={leadData?.phone}
                icon="phone"
              />

              <ViewField
                label="Lead Source"
                value="Website" // You can add this to your lead data structure
                icon="web"
              />

              <ViewField
                label="Status"
                value={leadData?.status}
                icon="info"
              />

              <ViewField
                label="Assigned To"
                value={leadData?.assignedTo}
                icon="assignment-ind"
              />

              <ViewField
                label="Lead Details"
                value="This is a sample lead with investment interest in mutual funds and insurance products."
                icon="description"
                multiline
              />
            </View>

            {/* Status Section */}
            <View style={styles.statusSection}>
              <View style={styles.statusHeader}>
                <Icon name="info-outline" size={moderateScale(20)} color="#9c27b0" />
                <Text style={styles.statusTitle}>Current Status</Text>
              </View>
              <View style={[styles.statusBadge, 
                leadData?.status === 'InProgress' && styles.inProgressBadge,
                leadData?.status === 'Completed' && styles.completedBadge,
                leadData?.status === 'Pending' && styles.pendingBadge,
                leadData?.status === 'Assigned' && styles.assignedBadge
              ]}>
                <Text style={styles.statusBadgeText}>{leadData?.status || 'N/A'}</Text>
              </View>
            </View>

            {/* Back Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleGoBack}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9c27b0', '#64b5f6']}
                  style={styles.backGradient}
                >
                  <Icon name="arrow-back" size={moderateScale(16)} color="#fff" />
                  <Text style={styles.backButtonText}>Back to Leads</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomBar active="LMS" onNavigate={handleBottomNavigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  viewChip: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(12),
  },
  viewChipText: {
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
  inputWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingVertical: scale(8),
    backgroundColor: '#f8f9fa',
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    minHeight: scale(80),
    backgroundColor: '#f8f9fa',
  },
  textDisplay: {
    fontSize: moderateScale(16),
    color: '#333',
    padding: 0,
  },
  textAreaDisplay: {
    textAlignVertical: 'top',
    minHeight: scale(60),
  },
  statusSection: {
    marginTop: scale(24),
    paddingTop: scale(20),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  statusTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: scale(8),
  },
  statusBadge: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: '#6c757d',
    alignSelf: 'flex-start',
  },
  inProgressBadge: {
    backgroundColor: '#fd7e14',
  },
  completedBadge: {
    backgroundColor: '#28a745',
  },
  pendingBadge: {
    backgroundColor: '#ffc107',
  },
  assignedBadge: {
    backgroundColor: '#007bff',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: scale(32),
  },
  backButton: {
    borderRadius: scale(8),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backGradient: {
    paddingVertical: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(8),
  },
  backButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
});

export default ViewLeadScreen;