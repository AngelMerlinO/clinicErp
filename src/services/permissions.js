import { api } from './api';

export const permissionsService = {
  list: () => api.get('/permissions'),
};
