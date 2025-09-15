// src/services/attendanceService.js

import api from './api';

/**
 * Mengambil data ringkasan kehadiran mingguan untuk chart.
 * Endpoint: GET /api/attendance/weekly-summary
 * @returns {Promise<object>} Data kehadiran mingguan.
 */
export async function getWeeklyAttendance() {
  try {
    const response = await api.get('/attendance/weekly-summary');
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly attendance data:", error);
    throw error;
  }
}

/**
 * Mencatat kehadiran massal untuk anggota pada tanggal tertentu.
 * Endpoint: POST /api/attendance/record
 * @param {string} date - Tanggal kehadiran dalam format YYYY-MM-DD.
 * @param {string[]} memberIds - Array ID anggota yang hadir.
 * @returns {Promise<object>} Respons dari server.
 */
export async function recordAttendance(date, memberIds) {
  try {
    const response = await api.post('/attendance/record', { date, memberIds });
    return response.data;
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
}

/**
 * Memperbarui status kehadiran anggota.
 * Endpoint: PUT /api/attendance/:id
 * @param {string} attendanceId - ID data kehadiran yang akan diperbarui.
 * @param {object} updatedData - Data yang akan diperbarui (misalnya, { status: 'hadir' }).
 * @returns {Promise<object>} Respons dari server.
 */
export async function updateAttendance(attendanceId, updatedData) {
  try {
    const response = await api.put(`/attendance/${attendanceId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }
}

/**
 * Menghapus data kehadiran.
 * Endpoint: DELETE /api/attendance/:id
 * @param {string} attendanceId - ID data kehadiran yang akan dihapus.
 * @returns {Promise<object>} Respons dari server.
 */
export async function deleteAttendance(attendanceId) {
  try {
    const response = await api.delete(`/attendance/${attendanceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    throw error;
  }
}