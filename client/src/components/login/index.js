import { useState, useEffect } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { Form, Input } from 'antd';
import { Button, notification } from '../common';
import { login } from '../../http/userAPI'
import { useDispatch } from 'react-redux';
import {setUser} from '../../store/userReducer'; // Замените путь на соответствующий

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  useEffect(() => {
    if (error) {
      notification({
        type: 'error',
        message: error.response.data.message,
        description: error.message,
        placement: 'bottomRight',
      });
    }
  }, [error]);

  const onFinish = async (values) => {
    try {
      const response = await login(values.username, values.password);
      dispatch(setUser(response)); 
      navigate('/positions');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Form
      name="normal_login"
      style={{ width: '70%' }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          size="medium"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          size="medium"
        />
      </Form.Item>
      <Form.Item>
        <Button style={{ width: '100%' }} text="Log in" htmlType="submit" />
      </Form.Item>
    </Form>
  );
};

export default Login;