import React from 'react'
import Dashboard from "./pages/Dashboard"
import Results from "./pages/Results"
import Upload from "./pages/Upload"
import Layout from "./Layout"
import { BrowserRouter,Routes,Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
            <Route index element={<Dashboard />} />
            <Route path="/Upload" element={<Upload />} />
            <Route path="/Results" element={<Results />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


