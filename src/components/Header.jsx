import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img
          src="/fairmind-logo.png"
          alt="Fairmind Logo"
          className="logo"
        />
      </div>
      <h1>AI Information Extractor</h1>
      <div className="logo-container">
        <img
          src="/davines-logo.svg"
          alt="Daviness Logo"
          className="logo"
        />
      </div>
    </header>
  );
};

export default Header; 