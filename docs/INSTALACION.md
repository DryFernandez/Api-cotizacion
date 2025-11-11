# ====================================
# INSTRUCCIONES DE INSTALACIÓN
# ====================================

## Requisitos Previos

Antes de ejecutar la API, asegúrate de tener instalado:

1. **Node.js** (v14 o superior)
   - Descargar: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **MySQL** (v5.7 o superior)
   - Descargar: https://dev.mysql.com/downloads/
   - Verificar instalación: `mysql --version`

3. **NPM** (viene con Node.js)
   - Verificar instalación: `npm --version`

---

## Pasos de Instalación

### 1. Navegar al directorio del proyecto

```bash
cd CAR-COTI
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:
- express (framework web)
- mysql2 (cliente de MySQL)
- dotenv (variables de entorno)
- pdfkit (generación de PDFs)
- cors (habilitar CORS)
- nodemon (auto-reinicio en desarrollo)

### 3. Configurar la base de datos

#### Opción A: Usando MySQL Workbench

1. Abrir MySQL Workbench
2. Conectarse a tu servidor MySQL
3. Abrir el archivo `docs/database.sql`
4. Ejecutar todo el script (Ctrl + Shift + Enter)

#### Opción B: Usando línea de comandos

```bash
# Conectarse a MySQL
mysql -u root -p

# Una vez dentro, ejecutar:
source docs/database.sql

# O ejecutar el archivo directamente:
mysql -u root -p < docs/database.sql
```

### 4. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus credenciales
```

Edita el archivo `.env` con tus datos:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=CAR
DB_PORT=3306
```

### 5. Verificar la conexión a la base de datos

```bash
# Iniciar MySQL (si no está corriendo)
# En Windows:
net start MySQL80

# En Linux/Mac:
sudo service mysql start
# o
sudo systemctl start mysql
```

### 6. Iniciar el servidor

#### Modo desarrollo (con auto-reinicio):
```bash
npm run dev
```

#### Modo producción:
```bash
npm start
```

### 7. Verificar que el servidor está corriendo

Deberías ver algo como:

```
═══════════════════════════════════════════════════════════
🚀 Servidor corriendo exitosamente
📡 Puerto: 3000
🌐 URL: http://localhost:3000
📚 API Base: http://localhost:3000/api
💚 Health Check: http://localhost:3000/health
═══════════════════════════════════════════════════════════
```

### 8. Probar la API

Abre tu navegador o Postman y prueba:

```
http://localhost:3000/health
```

Deberías recibir:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "Connected"
}
```

---

## Solución de Problemas Comunes

### Error: "Cannot find module 'express'"

**Solución:** Ejecutar `npm install`

### Error: "EADDRINUSE: address already in use :::3000"

**Solución:** El puerto 3000 está en uso. Opciones:

1. Cambiar el puerto en `.env`:
   ```env
   PORT=3001
   ```

2. Detener el proceso que usa el puerto 3000:
   ```bash
   # En Windows:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # En Linux/Mac:
   lsof -ti:3000 | xargs kill
   ```

### Error: "Access denied for user 'root'@'localhost'"

**Solución:** Verificar las credenciales en `.env`. Asegúrate de que:
- El usuario existe en MySQL
- La contraseña es correcta
- El usuario tiene permisos sobre la base de datos CAR

```sql
-- Crear usuario (si no existe)
CREATE USER 'root'@'localhost' IDENTIFIED BY 'tu_contraseña';

-- Dar permisos
GRANT ALL PRIVILEGES ON CAR.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Unknown database 'CAR'"

**Solución:** La base de datos no se ha creado. Ejecutar el script SQL:

```bash
mysql -u root -p < docs/database.sql
```

### Error al generar PDF

**Solución:** Asegúrate de que todas las dependencias están instaladas:

```bash
npm install pdfkit
```

---

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Iniciar en modo producción
npm start

# Ver logs en tiempo real
npm run dev

# Verificar versión de Node
node --version

# Verificar versión de NPM
npm --version

# Limpiar caché de NPM (si hay problemas)
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## Estructura de Archivos Después de la Instalación

```
CAR-COTI/
├── node_modules/           # Dependencias (se crea al hacer npm install)
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── server.js
├── docs/
│   ├── database.sql
│   ├── EJEMPLOS.md
│   └── INSTALACION.md
├── .env                    # Configuración (crear desde .env.example)
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json       # Se crea al hacer npm install
└── README.md
```

---

## Siguientes Pasos

1. ✅ Instalar dependencias
2. ✅ Configurar base de datos
3. ✅ Configurar variables de entorno
4. ✅ Iniciar el servidor
5. 📚 Leer la documentación en `README.md`
6. 🧪 Probar los endpoints con los ejemplos en `docs/EJEMPLOS.md`
7. 🚀 ¡Empezar a desarrollar!

---

## Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de MySQL2](https://github.com/sidorares/node-mysql2)
- [Documentación de PDFKit](http://pdfkit.org/)
- [Postman para pruebas](https://www.postman.com/)

---

¿Necesitas ayuda? Revisa el `README.md` o contacta al equipo de desarrollo.
