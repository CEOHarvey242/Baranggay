# Backend Server

Node.js backend server for handling push notifications via Firebase Cloud Messaging.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add Firebase service account key:
   - Download from Firebase Console → Project Settings → Service Accounts
   - Save as `serviceAccountKey.json` in this directory

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/status` - Get server status and registered device count
- `POST /api/register-token` - Register device FCM token
  ```json
  { "token": "fcm_token_here" }
  ```
- `POST /api/send-notification` - Send notification to all devices
  ```json
  {
    "title": "Alert Title",
    "body": "Alert Message",
    "type": "emergency"
  }
  ```
- `POST /api/emergency-water-alert` - Send water level alert
  ```json
  {
    "level": "critical",
    "message": "Custom message (optional)"
  }
  ```
- `POST /api/announcement` - Send general announcement
  ```json
  {
    "title": "Announcement Title",
    "message": "Announcement content"
  }
  ```

## Port Configuration

Default port is 3000. Change in `.env` file or environment variable:
```env
PORT=3000
```

## Production Deployment

For production, consider:
- Using environment variables for Firebase credentials
- Implementing authentication
- Using a database for token storage
- Adding rate limiting
- Enabling HTTPS
- Using process manager like PM2

