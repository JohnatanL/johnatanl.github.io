---
title: "SmartCut AI"
summary: "Prototipo funcional académico desacoplado para gestión administrativa de barberías: cliente web en JavaScript ES6+ orientado a objetos conectado a una API REST en FastAPI con persistencia en SQLite."
status: "prototipo"
coverImage: "./evidence/arquitectura-smartcut.svg"
coverAlt: "Diagrama de arquitectura cliente-servidor de SmartCut AI diferenciando módulos operativos en Frontend, API REST en FastAPI, SQLAlchemy ORM, SQLite y módulos de demostración visual."
technologies:
  - "Python 3.12"
  - "FastAPI"
  - "SQLAlchemy 2.0"
  - "Pydantic v2"
  - "SQLite"
  - "JWT (HS256)"
  - "Bcrypt"
  - "JavaScript ES6+ (POO)"
  - "HTML5"
  - "CSS3"
  - "Tailwind CSS (CDN)"
  - "Docker Compose"
participation: "Diseño e implementación académica de la interfaz frontend orientada a objetos, construcción de la API REST en FastAPI, modelado ORM con SQLAlchemy sobre SQLite, integración cliente-servidor y contenerización local con Docker Compose."
problem: "Las barberías independientes suelen llevar el registro de servicios, tarifas, productos de inventario y cuentas de usuario de forma dispersa o manual, dificultando consultar disponibilidad de catálogo y consolidar indicadores básicos en un único panel."
objective: "Construir un prototipo funcional con arquitectura cliente-servidor desacoplada en dos repositorios independientes que demuestre autenticación con JWT, verificación de sesión y operaciones CRUD reales sobre usuarios, servicios y productos, diferenciando con transparencia las demostraciones visuales de interfaz."
architecture:
  summary: "Sistema dividido en dos repositorios públicos independientes comunicados mediante HTTP/REST. El Backend en FastAPI expone exactamente 20 decoradores de ruta sobre SQLite mediante SQLAlchemy 2.0 ORM; el Frontend sin bundler estructura su lógica en seis clases ES6 y consume activamente 15 endpoints únicos a través de un cliente Fetch centralizado."
  layers:
    - name: "Capa Frontend (SmartCut-AI-Frontend)"
      description: "Aplicación estática en HTML5, CSS3 (variables propias y diseño adaptable en 1100px, 800px y 520px), Tailwind CSS e iconos vía CDN, modales nativos <dialog> y seis clases en JavaScript ES6+ (ApiError, ApiClient, ToastController, UIController, CrudModule y AuthController)."
    - name: "Comunicación HTTP y Contratos (20 rutas / 15 consumidas)"
      description: "Un único punto fetch() en ApiClient canaliza 15 invocaciones this.api.* combinando formularios application/x-www-form-urlencoded (OAuth2 en /auth/login) y cargas JSON con encabezado Authorization: Bearer <token>. Cinco rutas expuestas por el backend (GET /, PUT /auth/update-password y tres GET /{id} individuales) permanecen disponibles en la API sin vista dedicada en la interfaz."
    - name: "Capa Backend (SmartCut-AI-Backend)"
      description: "Servicio Python 3.12.1 sobre FastAPI y Uvicorn organizado en routers (/auth, /users, /services, /products), esquemas Pydantic v2 con validación de EmailStr, seguridad con Passlib/Bcrypt y tokens firmados JWT HS256 mediante Python-JOSE."
    - name: "Capa de Persistencia y Contenedores"
      description: "Base de datos embebida SQLite (data/smartcut.db) operada mediante SQLAlchemy 2.0 ORM y preservada fuera del ciclo efímero del contenedor con un volumen montado (./data:/app/data) en Docker Compose."
features:
  - title: "Registro de cuentas, inicio de sesión OAuth2 y gestión local de sesión"
    description: "Creación de usuarios con hash Bcrypt, autenticación contra POST /auth/login con emisión de token JWT HS256, restauración automática de sesión mediante GET /auth/verify al recargar la página y cierre de sesión con limpieza local."
    scope: "implementado"
  - title: "Dashboard conectado en tiempo real a la API"
    description: "Consulta concurrente mediante Promise.all sobre /users/, /services/ y /products/ para presentar totales actualizados y estado real de conectividad con el servidor."
    scope: "implementado"
  - title: "CRUD completo de Usuarios, Servicios y Productos"
    description: "Listado, búsqueda instantánea en cliente, creación, edición y eliminación con confirmación modal nativa <dialog> y notificaciones de estado sobre registros persistidos en SQLite."
    scope: "implementado"
  - title: "Módulo de Agendamiento con lectura real de catálogo"
    description: "Consume realmente GET /services/ para poblar el selector con servicios y precios en COP almacenados en SQLite, pero la confirmación de reserva se resuelve como simulación en el navegador y no guarda citas en base de datos."
    scope: "demostracion-visual"
  - title: "Simulador de Estilo mediante previsualización local"
    description: "Valida en el navegador archivos de imagen de hasta 10 MB y genera una vista previa local con URL.createObjectURL; no transmite imágenes al backend ni ejecuta ningún modelo de inteligencia artificial."
    scope: "demostracion-visual"
