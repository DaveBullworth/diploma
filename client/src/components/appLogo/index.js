import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import './style.scss';

const AppLogo = ({ size, color }) => (
    <span className="logo-container" style={{ fontSize: size, fontWeight: 'bold', color }}>
        <AppstoreOutlined className='logo-icon' /><span className="storage">Storage</span>
    </span>
);

export default AppLogo;