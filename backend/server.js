// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files

// Configuration
const PYTHON_ML_SERVICE = 'http://localhost:5001'; // Your Python ML service URL
const PORT = process.env.PORT || 5000;

// Enhanced mock database
const detectedPosts = [
    {
        id: 1,
        platform: 'telegram',
        content: '🍁🔥 Top quality available. Wickr: dealer123 | BTC accepted #420',
        confidence: 0.89,
        keywords: ['🍁', '🔥', 'Wickr', 'BTC', '#420'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending'
    },
    {
        id: 2,
        platform: 'twitter',
        content: 'Need 🔌 in NYC? DM for menu. Cashapp/Venmo ready',
        confidence: 0.76,
        keywords: ['🔌', 'DM', 'menu', 'Cashapp'],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'pending'
    }
];

// API Routes

// Get all detected posts
app.get('/api/detections', (req, res) => {
    try {
        res.json({
            success: true,
            count: detectedPosts.length,
            data: detectedPosts
        });
    } catch (error) {
        console.error('Error fetching detections:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Analyze text (now connects to Python ML service)
app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid input: text is required' 
            });
        }

        // Call Python ML service
        const mlResponse = await axios.post(`${PYTHON_ML_SERVICE}/predict`, { text });
        const { confidence } = mlResponse.data;
        
        // Local keyword detection
        const keywords = detectKeywords(text);
        
        // Create new detection record
        const newDetection = {
            id: detectedPosts.length + 1,
            platform: 'manual',
            content: text,
            confidence,
            keywords,
            timestamp: new Date(),
            status: 'reviewed'
        };
        
        detectedPosts.unshift(newDetection); // Add to beginning of array
        
        res.json({
            success: true,
            data: {
                ...newDetection,
                isSuspicious: confidence > 0.7
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        
        // Fallback to mock analysis if ML service is down
        if (error.code === 'ECONNREFUSED') {
            console.warn('ML service unavailable, using mock analysis');
            const { text } = req.body;
            const keywords = detectKeywords(text);
            const confidence = calculateConfidence(text);
            
            res.json({
                success: true,
                data: {
                    keywords,
                    confidence,
                    isSuspicious: confidence > 0.7,
                    warning: 'ML service unavailable - using mock analysis'
                }
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Analysis failed',
                details: error.message 
            });
        }
    }
});

// Helper functions
function detectKeywords(text) {
    const drugKeywords = [
        '🍁', '🔥', '🔌', 'Wickr', 'Signal', 'BTC', 
        '#420', 'menu', 'DM', '🍄', '❄️', '💊',
        'plug', 'score', 'ounce', 'gram', 'kush'
    ];
    return drugKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
    );
}

function calculateConfidence(text) {
    const keywords = detectKeywords(text);
    let score = keywords.length * 0.15;
    
    // Boost score for certain patterns
    if (text.includes('@') || text.includes(':')) score += 0.2;
    if (text.match(/\d{3}-\d{3}-\d{4}/)) score += 0.3; // Phone pattern
    if (text.includes('http') || text.includes('.com')) score += 0.15;
    
    return Math.min(0.99, score);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`ML Service: ${PYTHON_ML_SERVICE}`);
    console.log(`API Endpoints:
  GET    /api/detections
  POST   /api/analyze { text: string }
`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\nServer shutting down...');
    process.exit(0);
});