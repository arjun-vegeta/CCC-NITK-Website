import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import FacilitiesIndex from './pages/FacilitiesIndex';
import FacilitiesPost from './pages/FacilitiesPost';
import NetworkGuidesIndex from './pages/NetworkGuidesIndex';
import NetworkGuidesPost from './pages/NetworkGuidesPost';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import NavbarTest from './components/NavbarTest';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter> {/* Wrap everything inside BrowserRouter */}
      {/* Add min-h-screen to the body or a parent wrapper to ensure scrolling */}
      <div className="min-h-screen">
        {/* <Navbar /> */}
        <NavbarTest />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* About Us */}
          <Route path="/about-us" element={<AboutUs />} />

          {/* Facilities */}
          <Route path="/facilities">
            <Route index element={<FacilitiesIndex />} />
            <Route path="*" element={<FacilitiesPost />} />
          </Route>

          {/* Network Guides */}
          <Route path="/network-guides">
            <Route index element={<NetworkGuidesIndex />} />
            <Route path=":slug" element={<NetworkGuidesPost />} />
          </Route>

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
