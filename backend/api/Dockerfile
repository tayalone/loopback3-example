FROM node:10.21.0

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .

# ที่ EXPOSE PORT 5000 เพราะใช้ loopback
EXPOSE 3000

CMD ["npm", "run", "start"]