import { Typography } from 'antd';
import Login from '../../components/login';
import './style.scss';

const { Title } = Typography;

const LoginPage = () => (
  <div className="welcome-page">
    <div className="background" />
    <div className="content">
      <Title className="welcome-text">Kitsylo R. diplom project ...demo</Title>
      <Title className="appname-text">STORAGE</Title>
      <div className="login-container">
        <Login />
      </div>
    </div>
  </div>
);

export default LoginPage;