# 🚀 Start Barangay Notification System

## Quick Start Guide

### Step 1: Start Backend Server
Open a terminal and run:
```bash
cd backend
npm install  # (only first time)
npm start
```
Server will run on: `http://192.168.254.107:3000`

### Step 2: Start Website Dashboard
Open `website/index.html` in a web browser, or use:
```bash
cd website
python -m http.server 8000
# Then open http://localhost:8000
```

### Step 3: Mobile App (Already Running)
The app should be installed on your device (RMX3834).
If not, run:
```bash
cd mobile-app
flutter run
```

## Test the System

1. **Check Backend**: Open http://192.168.254.107:3000/api/status
   - Should see: `{"success":true,"registeredDevices":0,"status":"running"}`

2. **Open Mobile App**: 
   - Allow notification permissions
   - App will automatically register with backend
   - Should show "Notifications Active"

3. **Open Website Dashboard**:
   - Status should show "1 Registered Device"
   - Send a test announcement

4. **Verify Notification**:
   - Check mobile app - should receive notification!

## Configuration

- **Backend IP**: 192.168.254.107:3000
- **Mobile App**: Configured to connect to backend
- **Website**: Configured to use backend API

## Troubleshooting

- **No devices showing**: Make sure mobile app is open and has internet permission
- **Notifications not received**: Check backend logs, verify Firebase setup
- **Connection errors**: Ensure phone and computer are on same WiFi network

## Next Steps

1. Update Firebase configuration in `mobile-app/lib/firebase_options.dart`
2. Add your Firebase `google-services.json` to `mobile-app/android/app/`
3. Add Firebase `serviceAccountKey.json` to `backend/`

