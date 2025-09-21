import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Modal, Form, Button } from "react-bootstrap";
import QRCode from 'react-qr-code';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import memberService from '../../services/memberService';
import moment from 'moment';
import darkBg from '../../assets/images/5.jpeg'; // Asumsi Anda punya gambar latar belakang gelap
import defaultProfile from '../../assets/images/11.jpeg';

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
      await memberService.uploadProfileImage(formData);
      await fetchMemberData();
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
      backgroundImage: `url(${darkBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      paddingTop: '3rem',
      paddingBottom: '3rem',
      color: '#e2e8f0', // Teks terang
    },
    overlay: {
      minHeight: '100vh',
      backgroundColor: 'rgba(26, 32, 44, 0.9)', // Overlay gelap
      paddingTop: '3rem',
      paddingBottom: '3rem',
    },
    card: {
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(45, 55, 72, 0.5)',
      backgroundColor: 'rgba(45, 55, 72, 0.95)', // Card gelap transparan
      transition: 'all 0.4s ease-in-out',
      color: '#e2e8f0',
    },
    cardHover: {
      transform: 'translateY(-10px) scale(1.02)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6)',
    },
    profileImage: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '5px solid #48bb78', // Border hijau
      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      transition: 'transform 0.3s ease',
    },
    profileImageHover: {
      transform: 'scale(1.05)',
    },
    profileName: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#48bb78', // Judul hijau
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    badge: {
      fontSize: '1rem',
      padding: '0.6rem 1.2rem',
      borderRadius: '30px',
      fontWeight: '600',
    },
    heading: {
      fontWeight: '700',
      color: '#cbd5e0',
      borderLeft: '4px solid #48bb78',
      paddingLeft: '1rem',
      marginBottom: '1.5rem',
    },
    qrSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem',
      backgroundColor: 'rgba(26, 32, 44, 0.7)',
      borderRadius: '15px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay} className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="success" />
          <p className="ms-3 text-white">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <Container className="py-5">
          <h1 className="text-center mb-5" style={styles.heading}>Dasbor Member</h1>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Row className="g-5 justify-content-center">
            {profile && (
              <Col lg={6}>
                <Card 
                  className="shadow-xl" 
                  style={styles.card}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                  onMouseOut={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' })}
                >
                  <Card.Body className="p-5">
                    <div className="text-center mb-4 position-relative">
                      <img 
                        src={profile.profilePictureUrl ? `http://192.168.56.1:4000${profile.profilePictureUrl}` : defaultProfile}
                        alt="Profil" 
                        style={styles.profileImage}
                        className="mb-3"
                      />
                      <Button 
                        variant="dark" 
                        size="sm"
                        style={{ position: 'absolute', bottom: 20, right: 100, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%' }} 
                        onClick={() => setShowImageModal(true)}
                      >
                        <i className="bi bi-camera-fill"></i>
                      </Button>
                      <h4 style={styles.profileName}>{profile.fullName}</h4>
                      <p className="text-muted">{profile.membership?.packageName || "Tidak Ada Paket"}</p>
                    </div>

                    <hr className="border-gray-600" />
                    
                    <h5 className="mt-4 mb-3" style={styles.heading}>Informasi Kontak</h5>
                    <p><i className="bi bi-envelope me-3 text-success"></i><strong>Email:</strong> {profile.email}</p>
                    <p><i className="bi bi-phone me-3 text-success"></i><strong>Telepon:</strong> {profile.phone}</p>
                    
                    <hr className="border-gray-600" />

                    <h5 className="mt-4 mb-3" style={styles.heading}>Status Keanggotaan</h5>
                    <p className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar-check me-3 text-success"></i>
                      <strong>Masa Berlaku:</strong> &nbsp;
                      <span>
                        {profile.membership ? `${moment(profile.membership.startDate).format('DD MMM YYYY')} - ${moment(profile.membership.endDate).format('DD MMM YYYY')}` : 'Tidak ada data'}
                      </span>
                    </p>
                    <p className="d-flex align-items-center">
                      <i className="bi bi-patch-check-fill me-3 text-success"></i>
                      <strong>Status:</strong> &nbsp;
                      <Badge bg={profile.membership?.status === 'Aktif' ? 'success' : 'secondary'} style={styles.badge}>
                        {profile.membership?.status || 'Nonaktif'}
                      </Badge>
                    </p>
                    
                    {profile.qrToken && (
                      <div className="mt-5 text-center" style={styles.qrSection}>
                        <h5 className="mb-4 text-white">Kode QR untuk Check-in</h5>
                        <QRCode
                          value={profile.qrToken}
                          size={200}
                          bgColor="#1a202c"
                          fgColor="#48bb78"
                        />
                        <p className="mt-3 text-sm text-muted">Scan kode ini di pintu masuk gym.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )}
            <Col lg={6}>
              <Card 
                className="shadow-xl" 
                style={styles.card}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' })}
              >
                <Card.Body className="p-5">
                  <h5 className="mb-4" style={styles.heading}>Riwayat Kehadiran</h5>
                  {attendance.length > 0 ? (
                    <ul className="list-unstyled">
                      {attendance.slice(0, 10).map((att, index) => (
                        <li key={index} className="d-flex align-items-center mb-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                          <i className="bi bi-check-circle-fill me-3 text-success" style={{ fontSize: '1.5rem' }}></i>
                          <div>
                            <strong>Check-in:</strong> {moment(att.checkInAt).format('dddd, DD MMMM YYYY')}
                            <br />
                            <small className="text-muted">{moment(att.checkInAt).format('HH:mm:ss')}</small>
                          </div>
                        </li>
                      ))}
                      {attendance.length > 10 && <p className="text-center mt-3 text-muted">... Tampilkan lebih banyak</p>}
                    </ul>
                  ) : (
                    <Alert variant="secondary" className="text-center">
                      <i className="bi bi-info-circle me-2"></i>Tidak ada riwayat kehadiran.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
          <Modal.Header closeButton style={{ borderBottom: 'none' }}>
            <Modal.Title className="text-white">Unggah Foto Profil</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleImageUpload}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="text-white">Pilih Gambar</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setProfileImage(e.target.files[0])} 
                  className="bg-secondary text-white border-0"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none' }}>
              <Button variant="outline-light" onClick={() => setShowImageModal(false)}>
                Batal
              </Button>
              <Button variant="success" type="submit" disabled={uploading}>
                {uploading ? <Spinner animation="border" size="sm" /> : "Unggah"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}