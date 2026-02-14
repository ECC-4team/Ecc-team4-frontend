import api from './api';

export const getPlaces = (tripId) => {
  return api.get(`/trips/${tripId}/places`);
};

export const createPlace = (tripId, placeData) => {
  return api.post(`/trips/${tripId}/places`, placeData);
};

export const getPlaceDetail = (tripId, placeId) => {
  return api.get(`/trips/${tripId}/places/${placeId}`);
};

export const deletePlace = (tripId, placeId) => {
  return api.delete(`/trips/${tripId}/places/${placeId}`);
};

export const updatePlace = (tripId, placeId, updatedData) => {
  return api.patch(`/trips/${tripId}/places/${placeId}`, updatedData);
};
