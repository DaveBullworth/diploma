import { configureStore } from '@reduxjs/toolkit';
import  userReducer from './userReducer';

// Создание хранилища с поддержкой Redux DevTools
export const store = configureStore({
  reducer: {
    user: userReducer,
    // другие редукторы, если есть
  },
  // дополнительные параметры, если нужно
});