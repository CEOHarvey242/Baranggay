# Barangay Emergency Notification System - Project Overview

## What You Have

A complete notification system with three main components:

### 1. 📱 Mobile App (Flutter)
**Location:** `mobile-app/`

- Residents install this app on their phones
- Automatically registers for push notifications
- Receives alerts when you send them from the website
- Shows notification history
- Works on Android and iOS

**Features:**
- ✅ Push notifications (even when app is closed)
- ✅ Notification history
- ✅ Different alert types (Water Level, Emergency, Announcement)
- ✅ Beautiful, user-friendly interface

### 2. 🌐 Website Dashboard
**Location:** `website/`

- Web interface for barangay officials
- Send notifications with one click
- Real-time status of connected devices
- Three types of alerts:
  - 💧 Water Level Alerts
  - 📢 General Announcements
  - 🚨 Emergency Alerts

**Features:**
- ✅ Modern, responsive design
- ✅ Easy-to-use interface
- ✅ Device count tracking
- ✅ Confirmation messages

### 3. ⚙️ Backend Server (Node.js)
**Location:** `backend/`

- Handles communication between website and mobile apps
- Uses Firebase Cloud Messaging for push notifications
- Stores registered device tokens
- API endpoints for sending notifications

**Features:**
- ✅ RESTful API
- ✅ Automatic token management
- ✅ Error handling
- ✅ Status monitoring

## How It Works

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Website   │────────▶│   Backend   │────────▶│     FCM      │
│  Dashboard  │  API    │   Server    │  Push   │  (Firebase)  │
└─────────────┘         └─────────────┘         └──────┬───────┘
                                                        │
                                                        │ Push
                                                        │ Notification
                                                        ▼
                                               ┌─────────────┐
                                               │   Mobile    │
                                               │     App     │
                                               │  (Resident) │
                                               └─────────────┘
```

**Flow:**
1. Official opens website and clicks "Send Alert"
2. Website sends request to backend API
3. Backend server sends push notification via Firebase
4. All registered mobile apps receive the notification
5. Resident sees alert on their phone

## File Structure

```
barangay-notifications/
├── mobile-app/              # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart       # Main app code
│   │   ├── notification_service.dart
│   │   └── firebase_options.dart
│   ├── android/
│   │   └── app/
│   │       └── google-services.json  # Add this from Firebase
│   └── pubspec.yaml
│
├── backend/                 # Node.js server
│   ├── server.js           # Main server code
│   ├── package.json
│   └── serviceAccountKey.json  # Add this from Firebase
│
├── website/                 # Web dashboard
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
└── README.md               # Full documentation
```

## Key Technologies

- **Flutter**: Cross-platform mobile app framework
- **Firebase Cloud Messaging**: Push notification service
- **Node.js/Express**: Backend server
- **HTML/CSS/JavaScript**: Web dashboard

## Quick Start Checklist

- [ ] Set up Firebase project
- [ ] Download `google-services.json` → `mobile-app/android/app/`
- [ ] Download `serviceAccountKey.json` → `backend/`
- [ ] Run `npm install` in `backend/`
- [ ] Start backend server: `npm start`
- [ ] Update IP address in `mobile-app/lib/main.dart`
- [ ] Update IP address in `website/script.js`
- [ ] Run `flutter pub get` in `mobile-app/`
- [ ] Run `flutter run` to test mobile app
- [ ] Open `website/index.html` in browser
- [ ] Send test notification!

## Usage Scenarios

### Water Level Alert
1. Open website
2. Select water level (Low/Normal/High/Critical)
3. Add custom message (optional)
4. Click "Send Water Level Alert"
5. All residents get notification immediately

### General Announcement
1. Open website
2. Enter title (e.g., "Community Meeting")
3. Enter message (e.g., "Meeting on Saturday at 2PM")
4. Click "Send Announcement"
5. All residents notified

### Emergency Alert
1. Open website
2. Enter emergency title
3. Enter emergency message
4. Click "SEND EMERGENCY ALERT"
5. Confirmation dialog appears
6. All residents receive urgent notification

## Important Notes

1. **Network**: Mobile devices and server must be on same WiFi network for local testing
2. **Firewall**: Ensure port 3000 is open for backend server
3. **Firebase**: Keep service account key secure - don't share publicly
4. **Production**: For real deployment, use HTTPS and proper authentication

## Support

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `README.md` for full documentation
- Check Firebase Console for service status
- Check backend logs for API errors

## Next Steps (Optional Enhancements)

- [ ] Add user authentication to website
- [ ] Store notification history in database
- [ ] Add user management (register residents)
- [ ] Send targeted notifications to specific groups
- [ ] Add notification templates
- [ ] Add analytics and reporting
- [ ] Deploy to production server

