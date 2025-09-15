import api from './api';

const memberService = {
  // Fungsi untuk Admin
  getAllMembers: () => {
    return api.get('/members');
  },
  getDashboardData: () => {
    return api.get('/members/dashboard');
  },
  createMember: (memberData) => {
    return api.post('/members', memberData);
  },
  updateMember: (id, memberData) => {
    return api.put(`/members/${id}`, memberData);
  },
  deleteMember: (id) => {
    return api.delete(`/members/${id}`);
  },

  // Fungsi untuk Member Pribadi
  getMemberProfile: () => {
    return api.get('/members/profile');
  },
  getMemberAttendance: () => {
    return api.get('/members/attendance');
  },
  uploadProfileImage: (formData) => {
    return api.post('/members/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default memberService;