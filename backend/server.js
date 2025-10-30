const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  try {
    // Use service account from environment variable or file
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require('./serviceAccountKey.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error.message);
    console.log('Make sure to set up Firebase service account key');
  }
}

// Store FCM tokens (in production, use a database)
const fcmTokens = new Set();

// Serve website UI from /website
const websiteDir = path.join(__dirname, '..', 'website');
app.use(express.static(websiteDir));

// Root route serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(websiteDir, 'index.html'));
});

// Simple ping endpoint to test POSTs
app.post('/api/ping', (req, res) => {
  const { message } = req.body || {};
  res.json({ success: true, pong: true, echo: message ?? null, timestamp: new Date().toISOString() });
});

// Register device token
app.post('/api/register-token', (req, res) => {
  const { token } = req.body;
  if (token) {
    fcmTokens.add(token);
    console.log('Token registered:', token.substring(0, 20) + '...');
    res.json({ success: true, message: 'Token registered' });
  } else {
    res.status(400).json({ success: false, message: 'Token required' });
  }
});

// Send notification to all devices
app.post('/api/send-notification', async (req, res) => {
  try {
    const { title, body, type = 'general' } = req.body;

    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and body are required' 
      });
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: type,
        timestamp: new Date().toISOString(),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'barangay_channel',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    // Send to all registered tokens
    const tokens = Array.from(fcmTokens);
    
    if (tokens.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No devices registered' 
      });
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokens,
      ...message,
    });

    console.log(`Successfully sent ${response.successCount} notifications`);
    console.log(`Failed: ${response.failureCount}`);

    // Remove invalid tokens
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error) {
        if (resp.error.code === 'messaging/invalid-registration-token' ||
            resp.error.code === 'messaging/registration-token-not-registered') {
          fcmTokens.delete(tokens[idx]);
          console.log('Removed invalid token');
        }
      }
    });

    res.json({
      success: true,
      message: 'Notifications sent',
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending notification',
      error: error.message 
    });
  }
});

// Emergency water level alert endpoint
app.post('/api/emergency-water-alert', async (req, res) => {
  try {
    const { level, message: customMessage } = req.body;
    
    const title = '🚨 Water Level Alert';
    const body = customMessage || `Water level has reached ${level || 'CRITICAL'} level. Please take necessary precautions.`;
    
    const result = await sendNotificationToAll(title, body, 'water_level');
    res.json(result);
  } catch (error) {
    console.error('Error sending water alert:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending alert',
      error: error.message 
    });
  }
});

// General announcement endpoint
app.post('/api/announcement', async (req, res) => {
  try {
    const { title, message } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and message are required' 
      });
    }

    const result = await sendNotificationToAll(title, message, 'announcement');
    res.json(result);
  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending announcement',
      error: error.message 
    });
  }
});

// Helper function to send notifications
async function sendNotificationToAll(title, body, type) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      type: type,
      timestamp: new Date().toISOString(),
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'barangay_channel',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  const tokens = Array.from(fcmTokens);
  
  if (tokens.length === 0) {
    return { success: false, message: 'No devices registered' };
  }

  const response = await admin.messaging().sendEachForMulticast({
    tokens: tokens,
    ...message,
  });

  // Clean up invalid tokens
  response.responses.forEach((resp, idx) => {
    if (!resp.success && resp.error) {
      if (resp.error.code === 'messaging/invalid-registration-token' ||
          resp.error.code === 'messaging/registration-token-not-registered') {
        fcmTokens.delete(tokens[idx]);
      }
    }
  });

  return {
    success: true,
    message: 'Notifications sent',
    sent: response.successCount,
    failed: response.failureCount,
  };
}

// Get server status
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    registeredDevices: fcmTokens.size,
    status: 'running',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});

