export const ROUTES = {
    LOGIN: '/login',
    CATEGORIES: '/categories',
    UNITS: '/units',
    POSITIONS: '/position', //изначальная (таблица всех позиций)
    POSITION: '/position/:id', //смотреть/менять конкретную позицию
    CREATE_POSITION: '/position/new', //конструктор создания позиции
    UPDATE_POSITION: '/position/:id/update', //конструктор изменения позиции
    //RECORD: '/record/:id', //смотреть/менять конкретную запись
    CREATE_RECORD: '/record/:id/new', //конструктор создания записи
    UPDATE_RECORD: '/record/:id/update', //конструктор создания записи
    EXTRACTS: '/extract',  //таблица выписок(у каждого юзера своя)
    EXTRACT:'/extract/:id', //смотреть/менять конкретную выписку
    CREATE_EXTRACT: '/extract/new', //конструктор создания выписки
    UPDATE_EXTRACT: '/extract/:id/update', //конструктор создания записи
    ORDERS: '/order',  //таблица заказов(у каждого юзера своя)
    ORDER:'/order/:id', //смотреть/менять конкретный заказ
    CREATE_ORDER: '/order/new', //конструктор создания заказа
    UPDATE_ORDER: '/order/:id/update', //конструктор создания заказа
    USER_MANAGEMENT: '/users', //админка (создать/поменять пользователей)
};

export const TABLES = {
    POSITION:'POSITIONS',
    RECORD: 'RECORDS',
    EXTRACT: 'EXTRACTS',
    EXTRACTRECORD: 'EXTRACTRECORDS',
    ORDER: 'ORDERS',
    ORDERRECORD: 'ORDERRECORDS',
    POSITIONADD: 'POSITIONADD',
}