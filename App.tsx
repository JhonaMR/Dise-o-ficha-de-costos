
import React, { useState } from 'react';
import { DASHBOARD_DATA, CORRERIA_OPTIONS } from './constants';
import CostSheetSection from './components/CostSheetSection';

const App: React.FC = () => {
  const [selectedCorreria, setSelectedCorreria] = useState(CORRERIA_OPTIONS[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const data = DASHBOARD_DATA[selectedCorreria] || DASHBOARD_DATA["Madres 2026"];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <main className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-6">
        <CostSheetSection initialData={data.costos[0]} />
      </main>

      <footer className="max-w-[1600px] mx-auto p-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
        © 2026 Inventory & Ops Management Systems - Reporte Generado en Tiempo Real
      </footer>
    </div>
  );
};

export default App;
