import React, { useState } from "react";
import { Alert, Card, Button, Spinner } from "react-bootstrap";
import QrReader from "react-qr-reader-es6";

export default function QrScanner({ onScan }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  // Fungsi untuk menangani hasil scan QR
  const handleScan = (data) => {
    if (data) {
      setIsScanning(false);
      try {
        const url = new URL(data);
        const token = url.searchParams.get("token");
        if (token) {
          onScan(token);
        } else {
          onScan(data);
        }
      } catch (e) {
        onScan(data);
      }
    }
  };

  // Fungsi untuk menangani error, termasuk saat kamera ditolak
  const handleError = (error) => {
    if (error && error.name === 'NotAllowedError') {
      setErrorMsg("Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.");
    } else if (error) {
      setErrorMsg("Terjadi kesalahan saat mengakses kamera. Coba lagi.");
      console.warn("QR Scan Error:", error);
    }
    setIsScanning(false);
  };

  return (
    <Card className="p-4 shadow-sm" style={{ maxWidth: "450px", margin: "auto", borderRadius: "15px", border: "none" }}>
      <div className="text-center mb-4">
        <h4 className="fw-bold text-primary">Pindai Kode QR</h4>
        <p className="text-muted">Arahkan kamera Anda ke kode QR untuk *check-in*.</p>
      </div>

      <div style={{ position: "relative", width: "100%", paddingBottom: "100%", marginBottom: "1rem" }}>
        {/* Kontainer untuk QR Reader dengan rasio 1:1 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", borderRadius: "10px" }}>
          {errorMsg ? (
            <div className="d-flex justify-content-center align-items-center h-100" style={{ backgroundColor: "#e74c3c", color: "white" }}>
              <i className="bi bi-x-circle-fill me-2" style={{ fontSize: "2rem" }}></i>
            </div>
          ) : isScanning ? (
            <div className="d-flex flex-column justify-content-center align-items-center h-100" style={{ backgroundColor: "#f8f9fa" }}>
              <Spinner animation="border" variant="primary" className="mb-2" />
              <p className="text-muted">Membuka kamera...</p>
            </div>
          ) : null}

          {/* QrReader hanya akan di-render saat isScanning true dan tidak ada error */}
          {!errorMsg && isScanning && (
            <QrReader
              delay={300}
              facingMode="environment"
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      </div>

      {errorMsg && <Alert variant="danger" className="text-center">{errorMsg}</Alert>}
      {!isScanning && !errorMsg && (
        <Alert variant="success" className="text-center">
          ✅ Kode QR berhasil dipindai.
        </Alert>
      )}

      <div className="d-grid gap-2 mt-3">
        <Button 
          variant="outline-secondary" 
          onClick={() => { setErrorMsg(null); setIsScanning(true); }}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>Coba Lagi
        </Button>
      </div>
    </Card>
  );
}