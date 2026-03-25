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
  const [showSuccess, setShowSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const GESTOR_CONFIG = {
    nombre: 'Abraham Kohan',
    whatsapp: '+595982000808',
    email: 'info@abrahamkohan.com.py',
  };

  const COLORES = {
    rojo: '#0066CC',
    navy: '#1a3a52',
    verde: '#27AE60',
    gris_claro: '#f5f5f5',
    gris_medio: '#999999',
    gris_oscuro: '#2c3e50',
    bg: '#ffffff'
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
      { key: 'pasaporte', label: 'DNI o Pasaporte Vigente', tipoInput: 'dos_fotos' },
      { key: 'nacimiento', label: 'Nacimiento Apostillado', tipoInput: 'multiple' },
      { key: 'antecedentes', label: 'Antecedentes Apostillados', tipoInput: 'multiple' },
      { key: 'matrimonio', label: 'Matrimonio/Divorcio', tipoInput: 'multiple' },
      { key: 'foto', label: 'Foto Carnet', tipoInput: 'single' },
    ],
    permanente: [
      { key: 'pasaporte', label: 'DNI o Pasaporte Vigente', tipoInput: 'dos_fotos' },
      { key: 'foto', label: 'Foto Tipo Carnet', tipoInput: 'single' },
      { key: 'ruc', label: 'RUC / Título Universitario', tipoInput: 'multiple' },
      { key: 'carnetParaguayo', label: 'Carnet de Admisión Temporal', tipoInput: 'dos_fotos' },
      { key: 'cedulaParaguaya', label: 'Cédula Paraguaya', tipoInput: 'dos_fotos' },
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
        nuevasAdvertencias.push({ tipo: 'traduccion', texto: 'Traducción Jurada requerida' });
      }

      if (parseInt(formData.edad) < 14) {
        nuevasAdvertencias.push({ tipo: 'antecedentes', texto: 'Exento de Antecedentes' });
      }

      if (formData.estadoCivil !== 'Soltero/a') {
        nuevasAdvertencias.push({ tipo: 'matrimonio', texto: 'Cert. debe apostillarse' });
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
    if (!files || files.length === 0) return;

    setFormData(prev => ({
      ...prev,
      archivos: {
        ...prev.archivos,
        [fieldKey]: fieldKey.includes('_frente') || fieldKey.includes('_dorso') || fieldKey === 'foto'
          ? files[0]
          : Array.from(files)
      }
    }));
  };

  const generarMensajeWhatsApp = async () => {
    setEnviando(true);

    const documentosLlenados = Object.entries(formData.archivos)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const labels = {
          pasaporte_frente: 'Pasaporte (F)',
          pasaporte_dorso: 'Pasaporte (D)',
          nacimiento: 'Nacimiento',
          antecedentes: 'Antecedentes',
          matrimonio: 'Matrimonio',
          foto: 'Foto',
          ruc: 'RUC',
          carnetParaguayo_frente: 'Carnet (F)',
          carnetParaguayo_dorso: 'Carnet (D)',
          cedulaParaguaya_frente: 'Cédula (F)',
          cedulaParaguaya_dorso: 'Cédula (D)',
        };
        return labels[key] || key;
      });

    const mensaje = `Hola, he completado mi evaluación de radicación:

📋 Datos Personales
Nombre: ${formData.nombre}
Nacionalidad: ${formData.nacionalidad}
Edad: ${formData.edad} años

🏛️ Clasificación
${clasificacion}

📄 Documentos
${documentosLlenados.length > 0 ? documentosLlenados.map(d => `• ${d}`).join('\n') : '• Sin documentos'}

⚠️ Observaciones
${advertencias.length > 0 ? advertencias.map(a => a.texto).join('\n') : 'Sin observaciones'}

Quiero agendar una consulta.`;

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
      console.error('Error:', error);
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

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 16px',
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.3px' }}>
            <span style={{ color: COLORES.rojo }}>PARAGUAY</span>{' '}
            <span style={{ color: COLORES.navy }}>MIGRACIONES</span>
          </div>
          <div style={{ fontSize: '10px', color: COLORES.gris_medio, fontWeight: '500', backgroundColor: '#f0f0f0', padding: '3px 8px', borderRadius: '6px' }}>
            Ley Nº 6984/22
          </div>
        </div>
      </nav>

      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '16px',
        paddingBottom: '110px'
      }}>
        
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: COLORES.gris_oscuro,
            margin: '0 0 6px 0',
            lineHeight: '1.3'
          }}>
            Tu Radicación en Paraguay
          </h1>
          <p style={{
            fontSize: '13px',
            color: COLORES.gris_medio,
            margin: '0',
            lineHeight: '1.4'
          }}>
            Completá tu evaluación
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: COLORES.gris_medio }}>Progreso</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORES.navy }}>{formProgress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#e0e0e0',
            borderRadius: '2px',
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

        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f0f0f0'
        }}>
          
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: COLORES.gris_oscuro,
              margin: '0 0 12px 0',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              Datos Personales
            </h2>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: COLORES.gris_oscuro, marginBottom: '4px', textTransform: 'uppercase' }}>
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Tu nombre"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  minHeight: '40px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: COLORES.gris_oscuro, marginBottom: '4px', textTransform: 'uppercase' }}>
                  Nacionalidad
                </label>
                <select
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    minHeight: '40px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
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
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: COLORES.gris_oscuro, marginBottom: '4px', textTransform: 'uppercase' }}>
                  Residencia
                </label>
                <input
                  type="text"
                  name="paisResidencia"
                  value={formData.paisResidencia}
                  onChange={handleInputChange}
                  placeholder="País"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    minHeight: '40px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: COLORES.gris_oscuro, marginBottom: '4px', textTransform: 'uppercase' }}>
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
                    padding: '10px 12px',
                    minHeight: '40px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: COLORES.gris_oscuro, marginBottom: '4px', textTransform: 'uppercase' }}>
                  Estado Civil
                </label>
                <select
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    minHeight: '40px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
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

          <div style={{ 
            background: '#fafafa',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: COLORES.rojo, margin: '0 0 10px 0' }}>
              Tipo de Radicación
            </h3>

            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { label: 'No tengo Carnet (Nuevo)', value: false },
                { label: 'Tengo Carnet (Permanente)', value: true }
              ].map((opt, idx) => (
                <label key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: formData.carnetTemporal === opt.value ? 'rgba(0, 102, 204, 0.08)' : 'transparent'
                }}>
                  <input
                    type="radio"
                    checked={formData.carnetTemporal === opt.value}
                    onChange={() => setFormData(prev => ({ ...prev, carnetTemporal: opt.value }))}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: COLORES.rojo }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: COLORES.gris_oscuro,
              margin: '0 0 10px 0',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              Documentos Requeridos
            </h2>

            <div style={{ display: 'grid', gap: '8px' }}>
              {documentosActuales.map((doc) => (
                <div key={doc.key} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px',
                  background: '#fafafa'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: COLORES.gris_oscuro, marginBottom: '8px' }}>
                    {doc.label}
                  </div>

                  {doc.tipoInput === 'dos_fotos' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {['Frente', 'Dorso'].map((lado) => (
                        <label key={lado} style={{
                          display: 'block',
                          padding: '8px 10px',
                          background: '#E8F5E9',
                          border: `1px dashed ${COLORES.verde}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '12px',
                          color: '#2E7D32',
                          textAlign: 'center'
                        }}>
                          {formData.archivos[`${doc.key}_${lado.toLowerCase()}`]
                            ? `✓ ${lado}`
                            : lado
                          }
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, `${doc.key}_${lado.toLowerCase()}`)}
                            style={{ display: 'none' }}
                            accept="image/*,.pdf"
                            capture="environment"
                          />
                        </label>
                      ))}
                    </div>
                  )}

                  {doc.tipoInput === 'single' && (
                    <label style={{
                      display: 'block',
                      padding: '8px 10px',
                      background: '#E8F5E9',
                      border: `1px dashed ${COLORES.verde}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '12px',
                      color: '#2E7D32',
                      textAlign: 'center'
                    }}>
                      {formData.archivos[doc.key] ? '✓ Cargado' : 'Cargar'}
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, doc.key)}
                        style={{ display: 'none' }}
                        accept="image/*"
                        capture="user"
                      />
                    </label>
                  )}

                  {doc.tipoInput === 'multiple' && (
                    <label style={{
                      display: 'block',
                      padding: '8px 10px',
                      background: '#E8F5E9',
                      border: `1px dashed ${COLORES.verde}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '12px',
                      color: '#2E7D32',
                      textAlign: 'center'
                    }}>
                      {Array.isArray(formData.archivos[doc.key]) && formData.archivos[doc.key].length > 0
                        ? `✓ ${formData.archivos[doc.key].length} archivo(s)`
                        : 'Cargar'
                      }
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, doc.key)}
                        style={{ display: 'none' }}
                        accept=".pdf,image/*"
                        multiple
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {advertencias.length > 0 && (
            <div style={{
              background: '#FFF9E6',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '12px'
            }}>
              <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#856404', margin: '0 0 6px 0' }}>
                Información Importante
              </h3>
              {advertencias.map((adv, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: '#856404', marginBottom: idx < advertencias.length - 1 ? '4px' : '0' }}>
                  {adv.texto}
                </div>
              ))}
            </div>
          )}

          {clasificacion && (
            <div style={{
              background: `linear-gradient(135deg, ${COLORES.navy}, #2c3e50)`,
              color: 'white',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '10px', opacity: '0.7', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500' }}>
                Tu Categoría
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {clasificacion}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', color: COLORES.gris_medio, fontSize: '11px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>© 2026 Abraham Kohan</p>
          <p style={{ margin: 0, fontSize: '10px' }}>Ley Nº 6984/22</p>
        </div>
      </main>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        paddingTop: '12px',
        paddingBottom: '12px',
        zIndex: 99,
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
          <button
            onClick={generarMensajeWhatsApp}
            disabled={!formularioCompleto || enviando}
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '12px 16px',
              background: formularioCompleto && !enviando
                ? `linear-gradient(135deg, ${COLORES.verde}, #229954)`
                : '#e0e0e0',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: formularioCompleto && !enviando ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
              <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
              <path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
            </svg>
            {enviando ? 'Enviando...' : 'Enviar Formulario'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, ${COLORES.verde}, #229954)`,
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
          zIndex: 1000
        }}>
          ✓ Mensaje enviado!
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          input, select { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}
