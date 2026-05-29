import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaCloudUploadAlt, FaFilePdf, FaFileImage, FaArrowLeft, 
    FaTimes, FaPaperPlane, FaMagic, FaExclamationCircle 
} from 'react-icons/fa';
import { itinerariesAPI } from '../services/api';
import Loader from '../components/Loader';

const CreateItinerary = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError('');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        setError('');
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (uploadedFile) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(uploadedFile.type)) {
            setError('Unsupported file format! Please upload a PDF or an Image (PNG, JPG, JPEG).');
            return;
        }
        if (uploadedFile.size > 10 * 1024 * 1024) {
            setError('File size exceeds the 10MB limit!');
            return;
        }
        setFile(uploadedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError('');

        // Progress Message Orchestrator
        setLoadingMessage('Uploading booking document to secure server...');
        
        const messageTimer1 = setTimeout(() => {
            setLoadingMessage('AI Parsing ticket details & extracting traveler parameters...');
        }, 2200);

        const messageTimer2 = setTimeout(() => {
            setLoadingMessage('AI Formulating your personalized day-to-day timeline schedules...');
        }, 5500);

        const messageTimer3 = setTimeout(() => {
            setLoadingMessage('Writing final structured itineraries to MongoDB...');
        }, 8500);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await itinerariesAPI.generate(formData);
            
            clearTimeout(messageTimer1);
            clearTimeout(messageTimer2);
            clearTimeout(messageTimer3);

            if (res.success && res.itinerary) {
                navigate(`/itinerary/${res.itinerary._id}`);
            } else {
                throw new Error('Server returned an incomplete itinerary object.');
            }
        } catch (err) {
            clearTimeout(messageTimer1);
            clearTimeout(messageTimer2);
            clearTimeout(messageTimer3);
            console.error(err);
            setError(err.response?.data?.error || err.message || 'An error occurred during itinerary generation. Please try a different ticket.');
            setLoading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div style={styles.container} className="py-5">
            {loading && <Loader message={loadingMessage} />}

            <div className="container-xl" style={{ maxWidth: '680px' }}>
                {/* Back link */}
                <Link to="/" style={styles.backLink} className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none">
                    <FaArrowLeft size={11} /> Back to History
                </Link>

                <div style={styles.wizardCard} className="glass-panel p-4 p-sm-5 animate-fade-in">
                    <div className="text-center mb-4">
                        <div style={styles.magicIconContainer} className="mx-auto mb-3">
                            <FaMagic size={22} style={styles.magicIcon} />
                        </div>
                        <h3 style={styles.title}>AI Itinerary Creator</h3>
                        <p style={styles.subtitle}>Upload your flight ticket, hotel receipt or travel PDF to generate a dynamic timeline schedule instantly.</p>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 mb-4" style={styles.errorAlert}>
                            <FaExclamationCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Drag and Drop Zone */}
                        {!file ? (
                            <div 
                                className={`upload-zone d-flex flex-column align-items-center justify-content-center py-5 ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={triggerFileSelect}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept=".pdf,image/png,image/jpeg,image/jpg"
                                />
                                <FaCloudUploadAlt size={48} style={{ color: '#6366f1', marginBottom: '15px' }} />
                                <h5 style={{ color: '#cbd5e1', fontWeight: '700' }} className="mb-2">Choose ticket document</h5>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }} className="m-0">
                                    Drag & drop file here or click to browse
                                </p>
                                <span style={{ color: '#4b5563', fontSize: '0.725rem', marginTop: '12px' }}>
                                    Supports PDF, PNG, JPG, JPEG (Max 10MB)
                                </span>
                            </div>
                        ) : (
                            /* File Selected Panel */
                            <div style={styles.fileSelectedPanel} className="d-flex align-items-center justify-content-between p-3 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={styles.fileIconWrapper}>
                                        {file.type === 'application/pdf' ? (
                                            <FaFilePdf size={20} style={{ color: '#ef4444' }} />
                                        ) : (
                                            <FaFileImage size={20} style={{ color: '#3b82f6' }} />
                                        )}
                                    </div>
                                    <div style={{ maxWidth: '340px' }}>
                                        <h6 style={styles.fileName} className="mb-0 text-truncate">{file.name}</h6>
                                        <span style={styles.fileSize}>{formatBytes(file.size)}</span>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleRemoveFile} 
                                    style={styles.removeFileBtn} 
                                    className="btn btn-sm btn-link p-2"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                ...styles.generateBtn,
                                opacity: !file ? 0.5 : 1,
                                cursor: !file ? 'not-allowed' : 'pointer'
                            }}
                            className="btn btn-primary w-100 py-2.5 mt-2 d-flex align-items-center justify-content-center gap-2"
                            disabled={!file || loading}
                        >
                            <FaPaperPlane size={12} /> Generate AI Itinerary
                        </button>
                    </form>
                </div>
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
    wizardCard: {
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    },
    magicIconContainer: {
        width: '50px',
        height: '50px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.05)'
    },
    magicIcon: {
        color: '#818cf8'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#f8fafc',
        marginBottom: '6px'
    },
    subtitle: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        lineHeight: '1.5',
        margin: 0
    },
    errorAlert: {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        color: '#f87171',
        borderRadius: '14px',
        fontSize: '0.85rem',
        border: '1px solid'
    },
    fileSelectedPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px'
    },
    fileIconWrapper: {
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileName: {
        color: '#f1f5f9',
        fontSize: '0.9rem',
        fontWeight: '700'
    },
    fileSize: {
        color: '#64748b',
        fontSize: '0.75rem',
        fontWeight: '550'
    },
    removeFileBtn: {
        color: '#94a3b8',
        transition: 'color 0.2s ease',
        cursor: 'pointer'
    },
    generateBtn: {
        borderRadius: '12px',
        fontWeight: '650',
        fontSize: '0.95rem'
    }
};

export default CreateItinerary;
