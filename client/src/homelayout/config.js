import { NavLink } from 'react-router-dom';
import { 
    OrderedListOutlined, 
    PlusSquareOutlined,
    UserOutlined, 
    ProfileOutlined, 
    ContactsOutlined,
    PlusOutlined,
    SnippetsOutlined
 } from '@ant-design/icons';
import { ROUTES } from '../constants';

export const menuItems = [
    {
        key: ROUTES.POSITIONS,
        icon: <OrderedListOutlined />,
        label: <NavLink to={ROUTES.POSITIONS}>POSITIONS</NavLink>,
    },
    {
        key: ROUTES.CREATE_POSITION,
        icon: <PlusSquareOutlined />,
        label: <NavLink to={ROUTES.CREATE_POSITION}>ADD POSITION</NavLink>,
    },
    {
        key: ROUTES.CATEGORIES,
        icon: <SnippetsOutlined />,
        label: <NavLink to={ROUTES.CATEGORIES}>CATEGORIES</NavLink>,
    },
    {
        key: 'User',
        icon: <UserOutlined />,
        label: 'USER',
        children: [
            {
                key: ROUTES.USER_MANAGEMENT,
                icon: <ContactsOutlined />,
                label: <NavLink to={ROUTES.USER_MANAGEMENT}>USERS PANEL</NavLink>,
            },
            {
                key: ROUTES.EXTRACTS,
                icon: <ProfileOutlined />,
                label: <NavLink to={ROUTES.EXTRACTS}>EXTRACTS</NavLink>,
            },
            {
                key: ROUTES.CREATE_EXTRACT,
                icon: <PlusOutlined />,
                label: <NavLink to={ROUTES.CREATE_EXTRACT}>ADD EXTRACT</NavLink>,
            },
        ],
    },
]