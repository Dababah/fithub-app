import React, { useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import memberService from '../../services/memberService'; // ✅ Import objek layanan secara default

export default function MemberTable({ members = [], refresh }) {
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const tableStyle = {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  };

  const tableHeaderStyle = {
    backgroundColor: '#343a40',
    color: 'white',
  };

  const tableRowStyle = {
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  };

  const formatID = (id) => {
    return String(id).padStart(4, '0');
  };

  async function onDelete(id) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

    setDeletingId(id);
    setError(null);
    try {
      // ✅ Panggil fungsi dari objek layanan
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
      <Table striped hover responsive>
        <thead style={tableHeaderStyle}>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Kode QR</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map(m => (
              <tr 
                key={m.id}
                style={tableRowStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td>{formatID(m.id)}</td>
                <td>{m.fullName}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>
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
                <td>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => onDelete(m.id)}
                    disabled={deletingId === m.id}
                  >
                    {deletingId === m.id ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      'Hapus'
                    )}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">Tidak ada data anggota.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}