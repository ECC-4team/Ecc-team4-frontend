import api from './api';

export const getTrips = () => {
  return api.get(`/trips`);
};

export const createTrip = (formData) => {
  return api.post('/trips', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getTripDetail = (tripId) => {
  return api.get(`/trips/${tripId}`);
};

export const deleteTrip = (tripId) => {
  return api.delete(`/trips/${tripId}`);
};

export const updateTrip = (tripId, formData) => {
  return api.patch(`/trips/${tripId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
