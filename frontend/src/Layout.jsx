import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

import "./Layout.css";

function Layout() {
     return (
      <div className="layout">
        <Navbar />
        <main className="content">
            <Outlet />
        </main>
    </div>
  );
}

export default Layout;