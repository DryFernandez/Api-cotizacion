# 🛠️ Comandos Útiles - Desarrollo

## 🚀 Iniciar el Sistema

### Opción 1: Dos terminales separadas (Recomendado)

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

### Opción 2: Windows (PowerShell)
```powershell
# Iniciar backend en background
Start-Process powershell -ArgumentList "cd Backend; npm start"

# Iniciar frontend
cd Frontend
npm run dev
```

### Opción 3: Linux/Mac
```bash
# Iniciar ambos servicios en background
cd Backend && npm start &
cd Frontend && npm run dev
```

---

## 📦 Instalación

### Backend
```bash
cd Backend
npm install
```

### Frontend
```bash
cd Frontend
npm install
```

### Ambos (desde raíz)
```bash
# Windows PowerShell
cd Backend; npm install; cd ..; cd Frontend; npm install

# Linux/Mac
cd Backend && npm install && cd ../Frontend && npm install
```

---

## 🧪 Testing y Validación

### Verificar Backend
```bash
# Desde la raíz del proyecto
cd Backend
npm start

# En otra terminal, probar endpoint
curl http://localhost:3000/health
```

### Verificar Frontend
```bash
cd Frontend
npm run dev
# Abre: http://localhost:5173
```

### Test rápido de API
```bash
# GET - Listar clientes
curl http://localhost:3000/api/clientes

# POST - Crear cliente (ejemplo)
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "Usuario",
    "email": "test@example.com",
    "telefono": "555-0000"
  }'
```

---

## 🔧 Desarrollo

### Backend - Modo desarrollo con auto-reload
```bash
cd Backend
npm run dev
# o si no existe:
npx nodemon src/server.js
```

### Frontend - Modo desarrollo
```bash
cd Frontend
npm run dev
```

### Build de producción - Frontend
```bash
cd Frontend
npm run build
npm run preview  # Ver el build
```

---

## 🗄️ Base de Datos

### Crear la base de datos
```bash
# Conéctate a MySQL
mysql -u root -p

# Ejecuta:
mysql> CREATE DATABASE CAR;
mysql> USE CAR;
mysql> source Backend/docs/database.sql;
```

### Ver tablas
```sql
USE CAR;
SHOW TABLES;
DESCRIBE clientes;
DESCRIBE vehiculos;
DESCRIBE cotizaciones;
```

### Insertar datos de prueba
```sql
-- Cliente de ejemplo
INSERT INTO clientes (nombre, apellido, email, telefono, direccion, ciudad)
VALUES ('Juan', 'Pérez', 'juan@example.com', '555-1234', 'Calle 1', 'CDMX');

-- Vehículo de ejemplo
INSERT INTO vehiculos (marca, modelo, anio, precio, tipo, color, estado)
VALUES ('Toyota', 'Corolla', 2023, 350000, 'Sedan', 'Blanco', 'disponible');
```

---

## 📝 Logs y Debug

### Ver logs del backend
```bash
cd Backend
npm start
# Los logs aparecen en la terminal
```

### Ver logs del navegador (Frontend)
1. Abre DevTools: F12
2. Ve a la pestaña "Console"
3. Filtra por errores o warnings

### Ver requests HTTP
1. DevTools → Network
2. Filtra por "Fetch/XHR"
3. Haz clic en cualquier request para ver detalles

---

## 🧹 Mantenimiento

### Limpiar node_modules
```bash
# Backend
cd Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

### Limpiar cache de Vite
```bash
cd Frontend
rm -rf node_modules/.vite
npm run dev
```

### Reiniciar todo desde cero
```bash
# Detener todos los procesos
# Ctrl+C en cada terminal

# Limpiar
cd Backend && rm -rf node_modules
cd ../Frontend && rm -rf node_modules

# Reinstalar
cd ../Backend && npm install
cd ../Frontend && npm install

# Iniciar de nuevo
cd ../Backend && npm start &
cd ../Frontend && npm run dev
```

---

## 🔍 Verificar Puertos

### Ver qué está usando el puerto 3000 (Backend)
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### Ver qué está usando el puerto 5173 (Frontend)
```bash
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173
```

### Matar proceso en un puerto
```bash
# Windows (reemplaza PID con el número del proceso)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

---

## 📊 Monitoreo

### Ver estado de MySQL
```bash
# Windows
net start | findstr MySQL

# Linux
systemctl status mysql

# Mac
brew services list | grep mysql
```

### Verificar conexión a BD desde terminal
```bash
mysql -u root -p -e "USE CAR; SELECT COUNT(*) FROM clientes;"
```

---

## 🎯 Atajos Útiles

### Abrir todo en VS Code
```bash
# Desde la raíz
code .
```

### Abrir terminales integradas en VS Code
- **Ctrl + Shift + `** (abrir terminal)
- **Ctrl + Shift + 5** (dividir terminal)

### Comandos Git útiles
```bash
# Ver cambios
git status

# Guardar cambios
git add .
git commit -m "Descripción del cambio"

# Subir cambios
git push origin main
```

---

## 🚨 Comandos de Emergencia

### Backend no inicia - Reset completo
```bash
cd Backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

### Frontend no compila - Reset completo
```bash
cd Frontend
rm -rf node_modules package-lock.json .vite dist
npm cache clean --force
npm install
npm run dev
```

### Base de datos corrupta - Recrear
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS CAR; CREATE DATABASE CAR;"
mysql -u root -p CAR < Backend/docs/database.sql
```

---

## 📚 Recursos Adicionales

### Ver documentación
```bash
# Backend
cat Backend/QUICKSTART.md
cat Backend/docs/ESTRUCTURA.md

# Frontend
cat Frontend/SISTEMA-PRUEBAS.md
cat Frontend/GUIA-USO.md
```

### Abrir en navegador
```bash
# Windows
start http://localhost:3000
start http://localhost:5173

# Linux
xdg-open http://localhost:3000
xdg-open http://localhost:5173

# Mac
open http://localhost:3000
open http://localhost:5173
```

---

**¡Comandos listos para copiar y pegar! 🚀**
