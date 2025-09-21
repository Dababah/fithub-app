import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Modal, Form, Button } from "react-bootstrap";
import memberService from '../../services/memberService';
import moment from 'moment';
import mainBg from '../../assets/images/5.jpeg';
import defaultProfile from '../../assets/images/11.jpeg'; // Pastikan Anda memiliki gambar default

export default function MemberDashboard() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileRes = await memberService.getMemberProfile();
      const attendanceRes = await memberService.getMemberAttendance();
      setProfile(profileRes.data);
      setAttendance(attendanceRes.data);
    } catch (e) {
      console.error("Error fetching member data:", e.response?.data?.message || e.message);
      if (e.response?.status === 403) {
        setError("Akses ditolak. Silakan login kembali.");
      } else {
        setError("Gagal memuat data member.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      setError("Pilih file gambar terlebih dahulu.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      // Catatan: Jika ada data lain yang ingin Anda kirim, tambahkan di sini.
      // Contoh: formData.append('description', 'Foto profil baru');

      await memberService.uploadProfileImage(formData);
      await fetchMemberData(); // Muat ulang data untuk menampilkan foto baru
      setShowImageModal(false);
      setProfileImage(null);
    } catch (e) {
      console.error("Error uploading profile image:", e);
      setError("Gagal mengunggah foto profil. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundImage: `url(${mainBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      paddingTop: '3rem',
      paddingBottom: '3rem',
    },
    overlay: {
      minHeight: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      paddingTop: '3rem',
      paddingBottom: '3rem',
    },
    card: {
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      border: 'none',
      transition: 'transform 0.3s ease-in-out',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    cardHover: {
      transform: 'translateY(-5px)',
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: '1.5rem',
      position: 'relative',
    },
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      marginBottom: '1rem',
      objectFit: 'cover',
      border: '3px solid #0d6efd',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    editButton: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    profileName: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#343a40',
    },
    badge: {
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay} className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
          <p className="ms-3">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <Container className="my-5">
          <h3 className="fw-bold mb-4 text-center text-secondary">Dasbor Member</h3>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Row className="g-4">
            {profile && (
              <Col md={6}>
                <Card 
                  className="p-4 shadow-lg h-100" 
                  style={styles.card}
                  onMouseOver={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <div style={styles.profileSection}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={profile.profilePictureUrl ? `http://192.168.56.1:4000${profile.profilePictureUrl}` : defaultProfile}
                        alt="Profil" 
                        style={styles.profileImage} 
                      />
                      <Button 
                        variant="link" 
                        style={styles.editButton} 
                        onClick={() => setShowImageModal(true)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                    </div>
                    <h4 style={styles.profileName}>{profile.fullName}</h4>
                  </div>
                  <h5 className="fw-bold text-primary">Informasi Kontak</h5>
                  <p><i className="bi bi-envelope me-2 text-primary"></i><strong>Email:</strong> {profile.email}</p>
                  <p><i className="bi bi-phone me-2 text-primary"></i><strong>Telepon:</strong> {profile.phone}</p>
                  <hr />
                  <h5 className="fw-bold text-success">Detail Keanggotaan</h5>
                  {profile.membership ? (
                    <>
                      <p><i className="bi bi-box-fill me-2 text-success"></i><strong>Paket:</strong> {profile.membership.packageName}</p>
                      <p><i className="bi bi-calendar-check me-2 text-success"></i><strong>Masa Berlaku:</strong> {moment(profile.membership.startDate).format('DD MMM YYYY')} - {moment(profile.membership.endDate).format('DD MMM YYYY')}</p>
                      <p><i className="bi bi-patch-check-fill me-2 text-success"></i><strong>Status:</strong> <Badge bg={profile.membership.status === 'Aktif' ? 'success' : 'secondary'} style={styles.badge}>{profile.membership.status === 'Aktif' ? 'Aktif' : 'Nonaktif'}</Badge></p>
                    </>
                  ) : (
                    <p>Tidak ada data keanggotaan.</p>
                  )}
                </Card>
              </Col>
            )}
            <Col md={6}>
              <Card 
                className="p-4 shadow-lg h-100" 
                style={styles.card}
                onMouseOver={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                <h5 className="fw-bold text-info">Riwayat Kehadiran</h5>
                {attendance.length > 0 ? (
                  <ul className="list-unstyled">
                    {attendance.map((att, index) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-calendar-event me-2 text-info"></i>
                        {moment(att.checkInAt).format('DD MMMM YYYY, HH:mm')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Tidak ada riwayat kehadiran.</p>
                )}
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Unggah Foto Profil</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleImageUpload}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Pilih Gambar</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setProfileImage(e.target.files[0])} 
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                Batal
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? <Spinner animation="border" size="sm" /> : "Unggah"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}