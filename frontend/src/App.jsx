// App.jsx
import Home from "./pages/Home"
import Results from "./pages/Results"
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="results" element={<Results/>}/>
      </Route>
    </Routes>
    </BrowserRouter>

  );
}

export default App;