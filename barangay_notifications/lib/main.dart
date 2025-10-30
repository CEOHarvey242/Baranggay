import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

// CHANGE THIS to your website base URL (no trailing slash)
const String baseUrl = 'http://192.168.254.107:3000';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Website Connector',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const ApiHomeScreen(),
    );
  }
}

class ApiHomeScreen extends StatefulWidget {
  const ApiHomeScreen({super.key});

  @override
  State<ApiHomeScreen> createState() => _ApiHomeScreenState();
}

class _ApiHomeScreenState extends State<ApiHomeScreen> {
  bool _loading = false;
  String _error = '';
  dynamic _data;
  String _token = '';

  @override
  void initState() {
    super.initState();
    _initPush();
  }

  Future<void> _initPush() async {
    try {
      final fcm = FirebaseMessaging.instance;
      final settings = await fcm.requestPermission(alert: true, badge: true, sound: true);
      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        final token = await fcm.getToken();
        if (token != null) {
          setState(() => _token = token);
          // Register token with backend
          await http.post(
            Uri.parse('$baseUrl/api/register-token'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'token': token}),
          );
        }
        // Listen to token refresh
        fcm.onTokenRefresh.listen((newToken) async {
          setState(() => _token = newToken);
          await http.post(
            Uri.parse('$baseUrl/api/register-token'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'token': newToken}),
          );
        });
        // Foreground messages
        FirebaseMessaging.onMessage.listen((RemoteMessage message) {
          final title = message.notification?.title ?? 'Notification';
          final body = message.notification?.body ?? '';
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('$title\n$body')),
          );
        });
      } else {
        setState(() => _token = 'Permission denied');
      }
    } catch (e) {
      setState(() => _token = 'Push error: $e');
    }
  }

  Future<void> _fetchSample() async {
    setState(() {
      _loading = true;
      _error = '';
      _data = null;
    });
    try {
      final uri = Uri.parse('$baseUrl/api/status');
      final res = await http.get(uri, headers: {
        'Accept': 'application/json',
      });
      if (res.statusCode >= 200 && res.statusCode < 300) {
        final body = res.body.isEmpty ? {} : jsonDecode(res.body);
        setState(() {
          _data = body;
        });
      } else {
        setState(() {
          _error = 'HTTP ${res.statusCode}: ${res.reasonPhrase ?? 'Request failed'}';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Network error: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _postSample() async {
    setState(() {
      _loading = true;
      _error = '';
      _data = null;
    });
    try {
      final uri = Uri.parse('$baseUrl/api/ping');
      final res = await http.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({'message': 'hello from app'}),
      );
      if (res.statusCode >= 200 && res.statusCode < 300) {
        final body = res.body.isEmpty ? {} : jsonDecode(res.body);
        setState(() {
          _data = body;
        });
      } else {
        setState(() {
          _error = 'HTTP ${res.statusCode}: ${res.reasonPhrase ?? 'Request failed'}';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Network error: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connect to Website'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              elevation: 1,
              child: ListTile(
                title: const Text('Base URL'),
                subtitle: Text(baseUrl),
                trailing: const Icon(Icons.link),
              ),
            ),
            const SizedBox(height: 8),
            if (_token.isNotEmpty) Card(
              elevation: 1,
              child: ListTile(
                title: const Text('FCM Token (registered)'),
                subtitle: Text(_token.length > 28 ? '${_token.substring(0, 28)}...' : _token),
                leading: const Icon(Icons.notifications_active),
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                ElevatedButton.icon(
                  onPressed: _loading ? null : _fetchSample,
                  icon: const Icon(Icons.cloud_download),
                  label: const Text('GET /api/status'),
                ),
                ElevatedButton.icon(
                  onPressed: _loading ? null : _postSample,
                  icon: const Icon(Icons.cloud_upload),
                  label: const Text('POST /api/ping'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_loading) const Center(child: CircularProgressIndicator()),
            if (_error.isNotEmpty) Text(_error, style: const TextStyle(color: Colors.red)),
            if (!_loading && _error.isEmpty && _data != null) ...[
              const Text('Response:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Expanded(
                child: SingleChildScrollView(
                  child: Text(const JsonEncoder.withIndent('  ').convert(_data)),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
