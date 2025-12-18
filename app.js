// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const { useState, useEffect, useMemo, useRef } = React;
const { jsPDF } = window.jspdf;

const firebaseConfig = {
    apiKey: "AIzaSyB6AKWdDANzAjr5OHeskhT_KF_Gyco2fVY",
    authDomain: "guardias-5c5d9.firebaseapp.com",
    projectId: "guardias-5c5d9",
    storageBucket: "guardias-5c5d9.firebasestorage.app",
    messagingSenderId: "954058300552",
    appId: "1:954058300552:web:00135945002743e223d33d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ... (Pega aquí todas las funciones de Íconos y Helpers que tenías) ...

function App() {
    const [view, setView] = useState('calendario');
    const [user, setUser] = useState(null);
    // ... otros estados ...

    useEffect(() => {
        signInAnonymously(auth);
        onAuthStateChanged(auth, (u) => setUser(u));
    }, []);

    // DEFINE TODAS LAS VISTAS AQUÍ (VistaCalendario, VistaLicencias, etc.)
    // Asegúrate de que VistaLicencias sea la versión nueva que te pasé.

    function renderView() {
        if (view === 'calendario') return <VistaCalendario />;
        if (view === 'licencias') return <VistaLicencias />;
        // ... resto de vistas ...
    }

    return (
        <div className="min-h-screen">
            {!user ? (
                <div className="flex items-center justify-center h-screen">Cargando...</div>
            ) : (
                <>
                    {/* Tu Nav aquí */}
                    <main>{renderView()}</main>
                </>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
