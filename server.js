require('dotenv').config(); 
const express = require('express');
const path = require("path");
const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistence: Redis Connection
const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (err) => console.error('Redis Error', err));
redis.connect().then(() => console.log("Connected to Redis"));

// Deterministic Time Helper for Automated Testing
const getNow = (req) => {
    if (process.env.TEST_MODE === "1" && req.headers['x-test-now-ms']) {
        return parseInt(req.headers['x-test-now-ms']);
    }
    return Date.now();
};

// --- API ROUTES ---

// GET /api/healthz
app.get('/api/healthz', async (req, res) => {
    try {
        await redis.ping();
        res.status(200).json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
});

// POST /api/pastes
app.post('/api/pastes', async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: "content is required" });
    }

    const id = uuidv4();
    const expires_at = ttl_seconds ? Date.now() + (ttl_seconds * 1000) : null;

    const paste = {
        content,
        expires_at,
        remaining_views: max_views ? parseInt(max_views) : null
    };

    await redis.set(`paste:${id}`, JSON.stringify(paste));
    
    res.status(201).json({
        id: id,
        url: `${req.protocol}://${req.get('host')}/p/${id}`
    });
});

// GET /api/pastes/:id (JSON Data)
app.get('/api/pastes/:id', async (req, res) => {
    const raw = await redis.get(`paste:${req.params.id}`);
    if (!raw) return res.status(404).json({ error: "Not found" });

    const paste = JSON.parse(raw);
    const now = getNow(req);

    // Check availability
    if ((paste.expires_at && now > paste.expires_at) || 
        (paste.remaining_views !== null && paste.remaining_views <= 0)) {
        return res.status(404).json({ error: "Unavailable" });
    }

    // Decrement views
    if (paste.remaining_views !== null) {
        paste.remaining_views -= 1;
        await redis.set(`paste:${req.params.id}`, JSON.stringify(paste));
    }

    res.json({
        content: paste.content,
        remaining_views: paste.remaining_views,
        expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
    });
});

// --- USER INTERFACE ROUTES ---

// GET /p/:id (HTML Rendered View) 
app.get('/p/:id', async (req, res) => {
    const raw = await redis.get(`paste:${req.params.id}`);
    if (!raw) return res.status(404).send("Not Found");

    const paste = JSON.parse(raw);
    const now = getNow(req);

    // Check availability
    if ((paste.expires_at && now > paste.expires_at) || 
        (paste.remaining_views !== null && paste.remaining_views <= 0)) {
        return res.status(404).send("This paste is no longer available.");
    }

    // Decrement views for the HTML view too!
    if (paste.remaining_views !== null) {
        paste.remaining_views -= 1;
        await redis.set(`paste:${req.params.id}`, JSON.stringify(paste));
    }

    //unav
    if ((paste.expires_at && now > paste.expires_at) || 
    (paste.remaining_views !== null && paste.remaining_views <= 0)) {
    
    return res.status(404).send("This paste is no longer available.");
}
    res.render('view', { content: paste.content });
});

// Explicit route for index.html if static middleware is bypassed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));