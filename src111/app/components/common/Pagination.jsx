import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = false,
  maxVisiblePages = 5,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    if (!showPageNumbers) return [];
    
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity 
        style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]} 
        activeOpacity={0.7}
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <Icon name="chevron-left" size={18} color={currentPage === 1 ? "#ccc" : "#9c27b0"} />
      </TouchableOpacity>
      
      {showPageNumbers ? (
        <View style={styles.pageNumbersContainer}>
          {getVisiblePages().map((page) => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageNumberButton,
                page === currentPage && styles.activePageButton
              ]}
              onPress={() => onPageChange(page)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pageNumberText,
                page === currentPage && styles.activePageText
              ]}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.pageInfo}>
          <View style={styles.currentPage}>
            <Text style={styles.currentPageText}>{currentPage}</Text>
          </View>
          <Text style={styles.totalPagesText}>of {totalPages}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]} 
        activeOpacity={0.7}
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <Icon name="chevron-right" size={18} color={currentPage === totalPages ? "#ccc" : "#9c27b0"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  pageNumbersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNumberButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  activePageButton: {
    backgroundColor: '#9c27b0',
    borderColor: '#9c27b0',
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activePageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9c27b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalPagesText: {
    color: '#7f8c8d',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Pagination;
