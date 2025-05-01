import React, { useEffect, useRef, useState } from 'react';


const GoogleTranslate = () => {
  const translateRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Default to English

  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=initGoogleTranslate';
      script.async = true;
      document.body.appendChild(script);
    };

    window.initGoogleTranslate = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
        },
        'google_translate_element' // Hidden div still needs to be in the DOM
      );
    };

    if (!window.google || !window.google.translate) {
      loadGoogleTranslateScript();
    } else {
      window.initGoogleTranslate();
    }
  }, []);

  // Function to programmatically switch language to Hindi
  const switchToHindi = () => {
    const dropdown = document.querySelector('.goog-te-combo');
    if (dropdown) {
      dropdown.value = 'hi';
      dropdown.dispatchEvent(new Event('change'));
      setCurrentLanguage('hi');
    }
  };

  // Function to programmatically switch language to English
  const switchToEnglish = () => {
    const dropdown = document.querySelector('.goog-te-combo');
    if (dropdown) {
      dropdown.value = 'en';
      dropdown.dispatchEvent(new Event('change'));
      setCurrentLanguage('en');

      // Execute the switch to English again after a 100ms timeout
      setTimeout(() => {
        dropdown.value = 'en';
        dropdown.dispatchEvent(new Event('change'));
      }, 100);
    }
  };

  // Button label and click handler based on current language
  const isEnglish = currentLanguage === 'en';
  const buttonLabel = isEnglish ? 'हिंदी' : 'English';
  const handleClick = isEnglish ? switchToHindi : switchToEnglish;

  return (
    <div>
      {/* Hidden Google Translate Widget */}
      <div id="google_translate_element" ref={translateRef}></div>

    
      <div className="text-[17px] font-normal text-[#192F59]" translate="no">
        <button onClick={handleClick} style={{ display: 'flex', alignItems: 'center' }}>
          <i className="fa fa-language mr-2" aria-hidden="true"></i>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default GoogleTranslate;
