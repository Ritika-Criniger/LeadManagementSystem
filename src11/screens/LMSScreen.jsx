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

// Dummy Data
const dummyStats = {
  totalLeads: 125,
  hotLeads: 28,
  pendingMeetings: 15,
  completedLeads: 82
};

const dummySources = {
  website: 45,
  socialMedia: 30,
  emailForms: 15,
  referrals: 10
};

const dummyLeads = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    status: 'InProgress',
    assignedTo: 'Amit Sharma',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210'
  },
  {
    id: 2,
    name: 'Priya Singh',
    status: 'Completed',
    assignedTo: 'Neha Gupta',
    email: 'priya.singh@email.com',
    phone: '+91 9876543211'
  },
  {
    id: 3,
    name: 'Rohit Patel',
    status: 'Assigned',
    assignedTo: 'Vikash Yadav',
    email: 'rohit.patel@email.com',
    phone: '+91 9876543212'
  },
  {
    id: 4,
    name: 'Sunita Devi',
    status: 'Pending',
    assignedTo: 'Ravi Kumar',
    email: 'sunita.devi@email.com',
    phone: '+91 9876543213'
  },
  {
    id: 5,
    name: 'Arjun Verma',
    status: 'InProgress',
    assignedTo: 'Pooja Sharma',
    email: 'arjun.verma@email.com',
    phone: '+91 9876543214'
  },
  {
    id: 6,
    name: 'Kavya Reddy',
    status: 'Completed',
    assignedTo: 'Sanjay Singh',
    email: 'kavya.reddy@email.com',
    phone: '+91 9876543215'
  },
  {
    id: 7,
    name: 'Manoj Tiwari',
    status: 'Assigned',
    assignedTo: 'Deepika Rao',
    email: 'manoj.tiwari@email.com',
    phone: '+91 9876543216'
  },
  {
    id: 8,
    name: 'Shreya Jain',
    status: 'Pending',
    assignedTo: 'Rahul Mishra',
    email: 'shreya.jain@email.com',
    phone: '+91 9876543217'
  },
  {
    id: 9,
    name: 'Deepak Agarwal',
    status: 'InProgress',
    assignedTo: 'Anita Kumari',
    email: 'deepak.agarwal@email.com',
    phone: '+91 9876543218'
  },
  {
    id: 10,
    name: 'Meera Nair',
    status: 'Completed',
    assignedTo: 'Suresh Babu',
    email: 'meera.nair@email.com',
    phone: '+91 9876543219'
  }
];

const LMSScreen = ({ navigation }) => {
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(5);

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
    // Load dummy data instead of API calls
    const loadDummyData = () => {
      setStats(dummyStats);
      setSources(dummySources);
      setLeadData(dummyLeads);
      setCurrentPage(1); // Reset to first page when data loads
    };
    
    loadDummyData();
  }, []);

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

  // Pagination logic
  const totalPages = Math.ceil(leadData.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leadData.slice(indexOfFirstLead, indexOfLastLead);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
              {currentLeads.map((lead, index) => (
                <LeadItem key={lead.id} lead={lead} index={index} />
              ))}
            </View>

            <View style={styles.paginationContainer}>
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]} 
                activeOpacity={0.7}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <Icon name="chevron-left" size={moderateScale(18)} color={currentPage === 1 ? "#ccc" : "#9c27b0"} />
              </TouchableOpacity>
              
              <View style={styles.pageInfo}>
                <View style={styles.currentPage}>
                  <Text style={styles.currentPageText}>{currentPage}</Text>
                </View>
                <Text style={styles.totalPagesText}></Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]} 
                activeOpacity={0.7}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Icon name="chevron-right" size={moderateScale(18)} color={currentPage === totalPages ? "#ccc" : "#9c27b0"} />
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
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
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
  totalPagesText: {
    color: '#7f8c8d',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
});

export default LMSScreen;