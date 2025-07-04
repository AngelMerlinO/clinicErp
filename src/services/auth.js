import { api } from './api';

export function login({ email, password }) {
  // auth:false → NO se envía Authorization
  return api.post('/auth/login', { email, password }, { auth: false });
}
