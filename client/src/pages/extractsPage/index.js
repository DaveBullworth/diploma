import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Avatar, Switch, Empty, List, Pagination, Modal, Checkbox } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, notification } from '../../components/common/index';
import { fetchOneUser } from '../../http/userAPI'
import { fetchPositions, fetchOnePosition } from '../../http/positionsAPI'
import { fetchExtractRecords  } from '../../http/extractRecordsAPI'
import TableContainer from '../../components/tableContainer'
import SearchContainer from '../../components/searchContainer';
import { options } from '../../components/searchContainer/config'
import { TABLES } from '../../constants';
import './style.scss'

const { Meta } = Card;

const Extracts = () => {
    const { t } = useTranslation();
    const currentUserId = useSelector(state => state.user.user.id);
    const [currentUserInfo, setCurrentUserInfo] = useState({})
    const [id, setId] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [extractsId, setExtractsId] = useState({});
    const fetchUsersInfo = async () => {
        try {
            const response = await fetchOneUser(currentUserId);
            setCurrentUserInfo(response)
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    useEffect(() => {
        fetchUsersInfo();
    }, []);
    const handleSwitchChange = (checked) => {
        setId(checked ? currentUserId : null); // Set id based on switch state
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);

        // Вызываем функцию в зависимости от состояния чекбокса
        if (checked && selectedPositions.length !== 0) {
            findExtractForPosition();
        } else {
            setExtractsId({});
        }
    };

    // Функция, которая будет вызываться, когда чекбокс включен (true)
    const findExtractForPosition = async() => {
        let recordsIdBuf = [];
    
        // Проход по каждому объекту в массиве selectedPositions
        for (const position of selectedPositions) {
            // Вызываем fetchOnePosition для получения информации о позиции
            const response = await fetchOnePosition(position.id);
            
            // Проверяем, что response содержит поле records
            if (response && response.records && response.records.length > 0) {
                // Добавляем id каждой записи в recordsIdBuf
                response.records.forEach(record => {
                    recordsIdBuf.push(record.id);
                });
            }
        }
        
        // Вызываем fetchExtractRecords с массивом recordsIdBuf
        const _ = null;
        const response2 = await fetchExtractRecords(_, _, _, { recordsId: recordsIdBuf });
        
        let extractsIdBuf = [];
        
        // Проверяем, что response2 содержит поле rows
        if (response2 && response2.rows && response2.rows.length > 0) {
            // Проходим по каждой записи в rows
            response2.rows.forEach(row => {
                // Добавляем extractId в extractsIdBuf, если его там ещё нет
                if (!extractsIdBuf.includes(row.extractId)) {
                    extractsIdBuf.push(row.extractId);
                }
            });
        }
        
        // Выводим extractsIdBuf в консоль
        setExtractsId({id: extractsIdBuf})
    };

    ///вся логика по поиску выписок по позициям
    const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });

    const [selectedPositions, setSelectedPositions] = useState([]);

    const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility

    const [modalContent, setModalContent] = useState(null); // State to manage modal content

    const [searchFilters, setSearchFilters] = useState({});

    const handleAdd = (item) => {
        setSelectedPositions(prevState => [...prevState, item]);
    };


    const handleRemoveRelated = (id) => {
        setSelectedPositions(prevState => prevState.filter(item => item.id !== id));
    };


    const showModal = useCallback(() => {
        setModalVisible(true); // Set modal visibility to true
    }, []);


    const hideModal = useCallback(() => {
        setModalVisible(false); // Set modal visibility to false
    }, []);


    const fetchPositionsAndUpdateModal = useCallback(async ({ value, option }) => {
        try {
            let response;
            setSearchFilters({ value, option })
            const filters = {};
            if (value !== undefined && option !== undefined && value !== null && option !== null) {
                filters[option] = value;
                response = await fetchPositions(pagination.current, pagination.pageSize, filters);
            } else {
                response = await fetchPositions(pagination.current, pagination.pageSize);
            }
            const modalContent = (
                <>
                    {response.rows.length === 0 ? (
                        <Empty description={t("positionConstructor.noMatches")} />
                    ) : (
                        <>
                            <List
                                itemLayout="horizontal"
                                dataSource={response.rows}
                                renderItem={(item, index) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={<span>{((pagination.current - 1) * pagination.pageSize) + index + 1}. {item.desc}</span>}
                                            description={`${t("table-columns.article")}: ${item.article}`}
                                        />
                                        {selectedPositions.some(selectedItem => selectedItem.id === item.id) ? (
                                            <CheckOutlined style={{ color: 'green' }} />
                                        ) : (
                                            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(item)} />
                                        )}
                                    </List.Item>
                                )}
                            />
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={response.count}
                                onChange={(page, pageSize) => setPagination({ ...pagination, current: page })}
                                showSizeChanger={false}
                                hideOnSinglePage={true}
                            />
                        </>
                    )}
                </>
            );
            setModalContent(modalContent); // Update modal content
            showModal(); // Show modal
        } catch (error) {
            console.error('Error fetching positions:', error);
            notification({
                type: 'error',
                message: t("notification.error"),
                description: t("notification.errorDesc1"),
            });
        }
    }, [pagination, selectedPositions, showModal]);


    // Добавляем useEffect для отслеживания изменений в пагинации и обновления контента модального окна
    useEffect(() => {
        // Этот эффект будет отслеживать изменения в пагинации и вызывать функцию для загрузки обновленного контента модального окна
        if(modalVisible)fetchPositionsAndUpdateModal(searchFilters);
    }, [pagination, selectedPositions]);

    /////////
    return ( 
        <div>
            {/* Данные о текущем пользователе */}
            <Card 
                title={
                    <div>
                        {t("extractsPage.title1")}{' '}
                        <span style={{ color: id === currentUserId ? '#1890ff' : 'inherit', textDecoration: id === currentUserId ? 'underline' : 'none' }}>
                        {t("extractsPage.title2")}
                        </span>
                        /
                        <span style={{ color: id !== currentUserId ? '#1890ff' : 'inherit', textDecoration: id !== currentUserId ? 'underline' : 'none' }}>
                        {t("extractsPage.title3")}
                        </span>
                        {/* Switch компонент */}
                        <Switch 
                            onChange={handleSwitchChange}
                            style={{ marginLeft: '10px' }} 
                            checkedChildren={t("extractsPage.switch1")}
                            unCheckedChildren={t("extractsPage.switch2")}
                        />
                    </div>
                }
            >    
                <Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                    title={
                        <div className='user-info-card-meta-block-container'>
                            <div>
                                <u style={{color: '#1890ff'}}>{t("userManagment.login")}:</u>
                                <span style={{marginLeft:'20px'}}>{currentUserInfo.login}</span>
                            </div>
                            <div className='right-allight'>
                                <u style={{color: '#1890ff', marginRight:'38px'}}>ID:</u>
                                <span style={{marginRight:'28px'}}>{currentUserInfo.id}</span>
                            </div>
                        </div>
                    }
                    description={
                        <div className='user-info-card-meta-block-container'>
                            <div>
                                <u style={{color: '#1890ff'}}>{t("table-columns.name")}:</u>
                                <span style={{marginLeft:'20px'}}>{currentUserInfo.name}</span>
                            </div>
                            <div className='right-allight'>
                                <u style={{color: '#1890ff', marginRight:'5px'}}>{t("extractsPage.extracts")}:</u>
                                <span style={{marginRight:'25px'}}>{'['}{currentUserInfo.extract ? currentUserInfo.extract.length : 0}{']'}</span>
                            </div>
                        </div>
                    }
                />
            </Card>
            <TableContainer 
                keyWord={TABLES.EXTRACT}
                id={id}
                extractsId={extractsId}
            />
            {/* Поиск выписок по позициям */}
            <div className="search-container-extracts">
                <div className='label-button'>
                    <label>{t("extractsPage.title4")}:</label>
                    <Checkbox onChange={handleCheckboxChange}/>
                    {selectedPositions.length === 0 && isChecked && (
                        <span style={{ color: 'red', marginLeft: '10px', lineHeight: '15px' }}>{t("extractsPage.title5")}</span>
                    )}
                </div>
                <SearchContainer options={options()(TABLES.POSITION)} onSearch={fetchPositionsAndUpdateModal} />
            </div>
            {selectedPositions.length > 0 &&
                <TableContainer
                    keyWord={TABLES.POSITIONADD}
                    dataOut={selectedPositions}
                    handleRemoveRelated={(id) => handleRemoveRelated(id)}
                />
            }
            <Modal
                open={modalVisible}
                title={t("positionConstructor.searchRes")}
                onCancel={hideModal}
                footer={null}
            >
                {modalContent}
            </Modal>
        </div>
    );
}
 
export default Extracts;