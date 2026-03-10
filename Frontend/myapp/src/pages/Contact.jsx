import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Contact.css';

const Contact = () => {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="contact-container">
            {/* Navigation Header (Simplified for sub-pages) */}
            <header style={{ background: '#fff', padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <div className="logo"><h1 style={{ fontSize: '1.5rem', color: '#1a73e8', margin: 0 }}>Greenwood Academy</h1></div>
                <nav style={{ display: 'flex', gap: '2rem' }}>
                    <Link to="/home" style={{ textDecoration: 'none', color: '#555', fontWeight: 500 }}>Home</Link>
                    <Link to="/about" style={{ textDecoration: 'none', color: '#555', fontWeight: 500 }}>About</Link>
                    <Link to="/contact" style={{ textDecoration: 'none', color: '#1a73e8', fontWeight: 600 }}>Contact</Link>
                </nav>
            </header>

            <main className="contact-content">
                <div className="contact-header">
                    <h2>Get in Touch</h2>
                    <p>Have questions? We're here to help you every step of the way.</p>
                </div>

                <div className="contact-grid">
                    {/* Contact Details */}
                    <div className="contact-info-card">
                        <h3>Contact Details</h3>

                        <div className="contact-item">
                            <div>
                                <h4>General Inquiry</h4>
                                <p>info@greenwoodacademy.edu</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div>
                                <h4>Admission Office</h4>
                                <p>admissions@greenwoodacademy.edu</p>
                                <p>+1 (555) 012-3499</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div>
                                <h4>Campus Location</h4>
                                <p>123 Education Lane, Knowledge Park</p>
                                <p>City - 456789, State, Country</p>
                            </div>
                        </div>
                    </div>

                    {/* Router Links & Logout */}
                    <div className="contact-links-card">
                        <h3>Quick Navigation</h3>
                        <nav className="quick-nav">
                            <Link to="/home">Go to Home Page</Link>
                            <Link to="/about">Learn About Us</Link>
                            <Link to="/login">Login to Dashboard</Link>
                            <Link to="/register">Create an Account</Link>
                            <Link to="/help">Help & Support</Link>
                        </nav>

                        <div className="logout-btn-container">
                            <button className="logout-button" onClick={handleLogout}>
                                Logout from System
                            </button>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem', textAlign: 'center' }}>
                                Securely end your current session.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer style={{ background: '#202124', color: 'white', padding: '2rem 10%', textAlign: 'center' }}>
                <p>&copy; 2026 Greenwood Academy. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Contact;