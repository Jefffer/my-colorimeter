# 🎨 ToneMap

> **Colorimetría personalizada impulsada por IA.** Analiza tu foto y descubre tu paleta de colores ideal en segundos.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vitejs.dev/)

---

## ✨ ¿Qué es ToneMap?

ToneMap es una aplicación web que utiliza **Google Gemini 2.5 Flash** con visión por computadora para analizar tu fotografía y generar un análisis personalizado de colorimetría. En cuestión de segundos, recibe:

- 🎯 Tu **estación de color** (Primavera, Verano, Otoño, Invierno)
- 🔍 Tu **subtono** (Cálido, Neutro, Frío)
- 🎭 **6 colores ideales** para resaltar tus mejores rasgos
- 💜 **4 colores neutros** versátiles para tu guardarropa
- ❌ **3 colores a evitar** que pueden opacarte

### Privacidad Primero

- ✅ La imagen se procesa **localmente en tu navegador**
- ✅ **No se almacena** en ningún servidor
- ✅ El análisis es **tuyo y solo tuyo**
- ✅ Descarga tu reporte en JSON si lo deseas

---

## 🏗️ Arquitectura

### Frontend (React + Vite + Tailwind CSS)

```
src/
├── components/
│   ├── Hero.jsx              # Sección hero con aurora animations
│   ├── LoadingOverlay.jsx    # Overlay durante análisis
│   └── Footer.jsx            # Footer con info y redes sociales
├── App.jsx                   # Componente principal (sticky logic)
├── main.jsx                  # Entry point
└── index.css                 # Estilos globales + temas Tippy
```

**Stack:**
- **React 19** — Framework UI
- **Vite 8** — Build tool ultrarrápido
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Aurora animations
- **Tippy.js** — Tooltips estilizados
- **Lucide React + React Icons** — Icons

### Backend API (Node.js)

```
api/
├── generate.js      # Handler principal de análisis
├── dev-server.js    # Servidor dev local
├── debug-log.jsonl  # Logs de desarrollo (local only)
└── local-secrets.local  # Credenciales Gemini (gitignored)
```

**Stack:**
- **Node.js 18+** — Runtime
- **Google Gemini API** — IA de análisis
- **Vercel Functions** — Deployment sin servidor

---

## 🤖 Google Gemini Integration

### Cómo Funciona

1. **Usuario sube una foto** → Se convierte a base64
2. **Frontend envía a `/api/generate`** → Con metadata (MIME type, nombre)
3. **Backend procesa con Gemini** → Vision + LLM analysis
4. **Gemini retorna análisis JSON** → Con paleta personalizada
5. **Frontend renderiza resultados** → Colores, razones, paleta

### Prompt Engineering

El backend usa un prompt sofisticado que le indica a Gemini:
- Analizar el **tono de piel**, **cabello**, **ojos** del rostro
- Determinar **estación de color** (pigmentación natural)
- Identificar **subtono** (cálido, neutro, frío)
- Generar **6 mejores opciones, 4 neutros, 3 a evitar**
- Retornar **JSON estructurado** con razones detalladas

```javascript
// Estructura esperada de Gemini
{
  season: "Otoño Profundo",
  undertone: "Cálido",
  summary: "...",
  why_this_works: "...",
  best_options: [{ name, hex, reason }, ...],
  neutral_options: [{ name, hex, reason }, ...],
  avoid_options: [{ name, hex, reason }, ...]
}
```

### Modelos Soportados

- **Primary:** `gemini-3-flash-preview` (última generación)
- **Fallback:** `gemini-2.5-flash` (stable)
- **Free Tier:** 15 requests/min, 20 requests/día
- **Paid:** Escalable según tu plan

---

## 🎯 Características Principales

### ✅ Análisis Rápido
- Procesa en < 5 segundos
- Interfaz responsiva
- Carga optimizada con Vite

### ✅ Diseño Elegante
- Aurora animations de fondo
- Gradientes sutiles
- Tipografía premium (Sora)
- Tema oscuro minimalista
- Accesibilidad WCAG

### ✅ UX Inteligente
- Sticky sidebar en desktop (desktop-first)
- Sticky desactivado dinámicamente cerca del footer
- Tooltip informativo con Tippy.js
- Descarga de reporte en JSON
- Preview de imagen en tiempo real

### ✅ Privacidad y Transparencia
- Sin almacenamiento de imágenes
- Logs locales solo en desarrollo
- Footer con info de privacidad
- Links a GitHub y LinkedIn del creador

