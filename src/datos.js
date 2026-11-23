import { useState, useEffect } from "react";

// Guarda los datos en el navegador (localStorage) para que no se pierdan al recargar.
export function useAlmacen(clave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem("ig_" + clave);
      if (guardado !== null) {
        return JSON.parse(guardado);
      }
    } catch {
      // Si el navegador no permite almacenamiento, se usan los datos iniciales.
    }
    return typeof inicial === "function" ? inicial() : inicial;
  });

  useEffect(() => {
    try {
      localStorage.setItem("ig_" + clave, JSON.stringify(valor));
    } catch {
      // Sin almacenamiento disponible: los datos duran solo mientras la página está abierta.
    }
  }, [clave, valor]);

  return [valor, setValor];
}

// ---------- Fechas y formato ----------
const cero = (n) => String(n).padStart(2, "0");
export const aISO = (d) =>
  d.getFullYear() + "-" + cero(d.getMonth() + 1) + "-" + cero(d.getDate());
export const hoy = () => aISO(new Date());

export function sumarDias(iso, dias) {
  const [y, m, d] = iso.split("-").map(Number);
  return aISO(new Date(y, m - 1, d + dias));
}

// Días de diferencia entre dos fechas ISO (b - a).
export function diasEntre(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export const formatoFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");
export const dinero = (n) => "$" + Number(n).toLocaleString("es-MX");

// HU-03: estado de una membresía según su vigencia.
export function estadoMembresia(m) {
  if (!m) {
    return { texto: "Sin membresía", clase: "gris", dias: 0 };
  }
  const dias = diasEntre(hoy(), m.fin);
  if (dias < 0) {
    return { texto: "Vencida", clase: "rojo", dias };
  }
  if (dias <= 7) {
    return { texto: "Por vencer", clase: "amarillo", dias };
  }
  return { texto: "Activa", clase: "verde", dias };
}

// ---------- HU-16: reglas de contraseña ----------
export const REGLAS_CONTRASENA = [
  { texto: "Debe tener al menos 8 caracteres.", cumple: (c) => c.length >= 8 },
  { texto: "Debe incluir al menos una letra mayúscula.", cumple: (c) => /[A-ZÁÉÍÓÚÑ]/.test(c) },
  { texto: "Debe incluir al menos una letra minúscula.", cumple: (c) => /[a-záéíóúñ]/.test(c) },
  { texto: "Debe incluir al menos un número.", cumple: (c) => /[0-9]/.test(c) },
  { texto: "No debe contener espacios.", cumple: (c) => !/\s/.test(c) },
];

export function validarContrasena(contrasena) {
  return REGLAS_CONTRASENA.filter((r) => !r.cumple(contrasena)).map((r) => r.texto);
}

// ---------- Datos iniciales (se usan solo la primera vez) ----------
export const SOCIOS_INICIALES = [
  { id: 1, nombre: "Ana López", rol: "Socio" },
  { id: 2, nombre: "Carlos Ruiz", rol: "Entrenador" },
  { id: 3, nombre: "Mariana Díaz", rol: "Recepción" },
];

export const USUARIOS_INICIALES = [
  { usuario: "admin", contrasena: "1234", rol: "Administrador", nombre: "Administrador" },
  { usuario: "recepcion", contrasena: "Recepcion1", rol: "Recepción", nombre: "Mariana Díaz" },
  { usuario: "carlos", contrasena: "Entrenador1", rol: "Entrenador", nombre: "Carlos Ruiz" },
  { usuario: "ana", contrasena: "Socio1234", rol: "Socio", nombre: "Ana López", socioId: 1 },
];

export const PLANES_INICIALES = [
  { id: 1, nombre: "Mensual", precio: 600, duracionDias: 30 },
  { id: 2, nombre: "Trimestral", precio: 1600, duracionDias: 90 },
  { id: 3, nombre: "Anual", precio: 5500, duracionDias: 365 },
];

export const membresiasIniciales = () => [
  { socioId: 1, planId: 1, planNombre: "Mensual", inicio: sumarDias(hoy(), -10), fin: sumarDias(hoy(), 20) },
];

export const pagosIniciales = () => [
  { id: 1, socioId: 1, socioNombre: "Ana López", planId: 1, planNombre: "Mensual", monto: 600, metodo: "Efectivo", fecha: sumarDias(hoy(), -10) },
];

export const avisosIniciales = () => [
  { id: 1, tipo: "Promoción", titulo: "Inscripción gratis en diciembre", texto: "Si contratas un plan trimestral o anual en diciembre, no pagas inscripción.", fecha: hoy() },
];

export const clasesIniciales = () => [
  { id: 1, nombre: "Spinning", entrenador: "Carlos Ruiz", fecha: sumarDias(hoy(), 1), hora: "07:00", cupo: 12 },
  { id: 2, nombre: "Yoga", entrenador: "Carlos Ruiz", fecha: sumarDias(hoy(), 2), hora: "18:30", cupo: 10 },
];

export const reservasIniciales = () => [{ id: 1, claseId: 1, socioId: 1 }];
