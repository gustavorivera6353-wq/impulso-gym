# Impulso Gym

Plataforma web para administrar un gimnasio: llevar las membresías y los pagos de los socios, publicar avisos y promociones, organizar las clases con su cupo y atender quejas y sugerencias.

Es un proyecto individual del Equipo Dinamita (UDG Plus) y se desarrolla con Scrum, en Sprints de 10 días hábiles.

## Equipo Scrum

| Rol | Integrante |
| --- | --- |
| Product Owner | Gustavo Emmanuel Rivera Orozco |
| Scrum Master | Felix Ulises Franco Godinez |
| Desarrolladora | Brenda Janeth Garcia Mendoza |

Los roles rotan respecto al proyecto ReportaCasa (decisión del 21/11/2026).

## Tecnologías

- React 19
- Vite 8
- Oxlint (revisión de código)

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Otros comandos:

- `npm run build`: genera la versión de producción.
- `npm run lint`: revisa el código con Oxlint.

## Cuentas de prueba

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin` | `1234` (temporal; el sistema pide cambiarla en Mi cuenta) |
| Recepción | `recepcion` | `Recepcion1` |
| Entrenador | `carlos` | `Entrenador1` |
| Socio | `ana` | `Socio1234` |

Además, cualquier persona puede crear una cuenta de socio desde la pantalla de inicio de sesión.

## Funciones del sistema

Cada rol ve solo las secciones que le corresponden.

- **Inicio de sesión y cuenta (HU-01, HU-16):** campos obligatorios, mensajes de error, creación de cuentas y cambio de contraseña con reglas de seguridad (8 caracteres, mayúscula, minúscula y número).
- **Socios y roles (HU-02):** lista de socios con su rol y alta de nuevos socios.
- **Membresías (HU-03) y planes (HU-05):** consulta de vigencia (Activa, Por vencer, Vencida) y administración de planes.
- **Pagos (HU-04):** registro y consulta de pagos; cada pago crea o extiende la membresía.
- **Avisos y promociones (HU-06, HU-07):** publicación por administración y recepción, consulta para todos.
- **Clases (HU-08, HU-09, HU-10):** creación con horario y cupo, reservación y cancelación por parte del socio con membresía vigente.
- **Quejas y sugerencias (HU-11, HU-12):** registro por el socio y seguimiento de su estado.
- **Asistencia (HU-13, HU-14):** registro por el entrenador e historial del socio.
- **Reportes (HU-15):** ingresos por plan y por mes, membresías, asistencia por clase y descarga de pagos en CSV.

## Estructura del proyecto

```text
src/
  App.jsx                 Pantalla principal y menú por rol
  datos.js                Almacenamiento en el navegador, fechas y reglas
  ui.jsx                  Mensajes y etiquetas compartidas
  estilos.css             Estilo visual
  components/
    Login.jsx             Inicio de sesión y registro
    Socios.jsx            Socios y roles
    Membresias.jsx        Vigencia de membresías
    Planes.jsx            Planes de membresía
    Pagos.jsx             Pagos
    Avisos.jsx            Avisos y promociones
    Clases.jsx            Clases y reservaciones
    Asistencia.jsx        Asistencia
    Quejas.jsx            Quejas y sugerencias
    Reportes.jsx          Reportes
    Cuenta.jsx            Cambio de contraseña
```

## Avance por Sprint

| Sprint | Fechas | Meta | Estado |
| --- | --- | --- | --- |
| 1 | 17/11/2026 al 30/11/2026 | Repositorio con la base, inicio de sesión y registro de socios | Completado; HU-01 y HU-02 aceptadas el 22/11/2026 |
| 2 | 01/12/2026 al 14/12/2026 | Validar contraseñas y consultar membresías | Funcionalidad adelantada el 22 y 23/11/2026; en revisión del Product Owner |
| 3 | 15/12/2026 al 28/12/2026 | Registrar pagos y publicar avisos | Funcionalidad adelantada el 22 y 23/11/2026; en revisión del Product Owner |
| 4 | 29/12/2026 al 12/01/2027 | Consultar avisos y crear clases | Funcionalidad adelantada el 22 y 23/11/2026; en revisión del Product Owner |

## Limitaciones actuales

Los datos se guardan en el navegador (localStorage), no en un servidor: cada navegador tiene sus propios datos. Las contraseñas también se guardan ahí sin cifrar, por lo que el sistema es una demostración académica y no debe usarse con datos reales.

## Forma de trabajo

- Una rama y un Pull Request por tarea técnica, con el nombre `feature/T-xx-descripcion`.
- Las historias HU-03 a HU-16 se entregaron adelantadas en una sola rama (`feature/sprints-2-a-4`).
- El Product Backlog y los Sprints se llevan en Trello y en el documento del equipo.

## Referencia

Schwaber, K. y Sutherland, J. (2020). La Guía de Scrum. https://scrumguides.org

## Demo en línea

https://gustavorivera6353-wq.github.io/impulso-gym/
