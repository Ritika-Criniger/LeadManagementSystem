import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../../screens/DashboardScreen.jsx';
import NewLeadScreen from '../../screens/NewLeadScreen.jsx';
import AssignLeadScreen from '../../screens/AssignLeadScreen.jsx';
import StatusScreen from '../../screens/StatusScreen.jsx';
import AnalyticsScreen from '../../screens/AnalyticsScreen.jsx';
import SuggestionScreen from '../../screens/SuggestionScreen.jsx';
import QMSScreen from '../../screens/QMSScreen.jsx';
import LMSScreen from '../../screens/LMSScreen.jsx';
import ViewLeadScreen from '../../screens/ViewLeadScreen.jsx';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Business Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="Meeting Suggestion" component={SuggestionScreen} />
        <Stack.Screen name="LMS" component={LMSScreen} />
        <Stack.Screen name="QMS" component={QMSScreen} />
        <Stack.Screen name="NewLead" component={NewLeadScreen} />
        <Stack.Screen name="AssignLead" component={AssignLeadScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="ViewLead" component={ViewLeadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;