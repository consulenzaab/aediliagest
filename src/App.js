import React, { useState, useEffect } from 'react';
import { HardHat, Building2, Users, Receipt, FileText, PlusCircle, RefreshCw } from 'lucide-react';

// URL del backend: essendo su Vercel, usiamo direttamente le API interne relative
const BACKEND_URL = '';

export default function App() {
  const [activeTab, setActiveTab] = useState('cantieri');
  const [cantieri, setCantieri] = useState([]);
  const [risorse, setRisorse] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form Cantieri
  const [nuovoCantiere, setNuovoCantiere] = useState({
    codice_cantiere: '',
    nome: '',
    indirizzo: '',
    budget_stimato: ''
  });

  // Caricamento dati dal Backend
  const caricaDati = async () => {
    setLoading(true);
    try {
      const resCantieri = await fetch(`${BACKEND_URL}/api/cantieri`);
      const dataCantieri = await resCantieri.json();
      setCantieri(Array.isArray(dataCantieri) ? dataCantieri : []);

      const resRisorse = await fetch(`${BACKEND_URL}/api/risorse`);
      const dataRisorse = await resRisorse.json();
      setRisorse(Array.isArray(dataRisorse) ? dataRisorse : []);
    } catch (err) {
      console.error("Errore caricamento dati:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    caricaDati();
  }, []);

  // Inserimento Cantiere
  const handleSubmitCantiere = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/cantieri`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuovoCantiere)
      });
      if (res.ok) {
        setNuovoCantiere({ codice_cantiere: '', nome: '', indirizzo: '', budget_stimato: '' });
        caricaDati();
      }
    } catch (err) {
      alert("Errore durante il salvataggio del cantiere");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR DI NAVIGAZIONE */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-slate-800">
            <HardHat className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="font-bold text-lg leading-tight">AediliaGest</h1>
              <span className="text-xs text-slate-400">Gestionale Cantieri</span>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('cantieri')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'cantieri' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Building2 className="h-5 w-5" /> Cantieri & Lavori
            </button>
            <button
              onClick={() => setActiveTab('risorse')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'risorse' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Users className="h-5 w-5" /> Risorse Umane & Costi
            </button>
            <button
              disabled
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed"
            >
              <FileText className="h-5 w-5" /> Preventivi / SAL (Prossimamente)
            </button>
            <button
              disabled
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed"
            >
              <Receipt className="h-5 w-5" /> FatturaPA / SDI (Prossimamente)
            </button>
          </nav>
        </div>
        <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-800">
          AediliaGest v1.0.0 Cloud
        </div>
      </aside>

      {/* CONTENUTO PRINCIPALE */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'cantieri' ? 'Gestione Cantieri' : 'Risorse Umane & Costi Orari'}
            </h2>
            <p className="text-sm text-slate-500">Monitoraggio in tempo reale dei lavori e delle risorse</p>
          </div>
          <button
            onClick={caricaDati}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Aggiorna
          </button>
        </header>

        {/* TAB 1: CANTIERI */}
        {activeTab === 'cantieri' && (
          <div className="space-y-6">
            {/* Form per nuovo cantiere */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-amber-500" /> Nuovo Cantiere
              </h3>
              <form onSubmit={handleSubmitCantiere} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Codice (es. CNT-2026-01)"
                  required
                  className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={nuovoCantiere.codice_cantiere}
                  onChange={(e) => setNuovoCantiere({ ...nuovoCantiere, codice_cantiere: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Nome Cantiere"
                  required
                  className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={nuovoCantiere.nome}
                  onChange={(e) => setNuovoCantiere({ ...nuovoCantiere, nome: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Indirizzo / Citta"
                  className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={nuovoCantiere.indirizzo}
                  onChange={(e) => setNuovoCantiere({ ...nuovoCantiere, indirizzo: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Budget Stimato (€)"
                  className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={nuovoCantiere.budget_stimato}
                  onChange={(e) => setNuovoCantiere({ ...nuovoCantiere, budget_stimato: e.target.value })}
                />
                <button
                  type="submit"
                  className="md:col-span-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  Salva Cantiere
                </button>
              </form>
            </div>

            {/* Elenco Cantieri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cantieri.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        {c.codice_cantiere}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {c.stato}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{c.nome}</h4>
                    <p className="text-sm text-slate-500 mb-4">{c.indirizzo || 'Nessun indirizzo specificato'}</p>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center text-sm">
                    <span className="text-slate-500">Budget:</span>
                    <span className="font-bold text-slate-800">€ {Number(c.budget_stimato || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: RISORSE UMANE */}
        {activeTab === 'risorse' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b">
                <tr>
                  <th className="p-4">Nome / Operaio</th>
                  <th className="p-4">Ruolo</th>
                  <th className="p-4">Costo Orario (€)</th>
                  <th className="p-4">Ore Giornaliere</th>
                  <th className="p-4">Costo Giornaliero Totale (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {risorse.map((r) => {
                  const costoOrario = Number(r.costo_ora || 0);
                  const oreGiorno = Number(r.ore_giornaliere || 8);
                  const costoGiornaliero = costoOrario * oreGiorno;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800">{r.nome}</td>
                      <td className="p-4">{r.ruolo}</td>
                      <td className="p-4">€ {costoOrario.toFixed(2)}</td>
                      <td className="p-4">{oreGiorno}h</td>
                      <td className="p-4 font-bold text-emerald-600">€ {costoGiornaliero.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
