# Quick Setup Guide

Follow these steps to get your notification system running:

## 1. Firebase Setup (5 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "Barangay Notifications"
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Cloud Messaging
1. In Firebase Console, click "Cloud Messaging" in left menu
2. If prompted, click "Enable"

### Add Android App
1. Click "Add app" → Android icon
2. Package name: `com.barangay.notifications`
3. Download `google-services.json`
4. Copy to: `mobile-app/android/app/google-services.json`

### Add iOS App (Optional)
1. Click "Add app" → iOS icon
2. Bundle ID: `com.barangay.notifications`
3. Download `GoogleService-Info.plist`
4. Copy to: `mobile-app/ios/Runner/GoogleService-Info.plist`

### Get Service Account Key
1. Go to Project Settings (gear icon) → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Save as: `backend/serviceAccountKey.json`

## 2. Backend Setup (2 minutes)

```bash
cd backend
npm install

# Make sure serviceAccountKey.json is in this folder

npm start
```

Server will run on http://localhost:3000

## 3. Find Your IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your network adapter
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" address (usually starts with 192.168.x.x)
```

**Example:** `192.168.1.100`

## 4. Update Configuration Files

### Mobile App
Edit: `mobile-app/lib/main.dart`
```dart
// Line 144, change:
const backendUrl = 'http://YOUR_IP_ADDRESS:3000/api/register-token';
// Example:
const backendUrl = 'http://192.168.1.100:3000/api/register-token';
```

### Website
Edit: `website/script.js`
```javascript
// Line 1, change:
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
// Example:
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

## 5. Generate Firebase Options (Mobile App)

### Option A: Using FlutterFire CLI (Recommended)
```bash
cd mobile-app
dart pub global activate flutterfire_cli
flutterfire configure
```

### Option B: Manual Configuration
Edit `mobile-app/lib/firebase_options.dart` with values from:
- Firebase Console → Project Settings → Your apps
- Copy values from `google-services.json` or `GoogleService-Info.plist`

## 6. Run Mobile App

```bash
cd mobile-app
flutter pub get
flutter run
```

**On physical device:**
- Connect device via USB or WiFi
- Enable USB debugging (Android) or trust computer (iOS)
- `flutter devices` to see connected devices
- `flutter run` to install and run

## 7. Open Website

1. Open `website/index.html` in a web browser
2. Or use a simple server:
   ```bash
   cd website
   python -m http.server 8000
   # Then open http://localhost:8000
   ```

## 7. Test System

1. **Mobile App**: Install and open - should show "Notifications Active"
2. **Website**: Check status bar shows "1 Registered Device"
3. **Send Test**: Click "Send Announcement" with test message
4. **Mobile App**: Should receive notification immediately!

## Troubleshooting

### App won't connect to backend
- Check firewall allows port 3000
- Verify IP address is correct
- Ensure phone and computer on same WiFi network
- Try stopping/restarting backend server

### No notifications received
- Check Firebase console for errors
- Verify `google-services.json` is in correct location
- Check mobile app logs: `flutter logs`
- Ensure notification permissions granted

### Backend errors
- Verify `serviceAccountKey.json` is correct
- Check Firebase project has Cloud Messaging enabled
- Restart backend server

## Build for Distribution

### Android APK
```bash
cd mobile-app
flutter build apk --release
```
Share: `build/app/outputs/flutter-apk/app-release.apk`

### iOS (Requires Mac & Apple Developer account)
```bash
flutter build ios --release
```

## Next Steps

- Add authentication to website
- Store FCM tokens in database
- Add notification history/logs
- Configure for production deployment

