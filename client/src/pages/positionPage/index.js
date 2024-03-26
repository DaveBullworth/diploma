import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Spin, Modal, notification } from '../../components/common/index'
import { fetchOnePosition, deletePosition } from '../../http/positionsAPI'
import TableContainer from '../../components/tableContainer';
import { ROUTES, TABLES } from '../../constants';
import './style.scss'

const Position = () => {
    const { id } = useParams();
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
        const content = `Sure to delete: ${name} position?`;
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
            await deletePosition(id);
        } catch (err) {
            console.error(err);
        } finally {
            notification({
                type: 'success',
                message: 'Success!',
                description: `${name} position deleted successfully!`,
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
                        Position <u style={{ color: '#1890ff' }}>{name}</u> Info
                    </span>
                } 
                bordered 
                className="PositionInfo"
            >
                <Descriptions.Item label="Name">{name}</Descriptions.Item>
                <Descriptions.Item label="Category">{category.name}</Descriptions.Item>
                <Descriptions.Item label="Article">{article}</Descriptions.Item>
                <Descriptions.Item label="Description">{desc}</Descriptions.Item>
                <Descriptions.Item label="Factory">{factory}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{`${quantity} ${um}`}</Descriptions.Item>
            </Descriptions>
            {records.length > 0 && (            
                <>
                    <Divider>Position Records</Divider>
                    <TableContainer keyWord={TABLES.RECORD} id={id} />
                </>
            )}
            {ChildPositions.length > 0 && (
                <>
                    <Divider>Related Positions</Divider>
                    <TableContainer keyWord={TABLES.POSITION} dataOut={ChildPositions} />
                </>
            )}
        </div>
    );
}
 
export default Position;