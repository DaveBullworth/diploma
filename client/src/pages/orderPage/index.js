import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Descriptions, Divider, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Spin, Modal, notification } from '../../components/common/index'
import { deleteOrder, fetchOneOrder } from '../../http/ordersAPI';
import { fetchOrderRecords, deleteOrderRecord } from '../../http/orderRecordsAPI';
import { ROUTES, TABLES } from '../../constants';
import TableContainer from '../../components/tableContainer';
import './style.scss'

const Order = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await fetchOneOrder(id);
                data.date = new Date(data.date).toLocaleString(
                    'en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                        //, timeZone: 'UTC'
                    }
                )
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally{
                setLoading(false)
            }
        };
    
        fetchData();
    }, [id]);
    const handleEdit = () => {
        navigate(ROUTES.UPDATE_ORDER.replace(':id', id));
    }
    const showConfirm = () => {
        const content = `${t("modal.sureDel")}: ${order.id} ${t("orderPage.order")}?`;
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
    if (loading || !order) {
        return <Spin/>;
    }
    return ( 
        <div className="order">
            <ArrowLeftOutlined 
                className="back-icon" 
                style={{ color: 'green', fontSize: '28px' }} 
                onClick={() => navigate(ROUTES.ORDERS)}
            />
            <EditOutlined 
                className="edit-icon" 
                style={{ color: 'blue', fontSize: '28px' }} 
                onClick={() => handleEdit()}
            />
            <DeleteOutlined 
                className="delete-icon" 
                style={{ color: 'red', fontSize: '28px' }} 
                onClick={() => showConfirm()} 
            />
            <Descriptions 
                title={
                    <span>
                        {t("positionPage.info_")} {t("orderPage._order")} {t("positionPage._info")}{t("orderPage.order__")}: <u style={{ color: '#1890ff' }}>#{order.id}</u>
                    </span>
                } 
                bordered 
                className="order-info"
                column={2}
                layout="horizontal"
            >
                <Descriptions.Item label="ID #">{order.id}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.date") + ':'}>{order.date}</Descriptions.Item>
                <Descriptions.Item label={t("extractPage.recNO") + ':'}>{order.orderRecords.length}</Descriptions.Item>
                <Descriptions.Item label={t("orderPage.orderStat") + ':'}>
                    <Tag color={order.active ? 'green' : 'blue'}>
                        {order.active ? t("table-columns.activeTagTrue") : t("table-columns.activeTagFalse")} 
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
            {order.orderRecords.length > 0 && (            
                <>
                    <Divider>{t("orderPage.title3")}</Divider>
                    <TableContainer keyWord={TABLES.ORDERRECORD} id={id} />
                </>
            )}
        </div>
    );
}
 
export default Order;