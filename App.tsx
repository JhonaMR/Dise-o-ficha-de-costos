
import React, { useState } from 'react';
import { DASHBOARD_DATA, CORRERIA_OPTIONS } from './constants';
import KPICardsSection from './components/KPICardsSection';
import VendorSection from './components/VendorSection';
import DesignerSection from './components/DesignerSection';
import ProductionKPIs from './components/ProductionKPIs';
import ProductionSection from './components/ProductionSection';
import CostSheetSection from './components/CostSheetSection';

type Module = 'comercial' | 'produccion' | 'costos';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Module>('comercial');
  const [selectedCorreria, setSelectedCorreria] = useState(CORRERIA_OPTIONS[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const data = DASHBOARD_DATA[selectedCorreria] || DASHBOARD_DATA["Madres 2026"];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header / Filter Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-8 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span className={`w-2 h-8 rounded-full ${
                  activeModule === 'comercial' ? 'bg-blue-600' : 
                  activeModule === 'produccion' ? 'bg-indigo-600' : 'bg-amber-500'
                }`}></span>
                Inventario & Operaciones
              </h1>
              <p className="text-slate-400 text-sm font-medium">Panel Ejecutivo Unificado</p>
            </div>

            {/* Main Navigation Tabs */}
            <nav className="hidden lg:flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              {[
                { id: 'comercial', label: 'Comercial', color: 'blue' },
                { id: 'produccion', label: 'Producción', color: 'indigo' },
                { id: 'costos', label: 'Costos', color: 'amber' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id as any)}
                  className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeModule === tab.id 
                    ? `bg-white text-${tab.color}-600 shadow-sm` 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex gap-1">
               <button onClick={() => setActiveModule('comercial')} className={`px-3 py-2 rounded-xl text-xs font-bold ${activeModule === 'comercial' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>COM</button>
               <button onClick={() => setActiveModule('produccion')} className={`px-3 py-2 rounded-xl text-xs font-bold ${activeModule === 'produccion' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>PROD</button>
               <button onClick={() => setActiveModule('costos')} className={`px-3 py-2 rounded-xl text-xs font-bold ${activeModule === 'costos' ? 'bg-amber-500 text-white' : 'bg-white text-slate-500'}`}>COST</button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-4 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all px-6 py-3 rounded-2xl w-full md:w-72 justify-between group"
              >
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correría Seleccionada</span>
                  <span className="block text-sm font-bold text-slate-800">{selectedCorreria}</span>
                </div>
                <svg className={`w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-full md:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {CORRERIA_OPTIONS.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => { setSelectedCorreria(opt); setShowDropdown(false); }}
                        className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors hover:bg-blue-50 ${selectedCorreria === opt ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-6">
        {activeModule === 'comercial' && (
          <>
            <KPICardsSection kpis={data.kpis} />
            <div className="grid grid-cols-1 gap-6">
              <VendorSection vendors={data.vendedores} totals={data.kpis} />
              <DesignerSection designers={data.disenadoras} />
            </div>
          </>
        )}
        
        {activeModule === 'produccion' && (
          <>
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Control de Fechas de Entrega y Producción</h2>
            </div>
            <ProductionKPIs items={data.produccion} />
            <ProductionSection items={data.produccion} />
          </>
        )}

        {activeModule === 'costos' && (
          <CostSheetSection initialData={data.costos[0]} />
        )}
      </main>

      <footer className="max-w-[1600px] mx-auto p-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
        © 2026 Inventory & Ops Management Systems - Reporte Generado en Tiempo Real
      </footer>
    </div>
  );
};

export default App;
