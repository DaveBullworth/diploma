import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Tooltip, Avatar, theme } from 'antd';
import { LogoutOutlined, MehOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userReducer'; // Импортируем logout из userReducer
import Button from '../components/common/Button';
import { menuItems } from './config';
import { ROUTES } from '../constants';
import AppLogo from '../components/appLogo';
import './style.scss';

const { Header, Content, Sider } = Layout;

const HomeLayout = () => {
    const dispatch = useDispatch();
    const {
        token: { colorBgContainer, colorWhite, colorInfoBgHover },
    } = theme.useToken();

    const location = useLocation();

    const username = useSelector(state => state.user.user.login);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const logOut = () => {
        dispatch(logout()); // Вызываем экшен logout из userReducer
        localStorage.removeItem('token');
    };

    return(
        <Layout className="layout">
            <Header className="header">
                <NavLink to={ROUTES.POSITIONS}>
                    <AppLogo color={colorWhite} size={26} />
                </NavLink>
                <div className="user-info">
                    <Avatar 
                        size={33} 
                        icon={<MehOutlined />}
                        style={{ backgroundColor: getRandomColor() }}
                    />
                    <span className="username">{username}</span>
                <Tooltip title="Log out">
                    <Button
                        shape="circle"
                        onClick={logOut}
                        icon={<LogoutOutlined />}
                        type="default"
                    />
                </Tooltip>
                </div>
            </Header>
            <Layout hasSider>
                <Sider
                    style={{ background: colorBgContainer }}
                    breakpoint="sm"
                    collapsedWidth="0"
                    zeroWidthTriggerStyle={{ background: colorInfoBgHover }}
                >
                    <Menu
                        mode="inline"
                        theme="light"
                        items={menuItems}
                        selectedKeys={[location.pathname]}
                    />
                </Sider>
                <Content 
                    style={{
                    margin: 15,
                    overflow: 'auto',
                    background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
    </Layout>
    )
};

export default HomeLayout;