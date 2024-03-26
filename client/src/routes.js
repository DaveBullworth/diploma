import { Navigate } from 'react-router-dom';
import { ROUTES } from './constants';
import HomeLayout from './homelayout';
import Positions from './pages/positionsPage';
import Position from './pages/positionPage';
import PositionConstructor from './pages/positionConstructorPage'
import Extracts from './pages/extractsPage'
import Extract from './pages/extractPage';
import ExtractConstructor from './pages/extractConstructorPage';
import UserManagement from './pages/userManagementPage'
import RecordConstructor from './pages/recordConstructor'
import Categories from './pages/categoriesPage';
import LoginPage from './pages/loginPage';

export const routes = [
    {
      element: <HomeLayout />,
      children: [
        {
          path: ROUTES.CATEGORIES,
          element: <Categories />,
        },
        {
          path: ROUTES.POSITIONS,
          element: <Positions />,
        },
        {
          path: ROUTES.POSITION,
          element: <Position />,
        },
        {
          path: ROUTES.CREATE_POSITION,
          element: <PositionConstructor key={ROUTES.CREATE_POSITION}/>,
        },
        {
          path: ROUTES.UPDATE_POSITION,
          element: <PositionConstructor key={ROUTES.UPDATE_POSITION}/>,
        },
        {
          path: ROUTES.EXTRACTS,
          element: <Extracts />,
        },
        {
          path: ROUTES.EXTRACT,
          element: <Extract />,
        },
        {
          path: ROUTES.CREATE_EXTRACT,
          element: <ExtractConstructor key={ROUTES.CREATE_EXTRACT}/>,
        },
        {
          path: ROUTES.UPDATE_EXTRACT,
          element: <ExtractConstructor key={ROUTES.UPDATE_EXTRACT} update={true}/>,
        },
        {
          path: ROUTES.CREATE_RECORD,
          element: <RecordConstructor key={ROUTES.CREATE_RECORD}/>,
        },
        {
          path: ROUTES.UPDATE_RECORD,
          element: <RecordConstructor key={ROUTES.UPDATE_RECORD} update={true}/>,
        },
        {
          path: ROUTES.USER_MANAGEMENT,
          element: <UserManagement />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={ROUTES.POSITIONS} />,
    },
  ]; 
  
export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} />,
  },
];