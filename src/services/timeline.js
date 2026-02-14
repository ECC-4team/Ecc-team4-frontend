import api from './api';

export const getTripTimeline = (tripId) => {
  return api.get(`/trips/${tripId}/timeline`);
};

export const addTimelineItem = (tripId, timelineData) => {
  return api.post(`/trips/${tripId}/timeline`, timelineData);
};

export const deleteTimelineItem = (timelineId) => {
  return api.delete(`/trips/timeline/${timelineId}`);
};
