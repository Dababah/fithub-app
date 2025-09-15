import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
// Pastikan komponen-komponen ini diekspor dengan "export default"
import AttendanceChart from "../../components/dashboard/AttendanceChart";
import MemberTable from "../../components/dashboard/MemberTable";
import memberService from "../../services/memberService";
import * as attendanceService from "../../services/attendanceService";
import bgMembers from "../../assets/images/9.jpeg";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States untuk modal
  const [qrModal, setQrModal] = useState({ show: false, member: null });
  const [detailModal, setDetailModal] = useState({ show: false, member: null });
  const [attendanceModal, setAttendanceModal] = useState({
    show: false,
    members: [],
    date: "",
  });

  const baseCardStyle = {
    borderRadius: "20px",
    background: "rgba(20, 20, 20, 0.65)",
    backdropFilter: "blur(12px)",
    color: "#f8f9fa",
    transition: "all 0.3s ease-in-out",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
  };

  const hoverEffect = {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardRes] = await Promise.all([
        memberService.getDashboardData(),
      ]);
      setDashboardData(dashboardRes.data);
    } catch (e) {
      console.error(
        "Error fetching dashboard data:",
        e.response?.data?.message || e.message
      );
      if (e.response?.status === 403) {
        setError("Akses ditolak. Pastikan Anda login sebagai Admin.");
      } else {
        setError("Gagal memuat data dasbor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openAttendanceModal = async () => {
    try {
      const res = await memberService.getAllMembers();
      const membersWithAttendedStatus = res.data.members.map((member) => ({
        ...member,
        attended: false,
      }));
      setAttendanceModal({
        show: true,
        members: membersWithAttendedStatus,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (e) {
      setError("Gagal memuat daftar anggota.");
    }
  };

  const handleAttendanceChange = (memberId) => {
    setAttendanceModal((prevState) => {
      const members = prevState.members.map((member) =>
        member.id === memberId
          ? { ...member, attended: !member.attended }
          : member
      );
      return { ...prevState, members };
    });
  };

  const saveAttendance = async () => {
    setIsSubmitting(true);
    try {
      const attendees = attendanceModal.members.filter((m) => m.attended);
      await attendanceService.recordAttendance(
        attendanceModal.date,
        attendees.map((m) => m.id)
      );
      setAttendanceModal({ show: false, members: [], date: "" });
      fetchData();
    } catch (e) {
      console.error("Failed to save attendance:", e);
      setError("Gagal menyimpan data kehadiran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{
          background: `url(${bgMembers}) no-repeat center center/cover`,
        }}
      >
        <Spinner animation="border" variant="light" />
        <p className="mt-3 text-light">Memuat data dasbor...</p>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="p-4 min-vh-100"
      style={{
        background: `url(${bgMembers}) no-repeat center center/cover`,
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          borderRadius: "20px",
          padding: "2rem",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h3
            className="fw-bold text-light"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}
          >
            📊 Admin Dashboard
          </h3>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Button
              variant="outline-info"
              onClick={openAttendanceModal}
              className="rounded-pill shadow-sm"
            >
              <i className="bi bi-person-check me-1"></i> Kelola Kehadiran
            </Button>
            <Button
              variant="outline-light"
              onClick={fetchData}
              className="rounded-pill shadow-sm"
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/members")}
              className="rounded-pill shadow-sm"
            >
              <i className="bi bi-people-fill me-1"></i> Kelola Anggota
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {/* METRIK */}
        <Row className="g-4 mb-4">
          {[
            {
              label: "Total Anggota",
              value: dashboardData.totalMembers,
              color: "#0d6efd",
              icon: "bi-people",
            },
            {
              label: "Anggota Aktif",
              value: dashboardData.activeMembers,
              color: "#28a745",
              icon: "bi-check-circle",
            },
            {
              label: "Anggota Nonaktif",
              value: dashboardData.inactiveMembers,
              color: "#ffc107",
              icon: "bi-x-circle",
            },
          ].map((item, i) => (
            <Col md={4} key={i}>
              <Card
                className="p-4 h-100 shadow-sm text-center"
                style={{
                  ...baseCardStyle,
                  borderLeft: `6px solid ${item.color}`,
                }}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, {
                    ...baseCardStyle,
                    ...hoverEffect,
                    borderLeft: `6px solid ${item.color}`,
                  })
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, {
                    ...baseCardStyle,
                    borderLeft: `6px solid ${item.color}`,
                  })
                }
              >
                <i
                  className={`bi ${item.icon} display-6 mb-2`}
                  style={{ color: item.color }}
                ></i>
                <h5 style={{ color: item.color }}>{item.label}</h5>
                <h1 className="display-5 fw-bold">{item.value}</h1>
              </Card>
            </Col>
          ))}
        </Row>

        {/* GRAFIK & TABEL */}
        <Row className="g-4">
          <Col lg={6}>
            <Card className="p-4 h-100 shadow-sm" style={baseCardStyle}>
              <h5 className="mb-3 text-light">📈 Kehadiran Mingguan</h5>
              {dashboardData.weeklyAttendance && (
                <AttendanceChart data={dashboardData.weeklyAttendance} />
              )}
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="p-4 h-100 shadow-sm" style={baseCardStyle}>
              <h5 className="mb-3 text-light">👥 Anggota Terbaru</h5>
              {dashboardData.latestMembers && (
                <MemberTable
                  members={dashboardData.latestMembers}
                  onShowQR={(member) => setQrModal({ show: true, member })}
                  onShowDetail={(member) =>
                    setDetailModal({ show: true, member })
                  }
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* MODAL QR CODE */}
      <Modal
        show={qrModal.show}
        onHide={() => setQrModal({ show: false, member: null })}
        centered
        style={{ backdropFilter: "blur(5px)" }}
      >
        <Modal.Header closeButton className="bg-dark text-light border-0">
          <Modal.Title>QR Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light text-center">
          {qrModal.member && (
            <>
              <h5>{qrModal.member.name}</h5>
              <p className="text-muted">ID: {qrModal.member.id}</p>
              <div className="p-3 bg-light rounded d-inline-block">
                {/* Menampilkan QR Code dari backend */}
                <img
                  src={`http://localhost:4000/api/uploads/qr_codes/qr_member_1.png/${qrModal.member.id}`}
                  alt={`QR Code ${qrModal.member.name}`}
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              <p className="mt-3 text-muted">Scan untuk check-in/check-out</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button
            variant="secondary"
            onClick={() => setQrModal({ show: false, member: null })}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DETAIL ANGGOTA */}
      <Modal
        show={detailModal.show}
        onHide={() => setDetailModal({ show: false, member: null })}
        centered
        style={{ backdropFilter: "blur(5px)" }}
      >
        <Modal.Header closeButton className="bg-dark text-light border-0">
          <Modal.Title>Detail Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light text-center">
          {detailModal.member && (
            <div className="d-flex flex-column align-items-center">
              <img
                src={detailModal.member.profileImageUrl || "placeholder.jpeg"}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <h4 className="fw-bold">{detailModal.member.name}</h4>
              <p className="text-muted mb-1">{detailModal.member.email}</p>
              <p className="text-muted mb-3">
                {detailModal.member.phone_number}
              </p>
              <hr className="w-100 bg-secondary" />
              <div className="text-start w-100">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      detailModal.member.status === "active"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {detailModal.member.status}
                  </span>
                </p>
                <p>
                  <strong>Bergabung:</strong>{" "}
                  {new Date(detailModal.member.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button
            variant="secondary"
            onClick={() => setDetailModal({ show: false, member: null })}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL KELOLA KEHADIRAN HARIAN */}
      <Modal
        show={attendanceModal.show}
        onHide={() =>
          setAttendanceModal({ show: false, members: [], date: "" })
        }
        centered
        style={{ backdropFilter: "blur(5px)" }}
      >
        <Modal.Header closeButton className="bg-dark text-light border-0">
          <Modal.Title>Kelola Kehadiran</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {Array.isArray(attendanceModal.members) &&
            attendanceModal.members.map((member) => (
              <div
                key={member.id}
                className="d-flex justify-content-between align-items-center py-2 border-bottom"
              >
                <span>{member.name}</span>
                <Form.Check
                  type="switch"
                  id={`switch-${member.id}`}
                  label={member.attended ? "Hadir" : "Tidak Hadir"}
                  checked={member.attended}
                  onChange={() => handleAttendanceChange(member.id)}
                />
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button
            variant="secondary"
            onClick={() =>
              setAttendanceModal({ show: false, members: [], date: "" })
            }
          >
            Batal
          </Button>
          <Button
            variant="success"
            onClick={saveAttendance}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Simpan"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}