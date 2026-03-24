'use client';

import React, { useState, useEffect } from 'react';
import { FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  const GESTOR_CONFIG = {
    nombre: 'Abraham Kohan',
    whatsapp: '+595982000808',
    email: 'info@abrahamkohan.com.py',
    empresa: '',
  };

  const COLORES = {
    rojo: '#C41E3A',
    navy: '#1a3a52',
    verde: '#27AE60',
    gris_claro: '#f5f5f5',
    gris_medio: '#999999',
    azul_info: '#2196F3',
    rojo_claro: '#FEE5E7'
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

  // Documentos por tipo de radicación
  const documentosPorTipo = {
    nuevo: [
      { 
        key: 'pasaporte', 
        label: 'DNI, ID o Pasaporte Vigente',
        desc: 'Fotografía frente y dorso',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'nacimiento', 
        label: 'Nacimiento Apostillado',
        desc: 'Obligatorio por Convención de La Haya',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'antecedentes', 
        label: 'Antecedentes Apostillados',
        desc: 'Solo si eres mayor de 14 años',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'matrimonio', 
        label: 'Certificado de Matrimonio/Divorcio',
        desc: 'Solo si no eres soltero/a',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'foto', 
        label: 'Foto Carnet',
        desc: 'Digital, sacada con celular para uso interno',
        accept: '.jpg,.jpeg,.png'
      },
    ],
    permanente: [
      { 
        key: 'pasaporte', 
        label: 'DNI o Pasaporte Vigente',
        desc: 'Debe estar vigente',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'foto', 
        label: 'Foto Tipo Carnet',
        desc: 'Digital, sacada con celular para uso interno',
        accept: '.jpg,.jpeg,.png'
      },
      { 
        key: 'ruc', 
        label: 'RUC / Libros de Actas O Título Universitario',
        desc: 'Para demostrar Solvencia en el Pais (Paraguay)',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'carnetParaguayo', 
        label: 'Carnet de Admisión Temporal Paraguaya',
        desc: 'Fotografía frente y dorso',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      { 
        key: 'cedulaParaguaya', 
        label: 'Cédula Paraguaya',
        desc: 'Fotografía frente y dorso',
        accept: '.pdf,.jpg,.jpeg,.png'
      },
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

      if (esMercosur) {
        arancel = '';
        tipoRadicacion = 'Mercosur';
      } else {
        arancel = '';
        tipoRadicacion = 'Ley General';
      }

      if (formData.nacionalidad !== 'Brasil (Mercosur)') {
        nuevasAdvertencias.push({
          tipo: 'traduccion',
          texto: '⚠️ Requiere Traducción Jurada de documentos (excepto Brasil)'
        });
      }

      if (parseInt(formData.edad) < 14) {
        nuevasAdvertencias.push({
          tipo: 'antecedentes',
          texto: '✓ Exento de Antecedentes Penales (menor de 14 años)'
        });
      }

      if (formData.estadoCivil !== 'Soltero/a') {
        nuevasAdvertencias.push({
          tipo: 'matrimonio',
          texto: '⚠️ Certificado de ' + formData.estadoCivil + ' debe estar apostillado y legalizado'
        });
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
  }, [formData.nacionalidad, formData.edad, formData.estadoCivil, formData.carnetTemporal, formData.esInversor]);

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
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", color: COLORES.navy }}>
      
      {/* Navbar */}
      <nav style={{
        padding: '16px',
        borderBottom: `3px solid ${COLORES.rojo}`,
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
            <span style={{ color: COLORES.rojo }}>PARAGUAY</span>{' '}
            <span style={{ color: COLORES.navy }}>MIGRACIONES</span>
          </div>
          <div style={{ fontSize: '11px', color: COLORES.gris_medio, fontWeight: '500' }}>
            Ley Nº 6984/22
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 16px 48px 16px',
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: 'clamp(24px, 8vw, 36px)',
            fontWeight: '700',
            color: COLORES.navy,
            margin: '0 0 16px 0',
            lineHeight: '1.2'
          }}>
            Inicia tu Radicación en Paraguay
          </h1>
          <p style={{
            fontSize: '16px',
            color: COLORES.gris_medio,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Completa este formulario para identificar tu tipo de radicación y la documentación requerida.
          </p>
        </div>

        {/* Form Container */}
        <div style={{
          background: '#ffffff',
          border: `1px solid #e0e0e0`,
          borderRadius: '12px',
          padding: 'clamp(20px, 5vw, 40px)',
          marginBottom: '32px'
        }}>
          
          {/* Sección 1: Datos Básicos */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: COLORES.navy,
              margin: '0 0 24px 0',
              paddingBottom: '12px',
              borderBottom: `2px solid ${COLORES.gris_claro}`
            }}>
              Datos Personales
            </h2>

            {/* Nombre - Full width */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600',
                color: COLORES.navy,
                marginBottom: '8px'
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
                  padding: '12px 14px',
                  minHeight: '44px',
                  border: `1px solid #ddd`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORES.rojo}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Grid: Nacionalidad + Residencia - responsive */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '20px', 
              marginBottom: '20px',
              '@media (min-width: 768px)': {
                gridTemplateColumns: '1fr 1fr'
              }
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: COLORES.navy,
                  marginBottom: '8px'
                }}>
                  Nacionalidad
                </label>
                <select
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '44px',
                    border: `2px solid #ddd`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORES.rojo}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                >
                  {paises.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: COLORES.navy,
                  marginBottom: '8px'
                }}>
                  País de Residencia Actual
                </label>
                <input
                  type="text"
                  name="paisResidencia"
                  value={formData.paisResidencia}
                  onChange={handleInputChange}
                  placeholder="Dónde vives ahora"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '44px',
                    border: `1px solid #ddd`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORES.rojo}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>

            {/* Grid: Edad + Estado Civil - responsive */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '20px',
              '@media (min-width: 768px)': {
                gridTemplateColumns: '1fr 1fr'
              }
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: COLORES.navy,
                  marginBottom: '8px'
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
                    padding: '12px 14px',
                    minHeight: '44px',
                    border: `1px solid #ddd`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORES.rojo}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: COLORES.navy,
                  marginBottom: '8px'
                }}>
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
                    border: `1px solid #ddd`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORES.rojo}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
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
            background: COLORES.rojo_claro,
            border: `2px solid ${COLORES.rojo}`,
            borderRadius: '12px',
            padding: '24px 20px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: COLORES.rojo,
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🏛️ Calificación del Trámite
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '15px',
                  padding: '10px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <input
                    type="radio"
                    name="carnetTemporal"
                    checked={!formData.carnetTemporal}
                    onChange={() => setFormData(prev => ({ ...prev, carnetTemporal: false }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: COLORES.azul_info, minWidth: '18px' }}
                  />
                  <span>No tengo Carnet de Admisión Temporal (Nuevo)</span>
                </label>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '15px',
                  padding: '10px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <input
                    type="radio"
                    name="carnetTemporal"
                    checked={formData.carnetTemporal}
                    onChange={() => setFormData(prev => ({ ...prev, carnetTemporal: true }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: COLORES.azul_info, minWidth: '18px' }}
                  />
                  <span>Sí tengo Carnet (Pasando a Permanente)</span>
                </label>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '15px',
                  padding: '10px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <input
                    type="checkbox"
                    name="esInversor"
                    checked={formData.esInversor}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: COLORES.azul_info, minWidth: '18px' }}
                  />
                  <span>Planeo invertir más de USD 70.000 (SUACE)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sección 3: Documentos - responsive */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: COLORES.navy,
              margin: '0 0 24px 0',
              paddingBottom: '12px',
              borderBottom: `2px solid ${COLORES.gris_claro}`
            }}>
              {formData.carnetTemporal ? 'Documentos para Radicación Permanente' : '¿Con qué documentos cuentas hoy?'}
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 768px)': {
                gridTemplateColumns: '1fr 1fr'
              }
            }}>
              {documentosActuales.map(doc => (
                <div key={doc.key} style={{
                  border: `1px solid #e0e0e0`,
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  background: '#fafafa'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORES.rojo;
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <label style={{ cursor: 'pointer' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '12px',
                      fontWeight: '600',
                      fontSize: '15px'
                    }}>
                      <input
                        type="checkbox"
                        name={`doc_${doc.key}`}
                        checked={formData.documentos[doc.key]}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px', minWidth: '18px' }}
                      />
                      <span>{doc.label}</span>
                    </div>
                  </label>

                  <div style={{ fontSize: '13px', color: COLORES.gris_medio, marginBottom: '12px', lineHeight: '1.5' }}>
                    {doc.desc}
                  </div>

                  {formData.documentos[doc.key] && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#E8F5E9',
                      borderRadius: '8px',
                      border: '1px dashed #4CAF50'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: '#2E7D32',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        <FileUp size={16} />
                        {formData.archivos[doc.key] ? '✓ Archivo cargado' : 'Cargar archivo (PDF/JPG)'}
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
                          fontWeight: '500',
                          wordBreak: 'break-word'
                        }}>
                          📎 {formData.archivos[doc.key].name}
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
              background: '#FFF3CD',
              border: `2px solid #ffc107`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '40px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#856404',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} />
                Información Importante
              </h3>
              {advertencias.map((adv, idx) => (
                <div key={idx} style={{
                  fontSize: '14px',
                  color: '#856404',
                  marginBottom: idx < advertencias.length - 1 ? '8px' : '0',
                  lineHeight: '1.5'
                }}>
                  {adv.texto}
                </div>
              ))}
            </div>
          )}

          {/* Notas Legales */}
          <div style={{
            background: '#E3F2FD',
            border: `2px solid ${COLORES.azul_info}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            fontSize: '13px',
            color: '#1565C0',
            lineHeight: '1.6'
          }}>
            <strong>📌 Nota:</strong> La emisión del carnet tarda entre 60 y 90 días hábiles. La cédula paraguaya se gestiona después y tarda aprox. 45 días adicionales.
          </div>

          {/* Clasificación */}
          {clasificacion && (
            <div style={{
              background: COLORES.navy,
              color: 'white',
              borderRadius: '12px',
              padding: '24px 20px',
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
              '@media (min-width: 768px)': {
                gridTemplateColumns: '1fr 1fr'
              }
            }}>
              <div>
                <div style={{ fontSize: '11px', opacity: '0.8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Tu Categoría</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={24} style={{ color: COLORES.verde, minWidth: '24px' }} />
                  <span>{clasificacion}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', opacity: '0.8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Arancel</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: COLORES.verde
                }}>
                  {aranceles || '—'}
                </div>
              </div>
            </div>
          )}

          {/* Botón WhatsApp */}
          <button
            onClick={generarMensajeWhatsApp}
            disabled={!formularioCompleto}
            style={{
              width: '100%',
              minHeight: '54px',
              padding: '16px 20px',
              background: formularioCompleto ? COLORES.verde : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: formularioCompleto ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s',
              letterSpacing: '0.3px',
              boxShadow: formularioCompleto ? '0 4px 12px rgba(39, 174, 96, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (formularioCompleto) {
                e.target.style.background = '#229954';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(39, 174, 96, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (formularioCompleto) {
                e.target.style.background = COLORES.verde;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.3)';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.289-5.134 5.943-5.134 9.843 0 1.131.113 2.268.333 3.372l-.52 1.897 1.954-.512c1.289.703 2.759 1.073 4.367 1.073 5.522 0 10-4.477 10-10S17.324 2 11.802 2c-3.763 0-7.303 2.191-8.934 5.66"/>
            </svg>
            Enviar a mi Gestor por WhatsApp
          </button>

          <div style={{
            fontSize: '12px',
            color: COLORES.gris_medio,
            textAlign: 'center',
            marginTop: '14px'
          }}>
            Completa todos los campos y confirma al menos 1 documento
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '16px',
            right: '16px',
            background: COLORES.verde,
            color: 'white',
            padding: '14px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideUp 0.3s ease-out',
            maxWidth: '600px',
            margin: '0 auto',
            zIndex: 1000
          }}>
            <CheckCircle2 size={20} style={{ minWidth: '20px' }} />
            <span>¡Mensaje enviado! Revisa tu WhatsApp</span>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: COLORES.gris_medio,
          fontSize: '12px',
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>© 2025 Evaluación de Radicación en Paraguay</p>
          <p style={{ margin: 0, fontSize: '11px', opacity: '0.8' }}>
            Este formulario es informativo y se basa en Ley N° 6984/22. Consulta con tu gestor para confirmación oficial.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 767px) {
          input, select {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
