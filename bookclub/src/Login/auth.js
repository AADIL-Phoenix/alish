import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react';
import '../Login/login.css';
const AuthPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Stronger password validation
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            if (isLoginView) {
                // Login validation
                if (!username.trim() || !password) {
                    throw new Error('Please fill in all fields');
                }
                
                // Login logic here
                // await loginUser({ username, password, rememberMe });
            } else {
                // Registration validation
                if (!email || !validateEmail(email)) {
                    throw new Error('Please enter a valid email');
                }
                
                if (!username.trim()) {
                    throw new Error('Please enter username');
                }
                
                if (!validatePassword(password)) {
                    throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character');
                }
                
                // Register logic here
                // await registerUser({ email, username, password, rememberMe });
            }
            
            // On success, navigate to home
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-container">
            {error && <div className="error-message">{error}</div>}
            <div className="form-col">
                <div className="btn-box">
                    <button 
                        className={`btn btn-1 ${isLoginView ? 'active' : ''}`} 
                        onClick={() => setIsLoginView(true)}
                    >
                        Sign In
                    </button>
                    <button 
                        className={`btn btn-2 ${!isLoginView ? 'active' : ''}`} 
                        onClick={() => setIsLoginView(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {isLoginView ? (
                    <form className="form-box login-form" onSubmit={handleSubmit}>
                        <div className="form-title">
                            <span>Sign In</span>
                        </div>
                        <div className="form-inputs">
                            <div className="input-box">
                                <input 
                                    type="text" 
                                    className="inputs input-field" 
                                    placeholder="Username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                                <Lock className="icon" />
                            </div>
                            <div className="input-box">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="inputs input-field" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility} 
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <div className="forgot-pass">
                                <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                            </div>
                            <div className="input-box">
                                <button 
                                    type="submit" 
                                    className="inputs submit-btn"
                                    disabled={isLoading}
                                >
                                    <span>{isLoading ? 'Processing...' : 'Sign In'}</span>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                        <div className="social-login">
                            {['google', 'facebook', 'instagram', 'twitter'].map((platform) => (
                                <div key={platform} className="social-login-box">
                                    <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                                </div>
                            ))}
                        </div>
                    </form>
                ) : (
                    <form className="form-box register-form" onSubmit={handleSubmit}>
                        <div className="form-title">
                            <span>Sign Up</span>
                        </div>
                        <div className="form-inputs">
                            <div className="input-box">
                                <input 
                                    type="email" 
                                    className="inputs input-field" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                                <Mail className="icon" />
                            </div>
                            <div className="input-box">
                                <input 
                                    type="text" 
                                    className="inputs input-field" 
                                    placeholder="Username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                                <Lock className="icon" />
                            </div>
                            <div className="input-box">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="inputs input-field" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility} 
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <div className="remember-me">
                                <input 
                                    type="checkbox" 
                                    id="remember-me-check" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me-check">Remember me</label>
                            </div>
                            <div className="input-box">
                                <button 
                                    type="submit" 
                                    className="inputs submit-btn"
                                    disabled={isLoading}
                                >
                                    <span>{isLoading ? 'Processing...' : 'Sign Up'}</span>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                        <div className="social-login">
                            {['google', 'facebook', 'instagram', 'twitter'].map((platform) => (
                                <div key={platform} className="social-login-box">
                                    <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                                </div>
                            ))}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;