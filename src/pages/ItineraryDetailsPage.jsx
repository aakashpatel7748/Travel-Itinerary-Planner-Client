import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    FaArrowLeft, FaGlobe, FaLock, FaCopy, FaCheck, 
    FaTrashAlt, FaSuitcase 
} from 'react-icons/fa';
import { itinerariesAPI } from '../services/api';
import ItineraryDetails from '../components/ItineraryDetails';
import Loader from '../components/Loader';

const ItineraryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);

    const fetchDetails = async () => {
        try {
            const data = await itinerariesAPI.getDetails(id);
            if (data?.success) {
                setItinerary(data.itinerary);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to load itinerary details: ' + (err.response?.data?.error || err.message));
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleToggleShare = async () => {
        setShareLoading(true);
        try {
            const res = await itinerariesAPI.toggleShare(id);
            if (res.success) {
                setItinerary(prev => ({
                    ...prev,
                    isPublic: res.isPublic,
                    sharingToken: res.sharingToken
                }));
            }
        } catch (err) {
            alert('Failed to change sharing status: ' + (err.response?.data?.error || err.message));
        } finally {
            setShareLoading(false);
        }
    };

    const handleCopyLink = () => {
        const shareUrl = `${window.location.origin}/share/${itinerary.sharingToken}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this trip itinerary? This action cannot be undone.")) {
            try {
                const res = await itinerariesAPI.delete(id);
                if (res.success) {
                    navigate('/');
                }
            } catch (err) {
                alert('Deletion failed: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    if (loading) {
        return <Loader message="AI is preparing your travel timeline viewer..." />;
    }

    if (!itinerary) {
        return (
            <div className="container text-center py-5" style={{ minHeight: 'calc(100vh - 142px)' }}>
                <FaSuitcase size={48} style={{ color: '#ef4444', marginBottom: '20px' }} />
                <h4 style={{ color: '#cbd5e1' }}>Itinerary Not Found</h4>
                <Link to="/" className="btn btn-primary mt-3">Return to History</Link>
            </div>
        );
    }

    return (
        <div style={styles.container} className="py-5 animate-fade-in">
            <div className="container-xl" style={{ maxWidth: '960px' }}>
                {/* Header Back & Action Buttons */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                    <Link to="/" style={styles.backLink} className="d-inline-flex align-items-center gap-2 text-decoration-none">
                        <FaArrowLeft size={11} /> Back to Planner Board
                    </Link>

                    <div className="d-flex gap-2 align-self-end align-self-sm-center">
                        {/* Share Toggle Button */}
                        <button
                            onClick={handleToggleShare}
                            disabled={shareLoading}
                            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2`}
                            style={{
                                ...styles.actionBtn,
                                backgroundColor: itinerary.isPublic ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                                borderColor: itinerary.isPublic ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                color: itinerary.isPublic ? '#34d399' : '#94a3b8'
                            }}
                        >
                            {itinerary.isPublic ? (
                                <>
                                    <FaGlobe size={12} /> Public Share Active
                                </>
                            ) : (
                                <>
                                    <FaLock size={12} /> Make Itinerary Public
                                </>
                            )}
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            style={styles.deleteBtn}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
                        >
                            <FaTrashAlt size={12} /> Delete
                        </button>
                    </div>
                </div>

                {/* Share Link Banner (Visible if Public is Enabled) */}
                {itinerary.isPublic && (
                    <div style={styles.shareBanner} className="p-3.5 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span className="badge bg-success-subtle text-success mb-1" style={{ fontSize: '0.65rem', fontWeight: '700' }}>Sharing Enabled</span>
                            <p style={styles.shareText} className="m-0">Anyone with the link below can view your travel itinerary (no login required!)</p>
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ maxWidth: '100%' }}>
                            <input
                                type="text"
                                readOnly
                                value={`${window.location.origin}/share/${itinerary.sharingToken}`}
                                style={styles.shareInput}
                                className="form-control"
                            />
                            <button 
                                onClick={handleCopyLink} 
                                className="btn btn-primary d-flex align-items-center justify-content-center px-3"
                                style={styles.copyBtn}
                            >
                                {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Heading block */}
                <div className="mb-4">
                    <h2 style={styles.title}>{itinerary.title}</h2>
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
    backLink: {
        color: '#94a3b8',
        fontWeight: '600',
        fontSize: '0.875rem',
        cursor: 'pointer'
    },
    actionBtn: {
        fontSize: '0.825rem',
        fontWeight: '600',
        borderRadius: '10px',
        border: '1px solid',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    },
    deleteBtn: {
        fontSize: '0.825rem',
        fontWeight: '600',
        borderRadius: '10px',
        transition: 'all 0.2s ease'
    },
    shareBanner: {
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: '16px',
        padding: '16px 20px'
    },
    shareText: {
        fontSize: '0.825rem',
        color: '#cbd5e1'
    },
    shareInput: {
        width: '320px',
        backgroundColor: 'rgba(255, 255, 255, 0.03) !important',
        color: '#94a3b8 !important',
        height: '36px',
        fontSize: '0.8rem',
        padding: '6px 12px',
        border: '1px solid rgba(255, 255, 255, 0.08) !important',
        borderRadius: '8px !important'
    },
    copyBtn: {
        height: '36px',
        borderRadius: '8px !important'
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

export default ItineraryDetailsPage;
