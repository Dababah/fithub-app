// src/components/LandingPage.jsx

import React from "react";
// Import semua komponen React-Bootstrap yang digunakan
import { Container, Card, Button, Row, Col } from "react-bootstrap";
// Import Link dari react-router-dom
import { Link } from "react-router-dom";
// Import CSS yang baru dibuat
import './LandingPage.css';

// --- Impor gambar lokal Anda di sini ---
// Pastikan nama file dan path-nya sesuai dengan struktur folder Anda
// Mengubah './assets/5.jpeg' menjadi '../assets/images/5.jpeg' atau sejenisnya
import mainBg from '../assets/images/5.jpeg'; // Perbaikan path
import card1Bg from '../assets/images/2.jpeg';   
import card2Bg from '../assets/images/3.jpeg';   
import card3Bg from '../assets/images/10.jpeg';   

export default function LandingPage() {
  return (
    <>
      {/* Bagian Utama: Motivasi dan Ajakan */}
      <div 
        className="text-center text-white d-flex align-items-center justify-content-center"
        style={{
          height: 'calc(100vh - 56px)',
          // Gunakan variabel gambar yang sudah diimpor
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${mainBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container>
          <h1 className="display-3 fw-bold mb-4">
            Ini Saatnya Mulai!
          </h1>
          <p className="lead mb-4">
            Jangan tunda lagi niat baik Anda. Di sini, Anda akan mendapatkan semua yang Anda butuhkan untuk memulai perjalanan kebugaran dengan mudah dan terarah.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button as={Link} to="/register" variant="primary" size="lg">
              Daftar Sekarang
            </Button>
            <Button as={Link} to="/about" variant="outline-light" size="lg">
              Pelajari Fitur Kami
            </Button>
          </div>
        </Container>
      </div>

      {/* Bagian Fitur: Mengatasi Keraguan Calon Anggota */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Kami Memudahkan Langkah Pertama Anda</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card 
              className="h-100 text-center p-3 card-with-background"
              style={{
                '--background-url': `url(${card1Bg})`
              }}
            >
              <Card.Body>
                <Card.Title>Pendaftaran Mudah</Card.Title>
                <Card.Text>
                  Lupakan formulir kertas yang rumit. Daftar online dalam hitungan menit dari mana saja.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card 
              className="h-100 text-center p-3 card-with-background"
              style={{
                '--background-url': `url(${card2Bg})`
              }}
            >
              <Card.Body>
                <Card.Title>Check-in Praktis</Card.Title>
                <Card.Text>
                  Tidak perlu repot. Cukup pindai QR Code di pintu masuk untuk memulai sesi latihan Anda.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card 
              className="h-100 text-center p-3 card-with-background"
              style={{
                '--background-url': `url(${card3Bg})`
              }}
            >
              <Card.Body>
                <Card.Title>Pantau Perkembangan Anda</Card.Title>
                <Card.Text>
                  Lihat riwayat kehadiran dan status keanggotaan Anda kapan saja melalui dashboard pribadi.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Bagian "About Us" */}
      <div id="about-us" className="bg-light py-5">
        <Container>
          <Row>
            <Col>
              <h2>Tentang Kami</h2>
              <p>FitHub diciptakan untuk membuat kebugaran dapat diakses oleh semua orang. Kami menyediakan platform yang aman dan efisien bagi pemilik gym untuk fokus pada anggotanya, dan bagi Anda untuk fokus pada tujuan kebugaran Anda. Bergabunglah dengan kami dan rasakan kemudahan dari sistem manajemen gym yang modern.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}