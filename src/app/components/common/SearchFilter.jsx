import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const SearchFilter = ({
  onSearch,
  onClear,
  searchName,
  setSearchName,
  searchStatus,
  setSearchStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  statusOptions = ['All', 'Assigned', 'InProgress', 'Completed', 'Pending'],
  showDateFilter = true,
  showStatusFilter = true,
  showNameFilter = true,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleClear = () => {
    setSearchName('');
    setSearchStatus('');
    setStartDate(null);
    setEndDate(null);
    onClear?.();
  };

  const handleSearch = () => {
    onSearch?.({
      name: searchName,
      status: searchStatus,
      startDate,
      endDate,
    });
  };

  return (
    <View style={styles.searchCard}>
      <View style={styles.searchHeader}>
        <Icon name="search" size={20} color="#9c27b0" />
        <Text style={styles.searchTitle}>Filter Leads</Text>
      </View>
      
      <View style={styles.searchContent}>
        <View style={styles.searchRow}>
          {showNameFilter && (
            <View style={styles.inputContainer}>
              <Icon name="person" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter Name"
                value={searchName}
                onChangeText={setSearchName}
                placeholderTextColor="#999"
              />
            </View>
          )}
          
          {showStatusFilter && (
            <View style={styles.inputContainer}>
              <Icon name="flag" size={18} color="#666" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.statusInput}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text style={[styles.statusText, !searchStatus && styles.placeholderText]}>
                  {searchStatus || 'Select Status'}
                </Text>
                <Icon name="arrow-drop-down" size={18} color="#9c27b0" />
              </TouchableOpacity>
              
              {showStatusDropdown && (
                <View style={styles.dropdown}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSearchStatus(option === 'All' ? '' : option);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
        
        {showDateFilter && (
          <View style={styles.searchRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dateInputContainer}
              onPress={() => setShowStartPicker(true)}
            >
              <Icon name="event" size={18} color="#666" style={styles.inputIcon} />
              <Text style={[styles.dateText, !startDate && styles.placeholderText]}>
                {startDate ? formatDate(startDate) : 'Start Date'}
              </Text>
              <Icon name="arrow-drop-down" size={18} color="#9c27b0" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dateInputContainer}
              onPress={() => setShowEndPicker(true)}
            >
              <Icon name="event" size={18} color="#666" style={styles.inputIcon} />
              <Text style={[styles.dateText, !endDate && styles.placeholderText]}>
                {endDate ? formatDate(endDate) : 'End Date'}
              </Text>
              <Icon name="arrow-drop-down" size={18} color="#9c27b0" />
            </TouchableOpacity>
          </View>
        )}

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
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.searchButton} 
            activeOpacity={0.8}
            onPress={handleSearch}
          >
            <LinearGradient
              colors={['#9c27b0', '#64b5f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.searchGradientButton}
            >
              <Icon name="search" size={18} color="#fff" />
              <Text style={styles.searchButtonText}>Search</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
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
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  searchContent: {
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    minHeight: 44,
    position: 'relative',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 13,
    color: '#2c3e50',
  },
  statusInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 13,
    color: '#2c3e50',
    marginLeft: 8,
  },
  placeholderText: {
    color: '#95a5a6',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 13,
    color: '#2c3e50',
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  dateText: {
    flex: 1,
    fontSize: 13,
    color: '#2c3e50',
    marginLeft: 8,
  },
  searchButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clearButtonText: {
    color: '#7f8c8d',
    fontSize: 13,
    fontWeight: '600',
  },
  searchButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchGradientButton: {
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default SearchFilter;
