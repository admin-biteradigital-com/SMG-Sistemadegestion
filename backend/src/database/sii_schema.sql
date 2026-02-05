-- Esquema de Base de Datos para Integración SII (SIGLO)

-- 1. Empresas Emisoras (Tenants o Multi-Rut)
CREATE TABLE IF NOT EXISTS SII_EMPRESAS (
    Rut_Empresa VARCHAR(12) PRIMARY KEY, -- Formato: 12345678-9
    Razon_Social VARCHAR(255) NOT NULL,
    Giro_Comercial VARCHAR(255),
    Codigo_Actividad_SII INTEGER,
    Direccion_Casa_Matriz VARCHAR(255),
    Comuna_Casa_Matriz VARCHAR(100),
    Ciudad_Casa_Matriz VARCHAR(100),
    Email_Contacto VARCHAR(150),
    Fecha_Resolucion_SII DATE,
    Numero_Resolucion_SII INTEGER,
    Logo_Url TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Certificados Digitales
CREATE TABLE IF NOT EXISTS SII_CERTIFICADOS (
    ID_Certificado SERIAL PRIMARY KEY,
    Rut_Empresa VARCHAR(12) REFERENCES SII_EMPRESAS(Rut_Empresa),
    Nombre_Archivo VARCHAR(255),
    Password_Encrypted VARCHAR(255), -- Encriptado en reposo
    Fecha_Expiracion TIMESTAMP,
    Rut_Titular VARCHAR(12),
    Nombre_Titular VARCHAR(255),
    Is_Active BOOLEAN DEFAULT TRUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Control de Folios (CAF)
CREATE TABLE IF NOT EXISTS SII_FOLIOS (
    ID_Folio SERIAL PRIMARY KEY,
    Rut_Empresa VARCHAR(12) REFERENCES SII_EMPRESAS(Rut_Empresa),
    Tipo_DTE INTEGER NOT NULL, -- 33: Factura, 39: Boleta, etc.
    Rango_Desde INTEGER NOT NULL,
    Rango_Hasta INTEGER NOT NULL,
    Ultimo_Folio_Usado INTEGER,
    Fecha_Carga DATE,
    Archivo_CAF_Xml TEXT NOT NULL, -- Contenido del CAF para timbraje
    Is_Active BOOLEAN DEFAULT TRUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rango CHECK (Rango_Hasta >= Rango_Desde)
);

-- 4. Documentos Tributarios (Cabecera)
CREATE TABLE IF NOT EXISTS SII_DTES (
    ID_DTE SERIAL PRIMARY KEY,
    Rut_Emisor VARCHAR(12) REFERENCES SII_EMPRESAS(Rut_Empresa),
    Tipo_DTE INTEGER NOT NULL,
    Folio INTEGER NOT NULL,
    Fecha_Emision DATE NOT NULL,
    ID_Orden_Venta INTEGER, -- Link opcional a venta interna
    
    -- Receptor
    Rut_Receptor VARCHAR(12),
    Razon_Social_Receptor VARCHAR(255),
    Giro_Receptor VARCHAR(255),
    Direccion_Receptor VARCHAR(255),
    Comuna_Receptor VARCHAR(100),
    
    -- Totales
    Monto_Neto NUMERIC(15,2) DEFAULT 0,
    Monto_Exento NUMERIC(15,2) DEFAULT 0,
    Monto_IVA NUMERIC(15,2) DEFAULT 0,
    Monto_Total NUMERIC(15,2) DEFAULT 0,
    
    -- Estado SII
    Estado_SII VARCHAR(50) DEFAULT 'GENERADO', -- GENERADO, ENVIADO, ACEPTADO, RECHAZADO
    Track_ID VARCHAR(50), -- Identificador de envío al SII
    Xml_Firmado TEXT, -- XML final enviado
    Url_Timbre TEXT, -- Imagen del timbre para PDF
    
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(Rut_Emisor, Tipo_DTE, Folio)
);

-- 5. Detalle de DTE
CREATE TABLE IF NOT EXISTS SII_DTE_DETALLES (
    ID_Detalle_DTE SERIAL PRIMARY KEY,
    ID_DTE INTEGER REFERENCES SII_DTES(ID_DTE),
    Nro_Linea INTEGER NOT NULL,
    Nombre_Item VARCHAR(255),
    Cantidad NUMERIC(12,4),
    Unidad VARCHAR(10),
    Precio_Unitario NUMERIC(15,2),
    Monto_Item NUMERIC(15,2),
    
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices Recomendados
CREATE INDEX IF NOT EXISTS idx_sii_dtes_fecha ON SII_DTES(Fecha_Emision);
CREATE INDEX IF NOT EXISTS idx_sii_dtes_rut_emisor ON SII_DTES(Rut_Emisor);
CREATE INDEX IF NOT EXISTS idx_sii_folios_activo ON SII_FOLIOS(Rut_Empresa, Tipo_DTE, Is_Active);
