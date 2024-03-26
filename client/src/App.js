import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Spin } from './components/common/index'
import { logout, setUser } from './store/userReducer'
import { routes, publicRoutes } from './routes';
import { check } from './http/userAPI';

const App = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.user.isAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await check();
        dispatch(setUser(response)); 
      } catch (error) {
        dispatch(logout());
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const router = createBrowserRouter(isAuth ? routes : publicRoutes);
  
  if (loading) {
    return <Spin />;
  }

  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;