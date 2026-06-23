import {Link} from "react-router-dom"
import "./Navbar.css";

export default function Navbar() {
  return (
       <nav>
        <h2>SilverOAK Automation website</h2>
        <div>
            <Link to="/">Home</Link>
            <Link to="/results">Results</Link>
        </div>
       </nav>

  );
}
