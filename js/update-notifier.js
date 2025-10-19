/**
 * Service Worker Update Notifier
 * 
 * This script handles displaying update notifications when the service worker
 * detects a new version of the app.
 */

class UpdateNotifier {
    /**
     * Initialize the update notifier
     */
    static init() {
        // Check if service workers are supported
        if (!('serviceWorker' in navigator)) {
            return;
        }
        
        // Listen for service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
        
        // Check for updates periodically
        this.checkForUpdates();
        setInterval(() => this.checkForUpdates(), 60 * 60 * 1000); // Check every hour
    }
    
    /**
     * Check for service worker updates
     */
    static async checkForUpdates() {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.update();
        } catch (err) {
            console.error('Error checking for service worker updates:', err);
        }
    }
    
    /**
     * Show update notification
     */
    static showUpdateNotification() {
        // Remove any existing notification
        this.removeUpdateNotification();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'sw-update-notification';
        notification.style.position = 'fixed';
        notification.style.top = '0';
        notification.style.left = '0';
        notification.style.right = '0';
        notification.style.backgroundColor = '#26374D'; // True Navy color
        notification.style.color = 'white';
        notification.style.padding = '12px';
        notification.style.textAlign = 'center';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'center';
        notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        
        // Add refresh icon and text
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
                </svg>
                <span>App updated. Refreshing...</span>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
    }
    
    /**
     * Remove update notification
     */
    static removeUpdateNotification() {
        const notification = document.getElementById('sw-update-notification');
        if (notification) {
            notification.remove();
        }
    }
}

// Initialize the update notifier
UpdateNotifier.init();
