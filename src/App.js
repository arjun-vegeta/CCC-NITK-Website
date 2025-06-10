import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import FacilitiesIndex from './pages/FacilitiesIndex';
import FacilitiesPost from './pages/FacilitiesPost';
import NetworkGuidesIndex from './pages/NetworkGuidesIndex';
import NetworkGuidesPost from './pages/NetworkGuidesPost';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { DarkModeProvider } from './utils/DarkModeContext';
import AdvancedSearchPage from './components/AdvancedSearchPage';
import PeopleCCC from './pages/People';
import NotFoundPage from './pages/NotFoundPage';
import HighlightAndScroll from './components/HighlightAndScroll';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <HighlightAndScroll />
        <div className="flex flex-col min-h-screen bg-[#f5f5f5] dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100 dark-transition">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Home />} />

              <Route path="/advanced-search" element={<AdvancedSearchPage />} />


              {/* People */}
              <Route path="/people" element={<PeopleCCC/>} />

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

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
