import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Badge,
  InputGroup,
} from "react-bootstrap";
import memberService from "../../services/memberService";
import bgMembers from "../../assets/images/9.jpeg";
import moment from "moment";
const glassCard = {
  background: "rgba(30,30,30,0.75)",
  backdropFilter: "blur(15px)",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#f8f9fa",
  padding: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
  maxHeight: "75vh",
  overflowY: "auto",
};

const ManageMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
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

  // Fetch members from API
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

  // Filter members based on search input
  useEffect(() => {
    if (!search.trim()) {
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

  // Auto-clear alerts after 5 seconds
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

  // Open modal for add or edit member
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
        startDate: membership.startDate
          ? moment(membership.startDate).format("YYYY-MM-DD")
          : "",
        endDate: membership.endDate
          ? moment(membership.endDate).format("YYYY-MM-DD")
          : "",
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

  // Validate and save member data (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    // Basic validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
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

    if (
      formData.packageName &&
      (!formData.startDate || !formData.endDate)
    ) {
      setError("Tanggal mulai dan berakhir wajib diisi untuk paket.");
      setIsSaving(false);
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      moment(formData.startDate).isAfter(moment(formData.endDate))
    ) {
      setError("Tanggal mulai tidak boleh setelah tanggal berakhir.");
      setIsSaving(false);
      return;
    }

    try {
      // Siapkan data keanggotaan (membership)
      const membershipData = {
        status: formData.status,
        packageName: formData.packageName || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (editingMember) {
        // ✅ Update existing member
        const updatePayload = {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          membership: membershipData,
        };

        // Tambahkan password hanya jika diisi
        if (formData.password) {
          updatePayload.password = formData.password;
        }

        // Tambahkan email hanya jika diubah
        if (formData.email.trim() !== editingMember.email) {
          updatePayload.email = formData.email.trim();
        }

        await memberService.updateMember(editingMember.id, updatePayload);
        setSuccess("✅ Data anggota berhasil diperbarui.");
      } else {
        // ✅ Create new member
        const memberData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          membership: membershipData,
        };
        await memberService.createMember(memberData);
        setSuccess("✅ Anggota berhasil ditambahkan.");
      }

      fetchMembers();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete member with confirmation
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

  // Show member profile modal
  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowProfile(true);
  };

  // Download PDF report
  const handlePrintReport = async () => {
    setIsPrinting(true);
    try {
      const response = await memberService.getMembersPdfReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "laporan-anggota.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess("✅ Laporan PDF berhasil dibuat dan diunduh.");
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("❌ Gagal membuat laporan PDF.");
    } finally {
      setIsPrinting(false);
    }
  };

  // Format ID with leading zeros
  const formatID = (id) => String(id).padStart(4, "0");

  return (
    <div
      className="container-fluid p-4 min-vh-100 d-flex flex-column"
      style={{
        background: `url(${bgMembers}) no-repeat center center/cover`,
        backgroundSize: "cover",
      }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h3 className="fw-bold text-light shadow-sm">👥 Manajemen Anggota</h3>
        <InputGroup className="w-100 w-md-auto">
          <Form.Control
            type="search"
            placeholder="Cari nama, email, telepon, paket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search members"
            className="rounded-pill"
          />
          <Button
            variant="info"
            onClick={handlePrintReport}
            disabled={isPrinting}
            className="ms-2 rounded-pill shadow-sm"
            title="Cetak Laporan PDF"
          >
            {isPrinting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Mencetak...
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-pdf me-2"></i> Cetak Laporan
              </>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={() => handleShowModal()}
            className="ms-2 rounded-pill shadow-sm"
            title="Tambah Anggota Baru"
          >
            <i className="bi bi-plus-circle me-2"></i> Tambah Anggota
          </Button>
        </InputGroup>
      </div>

      {error && (
        <Alert variant="danger" className="text-center shadow-sm">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="text-center shadow-sm">
          {success}
        </Alert>
      )}

      <div style={glassCard} className="table-responsive shadow-sm">
        <Table
          hover
          responsive
          className="align-middle text-light"
          style={{ minWidth: "900px" }}
        >
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)" }}>
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
                <td colSpan={8} className="text-center py-5">
                  <Spinner animation="border" variant="light" />
                  <div className="mt-2">Memuat data...</div>
                </td>
              </tr>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <tr
                  key={m.id}
                  style={{ transition: "background-color 0.3s ease" }}
                  className="align-middle"
                >
                  <td>{formatID(m.id)}</td>
                  <td>{m.fullName}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{m.membership?.packageName || "-"}</td>
                  <td>
                    {m.membership
                      ? `${moment(m.membership.startDate).format(
                          "DD MMM YYYY"
                        )} - ${moment(m.membership.endDate).format("DD MMM YYYY")}`
                      : "-"}
                  </td>
                  <td>
                    <Badge
                      bg={
                        m.membership?.status === "Aktif"
                          ? "success"
                          : m.membership?.endDate &&
                            moment(m.membership.endDate).isBefore(moment())
                          ? "danger"
                          : "secondary"
                      }
                      className="text-uppercase"
                    >
                      {m.membership?.status || "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewProfile(m)}
                      title="Lihat Profil"
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(m)}
                      title="Edit Anggota"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(m.id)}
                      title="Hapus Anggota"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  Tidak ada data anggota.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal Tambah/Edit Anggota */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMember ? "✏️ Edit Anggota" : "➕ Tambah Anggota"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSave} noValidate>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Nama Lengkap *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Telepon *</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Masukkan nomor telepon"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>
                Password {editingMember ? "(Biarkan kosong jika tidak diubah)" : "*"}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={
                  editingMember
                    ? "Masukkan password baru jika ingin mengubah"
                    : "Masukkan password"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                {...(!editingMember && { required: true })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="packageName">
              <Form.Label>Paket</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama paket"
                value={formData.packageName}
                onChange={(e) =>
                  setFormData({ ...formData, packageName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </Form.Select>
            </Form.Group>

            <div className="row g-3">
              <Form.Group className="col-md-6" controlId="startDate">
                <Form.Label>Tanggal Mulai</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="col-md-6" controlId="endDate">
                <Form.Label>Tanggal Berakhir</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </Form.Group>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
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

      {/* Modal Profil Anggota */}
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
              <p>
                <strong>Paket:</strong> {selectedMember.membership?.packageName || "-"}
              </p>
              <p>
                <strong>Masa Berlaku:</strong>{" "}
                {selectedMember.membership
                  ? `${moment(selectedMember.membership.startDate).format("DD MMM YYYY")} - ${moment(
                      selectedMember.membership.endDate
                    ).format("DD MMM YYYY")}`
                  : "-"}
              </p>
              <p>
                <Badge
                  bg={
                    selectedMember.membership?.status === "Aktif"
                      ? "success"
                      : "secondary"
                  }
                >
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