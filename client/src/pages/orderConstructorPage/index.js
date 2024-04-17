import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Empty, Typography, Tag, InputNumber, DatePicker, Pagination, List, Modal, Checkbox } from 'antd';
import { Button, Spin, notification } from '../../components/common/index';
import { PlusOutlined, CheckOutlined, CloseOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { createOrder, editOrder, fetchOneOrder, deleteOrder } from "../../http/ordersAPI"
import { createOrderRecord, deleteOrderRecord, editOrderRecord, fetchOrderRecords } from "../../http/orderRecordsAPI"
import { fetchPositions, fetchOnePosition } from "../../http/positionsAPI"
import SearchContainer from '../../components/searchContainer';
import TableContainer from '../../components/tableContainer'
import { options } from '../../components/searchContainer/config'
import { TABLES, ROUTES } from '../../constants';
import dayjs from 'dayjs'; 

import './style.scss'

const { Title } = Typography;
const { Meta } = Card;

const OrderConstructor = ({update}) => {
    const { id } = useParams(); 
    const { t } = useTranslation();
    const navigate = useNavigate();
    const minDate = dayjs().subtract(5, 'year');
    const maxDate = dayjs().add(1, 'year');
    const [creationDate, setCreationDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [formDataArray, setFormDataArray] = useState([
        {
            quantity: 0,
            active: true,
            positionId: null,
            um: ''
        }
    ]);
    const [orderInfo, setOrderInfo] = useState({})
    const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
    const [selectedPositions, setSelectedPositions] = useState(Array(formDataArray.length).fill(null));
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [searchFilters, setSearchFilters] = useState({});

    const handleAddRecord = () => {
        setFormDataArray([...formDataArray, {
            quantity: 0,
            active: true,
            positionId: null,
            um: ''
        }]);
    };

    const handleAdd = (index, item) => {
        setSelectedPositions(prevState => {
            const updatedSelectedPositions = [...prevState];
            updatedSelectedPositions[index] = item;
            return updatedSelectedPositions;
        });
        const updatedFormDataArray = [...formDataArray];
        updatedFormDataArray[index].positionId = item.id;
        updatedFormDataArray[index].um = item.um.name; // Установка positionId для соответствующей записи в formDataArray
        setFormDataArray(updatedFormDataArray);
        hideModal();
    };

    const handleRemove = (index) => {
        const updatedFormDataArray = [...formDataArray];
        updatedFormDataArray.splice(index, 1);
        setFormDataArray(updatedFormDataArray);
        setSelectedPositions(prevState => {
            const updatedSelectedPositions = [...prevState];
            updatedSelectedPositions.splice(index, 1);
            return updatedSelectedPositions;
        });
    };

    const handleToggleActive = (index) => {
        const updatedFormDataArray = [...formDataArray];
        updatedFormDataArray[index].active = !updatedFormDataArray[index].active;
        setFormDataArray(updatedFormDataArray);
    };

    const showModal = useCallback(() => {
        setModalVisible(true);
    }, []);

    const hideModal = useCallback(() => {
        setModalVisible(false);
    }, []);

    const fetchPositionsAndUpdateModal = useCallback(async ({ value, option, indexR }) => {
        try {
            let response;
            setSearchFilters({ value, option, indexR });
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
                                        {selectedPositions.some(pos => pos && pos.id === item.id) ? ( // Проверяем, выбрана ли эта позиция для какой-либо формы
                                            <CheckOutlined style={{ color: 'green' }} />
                                        ) : (
                                            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(indexR, item)} />
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
            setModalContent(modalContent);
            showModal();
        } catch (error) {
            console.error('Error fetching positions:', error);
            notification({
                type: 'error',
                message: t("notification.error"),
                description: t("notification.errorDesc1"),
            });
        }
    }, [pagination, selectedPositions, showModal, formDataArray]);

    useEffect(() => {
        if(modalVisible){
            fetchPositionsAndUpdateModal(searchFilters);
        }
    }, [pagination, selectedPositions]);

    const showConfirm = () => {
        const content = `${t("modal.sureDel")}: ${orderInfo.id} ${t("orderPage.order")}?`;
        Modal({
          type: 'confirm',
          title: 'Confirmation',
          content,
          onOk() {
            handleDelete(id)
          },
        });
    };
    const handleDelete = async (id) => {
        try {
            setLoading(true)
            const response = await fetchOrderRecords(null, null, id);
            
            for (const order of response.rows) {
                await deleteOrderRecord(order.id);
            }
    
            await deleteOrder(id);
            
            notification({
                type: 'success',
                message: t("notification.success"),
                description: `${t("orderPage.order")} #${id} ${t("notification.successDesc5")}!`,
            });
    
            navigate(ROUTES.ORDERS);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (update) {
            fetchOrderData();
            fetchOrderRecordsData();
        }
    }, []);

    const fetchOrderData = async () => {
        try {
            setLoading(true)
            const response = await fetchOneOrder(id);
            setOrderInfo(response)
            setCreationDate(dayjs(response.date));
        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false)
        }
    };

    const fetchOrderRecordsData = async () => {
        try {
            setLoading(true)
            const response = await fetchOrderRecords(null, null, id);
            const newDataArray = [];
            const newDataPosArray = [];
            for (const OR of response.rows) {
                const response1 = await fetchOnePosition(OR.positionId)
                const data = {
                    quantity: OR.quantity,
                    active: OR.active,
                    positionId: OR.positionId,
                    um: response1.um.name
                }
                newDataArray.push(data);
                newDataPosArray.push(response1);
            }
            setSelectedPositions(newDataPosArray)
            setFormDataArray(newDataArray);
        } catch (error) {
            console.error('Error fetching order records data:', error);
        } finally {
            setLoading(false)
        }
    };

    // Функция обработки изменения значения DatePicker
    const handleDateChange = (date) => {
        setCreationDate(date);
    };

    const saveData = async () => {
        try {
            // Проверка на наличие некорректных данных в formDataArray
            if (formDataArray.some(formData => formData.positionId === null || formData.quantity === 0)) {
                throw new Error(t("orderPage.errTitle"));
            }
            setLoading(true);
            if (!update) {
                // Создание заказа
                const response = await createOrder({ date: creationDate });
    
                // Создание записей о заказе
                for (const formData of formDataArray) {
                    const data = {
                        quantity: formData.quantity,
                        positionId: formData.positionId,
                        active: formData.active,
                        orderId: response.id
                    };
                    await createOrderRecord(data);
                }
            } else {
                // Редактирование заказа
                let hasActiveRecord = false;
                for (const formData of formDataArray) {
                    if (formData.active) {
                        hasActiveRecord = true;
                        break;
                    }
                }
    
                const data = {
                    active: hasActiveRecord, // Если хотя бы одна запись активна, то заказ тоже будет активен
                    date: creationDate
                };
    
                const response2 = await editOrder(id, data);
    
                const response3 = await fetchOrderRecords(null, null, id);
    
                for (const row of response3.rows) {
                    let foundMatchingRecord = false;
                    for (const formData of formDataArray) {
                        if (
                            formData.active === row.active &&
                            formData.positionId === row.positionId &&
                            formData.quantity === row.quantity
                        ) {
                            foundMatchingRecord = true;
                            break;
                        } else if (
                            formData.positionId === row.positionId &&
                            formData.quantity === row.quantity
                        ) {
                            const rep = await editOrderRecord(row.id, {active: formData.active})
                            console.log(rep)
                            foundMatchingRecord = true;
                            break;
                        }
                    }
    
                    if (!foundMatchingRecord) {
                        await deleteOrderRecord(row.id);
                    }
                }
    
                for (const formData of formDataArray) {
                    let foundMatchingRecord = false;
                    for (const row of response3.rows) {
                        if (
                            formData.positionId === row.positionId &&
                            formData.quantity === row.quantity
                        ) {
                            foundMatchingRecord = true;
                            break;
                        }
                    }
    
                    if (!foundMatchingRecord) {
                        const data = {
                            quantity: formData.quantity,
                            positionId: formData.positionId,
                            active: formData.active,
                            orderId: response2.id
                        };
                        await createOrderRecord(data);
                    }
                }
            }
    
            notification({
                type: 'success',
                message: t("notification.success"),
                description: t("notification.order") + " " + (update ? t("modal.edited") : t("orderPage.create_")) + " " + t("notification.success_"),
            });
        } catch (error) {
            console.error(t("notification.error_") + (update ? t("extractConstructor.mod")  : t("extractConstructor.create")) + ' выписки:', error);
            notification({
                type: 'error',
                message: t("notification.errorDesc10") + " " + (update ? t("extractConstructor.mod__") : t("extractConstructor.create__")) + " " + t("orderPage.order_"),
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };    

    if (loading) {
        return <Spin/>;
    }

    return ( 
        <>
            <Card title={
                update ?
                (<span >
                    <ArrowLeftOutlined 
                        className="back-icon" 
                        style={{ color: 'green', fontSize: '28px' }} 
                        onClick={() => navigate(ROUTES.ORDERS)}
                    />
                    {t("orderPage.editOrder")} <strong style={{color: '#1890ff'}}>#{id}</strong>
                    <DeleteOutlined 
                        className="delete-icon" 
                        style={{ color: 'red', fontSize: '28px' }} 
                        onClick={() => showConfirm()} 
                    />
                </span>)
                :
                (<span >
                    {t("orderPage.title4") + ":"}
                </span>)
                }
            >
                <Meta
                    title={update ? (
                        <div className='user-info-card-meta-block-container'>
                            <div>
                                <u style={{color: '#1890ff'}}>{t("orderPage.orderStatus")}:</u>
                                <span style={{marginLeft:'20px'}}>
                                    <Tag color={orderInfo.active ? 'green' : 'blue'}>
                                        {orderInfo.active ? t("table-columns.activeTagTrue") : t("table-columns.activeTagFalse")} 
                                    </Tag>
                                </span>
                            </div>
                            <div className='right-allight'>
                                <b style={{color: '#1890ff', marginRight:'65px'}}>{t("orderPage.date")}</b>
                            </div>
                        </div>
                    ) : (
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <b style={{color: '#1890ff'}}>{t("orderPage.date")}</b>
                        </div>
                    )}
                    description={update ? (
                        <div className='user-info-card-meta-block-container'>
                            <div>
                                <u style={{color: '#1890ff'}}>ID: #</u>
                                <span style={{marginLeft:'20px'}}>{orderInfo.id}</span>
                            </div>
                            <div className='right-allight'>
                                <span style={{marginRight:'25px'}}>
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        value={creationDate} // Передача значения creationDate
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onChange={handleDateChange} // Передача функции handleDateChange
                                    />
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <span>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={creationDate} // Передача значения creationDate
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    onChange={handleDateChange} // Передача функции handleDateChange
                                />
                            </span>
                        </div>  
                    )}
                />
            </Card>
            {formDataArray.map((formData, index) => (
                <Card key={index} className="order-card">
                    <div className="order-card-header">
                        <Title level={4}>{t("orderPage.OR")} #{index + 1}</Title>
                    </div>
                    <div className="search-container-orders">
                        <label>{t("orderPage.choosePos")}:</label>
                        <SearchContainer 
                            options={options()(TABLES.POSITION)} 
                            onSearch={fetchPositionsAndUpdateModal} 
                            indexR={index}
                        />
                    </div>
                    {selectedPositions[index] &&
                        <>
                            <div className="selPos-label">
                                <label>{t("orderPage.selPos")}:</label>
                            </div>
                            <div style={{marginTop:'1rem'}}>
                                <TableContainer
                                    keyWord={TABLES.POSITIONADD}
                                    dataOut={[selectedPositions[index]]}
                                    handleRemoveRelated={() => {
                                        setSelectedPositions(prevState => {
                                            const updatedSelectedPositions = [...prevState];
                                            updatedSelectedPositions[index] = null;
                                            return updatedSelectedPositions;
                                        });
                                        const updatedFormDataArray = [...formDataArray];
                                        updatedFormDataArray[index].positionId = null;
                                        updatedFormDataArray[index].um = '';
                                        setFormDataArray(updatedFormDataArray);
                                    }}
                                />
                            </div>
                        </>
                    }
                    <div className="order-card-body">
                        <div className='input-field' >
                            <label>
                                {t("extractConstructor.quantity")}
                            </label>
                            <InputNumber value={formData.quantity} onChange={(value) => {
                                const updatedFormDataArray = [...formDataArray];
                                updatedFormDataArray[index].quantity = value;
                                setFormDataArray(updatedFormDataArray);
                            }} />
                            <label>
                               <b>{formData.um}</b>
                            </label>
                        </div>
                        <div className='input-field' >
                            <Checkbox checked={!formData.active} onChange={() => handleToggleActive(index)} disabled={!update} />
                            <label>{t("orderPage.orderStatus")}</label>
                        </div>
                        <div className='input-field' >
                            <Button 
                                danger
                                type="default" 
                                icon={<CloseOutlined />} 
                                onClick={() => handleRemove(index)}
                                text={t("orderPage.remRec")}
                            />
                        </div>
                    </div>
                </Card>
            ))}
            <div className="order-actions">
                <Button onClick={handleAddRecord}>{t("orderPage.addRec")}</Button>
                <Button danger onClick={saveData}>{t("positionConstructor.save")}</Button>
            </div>
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
 
export default OrderConstructor;