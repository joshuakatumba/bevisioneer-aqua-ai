import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

// --- Types ---
export interface ReportData {
    id?: string;
    sourceName: string; // e.g., "Village Well #3" or "Current Location"
    status: 'Safe' | 'Caution' | 'Unsafe';
    coordinates: {
        lat: number;
        lng: number;
    };
    turbidity: number;
    reportedAt: string; // ISO string
}

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCxLY1Kwy3NWU0zmL4wLkArnKw3plgx2LE",
    authDomain: "aqua-ai-11885.firebaseapp.com",
    projectId: "aqua-ai-11885",
    storageBucket: "aqua-ai-11885.firebasestorage.app",
    messagingSenderId: "247341765280",
    appId: "1:247341765280:web:14154fac4949088b6cefc5",
    measurementId: "G-JBTBXGX3T9"
};

// Initialize Firebase
let db: any;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
} catch (e) {
    console.warn("Firebase init failed:", e);
}

// --- LOCAL STORAGE FALLBACK (For Demo/Dev) ---
const LOCAL_STORAGE_KEY = 'aqua_ai_reports';

const getLocalReports = (): ReportData[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveLocalReport = (report: ReportData) => {
    const reports = getLocalReports();
    reports.unshift(report);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
};


// --- SERVICE METHODS ---

export const saveReport = async (report: ReportData): Promise<void> => {
    console.log("Saving Report:", report);

    // 1. Try Firebase if configured
    if (db) {
        try {
            await addDoc(collection(db, "reports"), {
                ...report,
                reportedAt: Timestamp.fromDate(new Date(report.reportedAt)) // Use Firestore Timestamp
            });
            return;
        } catch (e) {
            console.error("Firebase save failed, falling back to local:", e);
        }
    }

    // 2. Fallback to Local Storage
    saveLocalReport(report);
    return Promise.resolve();
};

export const subscribeToReports = (callback: (reports: ReportData[]) => void): () => void => {
    // 1. Try Firebase Real-time Listener
    if (db) {
        try {
            const q = query(collection(db, "reports"), orderBy("reportedAt", "desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
                const reports: ReportData[] = [];
                querySnapshot.forEach((doc: any) => {
                    const data = doc.data();
                    reports.push({
                        id: doc.id,
                        sourceName: data.sourceName,
                        status: data.status,
                        coordinates: data.coordinates,
                        turbidity: data.turbidity,
                        reportedAt: data.reportedAt instanceof Timestamp ? data.reportedAt.toDate().toISOString() : data.reportedAt
                    });
                });
                callback(reports);
            });
            return unsubscribe;
        } catch (e) {
            console.error("Firebase subscribe failed:", e);
        }
    }

    // 2. Fallback: Return local data immediately and poll/listen
    // For simple demo, we just return current data once. 
    // To make it "live" for local, we'd need a custom event listener, but for now refreshing page works or manual update.
    callback(getLocalReports());

    // Return dummy unsubscribe
    return () => { };
};
