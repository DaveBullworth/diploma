import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Descriptions, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import { Spin, Modal, notification } from '../../components/common/index'
import { fetchOnePosition, deletePosition } from '../../http/positionsAPI'
import { fetchRecords } from '../../http/recordsAPI'
import { fetchOrderRecords } from '../../http/orderRecordsAPI'
import TableContainer from '../../components/tableContainer';
import ChartPosition from '../../components/chartPosition'
import { ROUTES, TABLES } from '../../constants';
import './style.scss'

const Position = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [position, setPosition] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchOnePosition(id);
                setPosition(data);
            } catch (error) {
                console.error('Error fetching position:', error);
            }
        };
    
        fetchData();
    }, [id]);
    if (!position) {
        return <Spin/>;
    }
    const { name, category, article, desc, factory, quantity, um, records, ChildPositions } = position;
    const handleEdit = () => {
        navigate(ROUTES.UPDATE_POSITION.replace(':id', id));
    }
    const showConfirm = async() => {
        let content = `${t("modal.sureDel")} ${t("positionPage.position_")} ${name} ?`;
        let flag = false;
        let okButtonProps = {};
        const response1 = await fetchRecords(null, null, id);
        const response2 = await fetchOrderRecords(null, null, null, { positionsId: [id] });
        if (response1.rows.length > 0 || response2.rows.length > 0) {
            flag = true;
            const recordsInfo = response1.rows.map(row => `#${row.id} (${row.desc_fact})`).join(', ') + " " + response2.rows.map(row => `#${row.id} (${t("orderPage.order")})`).join(', ')
            content = (
                <span>
                    {t("modal.delNot3")} <strong>{recordsInfo}</strong> {t("modal.delNot4")}
                </span>
            );
            okButtonProps = { style: { display: 'none' } };
        }
        Modal({
          type: 'confirm',
          title: t("modal.confirm"),
          content,
          onOk() {
            if (!flag) handleDelete(id);
          },
          okButtonProps,
        });
    };
    const handleDelete = async (id) => {
        try {
            await deletePosition(id);
        } catch (err) {
            console.error(err);
        } finally {
            notification({
                type: 'success',
                message: t("notification.success"),
                description: `${name} ${t("notification.successDesc2")}`,
            });
            navigate(ROUTES.POSITIONS)
        }
    };
    return ( 
        <div className="Position">
            <ArrowLeftOutlined 
                className="back-icon" 
                style={{ color: 'green', fontSize: '28px' }} 
                onClick={() => navigate(ROUTES.POSITIONS)}
            />
            <FormOutlined
                className="form-icon" 
                style={{ color: 'black', fontSize: '28px' }}
                onClick={() => navigate(ROUTES.CREATE_RECORD.replace(':id', id))}
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
                        {t("positionPage.info_") + t("positionPage.position")} <u style={{ color: '#1890ff' }}>{name}</u> {t("positionPage._info")}
                    </span>
                } 
                bordered 
                className="PositionInfo"
            >
                <Descriptions.Item label={t("table-columns.name")}>{name}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.category")}>{category.name}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.article")}>{article}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.desc")}>{desc}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.factory")}>{factory}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.quantity")}>{`${quantity} ${um.name}`}</Descriptions.Item>
            </Descriptions>
            {records.length > 0 && (            
                <>
                    <Divider>{t("positionPage.pos_rec")}</Divider>
                    <TableContainer keyWord={TABLES.RECORD} id={id} />
                </>
            )}
            {ChildPositions.length > 0 && (
                <>
                    <Divider>{t("positionPage.rel_pos")}</Divider>
                    <TableContainer keyWord={TABLES.POSITION} dataOut={ChildPositions} />
                </>
            )}
            <div className='chart-container'>
                <ChartPosition id={id}/>
            </div>
        </div>
    );
}
 
export default Position;