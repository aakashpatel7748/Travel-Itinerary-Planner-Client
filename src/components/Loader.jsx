import React from 'react';

const Loader = ({ message = 'AI is preparing your itinerary...' }) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.glassCard}>
                <div style={styles.spinnerContainer}>
                    <div style={styles.spinnerCore}></div>
                    <div style={styles.spinnerRing}></div>
                </div>
                <h4 style={styles.title}>AI Itinerary Engine</h4>
                <p style={styles.text}>{message}</p>
                <div style={styles.progressTrack}>
                    <div style={styles.progressFill}></div>
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulsate {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    glassCard: {
        width: '400px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    spinnerContainer: {
        position: 'relative',
        width: '80px',
        height: '80px',
        marginBottom: '25px',
    },
    spinnerCore: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        animation: 'pulsate 2s infinite ease-in-out',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
    },
    spinnerRing: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        border: '4px solid transparent',
        borderTopColor: '#3b82f6',
        borderBottomColor: '#8b5cf6',
        animation: 'spin 1.5s infinite linear'
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: '10px',
        letterSpacing: '0.5px'
    },
    text: {
        fontSize: '14px',
        color: '#94a3b8',
        lineHeight: '1.6',
        marginBottom: '25px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressTrack: {
        width: '100%',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
        animation: 'progress 8s infinite linear',
        borderRadius: '10px'
    }
};

export default Loader;
