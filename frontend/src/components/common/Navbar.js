import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

// Import ikon dari React Icons
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>FitHub</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {user && user.role === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin">
                  <FaTachometerAlt className="me-2" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/members">
                  <FaUsers className="me-2" />
                  Anggota
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/reports">
                  <FaFileAlt className="me-2" />
                  Laporan
                </Nav.Link>
              </>
            )}
            {user && user.role === "member" && (
              <>
                <Nav.Link as={Link} to="/member">
                  <FaTachometerAlt className="me-2" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/member/profile">
                  <FaUserCircle className="me-2" />
                  Profil
                </Nav.Link>
                <Nav.Link as={Link} to="/member/checkin">
                  <FaSignInAlt className="me-2" />
                  Check-in
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown
                title={`Selamat datang, ${user.name || user.username || "Pengguna"}`}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to={user.role === "member" ? "/member/profile" : "/admin"}>
                  <FaUserCircle className="me-2" />
                  Profil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-2" />
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <FaUserPlus className="me-2" />
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;