FROM node:alpine
ENV CI=true
WORKDIR /app
COPY package.json .
RUN npm install 
#--omit=dev
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
# In production use npm run nodeStart
