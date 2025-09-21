import api from './api';

const memberService = {
  // Fungsi untuk Admin (termasuk yang baru)
  getAllMembers: () => api.get('/members'),
  getDashboardData: () => api.get('/members/dashboard'),
  createMember: (memberData) => api.post('/members', memberData),
  updateMember: (id, memberData) => api.put(`/members/${id}`, memberData),
  deleteMember: (id) => api.delete(`/members/${id}`),
  getMembersPdf: () => api.get("/members/pdf-report", { responseType: 'blob' }),
  getMembersPdfReport: () => api.get("/members/pdf-report", { responseType: 'blob' }),

  // Fungsi untuk Member Pribadi
  getMemberProfile: () => api.get('/members/profile'),
  getMemberAttendance: () => api.get('/members/attendance'),
  uploadProfileImage: (formData) =>
    api.post('/members/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default memberService;
