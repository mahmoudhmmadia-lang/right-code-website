import { fcmToken, lang, response } from "@/context/global";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const setupNotifications = async () => {
  try {
    if (!(await isSupported())) return;

    const notificationsPermission = await navigator.permissions.query({
      name: "notifications",
    });

    if (notificationsPermission.state !== "granted") {
      response.value = {
        type: "warning",
        message:
          lang.value === "ar"
            ? "Enable notifications to receive alerts."
            : "Enable notifications to receive alerts.",
      };
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const messaging = getMessaging(app);
      fcmToken.value = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
    }
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
};

export { app, setupNotifications };
