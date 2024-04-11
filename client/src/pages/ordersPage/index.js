import React, { useEffect, useState, useCallback } from 'react';
import TableContainer from '../../components/tableContainer'
import { useTranslation } from 'react-i18next';
import { TABLES } from '../../constants';
import SearchContainer from '../../components/searchContainer';
import { options } from '../../components/searchContainer/config'
import { Empty, List, Pagination, Modal, Checkbox } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { fetchPositions } from '../../http/positionsAPI'
import { fetchOrderRecords } from '../../http/orderRecordsAPI'
import { Button, notification } from '../../components/common/index';

const Orders = () => {
    const { t } = useTranslation()
    const [isChecked, setIsChecked] = useState(false);
    const [ordersId, setOrdersId] = useState({});
    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);

        // Вызываем функцию в зависимости от состояния чекбокса
        if (checked && selectedPositions.length !== 0) {
            findOrderForPosition();
        } else {
            setOrdersId({});
        }
    };

    // Функция, которая будет вызываться, когда чекбокс включен (true)
    const findOrderForPosition = async() => {
        let positionsIdBuf = [];
    
        // Проход по каждому объекту в массиве selectedPositions
        for (const position of selectedPositions) { 
            positionsIdBuf.push(position.id)
        }
        
        // Вызываем fetchExtractRecords с массивом positionsIdBuf
        const _ = null;
        const response = await fetchOrderRecords(_, _, _, { positionsId: positionsIdBuf });
        
        let ordersIdBuf = [];
        
        // Проверяем, что response содержит поле rows
        if (response && response.rows && response.rows.length > 0) {
            // Проходим по каждой записи в rows
            response.rows.forEach(row => {
                // Добавляем orderId в ordersIdBuf, если его там ещё нет
                if (!ordersIdBuf.includes(row.orderId)) {
                    ordersIdBuf.push(row.orderId);
                }
            });
        }
        setOrdersId({id: ordersIdBuf})
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
        setIsChecked(false)
        setOrdersId({})
        // Этот эффект будет отслеживать изменения в пагинации и вызывать функцию для загрузки обновленного контента модального окна
        if(modalVisible){
            fetchPositionsAndUpdateModal(searchFilters)
        }
    }, [pagination, selectedPositions]);

    return ( 
        <>
            <TableContainer 
                keyWord={TABLES.ORDER}
                ordersId={ordersId}
            />
            {/* Поиск выписок по позициям */}
            <div className="search-container-extracts">
                <div className='label-button'>
                    <label>{t("orderPage.title2")}:</label>
                    <Checkbox onChange={handleCheckboxChange} checked={isChecked}/>
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
        </>
    );
}
 
export default Orders;