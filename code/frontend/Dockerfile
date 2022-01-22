# Imagen Servidor API REST

# ROL: Front-end

FROM node:16.13.1

# Directorio donde se ejecuta la app
WORKDIR /usr/src/app

# Copiar el las depencias (para dejar esta capa separada de la del src)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# Ejecución del programa
CMD [ "node", "ServidorREST.js" ]
