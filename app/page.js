'use client';

import React, { useState, useEffect } from 'react';

export default function RadicacionPYLanding() {
  const [formData, setFormData] = useState({
    nombre: '',
    nacionalidad: '',
    paisResidencia: '',
    edad: '',
    estadoCivil: '',
    carnetTemporal: false,
    esInversor: false,
    documentos: {
      pasaporte: false,
      nacimiento: false,
      antecedentes: false,
      matrimonio: false,
      foto: false,
      ruc: false,
      carnetParaguayo: false,
      cedulaParaguaya: false,
    },
    archivos: {
      pasaporte: null,
      nacimiento: null,
      antecedentes: null,
      matrimonio: null,
      foto: null,
      ruc: null,
      carnetParaguayo: null,
      cedulaParaguaya: null,
    }
  });

  const [advertencias, setAdvertencias] = useState([]);
  const [clasificacion, setClasificacion] = useState(null);
  const [aranceles, setAranceles] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const GESTOR_CONFIG = {
    nombre: 'Abraham Kohan',
    whatsapp: '+595982000808',
    email: 'info@abrahamkohan.com.py',
    empresa: '',
  };

  const COLORES = {
    rojo: '#0066CC',
    navy: '#1a3a52',
    verde: '#27AE60',
    gris_claro: '#f5f5f5',
    gris_medio: '#999999',
    azul_info: '#0066CC',
    rojo_claro: '#E8F0FF',
    gris_oscuro: '#2c3e50',
    bg: '#e6e8eb'
  };

  const paises = [
    'Selecciona tu país',
    'Argentina (Mercosur)',
    'Brasil (Mercosur)',
    'Uruguay (Mercosur)',
    'Bolivia (Mercosur)',
    'Chile (Mercosur Asociado)',
    'Colombia (Mercosur Asociado)',
    'Ecuador (Mercosur Asociado)',
    'Perú (Mercosur Asociado)',
    'Otro País (Ley General)'
  ];

  const documentosPorTipo = {
    nuevo: [
      { key: 'pasaporte', label: 'DNI, ID o Pasaporte Vigente', desc: 'Debe ser original', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'nacimiento', label: 'Nacimiento Apostillado', desc: 'Obligatorio por Convención de La Haya', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'antecedentes', label: 'Antecedentes Apostillados', desc: 'Solo si eres mayor de 14 años', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'matrimonio', label: 'Certificado de Matrimonio/Divorcio', desc: 'Solo si no eres soltero/a', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'foto', label: 'Foto Carnet', desc: 'Sacada con celular, solo para uso interno', accept: '.jpg,.jpeg,.png' },
    ],
    permanente: [
      { key: 'pasaporte', label: 'DNI o Pasaporte Vigente', desc: 'Debe estar vigente', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'foto', label: 'Foto Tipo Carnet', desc: 'Digital, sacada con celular', accept: '.jpg,.jpeg,.png' },
      { key: 'ruc', label: 'RUC / Libros de Actas O Título Universitario', desc: 'Apostillado si es título profesional', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'carnetParaguayo', label: 'Carnet de Admisión Temporal Paraguaya', desc: 'Vigente y en buen estado', accept: '.pdf,.jpg,.jpeg,.png' },
      { key: 'cedulaParaguaya', label: 'Cédula Paraguaya', desc: 'Opcional, si ya cuenta con ella', accept: '.pdf,.jpg,.jpeg,.png' },
    ]
  };

  useEffect(() => {
    const nuevasAdvertencias = [];
    let tipoRadicacion = null;
    let arancel = null;

    if (formData.nacionalidad && formData.edad && formData.estadoCivil) {
      const esMercosur = 
        formData.nacionalidad.includes('Argentina') ||
        formData.nacionalidad.includes('Brasil') ||
        formData.nacionalidad.includes('Uruguay') ||
        formData.nacionalidad.includes('Bolivia');

      tipoRadicacion = esMercosur ? 'Mercosur' : 'Ley General';
      arancel = '';

      if (formData.nacionalidad !== 'Brasil (Mercosur)') {
        nuevasAdvertencias.push({ tipo: 'traduccion', texto: '⚠️ Requiere Traducción Jurada de documentos (excepto Brasil)' });
      }

      if (parseInt(formData.edad) < 14) {
        nuevasAdvertencias.push({ tipo: 'antecedentes', texto: '✓ Exento de Antecedentes Penales (menor de 14 años)' });
      }

      if (formData.estadoCivil !== 'Soltero/a') {
        nuevasAdvertencias.push({ tipo: 'matrimonio', texto: '⚠️ Certificado de ' + formData.estadoCivil + ' debe estar apostillado y legalizado' });
      }

      if (formData.carnetTemporal) {
        tipoRadicacion += ' → Permanente';
      } else if (formData.esInversor) {
        tipoRadicacion = 'SUACE (Inversión)';
        arancel = 'Variable según monto';
      } else {
        tipoRadicacion += ' → Temporal';
      }

      setClasificacion(tipoRadicacion);
      setAranceles(arancel);
      setAdvertencias(nuevasAdvertencias);
    }

    const campos = [formData.nombre, formData.nacionalidad !== 'Selecciona tu país', formData.paisResidencia, formData.edad, formData.estadoCivil];
    const documentosLlenados = Object.values(formData.documentos).filter(v => v).length;
    const totalCampos = campos.filter(Boolean).length + (documentosLlenados > 0 ? 1 : 0);
    setFormProgress(Math.round((totalCampos / 6) * 100));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.startsWith('doc_')) {
        const docType = name.replace('doc_', '');
        setFormData(prev => ({
          ...prev,
          documentos: { ...prev.documentos, [docType]: checked }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e, docType) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        archivos: { ...prev.archivos, [docType]: file }
      }));
    }
  };

  const generarMensajeWhatsApp = () => {
    const documentosListos = Object.entries(formData.documentos)
      .filter(([, valor]) => valor)
      .map(([key]) => {
        const labels = {
          pasaporte: 'Pasaporte/DNI/Cédula',
          nacimiento: 'Nacimiento Apostillado',
          antecedentes: 'Antecedentes Penales',
          matrimonio: 'Cert. Matrimonio/Divorcio',
          foto: 'Foto tipo Carnet',
          ruc: 'RUC/Título Universitario',
          carnetParaguayo: 'Carnet Temporal Paraguayo',
          cedulaParaguaya: 'Cédula Paraguaya',
        };
        return labels[key] || key;
      })
      .join('\n• ');

    const mensaje = `Hola, he completado mi evaluación de radicación:\n\n📋 *Datos Personales*\nNombre: ${formData.nombre}\nNacionalidad: ${formData.nacionalidad}\nEdad: ${formData.edad} años\n\n🏛️ *Clasificación de Trámite*\n${clasificacion}\n\n💰 *Arancel Estimado*\n${aranceles}\n\n📄 *Documentos Listos*\n• ${documentosListos || 'Aún no completados'}\n\n⚠️ *Observaciones*\n${advertencias.map(a => a.texto).join('\n') || 'Sin observaciones'}\n\nQuiero agendar una consulta.`;

    const numeroLimpio = GESTOR_CONFIG.whatsapp.replace(/\D/g, '');
    const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(urlWhatsApp, '_blank');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const documentosActuales = formData.carnetTemporal ? documentosPorTipo.permanente : documentosPorTipo.nuevo;

  const formularioCompleto = 
    formData.nombre && 
    formData.nacionalidad !== 'Selecciona tu país' && 
    formData.paisResidencia &&
    formData.edad &&
    formData.estadoCivil &&
    Object.values(formData.documentos).some(v => v);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: COLORES.bg, 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: COLORES.gris_oscuro
    }}>

      {/* Navbar con Glass effect */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            letterSpacing: '0.5px'
          }}>
            <span style={{ color: COLORES.rojo }}>PARAGUAY</span>{' '}
            <span style={{ color: COLORES.navy }}>MIGRACIONES</span>
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: COLORES.gris_medio, 
            fontWeight: '600',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            padding: '4px 10px',
            borderRadius: '12px',
            letterSpacing: '0.3px'
          }}>
            Ley Nº 6984/22
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 16px',
        paddingBottom: '120px'
      }}>
        
        {/* Header con animación */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          animation: 'fadeInDown 0.6s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(28px, 7vw, 42px)',
            fontWeight: '800',
            color: COLORES.gris_oscuro,
            margin: '0 0 12px 0',
            lineHeight: '1.2',
            letterSpacing: '-0.5px'
          }}>
            Tu Radicación en Paraguay
          </h1>
          <p style={{
            fontSize: '16px',
            color: COLORES.gris_medio,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            Completa tu evaluación y obtén la documentación exacta que necesitas
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          marginBottom: '32px',
          animation: 'fadeInUp 0.6s ease-out 0.1s both'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: COLORES.gris_medio }}>Progreso del formulario</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: COLORES.navy }}>{formProgress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              height: '100%',
              width: `${formProgress}%`,
              background: `linear-gradient(90deg, ${COLORES.verde}, ${COLORES.rojo})`,
              transition: 'width 0.3s ease-out',
              borderRadius: '3px'
            }}/>
          </div>
        </div>

        {/* Form Container - iOS Card Style */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: 'clamp(20px, 5vw, 40px)',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}>
          
          {/* Sección 1: Datos Básicos */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: COLORES.gris_oscuro,
              margin: '0 0 24px 0',
              paddingBottom: '12px',
              borderBottom: `2px solid ${COLORES.gris_claro}`
            }}>
              Datos Personales
            </h2>

            {/* Nombre */}
            <div style={{ marginBottom: '20px', animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '700',
                color: COLORES.gris_oscuro,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  minHeight: '48px',
                  border: `1.5px solid #e0e0e0`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  background: '#fafbfc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORES.rojo;
                  e.target.style.background = '#ffffff';
                  e.target.style.boxShadow = `0 8px 24px rgba(0, 102, 204, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.background = '#fafbfc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Grid: Nacionalidad + Residencia */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '20px',
              marginBottom: '20px',
              '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' }
            }}>
              <div style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  color: COLORES.gris_oscuro,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Nacionalidad
                </label>
                <select
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    minHeight: '48px',
                    border: `1.5px solid #e0e0e0`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: '#fafbfc',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORES.rojo;
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = `0 8px 24px rgba(0, 102, 204, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.background = '#fafbfc';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {paises.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>

              <div style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  color: COLORES.gris_oscuro,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  País de Residencia
                </label>
                <input
                  type="text"
                  name="paisResidencia"
                  value={formData.paisResidencia}
                  onChange={handleInputChange}
                  placeholder="Dónde vives"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    minHeight: '48px',
                    border: `1.5px solid #e0e0e0`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    background: '#fafbfc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORES.rojo;
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = `0 8px 24px rgba(0, 102, 204, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.background = '#fafbfc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Grid: Edad + Estado Civil */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '20px'
            }}>
              <div style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  color: COLORES.gris_oscuro,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Edad
                </label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  placeholder="Tu edad"
                  min="0"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    minHeight: '48px',
                    border: `1.5px solid #e0e0e0`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    background: '#fafbfc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORES.rojo;
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = `0 8px 24px rgba(0, 102, 204, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.background = '#fafbfc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  color: COLORES.gris_oscuro,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Estado Civil
                </label>
                <select
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    minHeight: '48px',
                    border: `1.5px solid #e0e0e0`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: '#fafbfc',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORES.rojo;
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = `0 8px 24px rgba(0, 102, 204, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.background = '#fafbfc';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecciona</option>
                  <option value="Soltero/a">Soltero/a</option>
                  <option value="Casado/a">Casado/a</option>
                  <option value="Divorciado/a">Divorciado/a</option>
                  <option value="Viudo/a">Viudo/a</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección 2: Calificación */}
          <div style={{ 
            background: `linear-gradient(135deg, ${COLORES.rojo_claro}, rgba(0, 102, 204, 0.05))`,
            border: `2px solid ${COLORES.rojo}`,
            borderRadius: '16px',
            padding: '28px 20px',
            marginBottom: '40px',
            animation: 'fadeInUp 0.6s ease-out 0.8s both'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: COLORES.rojo,
              margin: '0 0 24px 0'
            }}>
              Tipo de Radicación
            </h3>

            <div style={{ display: 'grid', gap: '14px' }}>
              {[
                { label: 'No tengo Carnet (Nuevo)', value: false },
                { label: 'Sí tengo Carnet (Permanente)', value: true }
              ].map((opt, idx) => (
                <label key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  background: formData.carnetTemporal === opt.value ? 'rgba(0, 102, 204, 0.1)' : 'transparent',
                  border: formData.carnetTemporal === opt.value ? `1.5px solid ${COLORES.rojo}` : '1.5px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (formData.carnetTemporal !== opt.value) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.carnetTemporal !== opt.value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                >
                  <input
                    type="radio"
                    checked={formData.carnetTemporal === opt.value}
                    onChange={() => setFormData(prev => ({ ...prev, carnetTemporal: opt.value }))}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: COLORES.rojo, minWidth: '20px' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sección 3: Documentos */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: COLORES.gris_oscuro,
              margin: '0 0 24px 0',
              paddingBottom: '12px',
              borderBottom: `2px solid ${COLORES.gris_claro}`
            }}>
              {formData.carnetTemporal ? 'Documentos Permanente' : 'Documentos Requeridos'}
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '16px'
            }}>
              {documentosActuales.map((doc, idx) => (
                <div key={doc.key} style={{
                  border: `1.5px solid #e0e0e0`,
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  background: '#ffffff',
                  animation: `fadeInUp 0.6s ease-out ${0.9 + idx * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORES.rojo;
                  e.currentTarget.style.background = '#fafbfc';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 102, 204, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <label style={{ cursor: 'pointer' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '10px'
                    }}>
                      <input
                        type="checkbox"
                        name={`doc_${doc.key}`}
                        checked={formData.documentos[doc.key]}
                        onChange={handleInputChange}
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          cursor: 'pointer', 
                          marginTop: '2px', 
                          minWidth: '20px',
                          accentColor: COLORES.verde
                        }}
                      />
                      <div>
                        <div style={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: COLORES.gris_oscuro
                        }}>
                          {doc.label}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: COLORES.gris_medio, 
                          marginTop: '4px',
                          lineHeight: '1.5'
                        }}>
                          {doc.desc}
                        </div>
                      </div>
                    </div>
                  </label>

                  {formData.documentos[doc.key] && (
                    <div style={{
                      marginTop: '14px',
                      padding: '12px 14px',
                      background: `linear-gradient(135deg, #E8F5E9, #F1F8E9)`,
                      borderRadius: '12px',
                      border: `1.5px dashed ${COLORES.verde}`,
                      animation: 'slideIn 0.3s ease-out'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: '#2E7D32',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {formData.archivos[doc.key] ? '✓ Archivo cargado' : 'Cargar archivo'}
                        <input
                          type="file"
                          accept={doc.accept}
                          onChange={(e) => handleFileUpload(e, doc.key)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {formData.archivos[doc.key] && (
                        <div style={{
                          fontSize: '12px',
                          color: '#2E7D32',
                          marginTop: '8px',
                          fontWeight: '600',
                          wordBreak: 'break-word',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          ✓ {formData.archivos[doc.key].name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advertencias */}
          {advertencias.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #FFF3CD, #FFFACD)',
              border: `2px solid #ffc107`,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '40px',
              animation: 'fadeInUp 0.6s ease-out both'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '800',
                color: '#856404',
                margin: '0 0 12px 0'
              }}>
                Información Importante
              </h3>
              {advertencias.map((adv, idx) => (
                <div key={idx} style={{
                  fontSize: '13px',
                  color: '#856404',
                  marginBottom: idx < advertencias.length - 1 ? '8px' : '0',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  {adv.texto}
                </div>
              ))}
            </div>
          )}

          {/* Notas Legales */}
          <div style={{
            background: 'linear-gradient(135deg, #E3F2FD, #E1F5FE)',
            border: `2px solid ${COLORES.azul_info}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            fontSize: '13px',
            color: '#1565C0',
            lineHeight: '1.6',
            fontWeight: '500',
            animation: 'fadeInUp 0.6s ease-out 0.1s both'
          }}>
            <strong>Nota Importante:</strong> La emisión del carnet tarda entre 60-90 días hábiles. La cédula paraguaya se gestiona después y tarda aprox. 45 días adicionales.
          </div>

          {/* Clasificación */}
          {clasificacion && (
            <div style={{
              background: `linear-gradient(135deg, ${COLORES.navy}, #2c3e50)`,
              color: 'white',
              borderRadius: '16px',
              padding: '28px 20px',
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
              boxShadow: '0 12px 40px rgba(26, 58, 82, 0.2)',
              animation: 'fadeInUp 0.6s ease-out 0.2s both'
            }}>
              <div>
                <div style={{ 
                  fontSize: '11px', 
                  opacity: '0.7', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  Tu Categoría
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '800'
                }}>
                  {clasificacion}
                </div>
              </div>
              {aranceles && (
                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: '0.7', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}>
                    Arancel Estimado
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: COLORES.verde
                  }}>
                    {aranceles || '—'}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ height: '40px' }}></div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: COLORES.gris_medio,
          fontSize: '12px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          marginBottom: '40px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>© 2026 Abraham Kohan</p>
          <p style={{ margin: 0, fontSize: '11px', opacity: '0.7' }}>
            Evaluación informativa basada en Ley Nº 6984/22
          </p>
        </div>
      </main>

      {/* Fixed Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        paddingTop: '16px',
        paddingBottom: `calc(16px + env(safe-area-inset-bottom))`,
        zIndex: 99,
        paddingLeft: '16px',
        paddingRight: '16px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={generarMensajeWhatsApp}
            disabled={!formularioCompleto}
            style={{
              width: '100%',
              maxWidth: '520px',
              minHeight: '56px',
              padding: '16px 20px',
              background: formularioCompleto 
                ? `linear-gradient(135deg, ${COLORES.verde}, #229954)`
                : '#e0e0e0',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: formularioCompleto ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.3px',
              boxShadow: formularioCompleto 
                ? '0 8px 24px rgba(39, 174, 96, 0.3)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (formularioCompleto) {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 12px 32px rgba(39, 174, 96, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (formularioCompleto) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(39, 174, 96, 0.3)';
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
              <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
              <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
              <path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
            </svg>
            Enviar Formulario
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '16px',
          right: '16px',
          background: `linear-gradient(135deg, ${COLORES.verde}, #229954)`,
          color: 'white',
          padding: '16px 20px',
          borderRadius: '14px',
          fontSize: '14px',
          fontWeight: '700',
          boxShadow: '0 12px 40px rgba(39, 174, 96, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxWidth: '520px',
          zIndex: 1000,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)'
        }}>
          <div>
            <strong>¡Mensaje enviado!</strong>
            <div style={{ fontSize: '12px', opacity: '0.9' }}>Revisa tu WhatsApp ahora</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scaleY(0.9);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        @media (max-width: 767px) {
          input, select {
            font-size: 16px !important;
          }
        }
        
        @media (min-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
