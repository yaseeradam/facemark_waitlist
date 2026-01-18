import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

// Simple session storage for login state
const isLoggedIn = () => sessionStorage.getItem('admin_logged_in') === 'true';
const setLoggedIn = (value) => {
  if (value) {
    sessionStorage.setItem('admin_logged_in', 'true');
  } else {
    sessionStorage.removeItem('admin_logged_in');
  }
};

// Icons as SVG components - Unique and professional icons
const Icons = {
  // Brand/Logo icon - Face scan
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M9 10h.01M15 10h.01M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M2 12h2M20 12h2M12 2v2M12 20v2" />
    </svg>
  ),
  // Face scanning
  FaceScan: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M9 11.75A1.25 1.25 0 1 0 9 14.25A1.25 1.25 0 1 0 9 11.75zM15 11.75A1.25 1.25 0 1 0 15 14.25A1.25 1.25 0 1 0 15 11.75zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8c0-.29.02-.58.05-.86c2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26c.21.71.33 1.47.33 2.26c0 4.41-3.59 8-8 8z" />
    </svg>
  ),
  // Lightning bolt for speed
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z" />
    </svg>
  ),
  // Target/Crosshair for accuracy
  Target: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7z" />
    </svg>
  ),
  // Lock for security
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1c1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  // Person
  Person: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  // Email
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z" />
    </svg>
  ),
  // Business/Organization
  Business: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 7h-4V5c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zm-6 0h-4V5h4v2z" />
    </svg>
  ),
  // Checkmark
  Check: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
    </svg>
  ),
  // Play button
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  // People/Group
  People: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  // Calendar
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
  // Clock/Time
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z" />
    </svg>
  ),
  // Error/Warning
  Error: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  // Empty inbox
  Inbox: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
      <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" />
    </svg>
  ),
  // Star/Sparkle
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  // Shield for security
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  ),
  // Rocket for launch
  Rocket: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57c-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zM17.65 14.81c-.26.62-.57 1.25-.91 1.85c-.47.47-.68 1.15-.55 1.81l.26 1.33l1.55-3.62l-.35.63zM14.5 9c0 .83-.67 1.5-1.5 1.5S11.5 9.83 11.5 9s.67-1.5 1.5-1.5s1.5.67 1.5 1.5zM7.41 19.59C6.5 20.5 4.5 21 3 21c0-1.5.5-3.5 1.41-4.41C5.32 15.69 6.62 15 8 15c.55 0 1 .45 1 1c0 1.38-.69 2.68-1.59 3.59z" />
    </svg>
  ),
  // Chart/Analytics
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M3.5 18.49l6-6.01l4 4L22 6.92l-1.41-1.41l-7.09 7.97l-4-4L2 16.99z" />
    </svg>
  ),
  // Logout
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  ),
  // Download
  Download: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5l-5-5l1.41-1.41L11 12.67V3h2z" />
    </svg>
  ),
  // Refresh
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  ),
  // New/Badge indicator
  New: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  // Fingerprint/Biometric
  Fingerprint: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.19.27.12.64-.15.83-.27.19-.64.12-.83-.15-.86-1.21-1.96-2.16-3.27-2.83-2.76-1.42-6.3-1.41-9.05.01-1.3.68-2.4 1.64-3.26 2.84a.471.471 0 0 1-.84 0z.84.12zM9.75 21.79a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zM16.92 19.94c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94-1.7 0-3.08-1.32-3.08-2.94 0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z" />
    </svg>
  ),
  // Arrow right
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  ),
  // Camera
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  ),
  // Document/Report
  Document: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
  // Integration/Puzzle
  Integration: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
    </svg>
  ),
  // Fire/Hot
  Fire: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  ),
  // Back arrow
  Back: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  ),
};

