import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Descriptions, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Spin, Modal, notification } from '../../components/common/index'
import { fetchOnePosition, editPosition } from '../../http/positionsAPI';
import { fetchOneRecord } from '../../http/recordsAPI';
import { deleteExtract, fetchOneExtract } from '../../http/extractsAPI';
import { fetchExtractRecords, deleteExtractRecord } from '../../http/extractRecordsAPI';
import { ROUTES, TABLES } from '../../constants';
import TableContainer from '../../components/tableContainer';
import './style.scss'

const Extract = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [extract, setExtract] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await fetchOneExtract(id);
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
                setExtract(data);
            } catch (error) {
                console.error('Error fetching extract:', error);
            } finally{
                setLoading(false)
            }
        };
    
        fetchData();
    }, [id]);
    const handleEdit = () => {
        navigate(ROUTES.UPDATE_EXTRACT.replace(':id', id));
    }
    const showConfirm = () => {
        const content = `${t("modal.sureDel")}: ${extract.id} ${t("extractPage.extract")}?`;
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
            const response1 = await fetchExtractRecords(null, null, id);
            
            for (const extract of response1.rows) {
                const response2 = await fetchOneRecord(extract.recordId);
                const response3 = await fetchOnePosition(response2.positionId);
                const newQuantity = response3.quantity + (extract.quantity * response2.quantity_um);
                await editPosition(response3.id, { quantity: newQuantity });
                await deleteExtractRecord(extract.id);
            }
    
            await deleteExtract(id);
            
            notification({
                type: 'success',
                message: t("notification.success"),
                description: `${id} ${t("extractPage.extract")} ${t("notification.successDesc3")}!`,
            });
    
            navigate(ROUTES.EXTRACTS);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    };
    if (loading || !extract) {
        return <Spin/>;
    }
    return ( 
        <div className="extract">
            <ArrowLeftOutlined 
                className="back-icon" 
                style={{ color: 'green', fontSize: '28px' }} 
                onClick={() => navigate(ROUTES.EXTRACTS)}
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
                        {t("positionPage.info_")} {t("extractPage._extract")} {t("positionPage._info")}{t("extractPage.extract__")}: <u style={{ color: '#1890ff' }}>#{extract.id}</u>
                    </span>
                } 
                bordered 
                className="extract-info"
                column={2}
                layout="horizontal"
            >
                <Descriptions.Item label="ID #">{extract.id}</Descriptions.Item>
                <Descriptions.Item label={t("table-columns.date") + ':'}>{extract.date}</Descriptions.Item>
                <Descriptions.Item label={t("extractPage.created") + ':'}>{extract.user.login}</Descriptions.Item>
                <Descriptions.Item label={t("extractPage.recNO") + ':'}>{extract.extractRecords.length}</Descriptions.Item>
            </Descriptions>
            {extract.extractRecords.length > 0 && (            
                <>
                    <Divider>{t("extractPage.title1")}</Divider>
                    <TableContainer keyWord={TABLES.EXTRACTRECORD} id={id} />
                </>
            )}
        </div>
    );
}
 
export default Extract;