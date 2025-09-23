import axios from 'axios';
import { LOGIN_API_URL, LEAD_API_URL, MEETING_API_URL } from './config';

export const api = axios.create({});

// AUTH
export const login = async ({ Email, password }) => {
  const { data, status } = await api.post(`${LOGIN_API_URL}Login`, { Email, password });
  if (status !== 200) throw new Error('Login failed');
  return data; // { message: token, user, id, arn, userRole }
};

export const signup = async (payload) => {
  const { data } = await api.post(`${LOGIN_API_URL}signup`, payload);
  return data;
};

export const getUsersByArn = async ({ Arn, token }) => {
  const { data } = await api.get(`${LOGIN_API_URL}GetUserByARNNo`, { params: { ARNNo: Arn, token } });
  return data; // [{ id, username }]
};

// LEADS
export const getLastLeadId = async () => {
  const { data } = await api.get(`https://leadmanagementapi.azure-api.net/echo/api/Lead/last-lead-id`);
  return data?.lastLeadId ?? 0;
};

export const createLead = async (lead) => {
  const { data, status } = await api.post(`https://leadmanagementapi.azure-api.net/echo/api/Lead/`, lead);
  if (status !== 201) throw new Error('Failed to create lead');
  return data; // created lead with id
};

export const getLeadsWithTracker = async ({ UserId, userRole, Arn }) => {
  const { data } = await api.get(`${LEAD_API_URL}leads-with-tracker/${UserId}/${userRole}/${Arn}`);
  return data;
};

export const filterLeads = async ({ UserId, userRole, Arn, clientName, fromDate, toDate, status }) => {
  let url = `${LEAD_API_URL}filter/${UserId}/${userRole}/${Arn}?`;
  if (clientName) url += `clientName=${clientName}&`;
  if (fromDate && toDate) url += `fromDate=${fromDate}&toDate=${toDate}&`;
  if (status) url += `status=${status}&`;
  const { data } = await api.get(url);
  return data;
};

export const getLeadSourcesProgress = async ({ UserId, userRole, Arn }) => {
  const { data } = await api.get(`${LEAD_API_URL}lead-sources-progress/${UserId}/${userRole}/${Arn}`);
  return data;
};

export const getLeadStats = async ({ UserId, userRole, Arn }) => {
  const { data } = await api.get(`${LEAD_API_URL}lead-stats/${UserId}/${userRole}/${Arn}`);
  return data;
};

export const saveLeadTracker = async ({ leadId, payload, existingTracker }) => {
  if (existingTracker && payload.assignedTo === existingTracker.assignedTo) {
    const { status } = await api.put(`https://leadmanagementapi.azure-api.net/echo/api/LeadsTracker/lead/${leadId}/${existingTracker.id}`, payload);
    return status;
  }
  const { status } = await api.post(`https://leadmanagementapi.azure-api.net/echo/api/LeadsTracker/lead/${leadId}`, payload);
  return status;
};

export const closeLead = async ({ leadId, requestData }) => {
  const { status } = await api.put(`https://leadmanagementapi.azure-api.net/echo/api/Lead/close/${leadId}`, requestData, { headers: { 'Content-Type': 'application/json' } });
  return status;
};

// MEETINGS / NOTIFICATIONS (as needed later)
export const getMeetingsByUser = async ({ UserId, months }) => {
  const { data } = await api.get(`${MEETING_API_URL}GetMeetingsByUser/${UserId}/${months}`);
  return data;
};

export const getNotifications = async ({ UserId }) => {
  const { data } = await api.get(MEETING_API_URL, { params: { Userid: UserId } });
  return data;
};

export const markNotificationsSeen = async ({ UserId }) => {
  const { status } = await api.post(`${MEETING_API_URL}Seen/${UserId}`);
  return status;
};