function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', organization: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '', position: null });
  const [totalSignups, setTotalSignups] = useState(2000);

  useEffect(() => {
    fetch(`${API_URL}/waitlist/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTotalSignups(2000 + data.stats.total);
        }
      })
      .catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '', position: null });

    try {
      const response = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '', position: data.position });
        setTotalSignups(prev => prev + 1);
      } else {
        setStatus({ loading: false, success: false, error: data.message, position: null });
      }
    } catch {
      setStatus({ loading: false, success: false, error: 'Unable to connect to server. Please try again.', position: null });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <a href="#" className="navbar-brand">
            <div className="navbar-logo">
              <img src="/android-chrome-192x192.png" alt="FaceMark" className="navbar-logo-img" />
            </div>
            <span className="navbar-title">FaceMark</span>
          </a>
          <div className="navbar-links">
            <a href="#features" className="navbar-link">Features</a>
            <a href="#how-it-works" className="navbar-link">How it Works</a>
            <a href="#waitlist" className="navbar-link">Join Waitlist</a>
          </div>
          <a href="#waitlist" className="btn btn-primary btn-glow">
            <Icons.Star />
            Get Early Access
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-layout">
            <div className="hero-content">
              <div className="hero-badge">
                <Icons.Rocket />
                <span>Launching Soon</span>
                <span className="hero-badge-dot"></span>
              </div>
              <h1 className="hero-title">
                The Future of
                <span className="hero-title-highlight">
                  <span className="hero-title-gradient">Attendance</span>
                  <svg className="hero-title-underline" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8 T200,8" stroke="url(#gradient)" strokeWidth="4" fill="none" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                is Here
              </h1>
              <p className="hero-description">
                Revolutionary face recognition technology that makes attendance tracking
                <strong> instant, secure, and contactless</strong>. No more manual logs.
                No more proxy attendance. Just look and go.
              </p>
              <div className="hero-buttons">
                <a href="#waitlist" className="btn btn-primary btn-lg btn-glow">
                  <Icons.Rocket />
                  Join the Waitlist
                </a>
                <button className="btn btn-glass btn-lg">
                  <Icons.Play /> Watch Demo
                </button>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">{totalSignups.toLocaleString()}+</span>
                  <span className="hero-stat-label">People Waiting</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-value">{"<"}1s</span>
                  <span className="hero-stat-label">Recognition Time</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-value">99.9%</span>
                  <span className="hero-stat-label">Accuracy Rate</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="video-container">
                <div className="video-glow"></div>
                <div className="video-wrapper">
                  <iframe
                    className="demo-video"
                    src="https://www.youtube.com/embed/bu8mLr4-Df8?rel=0&modestbranding=1"
                    title="FaceMark Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="floating-badge floating-badge-1">
                  <Icons.Shield />
                  <span>Secure</span>
                </div>
                <div className="floating-badge floating-badge-2">
                  <Icons.Bolt />
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge"><Icons.Star /> Features</span>
            <h2 className="section-title">Everything you need for modern attendance</h2>
            <p className="section-description">
              Built with cutting-edge technology to make attendance tracking effortless and secure.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-card-large">
              <div className="feature-card-glow"></div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon blue">
                  <Icons.Bolt />
                </div>
              </div>
              <h3 className="feature-title">Lightning Fast Recognition</h3>
              <p className="feature-description">
                Our AI processes faces in under 500ms. No waiting, no delays—just instant verification
                powered by edge computing technology.
              </p>
              <div className="feature-metric">
                <span className="feature-metric-value">{"<"}0.5s</span>
                <span className="feature-metric-label">Average Response</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">
                <Icons.Target />
              </div>
              <h3 className="feature-title">99.9% Accuracy</h3>
              <p className="feature-description">
                Advanced 3D facial mapping ensures near-perfect recognition, even with masks or glasses.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">
                <Icons.Chart />
              </div>
              <h3 className="feature-title">Smart Analytics</h3>
              <p className="feature-description">
                Real-time dashboards and automated reports give you complete visibility into attendance patterns.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon indigo">
                <Icons.Shield />
              </div>
              <h3 className="feature-title">Enterprise Security</h3>
              <p className="feature-description">
                End-to-end encryption and on-device processing keep biometric data completely private.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon teal">
                <Icons.Integration />
              </div>
              <h3 className="feature-title">Easy Integration</h3>
              <p className="feature-description">
                Works with your existing HR systems through our REST API and pre-built integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge"><Icons.Target /> Simple Process</span>
            <h2 className="section-title">Up and running in 3 easy steps</h2>
            <p className="section-description">No complex setup required. Get started in minutes.</p>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Register Faces</h3>
                <p className="step-description">
                  Employees scan their face once to create a secure digital identity. Takes just 30 seconds.
                </p>
              </div>
              <div className="step-visual">
                <div className="step-icon-visual"><Icons.Fingerprint /></div>
              </div>
            </div>

            <div className="step-connector">
              <div className="step-connector-line"></div>
              <div className="step-connector-dot"></div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Look & Go</h3>
                <p className="step-description">
                  Simply look at the camera when entering. Attendance is marked automatically and instantly.
                </p>
              </div>
              <div className="step-visual">
                <div className="step-icon-visual"><Icons.Camera /></div>
              </div>
            </div>

            <div className="step-connector">
              <div className="step-connector-line"></div>
              <div className="step-connector-dot"></div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Track & Analyze</h3>
                <p className="step-description">
                  View real-time attendance data, generate reports, and get insights all from one dashboard.
                </p>
              </div>
              <div className="step-visual">
                <div className="step-icon-visual"><Icons.Chart /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="waitlist" id="waitlist">
        <div className="container">
          <div className="waitlist-card">
            <div className="waitlist-bg-effects">
              <div className="waitlist-orb waitlist-orb-1"></div>
              <div className="waitlist-orb waitlist-orb-2"></div>
            </div>
            <div className="waitlist-content">
              <div className="waitlist-header">
                <span className="waitlist-badge"><Icons.Fire /> Limited Spots</span>
                <h2 className="waitlist-title">Be Among the First</h2>
                <p className="waitlist-description">
                  Join {totalSignups.toLocaleString()}+ forward-thinking organizations waiting to transform their attendance system.
                </p>
              </div>

              {status.success ? (
                <div className="success-container">
                  <div className="success-animation">
                    <div className="success-ring"></div>
                    <div className="success-icon">
                      <Icons.Check />
                    </div>
                  </div>
                  <h3 className="success-title">You're on the list!</h3>
                  <p className="success-text">Thank you for joining. We'll reach out with exclusive early access.</p>
                  <div className="success-position">
                    <span className="success-position-label">Your position</span>
                    <span className="success-position-value">#{2000 + status.position}</span>
                  </div>
                </div>
              ) : (
                <form className="form" onSubmit={handleSubmit}>
                  {status.error && (
                    <div className="error-message">
                      <Icons.Error />
                      {status.error}
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <div className="input-wrapper">
                        <span className="input-icon"><Icons.Person /></span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-input"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <div className="input-wrapper">
                        <span className="input-icon"><Icons.Mail /></span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="organization">
                      Organization / Role <span className="form-label-optional">(Optional)</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon"><Icons.Business /></span>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        className="form-input"
                        placeholder="Acme Inc. / HR Manager"
                        value={formData.organization}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full btn-lg btn-glow" disabled={status.loading}>
                    {status.loading ? (
                      <>
                        <span className="spinner"></span>
                        Joining...
                      </>
                    ) : (
                      <>
                        <Icons.Rocket />
                        Join the Waitlist
                      </>
                    )}
                  </button>

                  <p className="form-disclaimer">
                    <Icons.Shield /> Your information is secure. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/favicon-32x32.png" alt="FaceMark" />
            </div>
            <span>FaceMark</span>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact Us</a>
          </div>
          <div className="footer-copyright">
            © 2024 FaceMark. Revolutionizing the way you track attendance.
          </div>
        </div>
      </footer>
    </>
  );
}

function LoginPage({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        setLoggedIn(true);
        onLoginSuccess();
      } else {
        setStatus({ loading: false, error: data.message });
      }
    } catch {
      setStatus({ loading: false, error: 'Unable to connect to server. Please try again.' });
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img src="/android-chrome-192x192.png" alt="FaceMark" />
            </div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Sign in to access the waitlist dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {status.error && (
              <div className="error-message">
                <Icons.Error />
                {status.error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon"><Icons.Person /></span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Icons.Lock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Icons.Lock /> : <Icons.Shield />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg btn-glow" disabled={status.loading}>
              {status.loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <Icons.Lock />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="login-back-link">
              <Icons.Back /> Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);

    try {
      const [entriesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/waitlist`),
        fetch(`${API_URL}/waitlist/stats`)
      ]);

      const entriesData = await entriesRes.json();
      const statsData = await statsRes.json();

      if (entriesData.success) setEntries(entriesData.data);
      if (statsData.success) setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this entry?')) return;

    try {
      const response = await fetch(`${API_URL}/waitlist/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setEntries(entries.filter(entry => entry._id !== id));
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleExport = () => {
    window.open(`${API_URL}/waitlist/export`, '_blank');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    onLogout();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const goToLanding = () => {
    window.location.hash = '';
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div className="container navbar-content">
          <a href="#" onClick={(e) => { e.preventDefault(); goToLanding(); }} className="navbar-brand">
            <div className="navbar-logo">
              <img src="/android-chrome-192x192.png" alt="FaceMark" className="navbar-logo-img" />
            </div>
            <span className="navbar-title">FaceMark</span>
          </a>
          <div className="admin-nav">
            <button onClick={goToLanding} className="btn btn-secondary">
              <Icons.Back />
              Back to Site
            </button>
            <button onClick={handleLogout} className="btn btn-logout">
              <Icons.Logout />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Waitlist Dashboard</h1>
            <p className="admin-subtitle">Monitor and manage your waitlist signups</p>
          </div>
          <div className="admin-actions">
            <button onClick={handleExport} className="btn btn-secondary">
              <Icons.Download />
              <span>Export CSV</span>
            </button>
            <button onClick={() => fetchData(true)} className="btn btn-primary" disabled={refreshing}>
              {refreshing ? (
                <>
                  <span className="spinner"></span>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <Icons.Refresh />
                  <span>Refresh Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-gradient-blue">
            <div className="stat-icon-wrapper">
              <Icons.People />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total.toLocaleString()}</span>
              <span className="stat-label">Total Signups</span>
            </div>
          </div>
          <div className="stat-card stat-card-gradient-green">
            <div className="stat-icon-wrapper">
              <Icons.Calendar />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.today}</span>
              <span className="stat-label">Today</span>
            </div>
          </div>
          <div className="stat-card stat-card-gradient-orange">
            <div className="stat-icon-wrapper">
              <Icons.Clock />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.thisWeek}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">All Signups</h2>
            <span className="table-count">{entries.length} entries</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner large"></div>
              <p>Loading data...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icons.Inbox /></div>
              <h3>No signups yet</h3>
              <p>Share your waitlist page to start collecting signups!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={entry._id}>
                      <td className="table-cell-number">{entries.length - index}</td>
                      <td className="table-cell-name">{entry.name}</td>
                      <td className="table-cell-email">{entry.email}</td>
                      <td className="table-cell-org">{entry.organization || '—'}</td>
                      <td className="table-cell-date">{formatDate(entry.joinedAt)}</td>
                      <td>
                        <button onClick={() => handleDelete(entry._id)} className="btn-delete">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

  useEffect(() => {
    // Handle routing based on hash
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('landing');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsAuthenticated(false);
  };

  // Landing page
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  // Admin section
  if (currentPage === 'admin') {
    if (!isAuthenticated) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <LandingPage />;
}

export default App;
