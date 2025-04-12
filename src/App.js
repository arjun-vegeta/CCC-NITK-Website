import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import Home from './pages/Home';
import HowtoIndex from './pages/HowtoIndex';
import HowtoPost from './pages/HowtoPost';
import FacilitiesIndex from './pages/FacilitiesIndex';
import FacilitiesPost from './pages/FacilitiesPost';
import PoliciesIndex from './pages/PoliciesIndex';
import PoliciesPost from './pages/PoliciesPost';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter> {/* Wrap everything inside BrowserRouter */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/howto">
          <Route index element={<HowtoIndex />} />
          <Route path=":slug" element={<HowtoPost />} />
        </Route>
        <Route path="/facilities">
          <Route index element={<FacilitiesIndex />} />
          <Route path="*" element={<FacilitiesPost />} />
        </Route>
        <Route path="/policies">
          <Route index element={<PoliciesIndex />} />
          <Route path=":slug" element={<PoliciesPost />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter> 
  );
}

export default App;
