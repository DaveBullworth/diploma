# Используем образ с Node.js
FROM node:latest

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json из папки client для установки зависимостей
COPY client/package*.json ./client/

# Устанавливаем зависимости в папке client
RUN cd client && npm install

# Копируем все файлы из папки client внутрь контейнера
COPY client/ ./client/

# Открываем порт 3000, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения в папке client
CMD ["npm", "start", "--prefix", "client"]