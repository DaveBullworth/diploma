import React, { useEffect } from 'react';
import { Modal, List, Empty, Button, Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';

const RecordModal = ({ visible, records, onSelectRecord, onCancel, pagination, onPageChange, total }) => {
    const { t } = useTranslation();
    return (
        <Modal
            open={visible}
            title={t("extractConstructor.recRes")}
            onCancel={onCancel}
            footer={null}
        >
            {records.length === 0 ? (
                <Empty description={t("positionConstructor.noMatches")} />
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={records}
                        renderItem={(item, index) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={<span>{((pagination.current - 1) * pagination.pageSize) + index + 1}. {item.desc_fact}</span>}
                                    description={`${t("table-columns.quantity")}: ${item.quantity} ${item.um.name} `}
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