evidences:
  - title: "Diagrama de arquitectura verificada (Frontend, API REST, FastAPI y SQLite)"
    type: "diagrama"
    image: "./evidence/arquitectura-smartcut.svg"
    alt: "Diagrama técnico de SmartCut AI que muestra las seis clases del Frontend, las dos demostraciones visuales acotadas, el canal HTTP REST con 15 de 20 endpoints consumidos, los routers FastAPI, SQLAlchemy 2.0 ORM y SQLite en volumen Docker."
    caption: "Representación fiel de los componentes auditados en código: separa los módulos operativos con persistencia real respecto al agendamiento simulado y el previsualizador local de estilo (fuente Mermaid editable conservada junto al SVG)."
challenges:
  - challenge: "Evitar código duplicado al administrar tres entidades distintas (Usuarios, Servicios y Productos) sin utilizar frameworks reactivos."
    solution: "Implementación de la clase parametrizada CrudModule en JavaScript ES6+, reutilizando renderizado de tablas, filtrado local, diálogos modales, control de condiciones de carrera (loadVersion) y saneamiento de celdas mediante escapeHTML."
  - challenge: "Integrar en un mismo cliente HTTP el formato OAuth2PasswordRequestForm exigido por FastAPI en el login junto con peticiones JSON en el resto de recursos."
    solution: "Diseño de ApiClient para detectar cargas URLSearchParams frente a objetos JSON, ajustando dinámicamente Content-Type, inyección del token Bearer y captura uniforme de errores HTTP con ApiError."
  - challenge: "Conservar los datos de SQLite al reconstruir contenedores y evitar incompatibilidades de versiones en el cifrado de contraseñas."
    solution: "Montaje explícito del volumen ./data:/app/data en Docker Compose y fijación compatible de bcrypt==3.2.2 junto a passlib[bcrypt] en el entorno Python 3.12."
learnings:
  - "Diseño y trazabilidad de contratos REST reales entre repositorios separados de frontend y backend, conciliando nombres de campos, códigos HTTP y manejo de CORS."
  - "Aplicación práctica de programación orientada a objetos en JavaScript moderno sin dependencias de empaquetado para mantener una interfaz administrativa estructurada."
  - "Comprensión de la diferencia entre ocultar controles en el cliente y aplicar autorización obligatoria en cada router del servidor mediante inyección de dependencias."
  - "Importancia de documentar con precisión el alcance de un prototipo académico, distinguiendo persistencia real, demostraciones visuales y tareas de endurecimiento previas a producción."
limitations:
  - "Los routers CRUD (/users/, /services/ y /products/) no inyectan actualmente Depends(get_current_user) en el backend, por lo que no exigen autenticación JWT si se invoca la API directamente fuera de la interfaz."
  - "No existe control de acceso basado en roles (RBAC); todas las cuentas autenticadas acceden a las mismas vistas administrativas."
  - "El cierre de sesión (DELETE /auth/logout) es stateless y no revoca tokens en servidor; la invalidación depende de eliminar el JWT en localStorage y de su expiración temporal."
  - "Actualizar un usuario con un correo electrónico ya registrado en otro registro (PUT /users/{user_id}) puede producir un error HTTP 500 al no validarse previamente la colisión ni capturarse IntegrityError."
  - "Las validaciones de rangos numéricos (precios, duración y stock no negativos) y longitud mínima de contraseña están presentes en el HTML del cliente, pero incompletas en los esquemas Pydantic del backend."
  - "La carga de variables .env requiere revisión: pydantic-settings figura en requirements.txt sin uso activo y security.py consulta os.getenv() directamente sin env_file declarado en docker-compose.yml."
  - "La política CORS está acoplada exclusivamente a orígenes locales de desarrollo (localhost y 127.0.0.1 en los puertos 5500 y 5501)."
  - "Las consultas de listado utilizan paginación fija en cliente (?skip=0&limit=100) sin controles de navegación por páginas."
  - "El endpoint protegido PUT /auth/update-password está implementado en el backend, pero aún no cuenta con formulario en la interfaz frontend."
futureImprovements:
  - "Proteger todos los endpoints de escritura y lectura sensible en /users/, /services/ y /products/ con Depends(get_current_user) e incorporar roles diferenciados (administrador y cliente)."
  - "Reforzar los esquemas Pydantic v2 con restricciones Field(ge=0, min_length=...) y manejo explícito de IntegrityError devolviendo respuestas HTTP 400/409 controladas."
  - "Centralizar la configuración de entorno mediante BaseSettings (pydantic-settings) y parametrizar los orígenes CORS para despliegue externo."
  - "Modelar e implementar una entidad persistente de citas (appointments) en el backend para convertir la demostración de agendamiento en un flujo transaccional real."
  - "Compilar estilos e iconografía localmente para eliminar la dependencia de CDNs externos en el frontend."
