// authService.js
import api from './api';

// MEMBER
export async function registerMember(data) {
  const res = await api.post('/auth/member/register', data);
  return res.data;
}

export async function loginMember(data) {
  const res = await api.post('/auth/member/login', data);
  return res.data;
}

// ADMIN
export async function registerAdmin(data) {
  const res = await api.post('/auth/admin/register', data);
  return res.data;
}

export async function loginAdmin(data) {
  const res = await api.post('/auth/admin/login', data);
  return res.data;
}
