import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <>
    <Navbar/>
    <div className="content">
        <Outlet/>
    </div>
    </>
  );
}
