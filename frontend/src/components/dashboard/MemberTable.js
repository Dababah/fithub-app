import React, { useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; // ✅ Tambahkan ikon
import memberService from '../../services/memberService';

export default function MemberTable({ members = [], refresh }) {
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const tableStyle = {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
  };

  const tableHeaderStyle = {
    backgroundColor: '#2c3e50', // Warna header lebih gelap dan profesional
    color: '#ecf0f1',
    fontWeight: '600',
    fontSize: '1rem',
  };

  const tableRowStyle = {
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    cursor: 'pointer',
    backgroundColor: '#ffffff', // Latar belakang putih untuk baris
  };

  const tableRowHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  };

  const formatID = (id) => {
    return String(id).padStart(4, '0');
  };

  async function onDelete(id) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

    setDeletingId(id);
    setError(null);
    try {
      await memberService.deleteMember(id);
      await refresh();
    } catch (err) {
      console.error("Error deleting member:", err);
      setError(err.response?.data?.message || 'Gagal menghapus anggota.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="table-responsive" style={tableStyle}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive className="m-0">
        <thead style={tableHeaderStyle}>
          <tr>
            <th className="py-3">ID</th>
            <th className="py-3">Nama</th>
            <th className="py-3">Email</th>
            <th className="py-3">Telepon</th>
            <th className="py-3 text-center">Kode QR</th>
            <th className="py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map(m => (
              <tr 
                key={m.id}
                style={tableRowStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = tableRowHoverStyle.transform;
                  e.currentTarget.style.boxShadow = tableRowHoverStyle.boxShadow;
                  e.currentTarget.style.backgroundColor = '#f1f1f1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <td className="align-middle">{formatID(m.id)}</td>
                <td className="align-middle">{m.fullName}</td>
                <td className="align-middle">{m.email}</td>
                <td className="align-middle">{m.phone}</td>
                <td className="text-center align-middle">
                  {m.qrPath ? (
                    <img
                      src={process.env.REACT_APP_API_URL.replace('/api', '') + m.qrPath}
                      alt="QR Code"
                      width={60}
                      className="img-fluid rounded"
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="text-center align-middle">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-danger p-0 border-0"
                    onClick={() => onDelete(m.id)}
                    disabled={deletingId === m.id}
                  >
                    {deletingId === m.id ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      <FaTrash /> // ✅ Gunakan ikon
                    )}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">Tidak ada data anggota.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}