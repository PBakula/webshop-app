import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import {
  FaShoppingCart,
  FaUserCircle,
  FaListAlt,
  FaUserCog,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  console.log("Trenutni korisnik:", user);
  console.log("Je li autentificiran:", isAuthenticated);
  console.log("Korisnička uloga:", user?.role?.name);
  const isUserRole = user?.role?.name === "USER";

  console.log("Je li USER uloga:", isUserRole);
  const isUser = user && user.role && user.role.name === "USER";
  const isAdmin = user && user.role && user.role.name === "ADMIN";

  // Za debugiranje
  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      console.log("User role:", user.role?.name);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
    }
  };

  return (
    <Navbar bg="light" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          WEB SHOP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Admin linkovi - prikazuju se samo za admin korisnike */}
            {isAuthenticated && isAdmin && (
              <NavDropdown
                title={
                  <div className="d-inline">
                    <FaUserCog size={20} className="me-2" />
                    Admin
                  </div>
                }
                id="admin-dropdown"
              >
                <NavDropdown.Item as={Link} to="/admin/categories">
                  <FaListAlt size={18} className="me-2" /> Categories edit
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/products">
                  <FaListAlt size={18} className="me-2" /> Products edit
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/admin/history-log">
                  <FaListAlt size={18} className="me-2" /> History Log
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/request-log">
                  <FaListAlt size={18} className="me-2" /> Request Log
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orders">
                  <FaListAlt size={18} className="me-2" /> Orders
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {/* Prikazi link na narudžbe samo ako je korisnik prijavljen s ulogom USER */}
            {isAuthenticated && isUser && (
              <Nav.Link as={Link} to="/orders">
                <FaListAlt size={20} className="me-2" /> My orders
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/cart">
              <FaShoppingCart size={20} />
            </Nav.Link>

            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout}>
                <FaUserCircle size={20} className="me-2" />
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                <FaUserCircle size={20} className="me-2" />
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
