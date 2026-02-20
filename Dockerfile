FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración principal y lockfile
COPY package.json package-lock.json* ./

# Copiar los package.json de todos los workspaces para aprovechar cache de docker
COPY core/package.json ./core/
COPY database-layer/package.json ./database-layer/
COPY service-layer/package.json ./service-layer/
COPY siglo-workframe/package.json ./siglo-workframe/
COPY abritusitio/package.json ./abritusitio/

# Instalar dependencias
RUN npm install

# Copiar el código fuente completo del monorepo
COPY . .

# El comando de inicio será sobreescrito por el docker-compose dependiendo del servicio
CMD ["npm", "run", "start:siglo"]
