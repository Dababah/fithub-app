import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { loginMember, loginAdmin } from "../../services/authService";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import gymBackground from '../../assets/images/9.jpeg';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    setErr(null);
    setIsLoading(true);

    if (!emailOrUsername || !password) {
      setErr("Email / Username dan Password wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      let res;
      if (role === "member") {
        res = await loginMember({ email: emailOrUsername, password });
      } else {
        res = await loginAdmin({ username: emailOrUsername, password });
      }

      // ✅ PERUBAHAN UTAMA: Kirim seluruh objek respons ke fungsi `login`
      // Asumsi: Respon dari API berisi { token, role, name, ... } atau { token, role, username, ... }
      login(res);

      // ✅ Navigasi akan dilakukan di dalam AuthProvider, jadi baris ini bisa dihapus atau dipertahankan
      // jika Anda memiliki logika navigasi yang berbeda.
      // navigate(role === "admin" ? "/admin" : "/member");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login gagal, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  // --- Gaya/layout tidak diubah ---
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
    maxWidth: 380, 
    padding: 25, 
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
    marginBottom: "20px", 
    textShadow: "0 0 10px rgba(0, 188, 212, 0.5)",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "700",
  };

  const formLabelStyle = {
    color: "#adb5bd",
    fontWeight: "600",
    fontSize: "0.85rem", 
    marginBottom: "0.1rem", 
  };

  const formControlStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#e9ecef",
    padding: "0.5rem 0.7rem", 
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
    padding: "9px 0", 
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
        <h3 style={titleStyle}>FitHub — Login</h3>
        {err && <Alert variant="danger" className="mb-3 text-center">{err}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label style={formLabelStyle}>Email / Username</Form.Label>
            <Form.Control
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder={role === "member" ? "Masukkan email Anda" : "Masukkan username Anda"}
              required
              style={formControlStyle}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={formLabelStyle}>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              required
              style={formControlStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={formLabelStyle}>Login sebagai</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} style={formControlStyle}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 mb-3" 
            disabled={isLoading} 
            style={buttonStyle}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3 text-white-50">
          Belum punya akun? <Link to="/register" style={linkTextStyle}>Daftar sekarang</Link>
          <hr style={{borderColor: "rgba(255, 255, 255, 0.2)", margin: "1rem 0"}} />
          <Link to="/" style={linkTextStyle}>Kembali ke Beranda</Link>
        </div>
      </Card>
    </div>
  );
}