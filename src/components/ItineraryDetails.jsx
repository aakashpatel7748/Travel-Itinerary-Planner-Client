import React, { useState } from 'react';
import { 
    FaPlane, FaHotel, FaTrain, FaBus, FaSuitcase, 
    FaClock, FaMapMarkerAlt, FaWallet, FaCalendarDay 
} from 'react-icons/fa';

const ItineraryDetails = ({ itinerary }) => {
    const [activeDay, setActiveDay] = useState(0);

    const getIcon = (type) => {
        switch (type) {
            case 'Flight': return <FaPlane size={24} style={styles.headerIcon} />;
            case 'Hotel': return <FaHotel size={24} style={styles.headerIcon} />;
            case 'Train': return <FaTrain size={24} style={styles.headerIcon} />;
            case 'Bus': return <FaBus size={24} style={styles.headerIcon} />;
            default: return <FaSuitcase size={24} style={styles.headerIcon} />;
        }
    };

    const days = itinerary.structuredItinerary?.days || [];

    return (
        <div className="w-100">
            {/* Upper: Extracted Booking Panel */}
            <div style={styles.sectionCard} className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-white border-opacity-10">
                    <div style={styles.badgeContainer}>
                        {getIcon(itinerary.travelType)}
                    </div>
                    <div>
                        <h4 className="m-0" style={styles.sectionTitle}>Document Analysis Details</h4>
                        <p className="m-0 text-muted" style={{ fontSize: '0.8rem' }}>AI Extracted parameters from uploaded ticket</p>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>Travel Type</span>
                            <span style={styles.metaVal}>{itinerary.travelType || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>
                                {itinerary.travelType === 'Hotel' ? 'Hotel Name' : 'Carrier'}
                            </span>
                            <span style={styles.metaVal}>{itinerary.extractedData?.carrierOrHotel || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>Reference / PNR</span>
                            <span style={styles.metaVal} className="text-primary font-monospace">{itinerary.extractedData?.referenceNumber || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>Price / Cost</span>
                            <span style={styles.metaVal}>{itinerary.extractedData?.price || 'N/A'}</span>
                        </div>
                    </div>
                    
                    {itinerary.extractedData?.source && (
                        <div className="col-6 col-md-3">
                            <div style={styles.metaCell}>
                                <span style={styles.metaLabel}>Origin</span>
                                <span style={styles.metaVal}>{itinerary.extractedData.source}</span>
                            </div>
                        </div>
                    )}
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>Destination</span>
                            <span style={styles.metaVal}>{itinerary.extractedData?.destination || itinerary.destination || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>Travel Date</span>
                            <span style={styles.metaVal}>{itinerary.extractedData?.date || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div style={styles.metaCell}>
                            <span style={styles.metaLabel}>Traveler Name</span>
                            <span style={styles.metaVal}>{itinerary.extractedData?.travelerName || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Itinerary Timeline */}
            <div style={styles.timelineWrapper}>
                {/* Day Selectors */}
                {days.length > 1 && (
                    <div className="d-flex gap-2 overflow-auto pb-3 mb-4 border-bottom border-white border-opacity-5">
                        {days.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveDay(idx)}
                                className="btn px-4 py-2 text-nowrap"
                                style={{
                                    ...styles.dayTab,
                                    background: activeDay === idx 
                                        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                                        : 'rgba(255, 255, 255, 0.03)',
                                    color: activeDay === idx ? '#ffffff' : '#94a3b8',
                                    border: activeDay === idx ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                                }}
                            >
                                <FaCalendarDay size={12} style={{ marginRight: '6px' }} />
                                Day {day.dayNumber || idx + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected Day Content */}
                {days[activeDay] && (
                    <div>
                        <div className="mb-4">
                            <span className="badge bg-indigo-subtle text-indigo mb-2" style={styles.dayBadge}>
                                DAY {days[activeDay].dayNumber || activeDay + 1}
                            </span>
                            <h4 style={styles.dayTheme} className="mt-1">{days[activeDay].theme || 'Daily Planner Schedule'}</h4>
                            {days[activeDay].date && (
                                <small style={{ color: '#64748b' }}>Scheduled for {days[activeDay].date}</small>
                            )}
                        </div>

                        {/* Activities Timeline */}
                        <div style={styles.timelineContainer}>
                            {days[activeDay].activities && days[activeDay].activities.length > 0 ? (
                                days[activeDay].activities.map((act, actIdx) => (
                                    <div key={actIdx} style={styles.timelineNode}>
                                        {/* Left Track & Timing */}
                                        <div style={styles.timeSection}>
                                            <div style={styles.timeBadge}>
                                                <FaClock size={12} style={{ marginRight: '5px', color: '#818cf8' }} />
                                                {act.time}
                                            </div>
                                            <div style={styles.dotMarker}></div>
                                        </div>

                                        {/* Right Detail Card */}
                                        <div style={styles.activityCard} className="glass-card-no-hover">
                                            <h6 style={styles.activityTitle}>{act.title}</h6>
                                            <p style={styles.activityDesc}>{act.description}</p>
                                            
                                            <div className="d-flex flex-wrap gap-3 mt-3 pt-2 border-top border-white border-opacity-5">
                                                {act.location && (
                                                    <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                                                        <FaMapMarkerAlt size={12} style={{ marginRight: '5px', color: '#ef4444' }} />
                                                        {act.location}
                                                    </div>
                                                )}
                                                {act.cost && (
                                                    <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                                                        <FaWallet size={12} style={{ marginRight: '5px', color: '#10b981' }} />
                                                        {act.cost}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No activities scheduled for this day.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    sectionCard: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '24px',
        padding: '30px',
    },
    badgeContainer: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        color: '#818cf8',
    },
    sectionTitle: {
        color: '#f8fafc',
        fontSize: '1.2rem',
        fontWeight: '700'
    },
    metaCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.01)',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.03)'
    },
    metaLabel: {
        fontSize: '0.65rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    metaVal: {
        fontSize: '0.85rem',
        color: '#cbd5e1',
        fontWeight: '600'
    },
    timelineWrapper: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '24px',
        padding: '30px',
    },
    dayTab: {
        fontSize: '0.85rem',
        fontWeight: '600',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    },
    dayBadge: {
        background: 'rgba(99, 102, 241, 0.15)',
        color: '#818cf8',
        padding: '6px 12px',
        borderRadius: '30px',
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '1px'
    },
    dayTheme: {
        fontSize: '1.35rem',
        fontWeight: '800',
        color: '#f8fafc',
        margin: '5px 0 0 0'
    },
    timelineContainer: {
        position: 'relative',
        paddingLeft: '30px',
        marginTop: '30px'
    },
    timelineNode: {
        position: 'relative',
        paddingBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    timeSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    timeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '0.775rem',
        color: '#cbd5e1',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center'
    },
    dotMarker: {
        position: 'absolute',
        left: '-34px',
        top: '8px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#6366f1',
        border: '2.5px solid #070a13',
        zIndex: 5,
        boxShadow: '0 0 10px #6366f1'
    },
    activityCard: {
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '16px',
        padding: '20px',
        marginLeft: '0'
    },
    activityTitle: {
        color: '#f1f5f9',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '6px'
    },
    activityDesc: {
        color: '#94a3b8',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        margin: 0
    }
};

export default ItineraryDetails;
