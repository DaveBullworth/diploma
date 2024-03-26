import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Spin, Modal, notification } from '../../components/common/index'
import { deleteExtract, fetchOneExtract } from '../../http/extractsAPI';
import { ROUTES, TABLES } from '../../constants';
import TableContainer from '../../components/tableContainer';
import './style.scss'

const Extract = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [extract, setExtract] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
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
            }
        };
    
        fetchData();
    }, [id]);
    const handleEdit = () => {
        navigate(ROUTES.UPDATE_EXTRACT.replace(':id', id));
    }
    const showConfirm = () => {
        const content = `Sure to delete: ${extract.id} extract?`;
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
            console.log(`Extract ${id} deleted`)
            //await deleteExtract(id);
        } catch (err) {
            console.error(err);
        } finally {
            notification({
                type: 'success',
                message: 'Success!',
                description: `${extract.id} extract deleted successfully!`,
            });
            navigate(ROUTES.POSITIONS)
        }
    };
    if (!extract) {
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
                        Extract <u style={{ color: '#1890ff' }}>#{extract.id}</u> Info:
                    </span>
                } 
                bordered 
                className="extract-info"
                column={2}
                layout="horizontal"
            >
                <Descriptions.Item label="ID #">{extract.id}</Descriptions.Item>
                <Descriptions.Item label="DATE">{extract.date}</Descriptions.Item>
                <Descriptions.Item label="Created by">{extract.user.login}</Descriptions.Item>
                <Descriptions.Item label="N-O Records">{extract.extractRecords.length}</Descriptions.Item>
            </Descriptions>
            {extract.extractRecords.length > 0 && (            
                <>
                    <Divider>Extract Records</Divider>
                    <TableContainer keyWord={TABLES.EXTRACTRECORD} id={id} />
                </>
            )}
        </div>
    );
}
 
export default Extract;