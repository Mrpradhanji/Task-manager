import { toast } from 'react-toastify';

class NotificationService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.notificationCallbacks = new Set();
  }

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket('ws://localhost:4000/ws');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    };

    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleNotification(notification);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  handleNotification(notification) {
    // Show toast notification
    toast(notification.message, {
      type: notification.type || 'info',
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Notify all registered callbacks
    this.notificationCallbacks.forEach(callback => callback(notification));
  }

  subscribe(callback) {
    this.notificationCallbacks.add(callback);
    return () => this.notificationCallbacks.delete(callback);
  }

  // Send notification to server (for testing purposes)
  sendNotification(message, type = 'info') {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({ message, type }));
    }
  }
}

export default new NotificationService(); 