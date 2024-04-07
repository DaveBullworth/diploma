import { NavLink } from 'react-router-dom';
import { 
    OrderedListOutlined, 
    PlusSquareOutlined,
    UserOutlined, 
    ProfileOutlined, 
    ContactsOutlined,
    PlusOutlined,
    SnippetsOutlined,
    AuditOutlined
 } from '@ant-design/icons';
import { ROUTES } from '../constants';
import i18n from "../i18n";

const getMenuItems = () => {
    return [
        {
            key: ROUTES.POSITIONS,
            icon: <OrderedListOutlined />,
            label: <NavLink to={ROUTES.POSITIONS}>{i18n.t('menu.positions')}</NavLink>,
        },
        {
            key: ROUTES.CREATE_POSITION,
            icon: <PlusSquareOutlined />,
            label: <NavLink to={ROUTES.CREATE_POSITION}>{i18n.t('menu.addPosition')}</NavLink>,
        },
        {
            key: ROUTES.CATEGORIES,
            icon: <SnippetsOutlined />,
            label: <NavLink to={ROUTES.CATEGORIES}>{i18n.t('menu.categories')}</NavLink>,
        },
        {
            key: ROUTES.UNITS,
            icon: <AuditOutlined />,
            label: <NavLink to={ROUTES.UNITS}>{i18n.t('menu.units')}</NavLink>,
        },
        {
            key: 'User',
            icon: <UserOutlined />,
            label: `${i18n.t('menu.user')}`,
            children: [
                {
                    key: ROUTES.USER_MANAGEMENT,
                    icon: <ContactsOutlined />,
                    label: <NavLink to={ROUTES.USER_MANAGEMENT}>{i18n.t('menu.usersPanel')}</NavLink>,
                },
                {
                    key: ROUTES.EXTRACTS,
                    icon: <ProfileOutlined />,
                    label: <NavLink to={ROUTES.EXTRACTS}>{i18n.t('menu.extracts')}</NavLink>,
                },
                {
                    key: ROUTES.CREATE_EXTRACT,
                    icon: <PlusOutlined />,
                    label: <NavLink to={ROUTES.CREATE_EXTRACT}>{i18n.t('menu.addExtract')}</NavLink>,
                },
            ],
        },
    ];
};

export default getMenuItems;