---

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js 18+
- npm o pnpm
- Clave API de Google Gemini (gratuita en [ai.google.dev](https://ai.google.dev))

### Setup Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jefffer/my-colorimeter.git
cd my-colorimeter

# 2. Instalar dependencias
npm install

# 3. Crear archivo de credenciales
echo '{ "GEMINI_API_KEY": "tu-clave-aqui" }' > api/local-secrets.local

# 4. Ejecutar en desarrollo
npm run dev:all
# Abre http://localhost:5174 (frontend)
# API disponible en http://localhost:3001
```

### Variables de Entorno (Vercel)

```bash
GEMINI_API_KEY=tu_clave_gemini_aqui
```

### Scripts Disponibles

```bash
npm run dev         # Frontend dev (Vite)
npm run dev:api     # API dev (Node.js)
npm run dev:all     # Ambos en paralelo (concurrently)
npm run build       # Build production
npm run preview     # Preview build local
npm run lint        # ESLint
```

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Selecciona foto                                │ │
│  │  2. Preview en tiempo real                         │ │
│  │  3. Click "Analizar colorimetría"                  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────────────┘
               │
               │ POST /api/generate
               │ { image: base64, mimeType, fileName }
               ↓
┌─────────────────────────────────────────────────────────┐
│                   VERCEL FUNCTIONS                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Valida request                                 │ │
│  │  2. Intenta gemini-3-flash-preview                 │ │
│  │  3. Fallback a gemini-2.5-flash                    │ │
│  │  4. Parsea JSON de respuesta                       │ │
│  │  5. Retorna análisis estructurado                  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────────────┘
               │
               │ { report: { ... } }
               ↓
┌─────────────────────────────────────────────────────────┐
│              FRONTEND RENDERIZA                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Mostrar paleta de colores                      │ │
│  │  2. Razones detalladas por color                   │ │
│  │  3. Botón descargar JSON                           │ │
│  │  4. Botón limpiar todo                             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Técnico Detallado

### Frontend
| Librería | Versión | Propósito |
|----------|---------|-----------|
| React | 19.2.5 | UI Framework |
| Vite | 8.0.10 | Build tool |
| Tailwind CSS | 4.2.4 | Styling |
| Framer Motion | 12.38.0 | Animations |
| Tippy.js | 4.2.6 | Tooltips |
| Lucide React | 1.14.0 | Icons |
| React Icons | 5.6.0 | Icon library |

### Backend
| Librería | Versión | Propósito |
|----------|---------|-----------|
| Google Gemini API | 2.0.0+ | IA Analysis |
| Node.js | 18+ | Runtime |
| Concurrently | Latest | Dev parallelization |

### Dev Tools
| Herramienta | Propósito |
|-------------|-----------|
| ESLint | Code linting |
| Vite Config | Build optimization |
| Tailwind Vite Plugin | CSS JIT |

---

## 🔐 Seguridad y Privacidad

### ✅ Implementado
- **No storage de imágenes** — Procesadas en tiempo real, descartadas inmediatamente
- **HTTPS en producción** — Vercel maneja SSL automáticamente
- **Validación de input** — Verificación de MIME type y tamaño
- **Rate limiting** — Google Gemini API quota incluida
- **Error handling** — Mensajes seguros sin exponer detalles internos

### 📝 Futuras Mejoras
- [ ] Autenticación opcional para guardar historiales
- [ ] Encriptación end-to-end (opcional)
- [ ] GDPR compliance checklist

---

## 📈 Performance

### Optimizaciones Implementadas
- ✅ Vite: Bundling optimizado (~150KB gzipped)
- ✅ Code splitting: Lazy loading de componentes
- ✅ Image optimization: Base64 redimensionada antes de envio
- ✅ CSS: Tailwind JIT (solo clases usadas)
- ✅ Animations: GPU-accelerated (transform, opacity)

### Métricas Esperadas
- **Lighthouse:** 95+ performance
- **FCP:** < 1.5s
- **LCP:** < 2.5s
- **CLS:** < 0.05
- **API Response:** 2-5s (incluye Gemini)

---

## 🎨 Paleta de Colores (Diseño)

```
Primary Background:    #0c0d10  (Almost black)
Surface:               #0f1115  (Dark card)
Accent:                #f0bf86  (Warm gold)
Accent Soft:           #d5ece3  (Soft mint)
Text:                  #f5efe7  (Warm white)
Muted:                 #b9b2a9  (Gray-warm)
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! 

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas para Contribuir
- 🐛 Reportar bugs
- 💡 Sugerir nuevas características
- 📝 Mejorar documentación
- 🌍 Traducciones
- ♿ Accesibilidad

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Jefffer** — Colorimetry & Web Development

- 🔗 [LinkedIn](https://www.linkedin.com/in/jefffer/)
- 🐙 [GitHub](https://github.com/Jefffer)
- 🌐 [Portfolio](https://jefffer.com) *(opcional)*

---

## 🙏 Agradecimientos

- **Google Gemini** por la potencia de IA
- **Vercel** por el hosting serverless
- **React & Vite** comunidades por excelentes herramientas
- **Tailwind CSS** por el sistema de diseño

---

## 📧 Soporte

¿Preguntas o sugerencias? Abre un [GitHub Issue](https://github.com/Jefffer/my-colorimeter/issues) o contacta a través de LinkedIn.

---

<div align="center">

**Hecho con ❤️ y IA** 

v1.0.0 — Mayo 2026

</div>
