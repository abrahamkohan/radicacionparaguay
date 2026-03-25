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
    archivos: {
      pasaporte_frente: null,
      pasaporte_dorso: null,
      nacimiento: [],
      antecedentes: [],
      matrimonio: [],
      foto: null,
      ruc: [],
      carnetParaguayo_frente: null,
      carnetParaguayo_dorso: null,
      cedulaParaguaya_frente: null,
      cedulaParaguaya_dorso: null,
    }
  });

  const [advertencias, setAdvertencias] = useState([]);
  const [clasificacion, setClasificacion] = useState(null);
  const [aranceles, setAranceles] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [enviando, setEnviando] = useState(false);

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
      { 
        key: 'pasaporte', 
        label: 'DNI o Pasaporte Vigente', 
        desc: 'Debe ser original', 
        tipoInput: 'dos_fotos'
      },
      { 
        key: 'nacimiento', 
        label: 'Nacimiento Apostillado', 
        desc: 'Obligatorio por Convención de La Haya', 
        tipoInput: 'multiple'
      },
      { 
        key: 'antecedentes', 
        label: 'Antecedentes Apostillados', 
        desc: 'Solo si eres mayor de 14 años', 
        tipoInput: 'multiple'
      },
      { 
        key: 'matrimonio', 
        label: 'Certificado de Matrimonio/Divorcio', 
        desc: 'Solo si no eres soltero/a', 
        tipoInput: 'multiple'
      },
      { 
        key: 'foto', 
        label: 'Foto Carnet', 
        desc: 'Sacada con celular, solo para uso interno', 
        tipoInput: 'single'
      },
    ],
    permanente: [
      { 
        key: 'pasaporte', 
        label: 'DNI o Pasaporte Vigente', 
        desc: 'Debe estar vigente', 
        tipoInput: 'dos_fotos'
      },
      { 
        key: 'foto', 
        label: 'Foto Tipo Carnet', 
        desc: 'Digital, sacada con celular', 
        tipoInput: 'single'
      },
      { 
        key: 'ruc', 
        label: 'RUC / Libros de Actas O Título Universitario', 
        desc: 'Apostillado si es título profesional', 
        tipoInput: 'multiple'
      },
      { 
        key: 'carnetParaguayo', 
        label: 'Carnet de Admisión Temporal Paraguaya', 
        desc: 'Vigente y en buen estado', 
        tipoInput: 'dos_fotos'
      },
      { 
        key: 'cedulaParaguaya', 
        label: 'Cédula Paraguaya', 
        desc: 'Opcional, si ya cuenta con ella', 
        tipoInput: 'dos_fotos'
      },
    ]
  };

  useEffect(() => {
    const nuevasAdvertencias = [];

    if (formData.nacionalidad && formData.edad && formData.estadoCivil) {
      const esMercosur = 
        formData.nacionalidad.includes('Argentina') ||
        formData.nacionalidad.includes('Brasil') ||
        formData.nacionalidad.includes('Uruguay') ||
        formData.nacionalidad.includes('Bolivia');

      const tipoRadicacion = esMercosur ? 'Mercosur' : 'Ley General';
      const tipoFinal = formData.carnetTemporal ? `${tipoRadicacion} → Permanente` : `${tipoRadicacion} → Temporal`;

      if (formData.nacionalidad !== 'Brasil (Mercosur)') {
        nuevasAdvertencias.push({ tipo: 'traduccion', texto: '⚠️ Requiere Traducción Jurada de documentos (excepto Brasil)' });
      }

      if (parseInt(formData.edad) < 14) {
        nuevasAdvertencias.push({ tipo: 'antecedentes', texto: '✓ Exento de Antecedentes Penales (menor de 14 años)' });
      }

      if (formData.estadoCivil !== 'Soltero/a') {
        nuevasAdvertencias.push({ tipo: 'matrimonio', texto: '⚠️ Certificado de ' + formData.estadoCivil + ' debe estar apostillado y legalizado' });
      }

      setClasificacion(tipoFinal);
      setAdvertencias(nuevasAdvertencias);
    }

    const camposCompletos = [
      formData.nombre,
      formData.nacionalidad !== 'Selecciona tu país',
      formData.paisResidencia,
      formData.edad,
      formData.estadoCivil
    ].filter(Boolean).length;

    const archivosCount = Object.values(formData.archivos).filter(v => v).length;
    const totalProgress = Math.round(((camposCompletos + (archivosCount > 0 ? 1 : 0)) / 6) * 100);
    setFormProgress(totalProgress);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e, fieldKey) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        archivos: {
          ...prev.archivos,
          [fieldKey]: fieldKey.includes('_frente') || fieldKey.includes('_dorso') || fieldKey === 'foto'
            ? files[0]
            : Array.from(files)
        }
      }));
    }
  };

  const generarMensajeWhatsApp = async () => {
    setEnviando(true);

    const documentosLlenados = Object.entries(formData.archivos)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const labels = {
          pasaporte_frente: 'Pasaporte (Frente)',
          pasaporte_dorso: 'Pasaporte (Dorso)',
          nacimiento: 'Nacimiento Apostillado',
          antecedentes: 'Antecedentes',
          matrimonio: 'Cert. Matrimonio/Divorcio',
          foto: 'Foto Carnet',
          ruc: 'RUC/Título',
          carnetParaguayo_frente: 'Carnet Temp. (Frente)',
          carnetParaguayo_dorso: 'Carnet Temp. (Dorso)',
          cedulaParaguaya_frente: 'Cédula (Frente)',
          cedulaParaguaya_dorso: 'Cédula (Dorso)',
        };
        return labels[key] || key;
      });

    const mensaje = `Hola, he completado mi evaluación de radicación:

📋 *Datos Personales*
Nombre: ${formData.nombre}
Nacionalidad: ${formData.nacionalidad}
Edad: ${formData.edad} años

🏛️ *Clasificación de Trámite*
${clasificacion}

📄 *Documentos Listos*
${documentosLlenados.length > 0 ? documentosLlenados.map(d => `• ${d}`).join('\n') : '• Aún no completados'}

⚠️ *Observaciones*
${advertencias.length > 0 ? advertencias.map(a => a.texto).join('\n') : 'Sin observaciones'}

Quiero agendar una consulta.`;

    // Preparar FormData para email
    const formDataForEmail = new FormData();
    formDataForEmail.append('nombre', formData.nombre);
    formDataForEmail.append('nacionalidad', formData.nacionalidad);
    formDataForEmail.append('paisResidencia', formData.paisResidencia);
    formDataForEmail.append('edad', formData.edad);
    formDataForEmail.append('estadoCivil', formData.estadoCivil);
    formDataForEmail.append('carnetTemporal', formData.carnetTemporal);
    formDataForEmail.append('clasificacion', clasificacion);

    Object.entries(formData.archivos).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formDataForEmail.append(`archivo_${key}`, file);
        });
      } else if (value instanceof File) {
        formDataForEmail.append(`archivo_${key}`, value);
      }
    });

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        body: formDataForEmail
      });
    } catch (error) {
      console.log('Email enviado (o no disponible)');
    }

    const numeroLimpio = GESTOR_CONFIG.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
    
    setShowSuccess(true);
    setEnviando(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const documentosActuales = formData.carnetTemporal ? documentosPorTipo.permanente : documentosPorTipo.nuevo;

  const formularioCompleto = 
    formData.nombre && 
    formData.nacionalidad !== 'Selecciona tu país' && 
    formData.paisResidencia &&
    formData.edad &&
    formData.estadoCivil &&
    Object.values(formData.archivos).some(v => v);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: COLORES.bg, 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: COLORES.gris_oscuro
    }}>

      {/* Navbar */}
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
          <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
            <span style={{ color: COLORES.rojo }}>PARAGUAY</span>{' '}
            <span style={{ color: COLORES.navy }}>MIGRACIONES</span>
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: COLORES.gris_medio, 
            fontWeight: '600',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            padding: '4px 10px',
            borderRadius: '12px'
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
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: COLORES.gris_medio }}>Progreso</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: COLORES.navy }}>{formProgress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${formProgress}%`,
              background: `linear-gradient(90deg, ${COLORES.verde}, ${COLORES.rojo})`,
              transition: 'width 0.3s ease-out'
            }}/>
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}>
          
          {/* Datos Básicos */}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: COLORES.gris_oscuro, marginBottom: '8px', textTransform: 'uppercase' }}>
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
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: COLORES.gris_oscuro, marginBottom: '8px', textTransform: 'uppercase' }}>
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
                    boxSizing: 'border-box'
                  }}
                >
                  {paises.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: COLORES.gris_oscuro, marginBottom: '8px', textTransform: 'uppercase' }}>
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
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: COLORES.gris_oscuro, marginBottom: '8px', textTransform: 'uppercase' }}>
                  Edad
                </label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  min="0"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '44px',
                    border: `1.5px solid #e0e0e0`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: COLORES.gris_oscuro, marginBottom: '8px', textTransform: 'uppercase' }}>
                  Estado Civil
                </label>
                <select
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '44px',
                    border: `1.5px solid #e0e0e0`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
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

          {/* Tipo Radicación */}
          <div style={{ 
            background: `linear-gradient(135deg, ${COLORES.rojo_claro}, rgba(0, 102, 204, 0.05))`,
            border: `2px solid ${COLORES.rojo}`,
            borderRadius: '16px',
            padding: '28px 20px',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: COLORES.rojo, margin: '0 0 24px 0' }}>
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
                  background: formData.carnetTemporal === opt.value ? 'rgba(0, 102, 204, 0.1)' : 'transparent'
                }}>
                  <input
                    type="radio"
                    checked={formData.carnetTemporal === opt.value}
                    onChange={() => setFormData(prev => ({ ...prev, carnetTemporal: opt.value }))}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: COLORES.rojo }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Documentos */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: COLORES.gris_oscuro,
              margin: '0 0 24px 0',
              paddingBottom: '12px',
              borderBottom: `2px solid ${COLORES.gris_claro}`
            }}>
              Documentos Requeridos
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              {documentosActuales.map((doc) => (
                <div key={doc.key} style={{
                  border: `1.5px solid #e0e0e0`,
                  borderRadius: '16px',
                  padding: '20px',
                  background: '#ffffff'
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: COLORES.gris_oscuro' }}>
                    {doc.label}
                  </h3>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: COLORES.gris_medio }}>
                    {doc.desc}
                  </p>

                  {doc.tipoInput === 'dos_fotos' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {['Frente', 'Dorso'].map((lado) => (
                        <div key={lado}>
                          <label style={{
                            display: 'block',
                            padding: '12px 14px',
                            background: '#E8F5E9',
                            border: `1.5px dashed ${COLORES.verde}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: '#2E7D32',
                            textAlign: 'center'
                          }}>
                            {formData.archivos[`${doc.key}_${lado.toLowerCase()}`]
                              ? `✓ ${lado}`
                              : `📷 ${lado}`
                            }
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload(e, `${doc.key}_${lado.toLowerCase()}`)}
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {doc.tipoInput === 'single' && (
                    <label style={{
                      display: 'block',
                      padding: '12px 14px',
                      background: '#E8F5E9',
                      border: `1.5px dashed ${COLORES.verde}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#2E7D32',
                      textAlign: 'center'
                    }}>
                      {formData.archivos[doc.key] ? '✓ Cargado' : '📷 Cargar'}
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, doc.key)}
                        style={{ display: 'none' }}
                        accept=".jpg,.jpeg,.png"
                      />
                    </label>
                  )}

                  {doc.tipoInput === 'multiple' && (
                    <label style={{
                      display: 'block',
                      padding: '12px 14px',
                      background: '#E8F5E9',
                      border: `1.5px dashed ${COLORES.verde}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#2E7D32',
                      textAlign: 'center'
                    }}>
                      {Array.isArray(formData.archivos[doc.key]) && formData.archivos[doc.key].length > 0
                        ? `✓ ${formData.archivos[doc.key].length} archivo(s)`
                        : '📷 Cargar archivo(s)'
                      }
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, doc.key)}
                        style={{ display: 'none' }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advertencias */}
          {advertencias.length > 0 && (
            <div style={{
              background: '#FFF3CD',
              border: `2px solid #ffc107`,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '40px'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#856404', margin: '0 0 12px 0' }}>
                Información Importante
              </h3>
              {advertencias.map((adv, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: '#856404', marginBottom: '8px' }}>
                  {adv.texto}
                </div>
              ))}
            </div>
          )}

          {/* Clasificación */}
          {clasificacion && (
            <div style={{
              background: `linear-gradient(135deg, ${COLORES.navy}, #2c3e50)`,
              color: 'white',
              borderRadius: '16px',
              padding: '28px 20px',
              marginBottom: '32px'
            }}>
              <div>
                <div style={{ fontSize: '11px', opacity: '0.7', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700' }}>
                  Tu Categoría
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800' }}>
                  {clasificacion}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: COLORES.gris_medio, fontSize: '12px', marginBottom: '40px' }}>
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
        paddingBottom: '16px',
        zIndex: 99
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
          <button
            onClick={generarMensajeWhatsApp}
            disabled={!formularioCompleto || enviando}
            style={{
              width: '100%',
              maxWidth: '520px',
              minHeight: '56px',
              padding: '16px 20px',
              background: formularioCompleto && !enviando
                ? `linear-gradient(135deg, ${COLORES.verde}, #229954)`
                : '#e0e0e0',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: formularioCompleto && !enviando ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
              <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
              <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
              <path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
            </svg>
            {enviando ? 'Enviando...' : 'Enviar Formulario'}
          </button>
        </div>
      </div>

      {/* Success */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, ${COLORES.verde}, #229954)`,
          color: 'white',
          padding: '16px 20px',
          borderRadius: '14px',
          fontSize: '14px',
          fontWeight: '700',
          boxShadow: '0 12px 40px rgba(39, 174, 96, 0.3)',
          zIndex: 1000
        }}>
          <strong>✓ Mensaje enviado!</strong>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          input, select { font-size: 16px !important; }
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
