# Comando para baixar a última versão do node latest
FROM node:latest
# WORKDIR comando para criar e entrar na pasta API
# Essa pasta vai representar a area de trabalho do seu projeto
# que você está trazendo para o container
WORKDIR /api
# Comando para copiar os pacotes Json
COPY package*.json ./
# Comando para instalar o node_modules
RUN npm install
# Copiar os arquivos e colar dentro do container
COPY . .
# Porta que vou utilizar no meu container
EXPOSE 8081
# Comando para executar nossa API que está
# dentro do container utilizando o serviço do node
CMD [ "npm", "run", "dev" ]