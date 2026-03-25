# ✅ CHECKLIST - Actualizar GitHub (RadicacionPY)

## Archivos a REEMPLAZAR en tu repo

### 1. `/app/page.js`
**Cambiar por:** `app-page-final.jsx` 
**Cambios principales:**
- ✅ Removido `placeholder="XX"` del input Edad
- ✅ Input edad ahora vacío (sin placeholder)
- ✅ Todo lo demás igual

**Instrucciones:**
1. Abre `/app/page.js` en GitHub web editor
2. Copia TODO el contenido de `app-page-final.jsx`
3. Pega en `/app/page.js`
4. Commit: "Fix: remove placeholder XX from age input"

---

### 2. `/app/api/send-email/route.js`
**Cambiar por:** `route-final.js`
**Cambios principales:**
- ✅ Headers EMAIL ahora usan MISMOS EMOJIS que WhatsApp
  - 📋 Datos Personales (igual que WhatsApp)
  - 🏛️ Clasificación de Trámite (igual que WhatsApp)
  - 📄 Documentos Adjuntos (igual que WhatsApp)
- ✅ Estructura de secciones alineada 100% con mensaje WhatsApp
- ✅ Colores consistentes: navy, azul, verde

**Instrucciones:**
1. Abre `/app/api/send-email/route.js` en GitHub web editor
2. Copia TODO el contenido de `route-final.js`
3. Pega en `/app/api/send-email/route.js`
4. Commit: "Feature: align email headers with WhatsApp message format"

---

### 3. `/package.json` 
**Ya está correcto, SIN CAMBIOS**
```json
{
  "name": "radicacionparaguaya",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^16.2.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "resend": "^3.0.0"
  }
}
```

---

## Resumen de cambios

| Archivo | Cambio | Impacto |
|---------|--------|--------|
| `/app/page.js` | Sin placeholder "XX" en edad | UI limpia, sin distracción |
| `/app/api/send-email/route.js` | Headers alineados a WhatsApp | Email y WhatsApp = identidad consistente |
| `/package.json` | Sin cambios | ✅ Listo |

---

## Deployment en Vercel

Después de actualizar GitHub:

1. Vercel detecta cambios automáticamente
2. Corre `npm install` (fast, sin cambios)
3. Corre `npm run build` (debe pasar sin errores)
4. Deploy automático en https://radicacionparaguaya.vercel.app

**Tiempo total: ~2-3 minutos**

---

## Variables de Entorno (CRÍTICO)

En Vercel Dashboard → Settings → Environment Variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Si no está, el email NO va a funcionar. **Verifica que esté seteado.**

---

## Testing Post-Deploy

1. Abre tu landing: https://radicacionparaguaya.vercel.app
2. Completa formulario (ejemplo: Juan, Argentina, 35, Soltero)
3. Presiona "Enviar Formulario"
4. ✅ WhatsApp se abre (mensaje sin "XX" en edad)
5. ✅ Email llega en tu inbox (headers con emojis alineados)

---

## Archivos para copiar

Están todos en `/mnt/user-data/outputs/`:

- `app-page-final.jsx` → copiar a `/app/page.js`
- `route-final.js` → copiar a `/app/api/send-email/route.js`
- `package.json` → ya está bien, sin cambios necesarios

---

**Fecha:** Marzo 2026 | **Versión:** 1.0 Final | **Status:** 🟢 Ready to Deploy
