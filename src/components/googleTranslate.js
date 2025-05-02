import React, { useState, useEffect } from 'react';

const GoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Google Translate script once on component mount
  useEffect(() => {
    // Create hidden container for Google Translate
    if (!document.getElementById('google_translate_element')) {
      const element = document.createElement('div');
      element.id = 'google_translate_element';
      element.style.display = 'none';
      document.body.appendChild(element);
    }

    // Initialize Google Translate
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false
          },
          'google_translate_element'
        );
        setIsScriptLoaded(true);
      };

      // Load the script
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Cookie-based translation method - most reliable across Google Translate versions
  const translatePage = (targetLang) => {
    try {
      // First, clear any existing translation cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      
      if (targetLang !== 'en') {
        // Set the translation cookie to the target language
        document.cookie = `googtrans=/en/${targetLang}; path=/`;
        document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
      }
      
      // Force page reload to apply translation
      window.location.reload();
      return true;
    } catch (e) {
      console.error('Translation error:', e);
      return false;
    }
  };

  // Apply initial translation if needed
  useEffect(() => {
    if (isScriptLoaded && currentLanguage !== 'en') {
      // Short delay to ensure Google Translate is fully initialized
      const timer = setTimeout(() => {
        if (document.cookie.indexOf('googtrans=/en/hi') === -1) {
          translatePage(currentLanguage);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isScriptLoaded, currentLanguage]);

  const toggleLanguage = () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    const newLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    
    // Update state and localStorage
    setCurrentLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    
    // Translate the page
    translatePage(newLanguage);
    
    // Reset translating state after a delay
    // (though the page will reload anyway)
    setTimeout(() => setIsTranslating(false), 1000);
  };

  return (
    <div className="translate-container relative">
      <button 
        onClick={toggleLanguage}
        disabled={isTranslating || !isScriptLoaded}
        className={`px-0 pr-4 py-1 translate-y-[1px] rounded-md text-base font-medium text-white hover:text-green-400 transition-colors duration-300 ${
          isTranslating || !isScriptLoaded ? 'opacity-70' : ''
        }`}
        style={{ minWidth: '60px' }}
        aria-label={currentLanguage === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      >
        {isTranslating ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <span translate="no">{currentLanguage === 'en' ? 'हिंदी' : 'English'}</span>
        )}
      </button>
      
      {/* Hidden element for Google Translate */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
};

export default GoogleTranslate;