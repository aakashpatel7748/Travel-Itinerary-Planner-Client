import { useEffect, useState } from 'react';
import {
    FaGlobe,
    FaHistory,
    FaPlane, FaPlus, FaSearch,
    FaSuitcase
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ItineraryCard from '../components/ItineraryCard';
import Loader from '../components/Loader';
import { itinerariesAPI } from '../services/api';

const Dashboard = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [stats, setStats] = useState({ total: 0, publicCount: 0, destinations: 0 });

    const fetchItineraries = async () => {
        try {
            const data = await itinerariesAPI.getAll();
            if (data?.success) {
                const list = data.itineraries || [];
                setItineraries(list);
                setFilteredItineraries(list);
                calculateStats(list);
            }
        } catch (err) {
            console.error('Failed to load itineraries:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    const calculateStats = (list) => {
        const publicCount = list.filter(i => i.isPublic).length;
        const uniqueDests = new Set(list.map(i => i.destination?.toLowerCase())).size;
        setStats({
            total: list.length,
            publicCount,
            destinations: uniqueDests
        });
    };

    const handleSearchAndFilter = (query, filter) => {
        setSearchQuery(query);
        setTypeFilter(filter);

        let filtered = [...itineraries];

        if (query.trim() !== '') {
            const q = query.toLowerCase();
            filtered = filtered.filter(
                i => i.title.toLowerCase().includes(q) || i.destination.toLowerCase().includes(q)
            );
        }

        if (filter !== 'All') {
            filtered = filtered.filter(i => i.travelType === filter);
        }

        setFilteredItineraries(filtered);
    };

    const handleDelete = async (id) => {
        try {
            const res = await itinerariesAPI.delete(id);
            if (res.success) {
                const updatedList = itineraries.filter(i => i._id !== id);
                setItineraries(updatedList);
                setFilteredItineraries(
                    typeFilter === 'All' 
                        ? updatedList.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        : updatedList.filter(i => i.travelType === typeFilter && i.title.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                calculateStats(updatedList);
            }
        } catch (err) {
            alert('Failed to delete itinerary: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleToggleShare = async (id) => {
        try {
            const res = await itinerariesAPI.toggleShare(id);
            if (res.success) {
                const updatedList = itineraries.map(i => 
                    i._id === id ? { ...i, isPublic: res.isPublic, sharingToken: res.sharingToken } : i
                );
                setItineraries(updatedList);
                
                // Update filtered list in-place
                setFilteredItineraries(prev => prev.map(i => 
                    i._id === id ? { ...i, isPublic: res.isPublic, sharingToken: res.sharingToken } : i
                ));
                calculateStats(updatedList);
            }
        } catch (err) {
            alert('Failed to toggle share: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) {
        return <Loader message="Accessing your vacation records..." />;
    }

    return (
        <div style={styles.container} className="py-5">
            <div className="container-xl">
                {/* Upper: Welcoming & Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                    <div>
                        <h2 style={styles.title} className="m-0">Trip Planning Board</h2>
                        <p style={styles.subtitle} className="m-0">Automatically generate your day-to-day vacation schedules with AI</p>
                    </div>
                    <Link to="/create-itinerary" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5" style={styles.headerBtn}>
                        <FaPlus size={13} /> New Itinerary Wizard
                    </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="row g-4 mb-5">
                    <div className="col-12 col-sm-4">
                        <div style={styles.statCard} className="d-flex align-items-center gap-4">
                            <div style={{ ...styles.statIconWrapper, background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                                <FaSuitcase size={22} />
                            </div>
                            <div>
                                <h3 style={styles.statVal}>{stats.total}</h3>
                                <span style={styles.statLabel}>Vacations Planned</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div style={styles.statCard} className="d-flex align-items-center gap-4">
                            <div style={{ ...styles.statIconWrapper, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                                <FaGlobe size={20} />
                            </div>
                            <div>
                                <h3 style={styles.statVal}>{stats.publicCount}</h3>
                                <span style={styles.statLabel}>Shared Journeys</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div style={styles.statCard} className="d-flex align-items-center gap-4">
                            <div style={{ ...styles.statIconWrapper, background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                                <FaPlane size={20} style={{ transform: 'rotate(-45deg)' }} />
                            </div>
                            <div>
                                <h3 style={styles.statVal}>{stats.destinations}</h3>
                                <span style={styles.statLabel}>Cities Explored</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div style={styles.filterBar} className="p-3 mb-4 d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
                    <div className="position-relative flex-grow-1" style={styles.searchContainer}>
                        <FaSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by trip name or destination..."
                            className="form-control"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) =>handleSearchAndFilter(e.target.value, typeFilter)}
                        />
                    </div>

                    <div className="d-flex gap-2 overflow-auto" style={styles.filtersWrapper}>
                        {['All', 'Flight', 'Hotel', 'Train', 'Bus', 'Other'].map(type => (
                            <button
                                key={type}
                                onClick={() => handleSearchAndFilter(searchQuery, type)}
                                className={`btn btn-sm ${typeFilter === type ? 'active' : ''}`}
                                style={{
                                    ...styles.filterBtn,
                                    backgroundColor: typeFilter === type ? '#3b82f6' : 'rgba(255, 255, 255, 0.03)',
                                    borderColor: typeFilter === type ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
                                    color: typeFilter === type ? '#ffffff' : '#94a3b8'
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                {filteredItineraries.length > 0 ? (
                    <div className="row g-4 animate-fade-in">
                        {filteredItineraries.map(iti => (
                            <div key={iti._id} className="col-12 col-md-6 col-lg-4">
                                <ItineraryCard
                                    itinerary={iti}
                                    onDelete={handleDelete}
                                    onToggleShare={handleToggleShare}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty state card */
                    <div className="text-center py-5 glass-panel animate-fade-in" style={styles.emptyStateCard}>
                        <FaHistory size={48} style={{ color: '#4b5563', marginBottom: '20px' }} />
                        <h4 style={{ color: '#cbd5e1', fontWeight: '700' }}>No itineraries match your search</h4>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '400px' }} className="mx-auto mb-4">
                            Try clearing your search terms or generate a brand new travel schedule using our AI planning wizard.
                        </p>
                        <Link to="/create-itinerary" className="btn btn-primary px-4 py-2.5">
                            <FaPlus size={11} style={{ marginRight: '6px' }} /> Create New Trip Itinerary
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 142px)',
        backgroundColor: '#070a13'
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '900',
        color: '#f8fafc',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#94a3b8',
        marginTop: '4px'
    },
    headerBtn: {
        borderRadius: '12px',
        fontWeight: '650'
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    statIconWrapper: {
        width: '54px',
        height: '54px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statVal: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#ffffff',
        margin: 0,
        lineHeight: '1.1'
    },
    statLabel: {
        fontSize: '0.775rem',
        color: '#64748b',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    filterBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px'
    },
    searchContainer: {
        maxWidth: '400px'
    },
    searchIcon: {
        position: 'absolute',
        left: '14px',
        top: '13px',
        color: '#64748b',
        fontSize: '0.85rem',
        zIndex: 5
    },
    searchInput: {
        height: '40px',
        padding: '8px 12px 8px 38px',
        fontSize: '0.85rem'
    },
    filtersWrapper: {
        maxWidth: '100%'
    },
    filterBtn: {
        fontSize: '0.8rem',
        fontWeight: '600',
        borderRadius: '10px',
        padding: '6px 14px',
        border: '1px solid',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    },
    emptyStateCard: {
        padding: '60px 40px',
        borderRadius: '24px',
        border: '1px dashed rgba(255, 255, 255, 0.1)'
    }
};

export default Dashboard;
