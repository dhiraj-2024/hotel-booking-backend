import React from "react";
// import logo from '../../imageall/logo.jpeg';
import logo2 from "../MAG_WAG_booking_compnents/imageall/logo_transperent.png";
// import logopune from "../MAG_WAG_booking_compnents/imageall/punelogo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        
        <Link to="/">
          <img src={logo2} alt="Logo" style={styles.logo} />
        </Link>
        {/* <Link><img src={logopune} alt="Logo" style={styles.logop}/></Link> */}
      </div>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        <a href="/" style={styles.navLink}>
          Home
        </a>
        <a href="/contact" style={styles.navLink}>
          Contact us
        </a>
        <a href="/terms" style={styles.navLink}>
          T&C
        </a>
      </nav>
    </header>
  );
};

// Inline CSS Styles
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "black",
    color: "white",
    borderBottom: "0.4px dotted  gray",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    width: "full",
    height: "70px",
    zIndex: 1000,
  },
  logoContainer: {
    flex: 1,
  },
  a: {
    Cursor: "pointer",
  },
  logo: {
    height: "50px",
    width: "auto",
  },
  // logop: {
  //   height: "80px",
  //   width: "auto",
  // },
  nav: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s, color 0.3s",
  },
  "@media (max-width: 768px)": {
    header: {
      flexDirection: "column",
      padding: "10px",
    },
    nav: {
      marginTop: "10px",
      flexDirection: "column",
      gap: "10px",
    },
    navLink: {
      fontSize: "14px",
    },
  },
};

export default Header;
