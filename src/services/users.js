// src/services/users.js
import { api } from './api';          

export const usersService = {
  list:   ()           => api.get('/users'),              // GET  /users
  get:    (id)         => api.get(`/users/${id}`),        // GET  /users/:id
  create: (payload)    => api.post('/users', payload),    // POST /users
  update: (id, payload)=> api.put(`/users/${id}`, payload),// PUT  /users/:id
  remove: (id)         => api.del(`/users/${id}`),        // DELETE /users/:id
};