repositories:
  - label: "Repositorio Frontend (HTML/CSS/JS POO)"
    url: "https://github.com/JohnatanL/SmartCut-AI-Frontend"
    visibility: "publico"
  - label: "Repositorio Backend (FastAPI + SQLite)"
    url: "https://github.com/JohnatanL/SmartCut-AI-Backend"
    visibility: "publico"
demoUrl: "PENDIENTE"
draft: false
featured: true
order: 1
---

## Contexto académico y propósito técnico

**SmartCut AI** es un prototipo funcional desarrollado dentro del programa **Técnico en Programación de Software del SENA**. Su objetivo principal fue construir y conectar desde cero dos aplicaciones independientes —un cliente web administrativo y un servicio RESTful— para resolver operaciones cotidianas de catálogo, inventario y usuarios en una barbería, manteniendo una separación limpia de responsabilidades.

A diferencia de una maqueta puramente estática, el proyecto implementa persistencia real en base de datos para sus tres dominios centrales y expone de forma transparente qué apartados corresponden a demostraciones interactivas de interfaz y qué controles de seguridad deben endurecerse antes de un entorno productivo.

## Arquitectura e integración entre repositorios

El sistema se organiza en dos repositorios públicos verificados:

1. **`SmartCut-AI-Frontend`:** Construido con **HTML5**, **CSS3** propio con variables de diseño (`--navy`, `--blue`, `--cyan`) y tres puntos de quiebre responsivos, apoyo visual de **Tailwind CSS** y **Material Icons** vía CDN, diálogos nativos `<dialog>` y **JavaScript ES6+** en modo estricto estructurado en **seis clases**:
   - `ApiError`: encapsula códigos de estado HTTP y detalles devueltos por FastAPI.
   - `ApiClient`: único punto de comunicación HTTP (`fetch()`), encargado de adjuntar el token `Bearer` almacenado en `localStorage` y serializar peticiones JSON o formularios OAuth2.
   - `ToastController`: notificaciones visuales no bloqueantes para confirmar acciones o reportar fallos de red/validación.
   - `UIController`: coordinación de vistas, indicadores del panel principal con consultas concurrentes (`Promise.all`), módulo de agendamiento y previsualizador local de estilo.
   - `CrudModule`: abstracción reutilizable para listar, filtrar en tiempo real, crear, actualizar y eliminar registros en cada tabla administrativa.
   - `AuthController`: flujo de registro con inicio de sesión inmediato, autenticación, verificación de sesión activa y cierre de sesión local.
2. **`SmartCut-AI-Backend`:** Implementado en **Python 3.12.1** con **FastAPI** y **Uvicorn**, utilizando **SQLAlchemy 2.0 ORM** sobre **SQLite** (`data/smartcut.db`), validación de contratos mediante **Pydantic v2**, hashing de contraseñas con **Passlib + Bcrypt**, tokens **JWT (`HS256`)** con **Python-JOSE** y despliegue local reproducible mediante **Docker** y **Docker Compose**.

### Trazabilidad exacta de endpoints (`20` expuestos / `15` consumidos)

La auditoría directa sobre los decoradores `@app.*` y `@router.*` del backend y las llamadas del cliente confirma la siguiente distribución:

- **20 endpoints implementados en el Backend:** `1` ruta raíz (`GET /`), `4` rutas en `/auth` (`POST /auth/login`, `GET /auth/verify`, `PUT /auth/update-password`, `DELETE /auth/logout`) y `5` rutas CRUD en cada uno de los tres routers de negocio (`/users/`, `/services/`, `/products/`).
- **15 endpoints únicos consumidos por el Frontend:** `3` de autenticación (`login`, `verify`, `logout`) y `4` por cada módulo CRUD (`POST /`, `GET /`, `PUT /{id}`, `DELETE /{id}`), invocados desde 15 expresiones `this.api.*` canalizadas por una única llamada `fetch()`.
- **5 endpoints disponibles en el Backend sin consumo en la interfaz actual:** `GET /`, `PUT /auth/update-password` y las tres consultas unitarias `GET /users/{user_id}`, `GET /services/{service_id}` y `GET /products/{product_id}` (la interfaz edita a partir de la colección cargada en memoria).

## Alcance honesto de las demostraciones visuales

El nombre del proyecto incluye la referencia conceptual a *AI* por su visión de producto, pero el alcance técnico implementado se documenta con total precisión:

- **Agendamiento:** realiza una petición real `GET /services/?skip=0&limit=100` al backend para mostrar los servicios y precios vigentes almacenados en SQLite; sin embargo, al confirmar el formulario solo presenta retroalimentación simulada en el cliente sin persistir citas en el servidor.
- **Simulador de Estilo:** opera íntegramente en el navegador validando tipo de imagen y tamaño máximo (`10 MB`) mediante `URL.createObjectURL`, sin enviar fotografías al backend ni ejecutar modelos de inteligencia artificial.

