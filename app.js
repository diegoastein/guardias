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

// --- ÍCONOS ---
const IconWrapper = ({ children, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>;
const Umbrella = () => <IconWrapper><path d="M22 12A10 10 0 0 0 12 2v20"/><path d="M6 12a6 6 0 0 1 12 0"/></IconWrapper>;
const LayoutTemplate = () => <IconWrapper><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></IconWrapper>;
const Settings = () => <IconWrapper><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></IconWrapper>;
const Trash2 = () => <IconWrapper><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></IconWrapper>;
const Edit = () => <IconWrapper><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></IconWrapper>;
const XCircle = () => <IconWrapper><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></IconWrapper>;
const CheckCircle = () => <IconWrapper><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></IconWrapper>;
const Search = () => <IconWrapper><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></IconWrapper>;
const Clipboard = () => <IconWrapper><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></IconWrapper>;
const CloudUpload = () => <IconWrapper><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></IconWrapper>;
const CalendarIcon = () => <IconWrapper><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></IconWrapper>;
const Upload = () => <IconWrapper><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></IconWrapper>;
const Download = () => <IconWrapper><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></IconWrapper>;
const ShareIcon = () => <IconWrapper><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></IconWrapper>;
const ChevronLeft = () => <IconWrapper><polyline points="15 18 9 12 15 6" /></IconWrapper>;
const ChevronRight = () => <IconWrapper><polyline points="9 18 15 12 9 6" /></IconWrapper>;
const Users = () => <IconWrapper><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconWrapper>;
const FileText = () => <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></IconWrapper>;
const AlertOctagon = () => <IconWrapper className="text-red-500"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></IconWrapper>;

// --- COMPONENTES UI ---
const Card = ({ children, className = "", id="" }) => <div id={id} className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>;
const Button = ({ onClick, children, variant = "primary", className = "", disabled=false, title="" }) => {
    const styles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50",
        danger: "bg-red-100 text-red-600 hover:bg-red-200",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-orange-500 text-white hover:bg-orange-600",
        dark: "bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-600",
        whatsapp: "bg-green-500 text-white hover:bg-green-600"
    };
    return <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center justify-center gap-2 ${styles[variant]} ${className}`} title={title}>{children}</button>;
};

function App() {
    const [view, setView] = useState('calendario');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [user, setUser] = useState(null);
    const [medicos, setMedicos] = useState([]);
    const [licencias, setLicencias] = useState([]);
    const [guardias, setGuardias] = useState({});
    const [plantilla, setPlantilla] = useState({});

    // --- FIREBASE LISTENERS ---
    useEffect(() => {
        signInAnonymously(auth).catch(e => console.error("Error Auth:", e));
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user) return;
        const unsubMedicos = onSnapshot(collection(db, 'medicos'), (snap) => setMedicos(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
        const unsubLicencias = onSnapshot(collection(db, 'licencias'), (snap) => setLicencias(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
        const unsubGuardias = onSnapshot(collection(db, 'guardias'), (snap) => { const d = {}; snap.docs.forEach(x => d[x.id] = x.data()); setGuardias(d); });
        const unsubPlantilla = onSnapshot(collection(db, 'plantilla'), (snap) => { const d = {}; snap.docs.forEach(x => d[x.id] = x.data()); setPlantilla(d); });
        return () => { unsubMedicos(); unsubLicencias(); unsubGuardias(); unsubPlantilla(); };
    }, [user]);

    const medicosOrdenados = useMemo(() => [...medicos].sort((a, b) => a.nombre.localeCompare(b.nombre)), [medicos]);

    // --- DB WRAPPERS ---
    const dbAgregarMedico = async (medico) => { await setDoc(doc(db, 'medicos', String(medico.id)), medico); };
    const dbEditarMedico = async (medico) => { await setDoc(doc(db, 'medicos', String(medico.id)), medico); };
    const dbBorrarMedico = async (id) => { if(confirm('¿Borrar?')) await deleteDoc(doc(db, 'medicos', String(id))); };
    const dbAgregarLicencia = async (lic) => { await setDoc(doc(db, 'licencias', String(lic.id)), lic); };
    const dbBorrarLicencia = async (id) => { if(confirm('¿Borrar?')) await deleteDoc(doc(db, 'licencias', String(id))); };
    const dbGuardarGuardia = async (fechaStr, data) => { await setDoc(doc(db, 'guardias', fechaStr), data); };
    const dbGuardarPlantilla = async (diaIdx, data) => { await setDoc(doc(db, 'plantilla', diaIdx.toString()), data); };
    const dbBatchGuardias = async (nuevasGuardias) => {
        const batch = writeBatch(db);
        Object.entries(nuevasGuardias).forEach(([fecha, data]) => batch.set(doc(db, 'guardias', fecha), data));
        await batch.commit();
    };

    // --- HELPERS ---
    const getDaysInMonth = (date) => { const year = date.getFullYear(); const month = date.getMonth(); const days = new Date(year, month + 1, 0).getDate(); const firstDay = new Date(year, month, 1).getDay(); return { days, firstDay, month, year }; };
    const formatDate = (d, m, y) => `${d.toString().padStart(2, '0')}/${(m + 1).toString().padStart(2, '0')}/${y}`;
    const formatDateISO = (dateStr) => { if(!dateStr) return ''; const [y, m, d] = dateStr.split('-'); return `${d}/${m}/${y}`; }
    const estaDeLicencia = (medicoId, fechaStr) => licencias.some(lic => String(lic.medicoId) === String(medicoId) && fechaStr >= lic.desde && fechaStr <= lic.hasta);
    const obtenerDetalleLicencia = (medicoId, fechaStr) => licencias.find(lic => String(lic.medicoId) === String(medicoId) && fechaStr >= lic.desde && fechaStr <= lic.hasta);

    // --- MOTOR PDF ---
    const handleExportAction = (elementId, filename, action = 'download') => {
        const input = document.getElementById(elementId);
        if(!input || !window.html2canvas || !window.jspdf) return;
        setLoadingPdf(true);
        const clone = input.cloneNode(true);
        clone.style.width = elementId === 'reporte-ministerio' ? "1200px" : "1000px";
        clone.style.position = "absolute"; clone.style.top = "-9999px"; clone.style.left = "0"; clone.style.background = "#ffffff";
        document.body.appendChild(clone);
        setTimeout(() => {
            window.html2canvas(clone, { scale: 1.0, useCORS: true, backgroundColor: '#ffffff' }).then((canvas) => {
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                if (action === 'share') {
                    const blob = pdf.output('blob');
                    const file = new File([blob], `${filename}.pdf`, { type: 'application/pdf' });
                    if (navigator.share) navigator.share({ files: [file], title: filename });
                } else pdf.save(`${filename}.pdf`);
                document.body.removeChild(clone); setLoadingPdf(false);
            });
        }, 500);
    };

    // --- VISTAS RESTAURADAS ---

    function VistaCalendario() {
        const { days, firstDay, month, year } = getDaysInMonth(currentDate);
        const [selectedDay, setSelectedDay] = useState(null);
        const mesNombre = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        const firstDayVisual = (firstDay + 6) % 7;
        const daysArray = Array.from({ length: days }, (_, i) => i + 1);
        const today = new Date();
        const isToday = (day) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

        const renderCell = (day) => {
            const fStr = new Date(year, month, day).toISOString().split('T')[0].slice(0, 10);
            const g = guardias[fStr], p = plantilla[new Date(year, month, day).getDay()];
            const slots = [{ d: g?.dia1, t: p?.dia1 }, { d: g?.dia2, t: p?.dia2 }, { d: g?.noche1, t: p?.noche1 }, { d: g?.noche2, t: p?.noche2 }];

            return (
                <div className="flex flex-col h-full gap-1 p-1">
                    {slots.map((s, i) => {
                        if (!s.d || s.d.estado === 'VACANTE') return <div key={i} className="flex-1 bg-red-100 border border-red-300 text-red-600 text-[10px] font-bold text-center rounded-sm">VACANTE</div>;
                        const m = medicos.find(x => String(x.id) === String(s.d.medicoId));
                        const enLicencia = m && estaDeLicencia(m.id, fStr);
                        const titularId = s.t?.medicoId;
                        let bgClass = "bg-green-100 border-green-300 text-green-900";
                        if (enLicencia) bgClass = "bg-red-600 border-red-700 text-white font-bold";
                        else if (s.d.tipoPago === 'PERSONAL') bgClass = "bg-orange-100 border-orange-300 text-orange-900";
                        else if (s.d.estado === 'LICENCIA_SIAPE' || (titularId && estaDeLicencia(titularId, fStr))) bgClass = "bg-purple-100 border-purple-300 text-purple-800";
                        else if (!titularId) bgClass = "bg-cyan-200 border-cyan-400 text-cyan-900";
                        else if (s.d.prestadorId) bgClass = "bg-blue-100 border-blue-300 text-blue-900";
                        return <div key={i} className={`flex-1 ${bgClass} px-1 border rounded-sm truncate text-[10px]`}>{enLicencia && "⚠️ "}{m ? m.nombre.split(',')[0] : '?'}</div>;
                    })}
                </div>
            );
        };

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentDate(new Date(year, month - 1))}><ChevronLeft/></button>
                        <h2 className="font-bold text-2xl capitalize min-w-[200px] text-center">{mesNombre}</h2>
                        <button onClick={() => setCurrentDate(new Date(year, month + 1))}><ChevronRight/></button>
                    </div>
                </div>
                <div className="w-scroll-container">
                    <div className="min-w-[1000px] grid grid-cols-7 gap-1">
                        {Array(firstDayVisual).fill(null).map((_,i)=><div key={i} className="h-40 bg-gray-50 rounded"></div>)}
                        {daysArray.map(d=>(<div key={d} onClick={()=>setSelectedDay(d)} className={`h-40 border rounded bg-white relative cursor-pointer hover:shadow-md ${isToday(d)?'ring-2 ring-blue-500':''}`}><div className={`text-right text-xs p-1 font-bold ${isToday(d)?'bg-blue-100':'bg-gray-50'}`}>{d}</div>{renderCell(d)}</div>))}
                    </div>
                </div>
                <Card className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-100 border border-orange-300"></div> Arreglo Personal</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-100 border border-purple-300"></div> Cubre Licencia</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-200 border border-cyan-400"></div> Cubre Vacante</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600"></div> ⚠️ Médico en Licencia</div>
                </Card>
                {selectedDay && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <Card className="w-full max-w-2xl max-h-[90vh]">
                        <div className="flex justify-between mb-4 font-bold text-lg">Editar {formatDate(selectedDay, month, year)}<button onClick={()=>setSelectedDay(null)}><XCircle/></button></div>
                        <div className="grid grid-cols-2 gap-4">
                            {['Día 1', 'Día 2', 'Noche 1', 'Noche 2'].map((lbl, idx) => {
                                const fStr = new Date(year, month, selectedDay).toISOString().split('T')[0].slice(0, 10);
                                const g = guardias[fStr] || {}, key = ['dia1', 'dia2', 'noche1', 'noche2'][idx];
                                const slot = g[key] || { estado: 'VACANTE', tipoPago: 'SISTEMA' };
                                return (
                                    <div key={idx} className="p-2 border bg-gray-50 rounded">
                                        <div className="font-bold text-xs mb-1 uppercase">{lbl}</div>
                                        <select className="w-full text-sm mb-1" value={slot.estado} onChange={e=>dbGuardarGuardia(fStr, {...g, [key]:{...slot, estado:e.target.value}})}>
                                            <option value="CUBIERTA">Cubierta</option><option value="VACANTE">Vacante</option>
                                        </select>
                                        <select className="w-full text-sm mb-1" value={slot.medicoId||''} onChange={e=>dbGuardarGuardia(fStr, {...g, [key]:{...slot, medicoId:e.target.value}})}>
                                            <option value="">Médico...</option>
                                            {medicosOrdenados.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
                                        </select>
                                        <select className="w-full text-sm" value={slot.tipoPago} onChange={e=>dbGuardarGuardia(fStr, {...g, [key]:{...slot, tipoPago:e.target.value}})}>
                                            <option value="SISTEMA">Sistema</option><option value="PERSONAL">Personal</option>
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex justify-end"><Button onClick={()=>setSelectedDay(null)}>Guardar y Cerrar</Button></div>
                    </Card>
                </div>}
            </div>
        );
    }

    function VistaLicencias() {
        const [nueva, setNueva] = useState({ medicoId: '', desde: '', hasta: '', motivo: 'Vacaciones', detalleCobertura: '' });
        const [filtro, setFiltro] = useState('');
        const historial = licencias.filter(l => {
            const m = medicos.find(med => String(med.id) === String(l.medicoId));
            return m && m.nombre.toLowerCase().includes(filtro.toLowerCase());
        }).sort((a,b) => b.desde.localeCompare(a.desde));

        return (
            <div className="space-y-6">
                <Card>
                    <h3 className="text-lg font-bold mb-4">Registrar Licencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div><label className="text-sm">Médico</label><select className="w-full border p-2 rounded" value={nueva.medicoId} onChange={e=>setNueva({...nueva, medicoId:e.target.value})}><option value="">Seleccione...</option>{medicosOrdenados.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}</select></div>
                        <div><label className="text-sm">Desde</label><input type="date" className="w-full border p-2 rounded" value={nueva.desde} onChange={e=>setNueva({...nueva, desde:e.target.value})}/></div>
                        <div><label className="text-sm">Hasta</label><input type="date" className="w-full border p-2 rounded" value={nueva.hasta} onChange={e=>setNueva({...nueva, hasta:e.target.value})}/></div>
                        <div className="lg:col-span-2"><label className="text-sm">Detalle Cobertura (Texto libre)</label><input className="w-full border p-2 rounded" value={nueva.detalleCobertura} onChange={e=>setNueva({...nueva, detalleCobertura:e.target.value})} placeholder="Ej: Dr. X cubre los días 1, 2..."/></div>
                        <Button onClick={()=>{if(!nueva.medicoId||!nueva.desde)return; dbAgregarLicencia({...nueva, id:Date.now().toString()}); setNueva({...nueva, medicoId:'', detalleCobertura:''});}}>Registrar</Button>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Search size={18}/> Historial con Detalle Visible</h3>
                    <input className="w-full border p-2 rounded mb-4" placeholder="Buscar médico..." value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                    <ul className="divide-y">
                        {historial.map(lic => (
                            <li key={lic.id} className="py-4">
                                <div className="flex justify-between items-start">
                                    <div><p className="font-bold">{medicos.find(m=>String(m.id)===String(lic.medicoId))?.nombre}</p><p className="text-xs text-gray-500">{formatDateISO(lic.desde)} al {formatDateISO(lic.hasta)}</p></div>
                                    <button onClick={()=>dbBorrarLicencia(lic.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                                </div>
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded text-sm italic">{lic.detalleCobertura || "Sin detalles registrados."}</div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        );
    }

    function VistaReporte() {
        const { month, year } = getDaysInMonth(currentDate);
        const mesNombre = currentDate.toLocaleString('es-ES', { month: 'long' });
        const vacantes = {}, licenciasGrupo = {};
        for(let d=1; d<=31; d++){
            const fObj = new Date(year, month, d); if(fObj.getMonth()!==month) break;
            const fStr = fObj.toISOString().split('T')[0], g = guardias[fStr], p = plantilla[fObj.getDay()];
            if(!g) continue;
            const check = (s, t) => {
                if(!s || s.estado!=='CUBIERTA' || s.tipoPago==='PERSONAL') return;
                const m = medicos.find(x=>String(x.id)===String(s.medicoId)), r = s.prestadorId ? medicos.find(x=>String(x.id)===String(s.prestadorId)) : m;
                if(!r) return;
                const itm = { fecha: formatDate(d, month, year), receptor: r.nombre, sadofe: fObj.getDay()===0 || fObj.getDay()===6 };
                if(!t?.medicoId) (vacantes[fObj.getDay()] = vacantes[fObj.getDay()] || []).push(itm);
                else if(String(t.medicoId) !== String(s.medicoId)) {
                    const tit = medicos.find(x=>String(x.id)===String(t.medicoId))?.nombre || 'Titular';
                    (licenciasGrupo[tit] = licenciasGrupo[tit] || []).push(itm);
                }
            };
            [g.dia1, g.dia2, g.noche1, g.noche2].forEach((s, i) => check(s, [p?.dia1, p?.dia2, p?.noche1, p?.noche2][i]));
        }

        return (
            <div id="reporte-ministerio" className="bg-white p-8 space-y-8">
                <div className="flex justify-between items-center no-print">
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black">Reporte Ministerio - {mesNombre} {year}</h2>
                    <Button onClick={()=>handleExportAction('reporte-ministerio', `Reporte_${mesNombre}`)}>Descargar PDF</Button>
                </div>
                <div className="space-y-6">
                    <h3 className="font-bold text-lg bg-gray-100 p-2">COBERTURA DE CARGOS VACANTES</h3>
                    {Object.entries(vacantes).map(([dia, items], idx) => (
                        <div key={idx} className="mb-4">
                            <h4 className="font-bold text-xs uppercase mb-1 border-b">Día de la semana: {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][dia]}</h4>
                            <table className="w-full text-[10px] border-collapse border border-gray-400">
                                <thead className="bg-gray-50"><tr><th className="border p-1">Fecha</th><th className="border p-1">12hs Sem</th><th className="border p-1">SADOFE</th><th className="border p-1">Cobra</th></tr></thead>
                                <tbody>{items.map((it, k)=>(<tr key={k}><td className="border p-1 text-center">{it.fecha}</td><td className="border p-1 text-center">{!it.sadofe?'X':''}</td><td className="border p-1 text-center">{it.sadofe?'X':''}</td><td className="border p-1 font-bold">{it.receptor}</td></tr>))}</tbody>
                            </table>
                        </div>
                    ))}
                    <h3 className="font-bold text-lg bg-gray-100 p-2">COBERTURA DE LICENCIAS</h3>
                    {Object.entries(licenciasGrupo).map(([tit, items], idx) => (
                        <div key={idx} className="mb-4">
                            <h4 className="font-bold text-xs uppercase mb-1 border-b">Licencia: {tit}</h4>
                            <table className="w-full text-[10px] border-collapse border border-gray-400">
                                <thead className="bg-gray-50"><tr><th className="border p-1">Fecha</th><th className="border p-1">12hs Sem</th><th className="border p-1">SADOFE</th><th className="border p-1">Cobra</th></tr></thead>
                                <tbody>{items.map((it, k)=>(<tr key={k}><td className="border p-1 text-center">{it.fecha}</td><td className="border p-1 text-center">{!it.sadofe?'X':''}</td><td className="border p-1 text-center">{it.sadofe?'X':''}</td><td className="border p-1 font-bold">{it.receptor}</td></tr>))}</tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function VistaBusqueda() {
        const [mode, setMode] = useState('masivo');
        const [reporteMes, setReporteMes] = useState(new Date().toISOString().slice(0, 7));
        const [selMedicos, setSelMedicos] = useState([]);
        const [resMasivo, setResMasivo] = useState([]);

        const generarReporte = () => {
            setLoadingPdf(true); const results = [];
            const [y, m] = reporteMes.split('-').map(Number); const days = new Date(y, m, 0).getDate();
            for(let id of selMedicos){
                const med = medicos.find(x=>String(x.id)===String(id)); let tot = 0;
                for(let d=1; d<=days; d++){
                    const fStr = `${y}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
                    const g = guardias[fStr], p = plantilla[new Date(y, m-1, d).getDay()];
                    if(!g) continue;
                    [g.dia1, g.dia2, g.noche1, g.noche2].forEach((s,i)=>{
                        if(!s || s.estado!=='CUBIERTA' || s.tipoPago==='PERSONAL') return;
                        const cobrador = s.prestadorId ? String(s.prestadorId) : String(s.medicoId);
                        const titular = [p?.dia1, p?.dia2, p?.noche1, p?.noche2][i]?.medicoId;
                        if(cobrador === String(id) && String(titular)!==String(id)) tot++;
                    });
                }
                results.push({ nombre: med.nombre, total: tot, excedido: tot > 10 });
            }
            setResMasivo(results); setLoadingPdf(false);
        };

        return (
            <Card>
                <div className="flex gap-4 border-b mb-4 pb-2">
                    <button onClick={()=>setMode('masivo')} className={`font-bold text-sm uppercase ${mode==='masivo'?'text-blue-600 border-b-2 border-blue-600':''}`}>Reportes Masivos</button>
                    <button onClick={()=>setMode('derivadas')} className={`font-bold text-sm uppercase ${mode==='derivadas'?'text-blue-600 border-b-2 border-blue-600':''}`}>Búsqueda Derivadas</button>
                </div>
                {mode === 'masivo' && <div className="space-y-4">
                    <div className="flex gap-2 items-center"><label className="text-sm font-bold">Mes:</label><input type="month" className="border p-2 rounded" value={reporteMes} onChange={e=>setReporteMes(e.target.value)}/></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border p-3 rounded h-40 overflow-y-auto">
                        {medicosOrdenados.map(m=>(<label key={m.id} className="text-xs flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={selMedicos.includes(m.id)} onChange={()=>setSelMedicos(p=>p.includes(m.id)?p.filter(x=>x!==m.id):[...p,m.id])}/>{m.nombre}</label>))}
                    </div>
                    <Button onClick={generarReporte} disabled={loadingPdf}>{loadingPdf?'Procesando...':'Verificar Topes Mensuales'}</Button>
                    {resMasivo.length > 0 && <div className="mt-4 space-y-2">
                        {resMasivo.map((r,i)=>(<div key={i} className={`p-2 border rounded flex justify-between items-center ${r.excedido?'bg-red-50 border-red-200 text-red-700':'bg-green-50'}`}><span>{r.nombre}</span><span className="font-bold">{r.total} Unidades {r.excedido && "(EXCEDE)"}</span></div>))}
                    </div>}
                </div>}
            </Card>
        );
    }

    function VistaConfig() {
        const [editing, setEditing] = useState(null);
        return (
            <div className="space-y-6">
                <Card>
                    <h3 className="font-bold mb-4">Plantilla Base Semanal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((d,i)=>(<button key={i} onClick={()=>setEditing(i)} className="p-3 bg-gray-50 border rounded text-sm hover:bg-blue-50 hover:border-blue-300 font-bold transition-all">{d}</button>))}
                    </div>
                </Card>
                <Card>
                    <h3 className="font-bold mb-4">Listado de Médicos</h3>
                    <table className="w-full text-sm border-collapse">
                        <thead><tr className="bg-gray-100"><th className="text-left border p-2">Nombre</th><th className="text-center border p-2">Borrar</th></tr></thead>
                        <tbody>{medicosOrdenados.map(m=>(<tr key={m.id} className="hover:bg-gray-50"><td className="border p-2">{m.nombre}</td><td className="border p-2 text-center"><button onClick={()=>dbBorrarMedico(m.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>))}</tbody>
                    </table>
                </Card>
                {editing !== null && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-lg">
                        <h3 className="font-bold mb-4 border-b">Configurar: {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'][editing]}</h3>
                        {['dia1','dia2','noche1','noche2'].map(k=>(
                            <div key={k} className="mb-3">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">{k}</label>
                                <select className="w-full text-sm border p-2 rounded" value={plantilla[editing]?.[k]?.medicoId||''} onChange={e=>dbGuardarPlantilla(editing, {...(plantilla[editing]||{}), [k]:{medicoId:e.target.value}})}>
                                    <option value="">Vacante...</option>
                                    {medicosOrdenados.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </select>
                            </div>
                        ))}
                        <div className="mt-4 flex justify-end"><Button onClick={()=>setEditing(null)}>Guardar y Cerrar</Button></div>
                    </Card>
                </div>}
            </div>
        );
    }

    function renderView() {
        switch(view) {
            case 'calendario': return <VistaCalendario />;
            case 'licencias': return <VistaLicencias />;
            case 'reporte': return <VistaReporte />;
            case 'busqueda': return <VistaBusqueda />;
            case 'config': return <VistaConfig />;
            default: return <VistaCalendario />;
        }
    }

    if (!user) return <div className="h-screen flex items-center justify-center text-blue-600 font-bold animate-pulse">Iniciando Base de Datos...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-white shadow p-4 mb-6 flex gap-4 overflow-x-auto">
                <button onClick={()=>setView('calendario')} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${view==='calendario'?'bg-blue-600 text-white font-bold':'text-gray-500 hover:bg-gray-100'}`}>Calendario</button>
                <button onClick={()=>setView('licencias')} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${view==='licencias'?'bg-blue-600 text-white font-bold':'text-gray-500 hover:bg-gray-100'}`}>Licencias</button>
                <button onClick={()=>setView('reporte')} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${view==='reporte'?'bg-blue-600 text-white font-bold':'text-gray-500 hover:bg-gray-100'}`}>Reporte Ministerio</button>
                <button onClick={()=>setView('busqueda')} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${view==='busqueda'?'bg-blue-600 text-white font-bold':'text-gray-500 hover:bg-gray-100'}`}>Búsqueda y Masivos</button>
                <button onClick={()=>setView('config')} className="ml-auto p-2 hover:bg-gray-100 rounded-full"><Settings size={20}/></button>
            </nav>
            <main className="max-w-7xl mx-auto px-4">{renderView()}</main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
