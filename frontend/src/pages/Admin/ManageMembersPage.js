import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap";
import memberService from "../../services/memberService";
import bgMembers from "../../assets/images/9.jpeg";
import moment from "moment";

const glassCard = {
  background: "rgba(30,30,30,0.65)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#f8f9fa",
  padding: "20px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

const ManageMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "Nonaktif",
    password: "",
    packageName: "",
    startDate: "",
    endDate: "",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await memberService.getAllMembers();
      setMembers(res.data);
      setFilteredMembers(res.data);
    } catch (err) {
      setError("Gagal memuat data anggota.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredMembers(members);
    } else {
      const lower = search.toLowerCase();
      setFilteredMembers(
        members.filter(
          (m) =>
            m.fullName.toLowerCase().includes(lower) ||
            m.email.toLowerCase().includes(lower) ||
            m.phone.includes(lower) ||
            (m.membership?.packageName || "").toLowerCase().includes(lower)
        )
      );
    }
  }, [search, members]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleShowModal = (member = null) => {
    setEditingMember(member);
    if (member) {
      const membership = member.membership || {};
      setFormData({
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        status: membership.status || "Nonaktif",
        password: "",
        packageName: membership.packageName || "",
        startDate: membership.startDate ? moment(membership.startDate).format("YYYY-MM-DD") : "",
        endDate: membership.endDate ? moment(membership.endDate).format("YYYY-MM-DD") : "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        status: "Nonaktif",
        password: "",
        packageName: "",
        startDate: "",
        endDate: "",
      });
    }
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Nama, email, dan telepon wajib diisi.");
      setIsSaving(false);
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Format email tidak valid.");
        setIsSaving(false);
        return;
    }

    if (!editingMember && !formData.password) {
        setError("Password wajib diisi untuk anggota baru.");
        setIsSaving(false);
        return;
    }

    if (formData.packageName && (!formData.startDate || !formData.endDate)) {
      setError("Tanggal mulai dan berakhir wajib diisi untuk paket.");
      setIsSaving(false);
      return;
    }
    if (formData.startDate && formData.endDate && moment(formData.startDate).isAfter(moment(formData.endDate))) {
        setError("Tanggal mulai tidak boleh setelah tanggal berakhir.");
        setIsSaving(false);
        return;
    }

    try {
      const membershipData = {
        status: formData.status,
        packageName: formData.packageName || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (!editingMember) {
        const memberData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          membership: membershipData,
        };
        await memberService.createMember(memberData);
        setSuccess("✅ Anggota berhasil ditambahkan.");
      } else {
        const updatePayload = {
          fullName: formData.fullName,
          phone: formData.phone,
          membership: membershipData,
        };

        // Hanya kirimkan password jika diisi
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        
        // Hanya kirimkan email jika diubah
        if (formData.email !== editingMember.email) {
            updatePayload.email = formData.email;
        }

        await memberService.updateMember(editingMember.id, updatePayload);
        setSuccess("✅ Data anggota berhasil diperbarui.");
      }

      fetchMembers();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;
    setError("");
    setSuccess("");
    try {
      await memberService.deleteMember(id);
      setSuccess("✅ Anggota berhasil dihapus.");
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus anggota.");
    }
  };

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowProfile(true);
  };

  const formatID = (id) => String(id).padStart(4, "0");

  return (
    <div
      className="container-fluid p-4 min-vh-100 d-flex flex-column"
      style={{ background: `url(${bgMembers}) no-repeat center center/cover` }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-light shadow-sm">👥 Manajemen Anggota</h3>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Form.Control
            type="text"
            placeholder="Cari nama, email, telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-pill px-3"
          />
          <Button variant="primary" onClick={() => handleShowModal()} className="rounded-pill shadow-sm">
            <i className="bi bi-plus-circle me-2"></i> Tambah Anggota
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      {success && <Alert variant="success" className="text-center">{success}</Alert>}

      <div style={glassCard} className="table-responsive">
        <Table hover responsive className="align-middle text-light">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.08)" }}>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Paket</th>
              <th>Masa Berlaku</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center">
                  <Spinner animation="border" variant="light" />
                  <p className="mt-2">Memuat data...</p>
                </td>
              </tr>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <tr key={m.id} style={{ transition: "0.3s" }}>
                  <td>{formatID(m.id)}</td>
                  <td>{m.fullName}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{m.membership?.packageName || "-"}</td>
                  <td>
                    {m.membership
                      ? `${moment(m.membership.startDate).format("DD MMM YYYY")} - ${moment(m.membership.endDate).format("DD MMM YYYY")}`
                      : "-"}
                  </td>
                  <td>
                    <Badge
                      bg={
                        m.membership?.status === "Aktif"
                          ? "success"
                          : m.membership?.endDate && moment(m.membership.endDate).isBefore(moment())
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {m.membership?.status || "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleViewProfile(m)}>
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(m)}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(m.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">Tidak ada data anggota.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingMember ? "✏️ Edit Anggota" : "➕ Tambah Anggota"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telepon</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Form.Group>
            {editingMember ? (
                <Form.Group className="mb-3">
                    <Form.Label>Password (Biarkan kosong jika tidak diubah)</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </Form.Group>
            ) : (
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Paket</Form.Label>
              <Form.Control
                type="text"
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </Form.Select>
            </Form.Group>
            <div className="row">
              <div className="col">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Mulai</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Berakhir</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? (
                    <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                        Menyimpan...
                    </>
                ) : (
                    "Simpan"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>👤 Profil Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember ? (
            <div className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${selectedMember.fullName}&background=random&color=fff`}
                alt="avatar"
                className="rounded-circle mb-3"
                style={{ width: "100px", height: "100px" }}
              />
              <h5>{selectedMember.fullName}</h5>
              <p className="text-muted">{selectedMember.email}</p>
              <p>📞 {selectedMember.phone}</p>
              <hr />
              <p><strong>Paket:</strong> {selectedMember.membership?.packageName || "-"}</p>
              <p><strong>Masa Berlaku:</strong> {selectedMember.membership ? `${moment(selectedMember.membership.startDate).format("DD MMM YYYY")} - ${moment(selectedMember.membership.endDate).format("DD MMM YYYY")}` : "-"}</p>
              <p>
                <Badge bg={selectedMember.membership?.status === "Aktif" ? "success" : "secondary"}>
                  {selectedMember.membership?.status || "Nonaktif"}
                </Badge>
              </p>
            </div>
          ) : (
            <p>Data anggota tidak ditemukan.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageMembersPage;