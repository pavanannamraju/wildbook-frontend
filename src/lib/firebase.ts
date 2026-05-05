import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
};

declare global {
  interface Window {
    __WILDBOOK_CONFIG__?: {
      firebase?: Partial<FirebaseConfig>;
    };
  }
}

function readFirebaseConfig(): FirebaseConfig {
  const config = window.__WILDBOOK_CONFIG__?.firebase;
  if (!config) {
    throw new Error("Missing frontend firebase config.");
  }
  const { apiKey, authDomain, projectId, appId } = config;
  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error("Incomplete frontend firebase config.");
  }
  return { apiKey, authDomain, projectId, appId };
}

const firebaseConfig = readFirebaseConfig();

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
