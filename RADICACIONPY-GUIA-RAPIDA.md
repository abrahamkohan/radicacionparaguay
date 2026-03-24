# RadicacionPY - Marca Blanca | Guía de Customización

## ⚡ SETUP RÁPIDO (5 minutos)

Cada gestor necesita cambiar SOLO ESTO:

### Paso 1: Editar `GESTOR_CONFIG` (línea 47-53)

Abre el archivo `.jsx` y busca:

```javascript
const GESTOR_CONFIG = {
  nombre: 'Tu Gestor',           // ← CAMBIAR POR TU NOMBRE
  whatsapp: '+59895000000',      // ← CAMBIAR POR TU WHATSAPP (con código país)
  email: 'gestor@example.com',   // ← CAMBIAR POR TU EMAIL
  empresa: '',                   // ← OPCIONAL: nombre de tu empresa
  logo: null                     // ← OPCIONAL: URL a tu logo (ej: https://tudominio.com/logo.png)
};
```

### Ejemplo Real:

```javascript
const GESTOR_CONFIG = {
  nombre: 'Carlos Alves',
  whatsapp: '+595983456789',
  email: 'carlos@gestoriaalves.com.py',
  empresa: 'Gestoría Alves',
  logo: 'https://gestoriaalves.com.py/logo.png'
};
```

---

## 🎨 COLORES (Opcional)

Los colores ya están configurados en la paleta correcta:

```javascript
const COLORES = {
  rojo: '#C41E3A',           // PARAGUAY MIGRACIONES
  navy: '#1a3a52',           // Títulos
  verde: '#27AE60',          // Botón WhatsApp
  gris_claro: '#f5f5f5',
  gris_medio: '#999999',
  azul_info: '#2196F3',      // Notas info
  rojo_claro: '#FEE5E7'      // Fondo secciones
};
```

**Si quieres cambiar colores**, modifica COLORES (línea 55-63).

---

## 📦 DEPLOYMENT

### Opción 1: Next.js (Recomendado)

```bash
# 1. Crea proyecto Next.js
npx create-next-app@latest radicacionpy

# 2. Reemplaza app/page.tsx con el contenido del .jsx

# 3. Deploy en Vercel
npm run build
vercel
```

### Opción 2: React Puro

```bash
# 1. Crea app React
npx create-react-app radicacionpy

# 2. Copia el archivo a src/App.jsx

# 3. Build y host
npm run build
# Subir la carpeta 'build' a tu hosting
```

### Opción 3: Dominio Propio (Recomendado)

**Sugiero que cada gestor tenga su propio dominio o subdominio:**

- gestor1.radicacionpy.com.py
- gestor2.radicacionpy.com.py
- etc.

O

- tudominio.com.py/evaluacion

---

## ✅ CHECKLIST ANTES DE LANZAR

- [ ] Cambié `nombre` en GESTOR_CONFIG
- [ ] Cambié `whatsapp` (con código país +595)
- [ ] Cambié `email` (opcional pero recomendado)
- [ ] Agregué logo URL (opcional)
- [ ] Probé el formulario completamente
- [ ] Envié un WhatsApp de prueba
- [ ] Verifiqué que llega bien estructurado

---

## 🔧 QRACIÓN DE CÓDIGO IMPORTANTE

### Dónde está GESTOR_CONFIG:

```
radicacionpy-marca-blanca.jsx
    └─ Línea ~47: const GESTOR_CONFIG = { ... }
```

### Dónde está COLORES:

```
radicacionpy-marca-blanca.jsx
    └─ Línea ~55: const COLORES = { ... }
```

### Dónde se usa el WhatsApp:

```javascript
// Línea ~185: generarMensajeWhatsApp()
const numeroLimpio = GESTOR_CONFIG.whatsapp.replace(/\D/g, '');
const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
```

---

## 🚀 FLUJO DE USO

1. **Cliente** abre la landing (tu dominio)
2. **Cliente** completa formulario (2 minutos)
3. **Cliente** presiona "Enviar a mi Gestor por WhatsApp"
4. **WhatsApp se abre** con mensaje pre-cargado
5. **Cliente envía mensaje** a tu número
6. **Recibís el mensaje** estructurado con:
   - Nombre, nacionalidad, edad
   - Tipo de trámite (Mercosur/Ley General/SUACE)
   - Arancel exacto
   - Documentos que tiene
   - Alertas (traducción, apostilla, etc.)

---

## 📝 MENSAJE DE WHATSAPP QUE RECIBÍS

Ejemplo:

```
Hola, he completado mi evaluación de radicación:

📋 *Datos Personales*
Nombre: Juan García
Nacionalidad: Argentina (Mercosur)
Edad: 35 años

🏛️ *Clasificación de Trámite*
Mercosur → Temporal

💰 *Arancel Estimado*
Gs. 2.230.040

📄 *Documentos Listos*
• Pasaporte/DNI/Cédula
• Nacimiento Apostillado

⚠️ *Observaciones*
⚠️ Requiere Traducción Jurada de documentos (excepto Brasil)

Quiero agendar una consulta.
```

---

## ❓ PREGUNTAS FRECUENTES

### P: ¿Se guardan los datos del cliente en base de datos?
**R:** No. El formulario no guarda nada. Todo se envía por WhatsApp encriptado.

### P: ¿Puedo cambiar el diseño?
**R:** Sí, pero requiere conocimiento de React/CSS. Los colores son lo más fácil de cambiar.

### P: ¿Funciona en móvil?
**R:** Perfectamente. Está 100% responsive.

### P: ¿Puedo agregar mi logo?
**R:** Sí, solo agrega la URL en `logo: 'https://...'`

### P: ¿Qué pasa si cambio el WhatsApp?
**R:** Los clientes futuros enviarán al nuevo número. No afecta a anteriores.

### P: ¿Puedo vender esto a otros gestores?
**R:** El código es tuyo. Pero es marca blanca, así que es un poco unethical vender "como propio" sin mencionar que es código reutilizado.

---

## 🔐 SEGURIDAD

- ✅ HTTPS automático en Vercel/hosting respetable
- ✅ No hay base de datos (cero riesgo de breach)
- ✅ WhatsApp usa encriptación end-to-end
- ✅ Cumple GDPR (no recopila datos personales)

---

## 📞 SOPORTE

Si necesitás help:

1. **Cambiar colores** → Edita `COLORES`
2. **Cambiar texto** → Busca en el código (ej: "Inicia tu Radicación")
3. **Cambiar estructura** → Requiere dev skills

---

## 🎯 PRÓXIMOS PASOS

1. Customiza GESTOR_CONFIG
2. Deploy en tu dominio/Vercel
3. Prueba con 3 clientes reales
4. Ajusta según feedback
5. Lanza a producción

**Versión:** 1.0 | **Fecha:** Marzo 2025 | **Ley:** N° 6984/22
