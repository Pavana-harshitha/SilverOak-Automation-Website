import { NavLink } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
    return (
        <aside className="sidebar">

            <h2>SilverOAK</h2>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/upload">
                    Upload
                </NavLink>

                <NavLink to="/results">
                    Results
                </NavLink>

            </nav>

        </aside>
    );
}

export default Navbar;