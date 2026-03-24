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
      matrimonio: false
    },
    archivos: {
      pasaporte: null,
      nacimiento: null,
      antecedentes: null,
      matrimonio: null
    }
  });

  const [advertencias, setAdvertencias] = useState([]);
  const [clasificacion, setClasificacion] = useState(null);
  const [aranceles, setAranceles] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const COLORES = {
    rojo: '#C41E3A',
    navy: '#1a3a52',
    verde: '#27AE60',
    gris: '#6b7280',
    borde: '#e5e7eb',
    fondo: '#f4f6f8'
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
        arancel = 'Gs. 2.230.040';
        tipoRadicacion = 'Mercosur';
      } else {
        arancel = 'Gs. 2.787.550';
        tipoRadicacion = 'Ley General';
      }

      if (formData.nacionalidad !== 'Brasil (Mercosur)') {
        nuevasAdvertencias.push({
          texto: 'Requiere traducción jurada de documentos (excepto Brasil)'
        });
      }

      if (parseInt(formData.edad) < 14) {
        nuevasAdvertencias.push({
          texto: 'Exento de antecedentes penales (menor de 14 años)'
        });
      }

      if (formData.estadoCivil !== 'Soltero/a') {
        nuevasAdvertencias.push({
          texto: `Certificado de ${formData.estadoCivil} debe estar apostillado`
        });
      }

      if (formData.carnetTemporal) {
        tipoRadicacion += ' → Permanente';
      } else if (formData.esInversor) {
        tipoRadicacion = 'SUACE (Inversión)';
        arancel = 'Variable';
      } else {
        tipoRadicacion += ' → Temporal';
      }

      setClasificacion(tipoRadicacion);
      setAranceles(arancel);
      setAdvertencias(nuevasAdvertencias);
    }
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
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

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
      background: COLORES.fondo,
      fontFamily: 'Segoe UI, sans-serif',
      color: COLORES.navy
    }}>

      {/* NAV */}
      <nav style={{
        padding: '16px 24px',
        borderBottom: `2px solid ${COLORES.rojo}`,
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <strong style={{ color: COLORES.rojo }}>PARAGUAY MIGRACIONES</strong>
          <span style={{ fontSize: '12px', color: COLORES.gris }}>
            Ley Nº 6984/22
          </span>
        </div>
      </nav>

      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '34px',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            Inicia tu Radicación con Seguridad Jurídica
          </h1>
          <p style={{ color: COLORES.gris }}>
            Evaluación simple de tu situación migratoria en Paraguay
          </p>
        </div>

        {/* FORM CARD */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          border: `1px solid ${COLORES.borde}`
        }}>

          {/* INPUT */}
          <input
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleInputChange}
            style={inputStyle}
          />

          <div style={grid2}>
            <select name="nacionalidad" onChange={handleInputChange} style={inputStyle}>
              {paises.map(p => <option key={p}>{p}</option>)}
            </select>

            <input name="paisResidencia" placeholder="País actual" onChange={handleInputChange} style={inputStyle}/>
          </div>

          <div style={grid2}>
            <input name="edad" type="number" placeholder="Edad" onChange={handleInputChange} style={inputStyle}/>
            <select name="estadoCivil" onChange={handleInputChange} style={inputStyle}>
              <option value="">Estado civil</option>
              <option>Soltero/a</option>
              <option>Casado/a</option>
            </select>
          </div>

          {/* BLOQUE OPCIONES */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            border: `1px solid ${COLORES.borde}`,
            borderRadius: '10px'
          }}>
            <label>
              <input type="checkbox" name="esInversor" onChange={handleInputChange}/>
              Inversión mayor a USD 70.000
            </label>
          </div>

          {/* DOCUMENTOS */}
          <div style={{ marginTop: '32px' }}>
            <h3>Documentos</h3>

            <div style={grid2}>
              {Object.keys(formData.documentos).map(doc => (
                <div key={doc} style={{
                  border: `1px solid ${COLORES.borde}`,
                  borderRadius: '10px',
                  padding: '16px',
                  background: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                }}>
                  <label>
                    <input
                      type="checkbox"
                      name={`doc_${doc}`}
                      onChange={handleInputChange}
                    />
                    {doc}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTAS */}
          {advertencias.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#fff3cd',
              borderRadius: '8px'
            }}>
              {advertencias.map((a, i) => (
                <div key={i}>{a.texto}</div>
              ))}
            </div>
          )}

          {/* BOTON */}
          <button
            disabled={!formularioCompleto}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '14px',
              background: formularioCompleto ? COLORES.verde : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(39,174,96,0.3)',
              cursor: 'pointer'
            }}
          >
            Enviar por WhatsApp
          </button>
        </div>
      </main>
    </div>
  );
}

/* STYLES */
const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  marginBottom: '16px'
};

const grid2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
};
