import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content flex justify-between items-center">

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
                        src="/davines-logo.png"
                        alt="Daviness Logo"
                        className="logo"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header; 