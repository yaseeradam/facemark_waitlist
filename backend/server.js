const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Trust proxy - needed to get real IP behind reverse proxies
app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_attendance_waitlist';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Waitlist Schema with IP tracking
const waitlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    organization: {
        type: String,
        trim: true,
        default: ''
    },
    ipAddress: {
        type: String,
        trim: true,
        index: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for IP-based lookup
waitlistSchema.index({ ipAddress: 1 });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

// Helper function to get client IP
function getClientIP(req) {
    // Check various headers for the real IP (handles proxies/load balancers)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwarded.split(',')[0].trim();
    }

    return req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip ||
        'unknown';
}

// =====================
// AUTH ROUTE
// =====================

// POST - Admin Login (just validates credentials)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({
            success: true,
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// =====================
// PUBLIC ROUTES
// =====================

// POST - Add to waitlist (Public)
app.post('/api/waitlist', async (req, res) => {
    try {
        const { name, email, organization } = req.body;
        const clientIP = getClientIP(req);

        // Check if email already exists
        const existingEmail = await Waitlist.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'This email is already on the waitlist!'
            });
        }

        // Check if IP has already signed up (prevent multiple signups from same IP)
        const existingIP = await Waitlist.findOne({ ipAddress: clientIP });
        if (existingIP && clientIP !== 'unknown') {
            return res.status(400).json({
                success: false,
                message: 'You have already joined the waitlist from this device. Thank you for your interest!'
            });
        }

        // Create new entry with IP tracking
        const newEntry = new Waitlist({
            name,
            email,
            organization,
            ipAddress: clientIP
        });
        await newEntry.save();

        // Get total count
        const totalCount = await Waitlist.countDocuments();

        res.status(201).json({
            success: true,
            message: 'Successfully joined the waitlist!',
            position: totalCount,
            data: {
                name: newEntry.name,
                email: newEntry.email,
                organization: newEntry.organization,
                joinedAt: newEntry.joinedAt
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        console.error('Waitlist error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// GET - Get waitlist stats (Public - for showing count on landing page)
app.get('/api/waitlist/stats', async (req, res) => {
    try {
        const totalCount = await Waitlist.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Waitlist.countDocuments({ joinedAt: { $gte: today } });

        // Get last 7 days stats
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weekCount = await Waitlist.countDocuments({ joinedAt: { $gte: last7Days } });

        res.json({
            success: true,
            stats: {
                total: totalCount,
                today: todayCount,
                thisWeek: weekCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// =====================
// ADMIN ROUTES (no auth middleware - protected by login on frontend)
// =====================

// GET - Get all waitlist entries
app.get('/api/waitlist', async (req, res) => {
    try {
        // Don't send IP addresses to frontend for security
        const entries = await Waitlist.find()
            .select('-ipAddress')
            .sort({ joinedAt: -1 });
        const totalCount = await Waitlist.countDocuments();

        res.json({
            success: true,
            total: totalCount,
            data: entries
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE - Remove from waitlist
app.delete('/api/waitlist/:id', async (req, res) => {
    try {
        const entry = await Waitlist.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.json({ success: true, message: 'Entry removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET - Export CSV
app.get('/api/waitlist/export', async (req, res) => {
    try {
        const entries = await Waitlist.find().sort({ joinedAt: -1 });

        // Create CSV content (don't include IP for privacy)
        let csv = 'Name,Email,Organization,Joined At\n';
        entries.forEach(entry => {
            csv += `"${entry.name}","${entry.email}","${entry.organization || ''}","${entry.joinedAt.toISOString()}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/waitlist`);
    console.log(`🔐 Admin: Username: ${ADMIN_USERNAME}`);
});
