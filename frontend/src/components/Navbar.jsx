import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaTachometerAlt, FaUpload, FaFileAlt } from "react-icons/fa";


export default function Navbar() {
  return (
    <nav className="sidebar">
      <h2>SilverOAK Automation</h2>

      <div className="nav-links">
        <Link to="/">
        <FaTachometerAlt />
          Dashboard
        </Link>
        <Link to="/upload">
        <FaUpload/>
        Upload
        </Link>
        <Link to="/results">
        <FaFileAlt/>
        Results
        </Link>
      </div>
    </nav>
  );
}