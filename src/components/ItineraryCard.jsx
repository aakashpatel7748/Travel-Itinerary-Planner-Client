import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaPlane, FaHotel, FaTrain, FaBus, FaSuitcase, 
    FaTrashAlt, FaLock, FaGlobe, FaCopy, FaCheck 
} from 'react-icons/fa';

const ItineraryCard = ({ itinerary, onDelete, onToggleShare }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [isSharingLoading, setIsSharingLoading] = useState(false);

    const getIcon = (type) => {
        switch (type) {
            case 'Flight': return <FaPlane style={styles.travelIcon} />;
            case 'Hotel': return <FaHotel style={styles.travelIcon} />;
            case 'Train': return <FaTrain style={styles.travelIcon} />;
            case 'Bus': return <FaBus style={styles.travelIcon} />;
            default: return <FaSuitcase style={styles.travelIcon} />;
        }
    };

    const handleShareToggle = async (e) => {
        e.stopPropagation();
        setIsSharingLoading(true);
        try {
            await onToggleShare(itinerary._id);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSharingLoading(false);
        }
    };

    const handleCopyLink = (e) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/share/${itinerary.sharingToken}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedDate = itinerary.extractedData?.date 
        ? new Date(itinerary.extractedData.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Date Unspecified';

    return (
        <div 
            onClick={() => navigate(`/itinerary/${itinerary._id}`)} 
            style={styles.card}
            className="glass-card h-100 position-relative p-4 d-flex flex-column justify-content-between"
        >
            <div>
                {/* Header: Icon & Travel Type */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={styles.iconContainer}>
                        {getIcon(itinerary.travelType)}
                    </div>
                    {/* Share Status Badge */}
                    <div 
                        onClick={handleShareToggle}
                        style={{
                            ...styles.shareBadge,
                            backgroundColor: itinerary.isPublic ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: itinerary.isPublic ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            color: itinerary.isPublic ? '#34d399' : '#94a3b8',
                            cursor: isSharingLoading ? 'not-allowed' : 'pointer'
                        }}
                        title={itinerary.isPublic ? 'Click to make Private' : 'Click to make Public'}
                    >
                        {itinerary.isPublic ? (
                            <>
                                <FaGlobe size={11} style={{ marginRight: '4px' }} /> Public
                            </>
                        ) : (
                            <>
                                <FaLock size={11} style={{ marginRight: '4px' }} /> Private
                            </>
                        )}
                    </div>
                </div>

                {/* Body Content */}
                <h5 style={styles.title}>{itinerary.title}</h5>
                <p style={styles.destination}>{itinerary.destination}</p>

                {/* Extracted quick info */}
                <div style={styles.infoGrid} className="mb-4">
                    {itinerary.extractedData?.source && (
                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>From</span>
                            <span style={styles.infoValue}>{itinerary.extractedData.source}</span>
                        </div>
                    )}
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Date</span>
                        <span style={styles.infoValue}>{formattedDate}</span>
                    </div>
                    {itinerary.extractedData?.carrierOrHotel && (
                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>
                                {itinerary.travelType === 'Hotel' ? 'Hotel' : 'Carrier'}
                            </span>
                            <span style={styles.infoValue}>{itinerary.extractedData.carrierOrHotel}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-between align-items-center gap-2 pt-3 border-top border-white border-opacity-5 mt-auto">
                <span 
                    style={styles.viewBtn} 
                    className="p-0 text-decoration-none"
                >
                    View Details &rarr;
                </span>

                <div className="d-flex gap-2">
                    {itinerary.isPublic && (
                        <button 
                            onClick={handleCopyLink}
                            style={styles.actionBtn}
                            className="btn btn-sm"
                            title="Copy Public Sharing Link"
                        >
                            {copied ? <FaCheck style={{ color: '#10b981' }} size={13} /> : <FaCopy size={13} />}
                        </button>
                    )}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm("Are you sure you want to delete this itinerary?")) {
                                onDelete(itinerary._id);
                            }
                        }}
                        style={{ ...styles.actionBtn, color: '#f87171' }}
                        className="btn btn-sm"
                        title="Delete Itinerary"
                    >
                        <FaTrashAlt size={13} />
                    </button>
                </div>
            </div>
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .glass-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(99, 102, 241, 0.35);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
};

const styles = {
    card: {
        minHeight: '260px'
    },
    iconContainer: {
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    travelIcon: {
        fontSize: '1.2rem',
        color: '#818cf8'
    },
    shareBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.725rem',
        fontWeight: '600',
        border: '1px solid',
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        transition: 'all 0.2s ease'
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: '4px',
        lineHeight: '1.3'
    },
    destination: {
        fontSize: '0.85rem',
        color: '#6366f1',
        fontWeight: '600',
        marginBottom: '20px',
        letterSpacing: '0.3px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px 16px'
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    infoLabel: {
        fontSize: '0.7rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    infoValue: {
        fontSize: '0.825rem',
        color: '#cbd5e1',
        fontWeight: '550',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    viewBtn: {
        color: '#818cf8',
        fontWeight: '600',
        fontSize: '0.85rem',
        transition: 'color 0.2s ease',
        cursor: 'pointer'
    },
    actionBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        color: '#94a3b8',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'all 0.2s ease'
    }
};

export default ItineraryCard;
