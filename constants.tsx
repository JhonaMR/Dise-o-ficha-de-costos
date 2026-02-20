
import { DashboardData } from './types';

export const DASHBOARD_DATA: Record<string, DashboardData> = {
  "Madres 2026": {
    kpis: {
      cantReferencias: 121,
      referenciasCero: 17,
      porcentajeCero: 14.0,
      ventasTotalesUnd: 8147,
      despachosTotalesUnd: 3464,
      porcentajeDespacho: 42.5,
      ventasTotalesPesos: 181120300,
      valorDespachoPrecioLista: 77094800,
      despachosRealesReal: 74010000,
      diferenciaPesos: 3084800,
      porcentajeDiferencia: 4.0
    },
    vendedores: [
      { nombre: "LINA", pedidos: 24, undVendidas: 4333, undDespachadas: 1832, porcentajeSobreVenta: 53.2, valorVendido: 103648100, valorPrecioLista: 103674500, porcentajeDiferencia: 0.0, cumplimientoUnd: 42.3, cumplimientoVlr: 42.1, vlrDifVentaDesp: 59990300 },
      { nombre: "RAUL", pedidos: 16, undVendidas: 1558, undDespachadas: 588, porcentajeSobreVenta: 19.1, valorVendido: 39384200, valorPrecioLista: 39540200, porcentajeDiferencia: -0.4, cumplimientoUnd: 37.7, cumplimientoVlr: 34.7, vlrDifVentaDesp: 25703000 },
      { nombre: "JOHN", pedidos: 12, undVendidas: 2256, undDespachadas: 1044, porcentajeSobreVenta: 27.7, valorVendido: 38088000, valorPrecioLista: 47366400, porcentajeDiferencia: -24.4, cumplimientoUnd: 46.3, cumplimientoVlr: 43.8, vlrDifVentaDesp: 21417000 }
    ],
    disenadoras: [
      { nombre: "JACKELINE PEREA", ventas: 78945900, refCreadas: 36, refVendidas: 35, porcentajePedidas: 97, refEnCero: 1, porcentajeEnCero: 3 },
      { nombre: "MARTHA RAMIREZ", ventas: 89438000, refCreadas: 58, refVendidas: 45, porcentajePedidas: 78, refEnCero: 13, porcentajeEnCero: 22 },
      { nombre: "CATALINA CASTRO", ventas: 955200, refCreadas: 2, refVendidas: 1, porcentajePedidas: 50, refEnCero: 1, porcentajeEnCero: 50 },
      { nombre: "JENNIFER QUINTERO", ventas: 2170800, refCreadas: 5, refVendidas: 3, porcentajePedidas: 60, refEnCero: 2, porcentajeEnCero: 40 },
      { nombre: "MARIA MERCEDES", ventas: 3343200, refCreadas: 1, refVendidas: 1, porcentajePedidas: 100, refEnCero: 0, porcentajeEnCero: 0 },
      { nombre: "ZIVIS PACHECO", ventas: 178800, refCreadas: 1, refVendidas: 1, porcentajePedidas: 100, refEnCero: 0, porcentajeEnCero: 0 },
      { nombre: "MARIANA OCAMPO", ventas: 15549200, refCreadas: 17, refVendidas: 17, porcentajePedidas: 100, refEnCero: 0, porcentajeEnCero: 0 }
    ],
    produccion: [
      { id: '1', tercero: 'CAMILO HOYOS', referencia: '12871', cantidad: 84, fechaEnvio: '2025-12-15', fechaPresupuestada: '2025-12-22', fechaEntrega: '2026-01-20', proceso: 'CONFECCIÓN', observacion: '' },
      { id: '2', tercero: 'CAMILO HOYOS', referencia: '12782', cantidad: 120, fechaEnvio: '2025-12-23', fechaPresupuestada: '2025-12-24', fechaEntrega: '2026-01-08', proceso: 'TERMINACIÓN', observacion: '' },
      { id: '10', tercero: 'NANCY ARBOLEDA', referencia: '12783', cantidad: 120, fechaEnvio: '2026-01-07', fechaPresupuestada: '2026-01-14', fechaEntrega: '2026-01-13', proceso: 'TERMINACIÓN', observacion: '' }
    ],
    costos: [
      {
        id: '1',
        referencia: '13011',
        marca: 'PLOW',
        coleccion: 'MADRES',
        disenadora: 'JACKELINE PEREA',
        nombrePrenda: 'BLUSA EN GRIP',
        telaPrincipal: 'BURDA FRIA',
        fotoUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=436&auto=format&fit=crop',
        observaciones: 'LLEVA 3 FLORES POR BLUSA. 25 CM PARA ELCUELLO PARA TODAS LAS TALLAS',
        // Added missing properties required by CostSheet interface
        muestras: ['', ''],
        cortes: [],
        materiaPrima: [
          { id: 'm1', concepto: 'BURDA FRIA', unidad: 'METRO', valorUnidad: 16500, cantidad: 0.56, total: 9240 }
        ],
        manoDeObra: [
          { id: 'mo1', concepto: 'ESTAMPADO CAMILO', unidad: 'PRENDA', valorUnidad: 2200, cantidad: 1, total: 2200 },
          { id: 'mo2', concepto: 'CONFECCION BLUSA', unidad: 'UNIDAD', valorUnidad: 2000, cantidad: 1, total: 2000 }
        ],
        insumosDirectos: [
          { id: 'id1', concepto: 'MARQUILLA', unidad: 'UNIDAD', valorUnidad: 70, cantidad: 1, total: 70 },
          { id: 'id2', concepto: 'ETIQUETA', unidad: 'UNIDAD', valorUnidad: 130, cantidad: 1, total: 130 }
        ],
        insumosIndirectos: [
          { id: 'ii1', concepto: 'GRIPUR DE FLOR INSUTEX', unidad: 'UNIDAD', valorUnidad: 3900, cantidad: 0.24, total: 936, nota: 'INSUTEX' }
        ],
        provisiones: [
          { id: 'p1', concepto: 'PROV. CARTERA', unidad: 'UNIDAD', valorUnidad: 200, cantidad: 1, total: 200 }
        ],
        precioVenta: 30900,
        margenRentabilidad: 37
      }
    ]
  }
};

export const CORRERIA_OPTIONS = ["Madres 2026", "Inicio de año 2026"];
