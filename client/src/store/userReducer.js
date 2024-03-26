import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
  user: {},
  isAuth: false, // Добавляем начальное значение для isAuth
  // Другие свойства пользователя, которые вам нужны
};

// Создание среза (slice) для управления состоянием пользователя
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuth = true; // Устанавливаем isAuth в true при установке пользователя
    },
    logout(state) {
      state.user = {};
      state.isAuth = false; // Сбрасываем isAuth в false при выходе пользователя
    },
    // Другие редукторы, если необходимо
  },
});

// Экспорт редуктора и экшенов
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;