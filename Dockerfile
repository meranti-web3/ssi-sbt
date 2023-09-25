FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

#je copie le reste du projet
COPY . .

#j'écoute sur le port 3000
EXPOSE 3000

#la commande pour lancer l'application
CMD ["npm", "start"]
