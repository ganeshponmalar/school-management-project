import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Header / Navigation */}
            <header className="header">
                <div className="logo">
                    <h1>Greenwood Academy</h1>
                </div>
                <nav className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/">Login</Link>
                    <Link to="/register">Register</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <h2>Empowering the Next Generation</h2>
                <p>Welcome to Greenwood Academy, where we nurture young minds and prepare them for a bright future. Experience excellence in education and a supportive learning environment.</p>
                <div className="hero-btns">
                    <Link to="/" className="btn btn-primary" style={{ marginRight: '1rem', background: '#1a73e8', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>Login</Link>
                    <Link to="/register" className="btn btn-secondary" style={{ border: '1px solid white', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>Register Now</Link>
                </div>
            </section>

            {/* Information Sections */}
            <section className="info-section">
                <div className="grid-container">
                    {/* School Information */}
                    <article className="info-card">
                        <h3>School Information</h3>
                        <p><strong>Founded:</strong> 1995</p>
                        <p><strong>Affiliation:</strong> National Board of Secondary Education</p>
                        <p><strong>Motto:</strong> Excellence in Education, Strength in Character</p>
                        <p>Greenwood Academy is a premier educational institution committed to providing top-quality education through modern methodologies and a holistic approach to student development.</p>
                    </article>

                    {/* Admin Details */}
                    <article className="info-card">
                        <h3>School Administration</h3>
                        <p><strong>Principal:</strong> Dr. Sarah Johnson</p>
                        <p><strong>Address:</strong> 123 Education Lane, Knowledge Park, City-456789</p>
                        <p><strong>Office Hours:</strong> Mon - Fri, 8:00 AM to 4:00 PM</p>
                        <p>Our administration is dedicated to maintaining a safe and productive environment for both students and faculty.</p>
                    </article>

                    {/* Contact Details */}
                    <article className="info-card">
                        <h3>Contact Information</h3>
                        <p><strong>Email:</strong> info@greenwoodacademy.edu</p>
                        <p><strong>Phone:</strong> +1 (555) 012-3456</p>
                        <p><strong>Support:</strong> support@greenwoodacademy.edu</p>
                        <p>Feel free to reach out to us for any queries regarding admissions, student welfare, or general information.</p>
                    </article>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Greenwood Academy</h4>
                        <p>Building futures since 1995.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <p><Link to="/about">About Us</Link></p>
                        <p><Link to="/contact">Contact</Link></p>
                        <p><Link to="/help">Help Center</Link></p>
                    </div>
                    <div className="footer-section">
                        <h4>Stay Connected</h4>
                        <p>Facebook | Twitter | Instagram</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Greenwood Academy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;