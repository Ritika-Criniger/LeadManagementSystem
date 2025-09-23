import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Header from '../app/components/Header.jsx';
import BottomBar from '../app/components/BottomBar.jsx';
import { UserContext } from '../context/UserContext.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Reusable Components
import StatsCard from '../app/components/common/StatsCard.jsx';
import ProgressBar from '../app/components/common/ProgressBar.jsx';
import SearchFilter from '../app/components/common/SearchFilter.jsx';
import LeadItem from '../app/components/common/LeadItem.jsx';
import Pagination from '../app/components/common/Pagination.jsx';
import MeetingModal from '../app/components/common/MeetingModal.jsx';

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

// Enhanced Dummy Data
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

// Dummy Meetings Data
const dummyMeetings = [
  {
    id: 1,
    leadId: 1,
    clientName: 'Rajesh Kumar',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    meetingType: 'New',
    panNumber: 'ABCDE1234F',
    meetingAgenda: 'New Business',
    remark: 'Initial discussion about investment plans',
    fromLocation: 'Office',
    toLocation: 'Client Office',
    status: 'Scheduled'
  },
  {
    id: 2,
    leadId: 2,
    clientName: 'Priya Singh',
    date: '2024-01-16',
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'Follow-up',
    panNumber: 'FGHIJ5678K',
    meetingAgenda: 'Portfolio Review',
    remark: 'Quarterly review meeting',
    fromLocation: 'Office',
    toLocation: 'Client Office',
    status: 'Completed'
  }
];

const LMSScreen = ({ navigation }) => {
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(5);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditMeeting, setIsEditMeeting] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetings, setMeetings] = useState(dummyMeetings);

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

  // Filter leads based on search criteria
  const filteredLeads = leadData.filter(lead => {
    const matchesName = !searchName || lead.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus = !searchStatus || lead.status === searchStatus;
    const matchesDateRange = true; // Add date filtering logic if needed
    return matchesName && matchesStatus && matchesDateRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handleSearch = (searchParams) => {
    console.log('Search parameters:', searchParams);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClear = () => {
    setSearchName('');
    setSearchStatus('');
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const handleViewLead = (lead) => {
    Alert.alert(
      'Lead Details',
      `Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nStatus: ${lead.status}\nAssigned to: ${lead.assignedTo}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddMeeting = (lead) => {
    setSelectedLead(lead);
    setIsEditMeeting(false);
    setSelectedMeeting(null);
    setShowMeetingModal(true);
  };

  const handleEditMeeting = (lead) => {
    const meeting = meetings.find(m => m.leadId === lead.id);
    if (meeting) {
      setSelectedLead(lead);
      setIsEditMeeting(true);
      setSelectedMeeting(meeting);
      setShowMeetingModal(true);
    } else {
      Alert.alert('No Meeting', 'No meeting found for this lead. Would you like to create one?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: () => handleAddMeeting(lead) }
      ]);
    }
  };

  const handleSaveMeeting = (meetingData) => {
    if (isEditMeeting && selectedMeeting) {
      // Update existing meeting
      setMeetings(prev => prev.map(meeting => 
        meeting.id === selectedMeeting.id 
          ? { ...meeting, ...meetingData }
          : meeting
      ));
      Alert.alert('Success', 'Meeting updated successfully!');
    } else {
      // Create new meeting
      const newMeeting = {
        id: meetings.length + 1,
        leadId: selectedLead.id,
        ...meetingData,
        status: 'Scheduled'
      };
      setMeetings(prev => [...prev, newMeeting]);
      Alert.alert('Success', 'Meeting created successfully!');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          <SearchFilter
            onSearch={handleSearch}
            onClear={handleClear}
            searchName={searchName}
            setSearchName={setSearchName}
            searchStatus={searchStatus}
            setSearchStatus={setSearchStatus}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            statusOptions={['All', 'Assigned', 'InProgress', 'Completed', 'Pending']}
          />

          {/* Enhanced Leads Section */}
          <View style={styles.leadsSection}>
            <View style={styles.leadsHeader}>
              <Text style={styles.leadsSectionTitle}>Recent Leads</Text>
              <View style={styles.leadCount}>
                <Text style={styles.leadCountText}>{filteredLeads.length}</Text>
              </View>
            </View>

            <View style={styles.leadsContainer}>
              {currentLeads.map((lead, index) => (
                <LeadItem 
                  key={lead.id} 
                  lead={lead} 
                  index={index}
                  onViewPress={handleViewLead}
                  onAddPress={handleAddMeeting}
                />
              ))}
            </View>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showPageNumbers={false}
            />
          </View>
        </ScrollView>

        <BottomBar active="LMS" onNavigate={(key) => {
          if (key === 'Dashboard') navigation.navigate('Dashboard');
          if (key === 'Business Analytics') navigation.navigate('Business Analytics');
          if (key === 'Meeting Suggestion') navigation.navigate('Meeting Suggestion');
          if (key === 'QMS') navigation.navigate('QMS');
        }} />

        {/* Meeting Modal */}
        <MeetingModal
          visible={showMeetingModal}
          onClose={() => setShowMeetingModal(false)}
          onSave={handleSaveMeeting}
          leadData={selectedLead}
          isEdit={isEditMeeting}
          meetingData={selectedMeeting}
        />
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
});

export default LMSScreen;