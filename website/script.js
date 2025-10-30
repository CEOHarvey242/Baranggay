// When the website is served by the backend, same-origin calls work via '/api'
const API_BASE_URL = '/api';

// Check server status on load
document.addEventListener('DOMContentLoaded', () => {
    checkServerStatus();
    setInterval(checkServerStatus, 30000); // Check every 30 seconds
});

async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        document.getElementById('serverStatus').textContent = 'Connected';
        document.getElementById('serverStatus').style.color = '#10b981';
        document.getElementById('deviceCount').textContent = data.registeredDevices || 0;
    } catch (error) {
        document.getElementById('serverStatus').textContent = 'Disconnected';
        document.getElementById('serverStatus').style.color = '#ef4444';
        document.getElementById('deviceCount').textContent = '-';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

async function sendWaterAlert() {
    const level = document.getElementById('waterLevel').value;
    const customMessage = document.getElementById('waterMessage').value;
    const btn = event.target;
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/emergency-water-alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                level: level,
                message: customMessage,
            }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`✅ Water alert sent to ${data.sent} device(s)!`, 'success');
            document.getElementById('waterMessage').value = '';
        } else {
            showNotification(`❌ Error: ${data.message}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ Failed to send alert: ${error.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

async function sendAnnouncement() {
    const title = document.getElementById('announcementTitle').value.trim();
    const message = document.getElementById('announcementMessage').value.trim();
    const btn = event.target;
    
    if (!title || !message) {
        showNotification('❌ Please fill in both title and message', 'error');
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/announcement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                message: message,
            }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`✅ Announcement sent to ${data.sent} device(s)!`, 'success');
            document.getElementById('announcementTitle').value = '';
            document.getElementById('announcementMessage').value = '';
        } else {
            showNotification(`❌ Error: ${data.message}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ Failed to send announcement: ${error.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

async function sendEmergencyAlert() {
    const title = document.getElementById('emergencyTitle').value.trim();
    const message = document.getElementById('emergencyMessage').value.trim();
    const btn = event.target;
    
    if (!title || !message) {
        showNotification('❌ Please fill in both title and message', 'error');
        return;
    }
    
    if (!confirm('⚠️ Are you sure you want to send an EMERGENCY ALERT to all residents?')) {
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/send-notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: `🚨 ${title}`,
                body: message,
                type: 'emergency',
            }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`✅ Emergency alert sent to ${data.sent} device(s)!`, 'success');
            document.getElementById('emergencyTitle').value = '';
            document.getElementById('emergencyMessage').value = '';
        } else {
            showNotification(`❌ Error: ${data.message}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ Failed to send emergency alert: ${error.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

