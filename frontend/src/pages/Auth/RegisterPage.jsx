import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { registerMember } from "../../services/authService";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

import gymBackground from '../../assets/images/9.jpeg';

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/member", { replace: true });
      }
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);

    if (!fullName || !email || !password) {
      setMsg("Nama lengkap, email, dan password wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await registerMember({ fullName, email, phone, password });
      console.log("Response from backend:", res);

      setMsg("Registrasi berhasil! Anda akan dialihkan ke halaman login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error during registration:", err);
      setMsg(err?.response?.data?.message || "Registrasi gagal, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${gymBackground})`, 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 380, // ✅ PERUBAHAN: Lebar card lebih kecil
    padding: 30, // ✅ PERUBAHAN: Padding lebih kecil
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 15,
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f8f9fa",
    margin: "20px auto",
  };

  const titleStyle = {
    color: "#00bcd4",
    textAlign: "center",
    marginBottom: "25px", // ✅ PERUBAHAN: Jarak bawah judul lebih kecil
    textShadow: "0 0 10px rgba(0, 188, 212, 0.5)",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "700",
  };

  const formLabelStyle = {
    color: "#adb5bd",
    fontWeight: "600",
    fontSize: "0.9rem", // ✅ PERUBAHAN: Ukuran font label lebih kecil
    marginBottom: "0.2rem", // ✅ PERUBAHAN: Jarak bawah label lebih kecil
  };

  const formControlStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#e9ecef",
    padding: "0.6rem 0.8rem", // ✅ PERUBAHAN: Padding input lebih kecil
    borderRadius: "8px",
    fontFamily: "'Open Sans', sans-serif",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.4)",
    },
    "&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderColor: "#00bcd4",
      boxShadow: "0 0 0 0.2rem rgba(0, 188, 212, 0.3)",
      color: "#ffffff",
    },
  };

  const buttonStyle = {
    background: "linear-gradient(45deg, #00bcd4 30%, #2196f3 90%)",
    border: "none",
    fontWeight: "bold",
    padding: "10px 0", // ✅ PERUBAHAN: Padding vertikal lebih kecil
    borderRadius: "8px",
    transition: "all 0.3s ease",
    letterSpacing: "1px",
    textTransform: "uppercase",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 20px rgba(0, 188, 212, 0.5)",
    },
    "&:disabled": {
      background: "#6c757d",
      opacity: 0.7,
      transform: "none",
      boxShadow: "none",
    },
  };

  const linkTextStyle = {
    color: "#00bcd4",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.3s ease",
    "&:hover": {
      textDecoration: "underline",
      color: "#2196f3",
    },
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <h3 style={titleStyle}>FitHub — Daftar Member</h3>
        {msg && (
          <Alert variant={msg.includes("berhasil") ? "success" : "danger"} className="mb-4 text-center">
            {msg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={formLabelStyle}>Nama Lengkap</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
              style={formControlStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={formLabelStyle}>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email aktif Anda"
              required
              style={formControlStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={formLabelStyle}>Nomor Telepon</Form.Label>
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890 (opsional)"
              style={formControlStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={formLabelStyle}>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Buat password yang kuat"
              required
              style={formControlStyle}
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" disabled={isLoading} style={buttonStyle}>
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Mendaftar...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3 text-white-50"> {/* ✅ PERUBAHAN: Jarak bawah link lebih kecil */}
          Sudah punya akun? <Link to="/login" style={linkTextStyle}>Login di sini</Link>
          <br />
          <Link to="/" style={linkTextStyle}>Kembali ke Beranda</Link>
        </div>
      </Card>
    </div>
  );
}