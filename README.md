# Impulso Gym

Plataforma web para administrar un gimnasio: llevar las membresías y los pagos de los socios, publicar avisos y promociones, organizar las clases con su cupo y atender quejas y sugerencias.

Es un proyecto individual del Equipo Dinamita (UDG Plus) y se desarrolla con Scrum, en Sprints de 10 días hábiles.

## Equipo Scrum

| Rol | Integrante |
| --- | --- |
| Product Owner | Felix Ulises Franco Godinez |
| Scrum Master | Brenda Janeth Garcia Mendoza |
| Desarrollador | Gustavo Emmanuel Rivera Orozco |

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

Para entrar al sistema se usa el usuario de prueba `admin` con contraseña `1234`. Es un usuario fijo y temporal; la historia HU-16 agrega la validación de contraseñas.

## Funciones del sistema

En desarrollo (Sprint 1):

- Inicio de sesión (HU-01).
- Administración de socios y roles (HU-02).

Planeadas: validación de contraseñas, consulta de membresías, pagos, avisos y promociones, y creación de clases. El detalle completo está en el Product Backlog.

## Estructura del proyecto

```text
src/
  App.jsx                  Pantalla principal
  components/
    Login.jsx              Inicio de sesión
    Socios.jsx             Socios y roles
```

## Avance por Sprint

| Sprint | Fechas | Meta | Estado |
| --- | --- | --- | --- |
| 1 | 17/11/2026 al 30/11/2026 | Repositorio con la base, inicio de sesión y registro de socios | En curso |
| 2 | 01/12/2026 al 14/12/2026 | Validar contraseñas y consultar membresías | Planeado |
| 3 | 15/12/2026 al 28/12/2026 | Registrar pagos y publicar avisos | Planeado |
| 4 | 29/12/2026 al 12/01/2027 | Consultar avisos y crear clases | Planeado |

## Limitaciones actuales

Los datos viven solo en el estado de React, así que se pierden al recargar la página.

## Forma de trabajo

- Una rama y un Pull Request por tarea técnica, con el nombre `feature/T-xx-descripcion`.
- El Product Backlog y los Sprints se llevan en Trello y en el documento del equipo.

## Referencia

Schwaber, K. y Sutherland, J. (2020). La Guía de Scrum. https://scrumguides.org

## Demo en línea

https://gustavorivera6353-wq.github.io/impulso-gym/
