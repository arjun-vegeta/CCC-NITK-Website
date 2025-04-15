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
import Footer from './components/Footer';
import { DarkModeProvider } from './utils/DarkModeContext';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 dark-transition">
          <Navbar />
          <main className="flex-grow">
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
              <Route path="/guides">
                <Route index element={<NetworkGuidesIndex />} />
                <Route path=":slug" element={<NetworkGuidesPost />} />
              </Route>

              {/* Contact */}
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
