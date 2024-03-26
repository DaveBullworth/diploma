import React, { useEffect } from 'react';
import { Modal, List, Empty, Button, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const RecordModal = ({ visible, records, onSelectRecord, onCancel, pagination, onPageChange, total }) => {
    return (
        <Modal
            open={visible}
            title="Record Results"
            onCancel={onCancel}
            footer={null}
        >
            {records.length === 0 ? (
                <Empty description="There are no matches" />
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={records}
                        renderItem={(item, index) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={<span>{((pagination.current - 1) * pagination.pageSize) + index + 1}. {item.desc_fact}</span>}
                                    description={`Количество: ${item.quantity} ${item.um} `}
                                />
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => onSelectRecord(item)} />
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

export default RecordModal;