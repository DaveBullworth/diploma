import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Checkbox, Divider, DatePicker } from 'antd';
import { SearchOutlined, FilterFilled, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { fetchPositions, fetchOnePosition, deletePosition, editPosition } from '../../http/positionsAPI';
import { fetchRecords, deleteRecord, fetchOneRecord } from '../../http/recordsAPI';
import { fetchCategorys } from '../../http/categorysAPI';
import { fetchUsers } from '../../http/userAPI';
import { fetchExtracts, deleteExtract } from '../../http/extractsAPI';
import { fetchExtractRecords, deleteExtractRecord } from '../../http/extractRecordsAPI';
import { Table, Modal, notification, Button } from '../common/index';
import { columns } from './config';
import { ROUTES, TABLES } from '../../constants';
import './style.scss'

const TableContainer = ({keyWord, id, dataOut, handleRemoveRelated, extractsId}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchInputRef = useRef(null);

    const isPositionPage = location.pathname === '/position';
    const isExtractPage = /^\/extract\/\d+\/?$/.test(location.pathname);
    const displayInfo = isPositionPage || isExtractPage;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0, hideOnSinglePage:true });
    const [paginationVisible, setPaginationVisible] = useState(false);
    const [filters, setFilters] = useState({}); // Состояние видимости пагинации
    const [filtersER, setFiltersER] = useState({}); // Состояние видимости пагинации
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [sort, setSort] = useState({}); 
    const [date, setDate] = useState({ dateA: null, dateB: null });

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [pagination.current, dataOut, sort, date, id, extractsId, filtersER]); // Обновляем данные при изменении текущей страницы

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                setLoading(true)
                const response = await fetchCategorys(); 
                setCategories(response);
            } catch (error) {
                notification({
                    type: 'error',
                    message: 'Error!',
                    description: 'Failed to fetch categorys!',
                });
                console.error('Ошибка при получении категорий:', error);
            } finally {
                setLoading(false)
            }
        };
        if(keyWord===TABLES.POSITION)fetchCategoriesData();
        const fetchUsersData = async () => {
            try {
                setLoading(true)
                const response = await fetchUsers(); 
                setUsers(response);
            } catch (error) {
                notification({
                    type: 'error',
                    message: 'Error!',
                    description: 'Failed to fetch users!',
                });
                console.error('Ошибка при получении пользователей:', error);
            } finally {
                setLoading(false)
            }
        };
        if(keyWord===TABLES.POSITION)fetchCategoriesData();
        else if(keyWord===TABLES.EXTRACT)fetchUsersData();
    }, []);    

    useEffect(() => {
        // Проверяем, скрыта ли пагинация
        if (pagination.total <= pagination.pageSize) {
            setPaginationVisible(false);
        } else {
            setPaginationVisible(true);
        }
    }, [pagination.total, pagination.pageSize]);

    const fetchData = async (flag) => {
        try {
            if (flag && keyWord===TABLES.POSITION) delete filters.categoryId;
            else if (flag && keyWord===TABLES.EXTRACT) delete filters.usersId
            let response = {};
            let newData = [];
            let total = 0;
            let filterObject = {};
            let filterObjectRecord = {}; // Создаем пустой объект для фильтров
            let filterObjectExtractRecord = {}
            let sortObject = {};
            let dateObject = {};
            // Формируем объект фильтров на основе состояния filters
            for (let key in filters) {
                if (key.includes('-')) {
                    const newKey = key.replace('-', ''); // Удаляем символ '-'
                    filterObjectRecord[newKey] = filters[key];
                } else if (keyWord !== TABLES.EXTRACT){
                    // Если в ключе нет символа '-', просто добавляем значение в filterObject
                    if (filters[key]) {
                        filterObject[key] = filters[key];
                    }
                } else {
                    filterObject = { ...filters }
                }
            }
            if (keyWord === TABLES.EXTRACT && id) {
                filterObject.usersId = [id]
            }
            if(filtersER) filterObjectExtractRecord = {... filtersER}; // Создаем пустой объект для фильтров
            for (let key in sort) {
                if (sort[key]) {
                    if (sort[key] === 'ascend') {
                        sortObject[key] = 'asc';
                    } else if (sort[key] === 'descend') {
                        sortObject[key] = 'desc';
                    } else {
                        sortObject[key] = sort[key];
                    }
                }
            }
            for (let key in date) {
                if (date[key]) {
                    dateObject[key] = date[key];
                }
            }        
            switch (keyWord) {
                case TABLES.POSITION:
                    if (dataOut) {
                        response.rows = dataOut
                        response.count = dataOut.length
                    }
                    else {
                        response = await fetchPositions(
                            pagination.current,
                            pagination.pageSize,
                            filterObject,
                            sortObject
                        );
                    }
                    newData = response.rows;
                    total = response.count;
                    break;
                case TABLES.POSITIONADD:
                    newData = dataOut;
                    total = dataOut.length;
                    break;
                case TABLES.RECORD:
                    response = await fetchRecords(
                        pagination.current,
                        pagination.pageSize,
                        id,
                        dateObject,
                        filterObjectRecord
                    );
                    newData = response.rows;
                    total = response.count;
                    break;
                case TABLES.EXTRACT:
                    response = await fetchExtracts(
                        pagination.current,
                        pagination.pageSize,
                        filterObject,
                        dateObject,
                        extractsId
                    );
                    newData = response.rows.map(row => ({
                        id: row.id,
                        userId: row.userId,
                        user: row.user.login,
                        extracts: row.extractRecords.length,
                        date: row.date
                    }));
                    total = response.count;
                    break;
                case TABLES.EXTRACTRECORD:
                    response = await fetchExtractRecords(
                        pagination.current,
                        pagination.pageSize,
                        id,
                        filterObjectExtractRecord,
                        sortObject
                    );
                    newData = response.rows;
                    total = response.count;
                    break;
                default:
                    break; 
            }
            if (newData) {
                newData = newData.map((item, index) => ({
                    ...item,
                    number: index + 1
                }));  
                setData(newData);
                setPagination({ ...pagination, total });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        // Обработка сортировки
        if (sorter && Array.isArray(sorter)) {
            // Если sorter является массивом, значит, сортировка происходит по нескольким столбцам
            const newSort = { ...sort };
            sorter.forEach((s) => {
                if (s.order !== undefined) {
                    switch (s.field) {
                        case 'quantity':
                            newSort.quantity = s.order; // Добавляем/обновляем сортировку для столбца "Quantity"
                            break;
                        case 'quantity_min':
                            newSort.quantity_min = s.order; // Добавляем/обновляем сортировку для столбца "Shortage"
                            break;
                        default:
                            break; // Ничего не делаем для остальных столбцов
                    }
                } else {
                    // Если order === undefined, удаляем поле, соответствующее сброшенной сортировке
                    delete newSort[s.field];
                }
            });
            setSort(newSort);
        } else if (sorter && sorter.order !== undefined) {
            // Если sorter не является массивом, а является объектом, это означает сортировку только по одному столбцу
            let newSort = { ...sort }; // Создаем копию текущего состояния сортировки
            if (Object.keys(sort).length>1) {
                newSort = {};
            }
            switch (sorter.field) {
                case 'quantity':
                    newSort.quantity = sorter.order; // Добавляем/обновляем сортировку для столбца "Quantity"
                    break;
                case 'quantity_min':
                    newSort.quantity_min = sorter.order; // Добавляем/обновляем сортировку для столбца "Shortage"
                    break;
                default:
                    break; // Ничего не делаем для остальных столбцов
            }
            setSort(newSort);
        } else {
            // Если order === undefined, удаляем поле, соответствующее сброшенной сортировке
            let newSort = { ...sort };
            delete newSort[sorter.field];
            setSort(newSort);
        }
        // Обработка остальных изменений
        setPagination(pagination);
    };           

    const handleShow = (id) => {
        switch (keyWord) {
            case TABLES.POSITION:
                navigate(ROUTES.POSITION.replace(':id', id));
                break;
            case TABLES.EXTRACT:
                navigate(ROUTES.EXTRACT.replace(':id', id));
                break; 
            default:
                break; 
        }
    };

    const handleEdit = (id) => {
        switch (keyWord) {
            case TABLES.POSITION:
                navigate(ROUTES.UPDATE_POSITION.replace(':id', id));
                break;
            case TABLES.RECORD:
                navigate(ROUTES.UPDATE_RECORD.replace(':id', id));
                break;
            case TABLES.EXTRACT:
                navigate(ROUTES.UPDATE_EXTRACT.replace(':id', id));
                break;
            default:
                break; 
        }
    };

    const handleForm = (id) => {
        switch (keyWord) {
            case TABLES.POSITION:
                navigate(ROUTES.CREATE_RECORD.replace(':id', id)); // Передача id в маршрут
                break;
            default:
                break; 
        }
    };    

    const handleDelete = async (id) => {
        let toDescription = ''
        try {
            setLoading(true)
            switch (keyWord) {
                case TABLES.POSITION:
                    await deletePosition(id);
                    toDescription = 'позицию'
                case TABLES.RECORD:
                    const record = await fetchOneRecord(id)
                    const position = await fetchOnePosition(record.positionId)
                    const newQuantity = position.quantity - (record.quantity*record.quantity_um)
                    await editPosition(position.id, {quantity: newQuantity})
                    await deleteRecord(id);
                    toDescription = 'запись'
                case TABLES.EXTRACT:
                    const response1 = await fetchExtractRecords(null, null, id);
                    for (const extract of response1.rows) {
                        const response2 = await fetchOneRecord(extract.recordId);
                        const response3 = await fetchOnePosition(response2.positionId);
                        const newQuantity = response3.quantity + (extract.quantity * response2.quantity_um);
                        await editPosition(response3.id, { quantity: newQuantity });
                        await deleteExtractRecord(extract.id);
                    }
                    await deleteExtract(id);
                    toDescription = 'выписка'
                default:
                    break; 
            }
            fetchData();
            notification({
                type: 'success',
                message: 'Success!',
                description: `${keyWord.slice(0, -1).toLowerCase()} deleted successfully!`,
            });
        } catch (err) {
            console.error(err);
            notification({
                type: 'error',
                message: 'Ошибка',
                description: `Не удалось удалить ${toDescription}: ${err.message}`,
            });
        } finally {
            setLoading(false)
        }
    };

    const showConfirm = (id, name) => {
        const content = `Sure to delete: ${name} ${keyWord.slice(0, -1).toLowerCase()}?`;
        Modal({
          type: 'confirm',
          title: 'Confirmation',
          content,
          onOk() {
            handleDelete(id)
          },
        });
    };

    const filterExtractRecords = async () => {
        let newFilters = {}
        if (!filters || Object.values(filters).every(value => value === "")) {
            return setFiltersER({});
        } else if (filters["project+"] && Object.keys(filters).length === 1) {
            newFilters = { ...filters };
            newFilters.project = newFilters["project+"];
            delete newFilters["project+"];
        } else {
            let recordsIdBuf1 = [];
            if (("record,um+" in filters && filters["record,um+"] !== "") 
                || ("record,desc_fact+" in filters && filters["record,desc_fact+"] !== "")) {
                let filterObjR = {}
                if(filters["record,um+"] !== "") {
                    filterObjR = { um: filters["record,um+"] };
                }
                if("record,desc_fact+" in filters && filters["record,desc_fact+"] !== ""){
                    filterObjR = { ...filterObjR, desc_fact: filters["record,desc_fact+"] };
                }
                const response = await fetchRecords(null, null, null, null, filterObjR);
                recordsIdBuf1 = response.rows.map(row => row.id);
            }
            let positionsIdBuf = [];
            let recordsIdBuf = recordsIdBuf1;
            if ("record,position,desc+" in filters && filters["record,position,desc+"] !== "") {
                let recordsIdBuf2 = [];
                const filterObjP = { desc: filters["record,position,desc+"] };
                const response = await fetchPositions(null, null, filterObjP);
                positionsIdBuf = response.rows.map(row => row.id);
                for (const positionId of positionsIdBuf) {
                    const response = await fetchRecords(null, null, positionId);
                    recordsIdBuf2.push(...response.rows.map(row => row.id));
                }
                recordsIdBuf = recordsIdBuf2
                if (("record,um+" in filters && filters["record,um+"] !== "") 
                || ("record,desc_fact+" in filters && filters["record,desc_fact+"] !== "")){
                    recordsIdBuf = recordsIdBuf1.filter(id => recordsIdBuf2.includes(id));
                }
            }
            newFilters = { ...newFilters, recordsId: recordsIdBuf };
        }
        setFiltersER(newFilters);
    }    

    const filterCategoriesOrUsers = (filterKey) => ({
        filterDropdown: ({ setSelectedKeys, confirm }) => (
            <div className="filter-container">
                {filterKey === TABLES.POSITION ? (
                    // Для TABLES.POSITION оставляем логику фильтрации по категориям
                    categories.map(category => (
                        <div key={category.id}>
                            <Checkbox
                                checked={filters.categoryId === category.id}
                                onChange={(e) => {
                                    setFilters({ ...filters, categoryId: e.target.checked ? category.id : undefined });
                                }}
                            >
                                {category.name}
                            </Checkbox>
                        </div>
                    ))
                ) : filterKey === TABLES.EXTRACT ? (
                    // Для TABLES.EXTRACT меняем логику фильтрации на пользователей
                    users.map(user => (
                        <div key={user.id}>
                            <Checkbox
                                checked={(filters.usersId || []).includes(user.id)}
                                onChange={(e) => {
                                    const selectedIds = e.target.checked ?
                                        [...(filters.usersId || []), user.id] :
                                        (filters.usersId || []).filter(id => id !== user.id);
                                    setFilters({ ...filters, usersId: selectedIds });
                                }}
                            >
                                {user.login}
                            </Checkbox>
                        </div>
                    ))
                ) : null}
                <Divider/>
                <div className='btn-container'>
                    <Button
                        onClick={() => {
                            const flag = true;
                            if (filterKey === TABLES.POSITION) {
                                const { categoryId, ...restFilters } = filters;
                                setFilters(restFilters);
                            } else if (filterKey === TABLES.EXTRACT) {
                                setFilters({usersId: []});
                            }
                            fetchData(flag);
                            confirm();
                        }}
                        size="small"
                        type='default'
                        className="reset-btn"
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            fetchData();
                            confirm();
                        }}
                        size="small"
                        className="ok-btn"
                    >
                        OK
                    </Button>
                </div>
            </div>
        ),
        filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />,
    });    
    
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, confirm }) => (
            <div className="search-container">
                <Input
                    ref={searchInputRef}
                    placeholder={`Search ${dataIndex.includes('-')?dataIndex.replace('-', ''):dataIndex}`}
                    value={filters[dataIndex]}
                    onChange={(e) => {
                        setFilters({ ...filters, [dataIndex]: e.target.value });
                    }}
                    allowClear={true}
                    onPressEnter={() => {
                        confirm();
                        if (dataIndex.includes('+')) {
                            filterExtractRecords();
                        } else {
                            fetchData();
                        }
                    }}
                />
                <Button
                    type="primary"
                    onClick={() => {
                        confirm();
                        if (dataIndex.includes('+')) {
                            filterExtractRecords();
                        } else {
                            fetchData();
                        }
                    }}
                    icon={<SearchOutlined />}
                    size="small"
                />
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInputRef.current.select());
            }
        },
    });

    const getDateSearchProps = () => ({
        filterDropdown: ({ confirm }) => (
            <div style={{ padding: 8 }}>
                <DatePicker.RangePicker
                    showTime
                    onChange={(dates) => {
                        if (dates && dates.length === 2) {
                            const [start, end] = dates;
                            setDate({ dateA: start, dateB: end });
                        } else {
                            setDate({ dateA: null, dateB: null });
                        }
                    }}
                />
                <div style={{ marginTop: 8 }}>
                    <button
                        type="button"
                        onClick={() => {
                            confirm();
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
    });

    const renderExtractRecordFilter = (key, value) => {
        switch (key) {
            case 'project+':
                return 'project';
            case 'record,um+':
                return 'u.m.';
            case 'record,desc_fact+':
                return 'record desc';
            case 'record,position,desc+':
                return 'position desc';
            default:
                return `${key} ${value}`;
        }
    };

    return (
        <>
        <Table
                columns={
                    columns(
                        handleShow, 
                        handleEdit, 
                        showConfirm, 
                        handleForm, 
                        handleRemoveRelated, 
                        getColumnSearchProps, 
                        filterCategoriesOrUsers,
                        sort,
                        getDateSearchProps,
                        dataOut
                        )(keyWord)
                    }
                dataSource={data}
                pagination={pagination}
                onChange={handleTableChange}
                loading={loading}
                rowKey="id"
                style={{ marginBottom: paginationVisible ? 0 : '15px' }}
            />
            {displayInfo && (
                <div className="table-info">
                    <div>
                        <label>Filters:</label>
                        {Object.entries(filters).map(([key, value]) => (
                            value && (
                                <div key={key}>
                                    {keyWord === TABLES.EXTRACTRECORD 
                                        ? renderExtractRecordFilter(key, value) 
                                        : key === 'categoryId' ? 'Category' : key}
                                        : {key === 'categoryId' ? categories.find(cat => cat.id === value)?.name : value}
                                </div>
                            )
                        ))}
                    </div>
                    <div>
                        <label>Sort:</label>
                        {Object.keys(sort).length > 0 ? (
                            <div>
                                {Object.entries(sort).map(([field, order], index) => (
                                    <span key={field}>
                                        {field === 'quantity_min' ? 'Недостача' : field}
                                        : {order === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                                        {index !== Object.keys(sort).length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TableContainer;