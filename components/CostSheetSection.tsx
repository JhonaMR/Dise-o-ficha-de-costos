
import React, { useState } from 'react';
import { CostSheet, CostLineItem, CutInfo } from '../types';

interface Props { 
  initialData: CostSheet; 
}

const CostSheetSection: React.FC<Props> = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState<'inicial' | 'corte1' | 'corte2' | 'corte3' | 'corte4'>('inicial');
  
  // Default items
  const defaultMP: CostLineItem[] = [
    { id: 'mp_init', concepto: 'INGRESE TELA', unidad: 'METRO', valorUnidad: 0, cantidad: 1, total: 0 }
  ];

  const defaultMO: CostLineItem[] = [
    { id: 'mo_init', concepto: 'INGRESE LABOR', unidad: 'UNIDAD', valorUnidad: 0, cantidad: 1, total: 0 }
  ];

  const defaultID: CostLineItem[] = [
    { id: 'id1', concepto: 'MARQUILLA', unidad: 'UNIDAD', valorUnidad: 70, cantidad: 1, total: 70 },
    { id: 'id2', concepto: 'MARQUILLA TECNICA', unidad: 'UNIDAD', valorUnidad: 10, cantidad: 1, total: 10 },
    { id: 'id3', concepto: 'ETIQUETA', unidad: 'UNIDAD', valorUnidad: 130, cantidad: 1, total: 130 },
    { id: 'id4', concepto: 'CODIGO DE BARRAS', unidad: 'UNIDAD', valorUnidad: 10, cantidad: 1, total: 10 },
    { id: 'id5', concepto: 'BOLSA', unidad: 'UNIDAD', valorUnidad: 94, cantidad: 1, total: 94 },
  ];

  const defaultII: CostLineItem[] = [];

  const defaultProvisiones: CostLineItem[] = [
    { id: 'p1', concepto: 'PROV. CARTERA', unidad: 'UNIDAD', valorUnidad: 200, cantidad: 1, total: 200 },
    { id: 'p2', concepto: 'SERVICIOS CONFECCIONISTAS', unidad: 'UNIDAD', valorUnidad: 200, cantidad: 1, total: 200 },
    { id: 'p3', concepto: 'TRANSPORTE', unidad: 'UNIDAD', valorUnidad: 0, cantidad: 1, total: 0 },
  ];

  // Initialize state ensuring cortes is never an empty array that causes undefined lookups
  const [sheet, setSheet] = useState<CostSheet>(() => {
    const defaultCortes: CutInfo[] = Array.from({length: 4}, (_, i) => ({
      id: `c${i+1}`,
      numeroFicha: '',
      fechaCorte: '',
      cantidadCortada: 0,
      materiaPrima: [...defaultMP],
      manoDeObra: [...defaultMO],
      insumosDirectos: [...defaultID],
      insumosIndirectos: [...defaultII],
      provisiones: [...defaultProvisiones]
    }));

    return {
      ...initialData,
      novedadOCorreria: initialData.novedadOCorreria || '',
      muestras: (initialData.muestras && initialData.muestras.length >= 2) ? initialData.muestras : ['', ''],
      cortes: (initialData.cortes && initialData.cortes.length > 0) ? initialData.cortes : defaultCortes,
      materiaPrima: [
        ...defaultMP,
        ...initialData.materiaPrima.filter(i => i.concepto !== 'INGRESE TELA')
      ],
      manoDeObra: [
        ...defaultMO,
        ...initialData.manoDeObra.filter(i => i.concepto !== 'INGRESE LABOR')
      ],
      insumosDirectos: [
        ...defaultID,
        ...initialData.insumosDirectos.filter(i => !defaultID.some(d => d.concepto === i.concepto))
      ],
      insumosIndirectos: initialData.insumosIndirectos.length > 0 ? initialData.insumosIndirectos : [...defaultII],
      provisiones: [
        ...defaultProvisiones,
        ...initialData.provisiones.filter(i => !defaultProvisiones.some(d => d.concepto === i.concepto))
      ]
    };
  });

  const formatCur = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  // Helper to get active data based on tab with safety fallback
  const getActiveData = (): CutInfo | CostSheet => {
    if (activeTab === 'inicial') return sheet;
    const index = parseInt(activeTab.replace('corte', '')) - 1;
    return sheet.cortes[index] || sheet;
  };

  const updateActiveSection = (section: keyof Omit<CutInfo, 'id' | 'numeroFicha' | 'fechaCorte' | 'cantidadCortada'>, newItems: CostLineItem[]) => {
    if (activeTab === 'inicial') {
      setSheet({ ...sheet, [section]: newItems });
    } else {
      const index = parseInt(activeTab.replace('corte', '')) - 1;
      const newCortes = [...sheet.cortes];
      if (newCortes[index]) {
        newCortes[index] = { ...newCortes[index], [section]: newItems };
        setSheet({ ...sheet, cortes: newCortes });
      }
    }
  };

  const handleItemUpdate = (section: any, itemId: string, field: keyof CostLineItem, value: any) => {
    const active = getActiveData() as any;
    const newItems = active[section].map((item: CostLineItem) => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'valorUnidad' || field === 'cantidad') {
          updated.total = updated.valorUnidad * updated.cantidad;
        }
        return updated;
      }
      return item;
    });
    updateActiveSection(section, newItems);
  };

  const addItem = (section: any, concepto: string = '', valor: number = 0, unidad: string = 'UNIDAD') => {
    const active = getActiveData() as any;
    const newItem: CostLineItem = {
      id: Math.random().toString(),
      concepto: concepto.toUpperCase(),
      unidad: unidad,
      valorUnidad: valor,
      cantidad: 1,
      total: valor
    };
    updateActiveSection(section, [...(active[section] || []), newItem]);
  };

  const calculateTotal = (items: CostLineItem[] = []) => items.reduce((sum, i) => sum + (Number(i.valorUnidad) * Number(i.cantidad)), 0);

  const currentData = getActiveData();
  const totalMP = calculateTotal(currentData.materiaPrima);
  const totalMO = calculateTotal(currentData.manoDeObra);
  const totalID = calculateTotal(currentData.insumosDirectos);
  const totalII = calculateTotal(currentData.insumosIndirectos);
  const totalP = calculateTotal(currentData.provisiones);
  const totalCosto = totalMP + totalMO + totalID + totalII + totalP;

  const totalProyectado = calculateTotal(sheet.materiaPrima) + calculateTotal(sheet.manoDeObra) + calculateTotal(sheet.insumosDirectos) + calculateTotal(sheet.insumosIndirectos) + calculateTotal(sheet.provisiones);

  const totalCantidadCortada = sheet.cortes.reduce((sum, c) => sum + (Number(c.cantidadCortada) || 0), 0);

  const removeItem = (section: any, itemId: string) => {
    const active = getActiveData() as any;
    const newItems = active[section].filter((item: CostLineItem) => item.id !== itemId);
    updateActiveSection(section, newItems);
  };

  const updateCutInfo = (field: keyof CutInfo, value: any) => {
    const index = parseInt(activeTab.replace('corte', '')) - 1;
    const newCortes = [...sheet.cortes];
    if (newCortes[index]) {
      newCortes[index] = { ...newCortes[index], [field]: value };
      setSheet({ ...sheet, cortes: newCortes });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Costeo de Referencia</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            GUARDAR
          </button>
          <div className="flex gap-2">
            {['inicial', 'corte1', 'corte2', 'corte3', 'corte4'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === tab 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-200' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab === 'inicial' ? 'COSTEO INICIAL' : `CORTE #${tab.replace('corte', '')}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <div className="mb-6">
              <div className="relative flex items-center mb-4">
                <input 
                  value={sheet.referencia}
                  onChange={e => setSheet({...sheet, referencia: e.target.value})}
                  className="text-2xl font-black text-slate-900 bg-transparent border-b border-transparent focus:border-amber-400 outline-none text-left w-full pr-20"
                />
                <div className="absolute right-0">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-colors border border-slate-200 whitespace-nowrap">
                    Foto adicional
                  </button>
                </div>
              </div>

              <div className="w-full aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 mb-6 group relative">
                {sheet.fotoUrl ? (
                  <img src={sheet.fotoUrl} alt="Referencia" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">No hay foto</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold">Cambiar Foto</button>
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100 mb-6">
                <h3 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4 text-center">Rentabilidad vs Precio</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-amber-100">
                    <span className="text-[9px] font-bold text-amber-600 uppercase">Costo Total</span>
                    <p className="text-base font-black text-slate-800">{formatCur(totalCosto)}</p>
                  </div>
                  <div className="pb-2">
                    <label className="text-[9px] font-bold text-amber-600 uppercase block mb-1">Precio de Venta</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">$</span>
                      <input 
                        type="number"
                        value={sheet.precioVenta}
                        onChange={e => setSheet({...sheet, precioVenta: Number(e.target.value)})}
                        className="w-full pl-8 p-3 rounded-xl bg-white border-2 border-emerald-200 font-black text-2xl text-emerald-600 outline-none shadow-sm focus:border-emerald-400 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2 rounded-xl border border-amber-200 text-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase block">M.R REAL</span>
                      <p className="text-lg font-black text-amber-600">{sheet.precioVenta > 0 ? (((sheet.precioVenta - totalCosto) / sheet.precioVenta) * 100).toFixed(0) : 0}%</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 text-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase block">Cant. Cortada</span>
                      <p className="text-lg font-black text-indigo-600">{totalCantidadCortada}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Marca</label>
                  <input value={sheet.marca} onChange={e => setSheet({...sheet, marca: e.target.value})} className="w-full text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Diseñadora</label>
                  <input value={sheet.disenadora} onChange={e => setSheet({...sheet, disenadora: e.target.value})} className="w-full text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Muestra #1</label>
                  <input value={sheet.muestras[0]} onChange={e => {
                    const m = [...sheet.muestras]; m[0] = e.target.value; setSheet({...sheet, muestras: m});
                  }} className="w-full text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Muestra #2</label>
                  <input value={sheet.muestras[1]} onChange={e => {
                    const m = [...sheet.muestras]; m[1] = e.target.value; setSheet({...sheet, muestras: m});
                  }} className="w-full text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg outline-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Observaciones</label>
                <textarea 
                  value={sheet.observaciones} 
                  onChange={e => setSheet({...sheet, observaciones: e.target.value})}
                  className="w-full min-h-[100px] bg-transparent text-xs text-slate-600 italic leading-relaxed outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Novedad o correría</label>
                <input 
                  value={sheet.novedadOCorreria} 
                  onChange={e => setSheet({...sheet, novedadOCorreria: e.target.value})} 
                  className="w-full text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl outline-none border border-slate-100" 
                />
              </div>
            </div>
          </div>

          {activeTab === 'inicial' ? (
            <>
              <div className="bg-orange-100 rounded-[1.5rem] p-6 shadow-sm border border-orange-200">
                <h3 className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-6 text-center border-b border-orange-200 pb-2">DESCUENTOS Y CANALES</h3>
                <div className="space-y-3">
                   {[15, 10, 5, 0].map(d => (
                     <div key={d} className="flex justify-between text-xs font-bold border-b border-orange-200/50 pb-1">
                       <span className="text-orange-600">DESC {d}%</span>
                       <span className="text-slate-700">{formatCur(sheet.precioVenta * (1 - d/100))}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="bg-orange-100 rounded-[1.5rem] p-6 shadow-sm border border-orange-200">
                <p className="text-[9px] font-black text-orange-600 uppercase text-center mb-2 tracking-widest">MARGEN GANANCIA CLIENTE</p>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-orange-200 shadow-sm">
                  <span className="text-xs font-black text-orange-500">35%</span>
                  <span className="text-lg font-black text-slate-800">{formatCur(sheet.precioVenta * 1.35)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-blue-100 rounded-[2rem] p-8 shadow-sm border border-blue-200">
               <h3 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-6 text-center border-b border-blue-200 pb-2 uppercase">UTILIDAD O PERDIDA CORTE</h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase">Costo Real</span>
                    <span className="font-black text-slate-800">{formatCur(totalCosto)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase">Costo Proyectado</span>
                    <span className="font-black text-slate-800">{formatCur(totalProyectado)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Diferencia</span>
                    <span className="font-black text-emerald-700">{formatCur(totalProyectado - totalCosto)}</span>
                  </div>
                  <div className="pt-4 border-t border-blue-200">
                    <div className="flex justify-between text-xs mb-2">
                       <span className="font-bold text-slate-500">M.R UTILIDAD</span>
                       <span className="font-black text-blue-600">{sheet.precioVenta > 0 ? (((sheet.precioVenta - totalCosto) / sheet.precioVenta) * 100).toFixed(0) : 0}%</span>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          {activeTab !== 'inicial' && (
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 grid grid-cols-3 gap-6">
               <div>
                 <label className="text-[10px] font-black text-indigo-400 uppercase block mb-1">Ficha de Corte</label>
                 <input 
                  className="w-full p-3 rounded-xl bg-white border border-indigo-200 outline-none text-xs font-bold" 
                  placeholder="Número..." 
                  value={(currentData as CutInfo).numeroFicha || ''}
                  onChange={e => updateCutInfo('numeroFicha', e.target.value)}
                />
               </div>
               <div>
                 <label className="text-[10px] font-black text-indigo-400 uppercase block mb-1">Fecha de Corte</label>
                 <input 
                  type="date" 
                  className="w-full p-3 rounded-xl bg-white border border-indigo-200 outline-none text-xs font-bold" 
                  value={(currentData as CutInfo).fechaCorte || ''}
                  onChange={e => updateCutInfo('fechaCorte', e.target.value)}
                />
               </div>
               <div>
                 <label className="text-[10px] font-black text-indigo-400 uppercase block mb-1">Cant. Cortada</label>
                 <input 
                  type="number" 
                  className="w-full p-3 rounded-xl bg-white border border-indigo-200 outline-none text-xs font-bold" 
                  value={(currentData as CutInfo).cantidadCortada || 0}
                  onChange={e => updateCutInfo('cantidadCortada', Number(e.target.value))}
                />
               </div>
            </div>
          )}

          <CostTable 
            title="Materia Prima" 
            items={currentData.materiaPrima} 
            color="indigo" 
            onUpdate={(id, field, value) => handleItemUpdate('materiaPrima', id, field, value)}
            onDelete={(id) => removeItem('materiaPrima', id)}
            actions={
              <div className="flex gap-2">
                <button onClick={() => addItem('materiaPrima', 'TELA O SESGO', 11500, 'METRO')} className="px-3 py-1 bg-indigo-50/20 text-white text-[9px] font-bold rounded-lg border border-indigo-400 hover:bg-indigo-400">+ TELA/SESGO</button>
                <button onClick={() => addItem('materiaPrima', 'RESORTE', 500, 'MTS')} className="px-3 py-1 bg-indigo-50/20 text-white text-[9px] font-bold rounded-lg border border-indigo-400 hover:bg-indigo-400">+ RESORTE</button>
              </div>
            }
          />

          <CostTable 
            title="Mano de Obra" 
            items={currentData.manoDeObra} 
            color="blue"
            onUpdate={(id, field, value) => handleItemUpdate('manoDeObra', id, field, value)}
            onDelete={(id) => removeItem('manoDeObra', id)}
            actions={
              <button onClick={() => addItem('manoDeObra', 'NUEVO PROCESO', 2000)} className="px-3 py-1 bg-blue-50/20 text-white text-[9px] font-bold rounded-lg border border-blue-400 hover:bg-blue-400">+ AÑADIR PROCESO</button>
            }
          />

          <CostTable 
            title="Insumos Directos" 
            items={currentData.insumosDirectos} 
            color="slate"
            onUpdate={(id, field, value) => handleItemUpdate('insumosDirectos', id, field, value)}
            onDelete={(id) => removeItem('insumosDirectos', id)}
            actions={
               <button onClick={() => addItem('insumosDirectos', 'NUEVO INSUMO')} className="px-3 py-1 bg-slate-50/20 text-white text-[9px] font-bold rounded-lg border border-slate-500 hover:bg-slate-600">+ AGREGAR INSUMOS</button>
            }
          />

          <CostTable 
            title="Insumos Indirectos" 
            items={currentData.insumosIndirectos} 
            color="amber"
            onUpdate={(id, field, value) => handleItemUpdate('insumosIndirectos', id, field, value)}
            onDelete={(id) => removeItem('insumosIndirectos', id)}
            actions={
              <button onClick={() => addItem('insumosIndirectos', 'NUEVO INDIRECTO')} className="px-3 py-1 bg-amber-50/20 text-white text-[9px] font-bold rounded-lg border border-amber-400 hover:bg-amber-400">+ AGREGAR INSUMO</button>
            }
          />

          <CostTable 
            title="Provisiones" 
            items={currentData.provisiones} 
            color="rose" 
            onUpdate={(id, field, value) => handleItemUpdate('provisiones', id, field, value)}
            onDelete={(id) => removeItem('provisiones', id)}
          />

          <div className="bg-yellow-400 rounded-2xl p-4 shadow-md border-2 border-yellow-500 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-yellow-900 uppercase tracking-widest">Costo para contabilizar</h3>
              <p className="text-[9px] font-bold text-yellow-800 uppercase">Total costos - Provisiones</p>
            </div>
            <p className="text-2xl font-black text-yellow-950">{formatCur(totalCosto - totalP)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CostTable: React.FC<{ 
  title: string; 
  items: CostLineItem[]; 
  color: 'indigo' | 'blue' | 'slate' | 'amber' | 'rose';
  actions?: React.ReactNode;
  onUpdate: (id: string, field: keyof CostLineItem, value: any) => void;
  onDelete: (id: string) => void;
}> = ({ title, items = [], color, actions, onUpdate, onDelete }) => {
  const formatCur = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
  
  const total = items.reduce((sum, i) => sum + (Number(i.valorUnidad) * Number(i.cantidad)), 0);

  const colors = {
    indigo: 'bg-indigo-600 text-indigo-50 border-indigo-100',
    blue: 'bg-blue-600 text-blue-50 border-blue-100',
    slate: 'bg-slate-700 text-slate-50 border-slate-100',
    amber: 'bg-amber-600 text-amber-50 border-amber-100',
    rose: 'bg-rose-600 text-rose-50 border-rose-100',
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className={`${colors[color]} px-6 py-3 flex justify-between items-center`}>
        <h4 className="text-[10px] font-black uppercase tracking-widest">{title}</h4>
        {actions}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter">Concepto</th>
              <th className="px-4 py-3 font-bold text-slate-400 uppercase text-center">UM</th>
              <th className="px-4 py-3 font-bold text-slate-400 uppercase text-right">Vlr. Unit</th>
              <th className="px-4 py-3 font-bold text-slate-400 uppercase text-center">Cant.</th>
              <th className="px-6 py-3 font-bold text-slate-400 uppercase text-right">Costo Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 group">
                <td className="px-4 py-3">
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
                  >
                    -
                  </button>
                </td>
                <td className="px-6 py-3">
                   <input 
                    className="w-full bg-transparent font-bold text-slate-700 uppercase outline-none" 
                    value={item.concepto}
                    onChange={(e) => onUpdate(item.id, 'concepto', e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                   <input 
                    className="w-12 bg-transparent text-slate-500 font-medium text-center outline-none uppercase" 
                    value={item.unidad}
                    onChange={(e) => onUpdate(item.id, 'unidad', e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                   <input 
                    type="number"
                    className="w-20 bg-transparent text-slate-600 font-bold text-right outline-none" 
                    value={item.valorUnidad}
                    onChange={(e) => onUpdate(item.id, 'valorUnidad', Number(e.target.value))}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                   <input 
                    type="number"
                    step="0.01"
                    className="w-12 bg-transparent text-slate-800 font-black text-center outline-none" 
                    value={item.cantidad}
                    onChange={(e) => onUpdate(item.id, 'cantidad', Number(e.target.value))}
                  />
                </td>
                <td className="px-6 py-3 text-right text-slate-900 font-black">{formatCur(item.valorUnidad * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/50">
            <tr>
              <td colSpan={5} className="px-6 py-3 text-right font-black text-slate-500 text-[10px] uppercase">Total {title}</td>
              <td className="px-6 py-3 text-right font-black text-slate-900">{formatCur(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CostSheetSection;
