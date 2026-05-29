import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlane, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const { register, error: authError, clearError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateForm = () => {
        const tempErrors = {};
        if (!formData.name.trim()) {
            tempErrors.name = 'Full name is required';
        }

        if (!formData.email) {
            tempErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
        if (apiError || authError) {
            setApiError('');
            clearError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setApiError('');

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setApiError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container} className="d-flex align-items-center justify-content-center">
            <div style={styles.glassCard} className="w-100 p-4 p-sm-5">
                {/* Brand Header */}
                <div className="text-center mb-4">
                    <div style={styles.logoContainer} className="mx-auto mb-3">
                        <FaPlane size={24} style={styles.logoIcon} />
                    </div>
                    <h3 style={styles.title}>Get Started</h3>
                    <p style={styles.subtitle}>Create an account to generate custom travel schedules</p>
                </div>

                {/* Error Banner */}
                {(apiError || authError) && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 mb-4" style={styles.alert}>
                        <FiAlertTriangle size={16} />
                        <span>{apiError || authError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    {/* Full Name */}
                    <div className="d-flex flex-column gap-1.5">
                        <label style={styles.label} htmlFor="name">Full Name</label>
                        <div className="position-relative">
                            <FaUser style={styles.fieldIcon} />
                            <input
                                className="form-control"
                                style={styles.input}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Rahul Sharma"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                    </div>

                    {/* Email Input */}
                    <div className="d-flex flex-column gap-1.5">
                        <label style={styles.label} htmlFor="email">Email Address</label>
                        <div className="position-relative">
                            <FaEnvelope style={styles.fieldIcon} />
                            <input
                                className="form-control"
                                style={styles.input}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@domain.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                    </div>

                    {/* Password Input */}
                    <div className="d-flex flex-column gap-1.5">
                        <label style={styles.label} htmlFor="password">Password</label>
                        <div className="position-relative">
                            <FaLock style={styles.fieldIcon} />
                            <input
                                className="form-control"
                                style={styles.input}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="•••••••• (Min 6 chars)"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="d-flex flex-column gap-1.5">
                        <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                        <div className="position-relative">
                            <FaLock style={styles.fieldIcon} />
                            <input
                                className="form-control"
                                style={styles.input}
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 mt-3"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Creating Profile...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top border-white border-opacity-5">
                    <p style={styles.footerText} className="m-0">
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link} onClick={clearError}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 72px)',
        padding: '24px 0',
        backgroundColor: '#070a13'
    },
    glassCard: {
        maxWidth: '460px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)'
    },
    logoContainer: {
        width: '50px',
        height: '50px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
    },
    logoIcon: {
        color: '#ffffff',
        transform: 'rotate(-45deg)'
    },
    title: {
        fontSize: '1.6rem',
        fontWeight: '800',
        color: '#f8fafc',
        margin: '0 0 5px 0'
    },
    subtitle: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        margin: 0
    },
    alert: {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        color: '#f87171',
        borderRadius: '14px',
        fontSize: '0.85rem',
        border: '1px solid'
    },
    label: {
        fontSize: '0.825rem',
        fontWeight: '600',
        color: '#cbd5e1'
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        color: '#ffffff',
        padding: '10px 12px 10px 40px',
        height: '44px',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        boxShadow: 'none'
    },
    fieldIcon: {
        position: 'absolute',
        left: '15px',
        top: '15px',
        color: '#64748b',
        fontSize: '0.85rem',
        zIndex: 5
    },
    errorText: {
        fontSize: '0.7rem',
        color: '#f87171',
        marginTop: '3px'
    },
    submitBtn: {
        height: '44px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        border: 'none',
        borderRadius: '12px',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '0.925rem',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.2s ease'
    },
    footerText: {
        fontSize: '0.825rem',
        color: '#64748b'
    },
    link: {
        color: '#818cf8',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

export default Signup;
