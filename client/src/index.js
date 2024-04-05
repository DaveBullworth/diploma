import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/reset.css';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { Spin } from './components/common/index'
import App from './App';
import './i18n'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Suspense fallback={<Spin/>}>
            <App />
        </Suspense>
    </Provider>
);