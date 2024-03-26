import React from 'react';
import { Modal, List, Empty, Button, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const PositionModal = ({ visible, positions, onSelectPosition, onCancel, pagination, onPageChange, total }) => {
    return (
        <Modal
            open={visible}
            title="Search Results"
            onCancel={onCancel}
            footer={null}
        >
            {positions.length === 0 ? (
                <Empty description="There are no matches" />
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={positions}
                        renderItem={(item, index) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={<span>{((pagination.current - 1) * pagination.pageSize) + index + 1}. {item.desc}</span>}
                                    description={`Article: ${item.article}`}
                                />
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => onSelectPosition(item)} />
                            </List.Item>
                        )}
                    />
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={total}
                        onChange={onPageChange}
                        showSizeChanger={false}
                        hideOnSinglePage={true}
                    />
                </>
            )}
        </Modal>
    );
};

export default PositionModal;