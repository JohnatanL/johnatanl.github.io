---
# PLANTILLA DE PROYECTO — Copiar como: src/content/projects/<slug-kebab-case>/index.md
# IMPORTANTE:
# 1. NO agregues un campo "slug": el identificador y la URL se generan desde el nombre de la carpeta.
# 2. El esquema usa z.strictObject(): cualquier propiedad no listada aquí detendrá la compilación.
# 3. Usa preferentemente URLs con esquema https:// en enlaces externos, repositorios y demoUrl.
# 4. Puedes omitir createdAt y updatedAt si no cuentas con fechas exactas verificables.

title: "Nombre del Proyecto"
summary: "Resumen técnico conciso del proyecto entre 20 y 220 caracteres explicando qué problema aborda y con qué stack real está construido."
status: "en-desarrollo" # Valores permitidos: prototipo | en-desarrollo | terminado | archivado
# createdAt: 2026-11-01
# updatedAt: 2026-11-15
# coverImage: "./evidence/arquitectura.svg"
# coverAlt: "Descripción clara y accesible de la imagen de portada (obligatoria si usas coverImage)."

technologies:
  - "Tecnología 1"
  - "Tecnología 2"

participation: "Descripción puntual de tu rol técnico y responsabilidades reales en el proyecto."
problem: "Explicación clara de la necesidad o problema técnico que motiva la construcción del sistema."
objective: "Objetivo verificable alcanzado o buscado con la arquitectura e implementación actual."

architecture:
  summary: "Descripción general de cómo interactúan los módulos o capas del proyecto."
  layers:
    - name: "Capa o módulo 1"
      description: "Responsabilidad específica y tecnologías empleadas en esta capa."

features:
  - title: "Funcionalidad operativa principal"
    description: "Qué hace realmente hoy en código y cómo se verifica."
    scope: "implementado" # Valores: implementado | demostracion-visual | en-progreso

# CADA EVIDENCIA DEBE TENER EXACTAMENTE UNA FUENTE PRINCIPAL:
# - image (ruta relativa dentro de ./evidence/ + alt obligatorio), O
# - filePath (ruta local segura bajo /files/ sin .. ni %), O
# - externalUrl (URL externa HTTP/HTTPS, preferentemente https://).
evidences: []
  # - title: "Diagrama de arquitectura"
  #   type: "diagrama" # Valores: captura | diagrama | documento | video | demo
  #   image: "./evidence/diagrama.svg"
  #   alt: "Texto alternativo descriptivo obligatorio para accesibilidad."
  #   caption: "Explicación técnica breve de lo que demuestra esta evidencia."

challenges:
  - challenge: "Obstáculo técnico real encontrado durante el desarrollo."
    solution: "Decisión o implementación concreta aplicada para resolverlo."

learnings:
  - "Aprendizaje técnico verificable obtenido al construir este proyecto."

limitations:
  - "Limitación técnica o de seguridad actual documentada con transparencia."

futureImprovements:
  - "Mejora futura propuesta, separada de lo que ya está implementado."

repositories:
  - label: "Repositorio Principal"
    url: "PENDIENTE" # Reemplazar por URL https://... cuando sea público
    visibility: "pendiente" # Valores: publico | privado | pendiente

demoUrl: "PENDIENTE" # Reemplazar por URL https://... cuando exista despliegue activo
draft: true # Cambiar a false únicamente cuando el contenido esté revisado y listo para publicar
featured: false
order: 10
---

## Contexto y decisiones técnicas

Desarrolla aquí en Markdown el análisis complementario del proyecto: estructura interna, flujo de datos y criterios de calidad aplicados. Evita incluir datos personales de terceros, credenciales o métricas no verificadas.

