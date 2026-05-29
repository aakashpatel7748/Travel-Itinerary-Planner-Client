import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlane, FaGlobe, FaSuitcase, FaSignInAlt } from 'react-icons/fa';
import { itinerariesAPI } from '../services/api';
import ItineraryDetails from '../components/ItineraryDetails';
import Loader from '../components/Loader';

const ShareItinerary = () => {
    const { token } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSharedItinerary = async () => {
        try {
            const data = await itinerariesAPI.getShared(token);
            if (data?.success) {
                setItinerary(data.itinerary);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'This shared link has expired or is invalid.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSharedItinerary();
    }, [token]);

    if (loading) {
        return <Loader message="Accessing shared travel schedule..." />;
    }

    if (error || !itinerary) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center py-5">
                <div style={styles.errorCard} className="glass-panel p-5 text-center w-100 mx-3 animate-fade-in">
                    <FaSuitcase size={48} style={{ color: '#ef4444', marginBottom: '20px' }} />
                    <h4 style={{ color: '#f8fafc', fontWeight: '800' }}>Link Expired or Private</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px' }} className="mx-auto mb-4">
                        {error || "The owner has set this itinerary to private or the link is invalid."}
                    </p>
                    <div className="d-flex flex-column gap-2 max-width-xs mx-auto" style={{ width: '220px' }}>
                        <Link to="/login" className="btn btn-primary d-flex align-items-center justify-content-center gap-2">
                            <FaSignInAlt size={12} /> Sign In
                        </Link>
                        <Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem' }} className="mt-2 text-decoration-none">
                            Learn more about Orbitra Travel AI
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container} className="py-5 animate-fade-in">
            <div className="container-xl" style={{ maxWidth: '960px' }}>
                
                {/* Branding header backlink */}
                <div style={styles.bannerCard} className="p-4 mb-5 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div className="d-flex align-items-center gap-2.5">
                        <FaPlane size={20} style={{ color: '#3b82f6', transform: 'rotate(-45deg)' }} />
                        <div>
                            <h6 style={styles.bannerBrand} className="m-0">Orbitra Travel AI</h6>
                            <p style={styles.bannerLabel} className="m-0">Shared Travel Plan Viewer</p>
                        </div>
                    </div>
                    <div>
                        <Link to="/signup" className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 px-3 py-2">
                            Create Your Own &rarr;
                        </Link>
                    </div>
                </div>

                {/* Main Heading block */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                        <FaGlobe style={{ color: '#10b981' }} size={12} />
                        <span>Shared itinerary by <strong>{itinerary.extractedData?.travelerName || 'Rahul'}</strong></span>
                    </div>
                    <h2 style={styles.title} className="mt-1">{itinerary.title}</h2>
                    <h5 style={styles.subtitle} className="mt-1">{itinerary.destination}</h5>
                </div>

                {/* Itinerary Details Component */}
                <ItineraryDetails itinerary={itinerary} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 142px)',
        backgroundColor: '#070a13'
    },
    errorCard: {
        maxWidth: '480px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
    },
    bannerCard: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px'
    },
    bannerBrand: {
        color: '#f8fafc',
        fontWeight: '800',
        fontSize: '1rem',
        letterSpacing: '0.5px'
    },
    bannerLabel: {
        fontSize: '0.75rem',
        color: '#64748b',
        fontWeight: '550'
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '900',
        color: '#f8fafc',
        letterSpacing: '-0.02em',
        margin: 0
    },
    subtitle: {
        fontSize: '1rem',
        color: '#818cf8',
        fontWeight: '600',
        letterSpacing: '0.5px',
        margin: 0
    }
};

export default ShareItinerary;
