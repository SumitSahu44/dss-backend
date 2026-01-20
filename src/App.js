import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddBlog from "./pages/AddBlog";

function App() {
  return (
    <BrowserRouter basename="/surendraadmin">
      <Routes>
        <Route path="/" element={<AddBlog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
