// App.jsx
import Dashboard from "./pages/Dashboard"
import Results from "./pages/Results"
import Upload from "./pages/Upload"
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="upload" element={<Upload/>}/>
        <Route path="results" element={<Results/>}/>
      </Route>
    </Routes>
    </BrowserRouter>

  );
}

export default App;