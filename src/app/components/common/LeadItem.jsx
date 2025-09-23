import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LeadItem = ({ 
  lead, 
  index, 
  onViewPress, 
  onAddPress,
  showActions = true 
}) => {
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
          
          {showActions && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.addButton} 
                activeOpacity={0.7}
                onPress={() => onAddPress?.(lead)}
              >
                <Icon name="add" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.viewButton} 
                activeOpacity={0.7}
                onPress={() => onViewPress?.(lead)}
              >
                <Icon name="visibility" size={18} color="#9c27b0" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leadItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  leadCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
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
    marginBottom: 10,
  },
  leadNameContainer: {
    flex: 1,
    marginRight: 8,
  },
  leadName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  leadEmail: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignedInfo: {
    flex: 1,
    marginRight: 8,
  },
  phoneText: {
    fontSize: 11,
    color: '#34495e',
    marginBottom: 2,
    fontWeight: '500',
  },
  assignedLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#9c27b0',
    borderRadius: 16,
    width: 32,
    height: 32,
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
    borderRadius: 16,
    width: 32,
    height: 32,
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
});

export default LeadItem;
