import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Descriptions, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import { Spin, Modal, notification } from '../../components/common/index'
import { fetchOnePosition, deletePosition } from '../../http/positionsAPI'
import TableContainer from '../../components/tableContainer';
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
    const showConfirm = () => {
        const content = `${t("modal.sureDel")} ${t("positionPage.position_")} ${name} ?`;
        Modal({
          type: 'confirm',
          title: t("modal.confirm"),
          content,
          onOk() {
            handleDelete(id)
          },
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
                <Descriptions.Item label={t("table-columns.quantity")}>{`${quantity} ${um}`}</Descriptions.Item>
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
        </div>
    );
}
 
export default Position;