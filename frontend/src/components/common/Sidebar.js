// frontend/src/components/common/Sidebar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import {
  HouseDoor,
  People,
  ClipboardCheck,
  BarChart,
  PersonCircle,
  QrCodeScan
} from "react-bootstrap-icons";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = {
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: <HouseDoor /> },
      { path: "/admin/members", label: "Anggota", icon: <People /> },
      { path: "/admin/reports", label: "Laporan", icon: <BarChart /> },
    ],
    member: [
      { path: "/member/dashboard", label: "Dashboard", icon: <HouseDoor /> },
      { path: "/member/profile", label: "Profil", icon: <PersonCircle /> },
      { path: "/member/checkin", label: "Check-in", icon: <QrCodeScan /> },
      { path: "/member/attendance", label: "Kehadiran", icon: <ClipboardCheck /> },
    ],
  };

  if (!user) return null;

  return (
    <div className="d-flex flex-column bg-dark text-light p-3 vh-100" style={{ width: "240px" }}>
      <h4 className="text-center mb-4">FitHub</h4>
      <ListGroup variant="flush">
        {menuItems[user.role]?.map((item) => (
          <ListGroup.Item
            key={item.path}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center bg-dark text-light border-0 py-2 ${
              location.pathname === item.path ? "fw-bold bg-secondary" : ""
            }`}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
