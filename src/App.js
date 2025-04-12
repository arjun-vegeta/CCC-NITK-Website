import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import FacilitiesIndex from './pages/FacilitiesIndex';
import FacilitiesPost from './pages/FacilitiesPost';
import HowToIndex from './pages/HowtoIndex';  
import HowToPost from './pages/HowtoPost';    
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* About Us */}
        <Route path="/about" element={<AboutUs />} />

        {/* Facilities */}
        <Route path="/facilities">
          <Route index element={<FacilitiesIndex />} />
          <Route path="*" element={<FacilitiesPost />} />
        </Route>

        {/* Network Guides */}
        <Route path="/howto">
          <Route index element={<HowToIndex />} />
          <Route path=":slug" element={<HowToPost />} />
        </Route>

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
