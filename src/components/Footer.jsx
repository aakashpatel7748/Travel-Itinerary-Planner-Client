import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container-xl d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 text-center text-sm-start">
                <div>
                    <h6 style={styles.brand}>Orbitra Travel AI</h6>
                    <p style={styles.copy}>&copy; {new Date().getFullYear()} Orbitra Technologies. All rights reserved.</p>
                </div>
                <div className="d-flex gap-4" style={styles.linksContainer}>
                    <a href="#" style={styles.link}>Privacy Policy</a>
                    <a href="#" style={styles.link}>Terms of Service</a>
                    <a href="#" style={styles.link}>Support</a>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: '#070a13',
        padding: '30px 0',
        width: '100%',
        marginTop: 'auto'
    },
    brand: {
        color: '#f8fafc',
        fontWeight: '700',
        fontSize: '0.95rem',
        margin: '0 0 5px 0',
        letterSpacing: '0.5px'
    },
    copy: {
        color: '#64748b',
        fontSize: '0.8rem',
        margin: 0
    },
    linksContainer: {
        fontSize: '0.8rem'
    },
    link: {
        color: '#94a3b8',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        cursor: 'pointer'
    }
};

export default Footer;
