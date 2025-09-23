# Reusable Components

This folder contains reusable React Native components that can be used across the application.

## Components

### StatsCard
A reusable card component for displaying statistics with gradient backgrounds.

**Props:**
- `title` (string): The title of the stat
- `value` (string|number): The value to display
- `icon` (string): MaterialIcons icon name
- `gradient` (array): Array of colors for gradient background
- `size` (string): 'small', 'medium', or 'large'
- `onPress` (function): Optional press handler

**Usage:**
```jsx
<StatsCard
  title="Total Leads"
  value="125"
  icon="people"
  gradient={['#9c27b0', '#64b5f6']}
  size="medium"
/>
```

### ProgressBar
A reusable progress bar component with gradient support.

**Props:**
- `label` (string): Label for the progress bar
- `percentage` (number): Progress percentage (0-100)
- `color` (array): Array of colors for gradient
- `showPercentage` (boolean): Whether to show percentage text
- `height` (number): Height of the progress bar
- `labelWidth` (number): Width of the label

**Usage:**
```jsx
<ProgressBar
  label="Website"
  percentage={45}
  color={['#9c27b0', '#64b5f6']}
  showPercentage={true}
/>
```

### SearchFilter
A comprehensive search and filter component.

**Props:**
- `onSearch` (function): Search callback
- `onClear` (function): Clear callback
- `searchName` (string): Name search value
- `setSearchName` (function): Name setter
- `searchStatus` (string): Status filter value
- `setSearchStatus` (function): Status setter
- `startDate` (Date): Start date filter
- `setStartDate` (function): Start date setter
- `endDate` (Date): End date filter
- `setEndDate` (function): End date setter
- `statusOptions` (array): Available status options
- `showDateFilter` (boolean): Show date filters
- `showStatusFilter` (boolean): Show status filter
- `showNameFilter` (boolean): Show name filter

**Usage:**
```jsx
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
```

### LeadItem
A reusable component for displaying lead information with action buttons.

**Props:**
- `lead` (object): Lead data object
- `index` (number): Index for alternating row colors
- `onViewPress` (function): View button callback
- `onAddPress` (function): Add button callback
- `showActions` (boolean): Whether to show action buttons

**Usage:**
```jsx
<LeadItem
  lead={leadData}
  index={0}
  onViewPress={handleViewLead}
  onAddPress={handleAddMeeting}
  showActions={true}
/>
```

### Pagination
A reusable pagination component.

**Props:**
- `currentPage` (number): Current page number
- `totalPages` (number): Total number of pages
- `onPageChange` (function): Page change callback
- `showPageNumbers` (boolean): Whether to show page numbers
- `maxVisiblePages` (number): Maximum visible page numbers

**Usage:**
```jsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  showPageNumbers={false}
/>
```

### MeetingModal
A modal component for adding/editing meetings.

**Props:**
- `visible` (boolean): Modal visibility
- `onClose` (function): Close callback
- `onSave` (function): Save callback
- `leadData` (object): Lead data for pre-filling
- `isEdit` (boolean): Whether editing existing meeting
- `meetingData` (object): Existing meeting data for editing

**Usage:**
```jsx
<MeetingModal
  visible={showMeetingModal}
  onClose={() => setShowMeetingModal(false)}
  onSave={handleSaveMeeting}
  leadData={selectedLead}
  isEdit={false}
  meetingData={null}
/>
```

## Styling

All components use consistent styling with:
- Responsive design using scale functions
- Material Design principles
- Consistent color scheme
- Proper elevation and shadows
- Accessibility considerations

## Dependencies

- `react-native-vector-icons/MaterialIcons`
- `react-native-linear-gradient`
- `@react-native-community/datetimepicker`
- `react-native-safe-area-context`
