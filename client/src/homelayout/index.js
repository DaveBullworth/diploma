import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Tooltip, Avatar, Select, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { LogoutOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userReducer';
import Button from '../components/common/Button';
import getMenuItems from './config';
import { ROUTES } from '../constants';
import AppLogo from '../components/appLogo';
import './style.scss';

const { Header, Content, Sider } = Layout;

const HomeLayout = () => {
    const dispatch = useDispatch();
    const {
        token: { colorBgContainer, colorWhite, colorInfoBgHover },
    } = theme.useToken();

    const defaultLanguage = localStorage.getItem('lng') || 'en';

    const location = useLocation();

    const { t, i18n } = useTranslation()

    const user = useSelector(state => state.user.user);

    const [loading, setLoading] = useState(false);

    const [language, setLanguage] = useState(defaultLanguage);

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
        localStorage.removeItem('refreshToken');
    };

    const changeLanguage = (language) => {
        setLoading(true)
        i18n.changeLanguage(language)
        setLanguage(language)
        localStorage.setItem('lng', language)
        setLoading(false)
    }

    return(
        <Layout className="layout">
            <Header className="header">
                <NavLink to={ROUTES.POSITIONS}>
                    <AppLogo color={colorWhite} size={26} />
                </NavLink>
                <Select
                    loading={loading}
                    defaultValue={language}
                    onChange={(value)=>changeLanguage(value)}
                    options={[
                        {
                            value: 'en',
                            label: 'EN',
                        },
                        {
                            value: 'ru',
                            label: 'RU',
                        },
                    ]}
                />
                <div className="user-info">
                    <Tooltip title={user.name}>
                        <Avatar 
                            size={33} 
                            icon={user.admin ? <CrownOutlined/> : <UserOutlined/>}
                            style={{ backgroundColor: getRandomColor() }}
                        />
                        <span className="username">{user.login}</span>
                    </Tooltip>
                <Tooltip title={t("homeLayout.logout")}>
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
                    width={260}
                    breakpoint="sm"
                    collapsedWidth="0"
                    zeroWidthTriggerStyle={{ background: colorInfoBgHover }}
                >
                    <Menu
                        style={{ fontSize: language === 'en' ? '15px' : '13px' }}
                        mode="inline"
                        theme="light"
                        items={getMenuItems()}
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