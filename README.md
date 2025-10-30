# Barangay Emergency Notification System

A complete notification system for barangay (community) announcements and emergency alerts. This system consists of:
- **Mobile App (Flutter)**: For residents to receive push notifications
- **Website Dashboard**: For barangay officials to send alerts
- **Backend Server (Node.js)**: Handles notification delivery via Firebase Cloud Messaging

## Features

- 📱 Push notifications for residents
- 💧 Water level alerts
- 📢 General announcements  
- 🚨 Emergency alerts
- 🌐 Web dashboard for sending notifications
- 📊 Real-time device status tracking

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **Flutter SDK** (v3.0 or higher) - [Install Guide](https://flutter.dev/docs/get-started/install)
3. **Firebase Account** - [Create Account](https://firebase.google.com/)

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Cloud Messaging** in Firebase Console
4. Add Android app:
   - Package name: `com.barangay.notifications` (or your choice)
   - Download `google-services.json` → place in `mobile-app/android/app/`
5. Add iOS app (optional):
   - Bundle ID: `com.barangay.notifications` (or your choice)
   - Download `GoogleService-Info.plist` → place in `mobile-app/ios/Runner/`
6. Generate Service Account Key:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `backend/serviceAccountKey.json`

### Step 2: Backend Setup

```bash
cd backend
npm install

# Create .env file
PORT=3000

# Add your service account key to serviceAccountKey.json
# (From Firebase Console → Service Accounts)

# Start the server
npm start
```

The backend will run on `http://localhost:3000`

### Step 3: Mobile App Setup

```bash
cd mobile-app

# Install dependencies
flutter pub get

# For Android: Copy google-services.json to android/app/

# Update the backend URL in lib/main.dart
# Change: const backendUrl = 'http://YOUR_SERVER_IP:3000/api/register-token';
# Replace YOUR_SERVER_IP with your computer's IP address
# Example: 'http://192.168.1.100:3000/api/register-token'

# Run the app
flutter run
```

### Step 4: Website Setup

1. Open `website/index.html` in a web browser
2. Update the API URL in `website/script.js` if your backend is on a different IP:
   ```javascript
   const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
   ```
3. For production, you can use a simple web server:
   ```bash
   cd website
   # Using Python
   python -m http.server 8000
   # Or using Node.js http-server
   npx http-server -p 8000
   ```

## Usage

### For Barangay Officials (Website)

1. Open the website dashboard
2. Check the status bar to see connected devices
3. Send notifications:
   - **Water Level Alert**: Select level and send water level warnings
   - **General Announcement**: Send regular barangay announcements
   - **Emergency Alert**: Send urgent emergency notifications

### For Residents (Mobile App)

1. Install the app on your device
2. Allow notification permissions when prompted
3. The app will automatically register for notifications
4. When officials send alerts, you'll receive push notifications
5. View notification history in the app

## Network Configuration

**Important**: For the mobile app to connect to your backend:

1. Make sure your computer and mobile device are on the same network
2. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
3. Update the backend URL in `mobile-app/lib/main.dart`
4. Update the API URL in `website/script.js`
5. **Firewall**: Allow incoming connections on port 3000

## Project Structure

```
.
├── mobile-app/          # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart
│   │   └── notification_service.dart
│   └── pubspec.yaml
├── backend/             # Node.js server
│   ├── server.js
│   ├── package.json
│   └── serviceAccountKey.json (add this)
├── website/             # Web dashboard
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── README.md
```

## Troubleshooting

### Mobile app not receiving notifications
- Check if FCM token is registered (check backend logs)
- Verify Firebase configuration files are in place
- Ensure notification permissions are granted on device
- Check backend server is running and accessible

### Backend connection issues
- Verify server IP address is correct
- Check firewall settings
- Ensure mobile device and server are on same network
- Test API endpoint: `http://YOUR_IP:3000/api/status`

### Firebase errors
- Verify `serviceAccountKey.json` is correct
- Check Firebase project has Cloud Messaging enabled
- Ensure `google-services.json` is in correct location

## Security Notes

For production use:
- Use HTTPS for backend API
- Store service account key securely
- Add authentication to web dashboard
- Use environment variables for sensitive data
- Consider using a proper database instead of in-memory token storage

## License

This project is for barangay/public use.

## Support

For issues or questions, check:
- Firebase Cloud Messaging Documentation
- Flutter Documentation
- Node.js Documentation

