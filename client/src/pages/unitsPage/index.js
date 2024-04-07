import React, { useState, useEffect } from 'react';
import { List, Space, Pagination, Typography, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { Spin, Button, notification } from '../../components/common/index';
import { EditOutlined, DeleteOutlined, WarningTwoTone, StopTwoTone } from '@ant-design/icons';
import { fetchUMs, editUM, deleteUM } from "../../http/umAPI"; // Импортируем функцию для удаления категории
import { fetchPositions } from '../../http/positionsAPI';
import { fetchRecords } from '../../http/recordsAPI';
import { fetchExtractRecords } from '../../http/extractRecordsAPI';
import "./style.scss";

const { Title } = Typography;

const Units = () => {
    const { t } = useTranslation();
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [editedUnit, setEditUnit] = useState({});
    const [oldUnitName, setOldUnitName] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Новое состояние для модального окна удаления
    const [deletingUnit, setDeletingUnit] = useState({}); // Новое состояние для хранения информации о категории, которую пользователь собирается удалить

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetchUMs();
            const unitsWithCounts = await Promise.all(
                response.map(async unit => {
                    const positionsResponse = await fetchPositions(null, null, {umId: unit.id});
                    const recordsResponse = await fetchRecords(null, null, null, null, {umId: unit.id});
                    const extractRecordsResponse = await fetchExtractRecords(null, null, null, {umId: unit.id});
                    return {
                        ...unit, 
                        countP: positionsResponse.count,
                        countR: recordsResponse.count,
                        countER: extractRecordsResponse.count,
                    };
                })
            );
            setUnits(unitsWithCounts);
        } catch (error) {
            console.error('Error fetching units:', error);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const handleEditUnit = async (unit) => {
        setEditModalVisible(true);
        setEditUnit(unit);
        setOldUnitName(unit.name);
        setConfirmModalVisible(false);
    };

    const handleEditModalOk = async () => {
        try {
            await editUM(editedUnit.id, { name: editedUnit.name });
            notification({
                type: 'success',
                message: t("notification.success"),
                description: `${t("table-columns.um")} ${oldUnitName} ${t("notification.editSucc")}.`,
            });
            setConfirmModalVisible(false);
            setEditUnit({});
            setOldUnitName('');
            fetchData();
        } catch (error) {
            console.error('Error editing unit:', error);
            notification({
                type: 'error',
                message: t("notification.error"),
                description: `${t("notification.errorDesc11")} ${oldUnitName}: ${error.message}`,
            });
        }
    };

    const handleDeleteUnit = async (unit) => {
        setDeletingUnit(unit); // Устанавливаем информацию о категории, которую пользователь собирается удалить
        setDeleteModalVisible(true);
    };
    return (
        <>
            <Title>{t("unitPage.title")}</Title>
            {units && units.length > 0 ? (
                <>
                    <List
                        header={
                            <div className='category-list-info'>
                                <p style={{width:'6rem'}}><b>#</b></p>
                                <p style={{width:'8rem'}}><b>{t("table-columns.name")}</b></p>
                                <p style={{width:'12rem'}}><b>{t("categoryPage.no_pos")}</b></p>
                                <p style={{width:'12rem'}}><b>{t("unitPage.no_rec")}</b></p>
                                <p><b>{t("unitPage.no_ER")}</b></p>
                            </div>
                        }
                        itemLayout="horizontal"
                        dataSource={units.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <div className='category-list-info'>
                                            <p style={{width:'7.5rem'}}><u><b>{(currentPage - 1) * pageSize + index + 1}</b></u></p>
                                            <p style={{width:'6rem'}}>{item.name}</p> 
                                            <p style={{width:'12rem'}}>({t("categoryPage.no_pos")}: <b>{item.countP}</b>)</p>
                                            <p style={{width:'12rem'}}>({t("unitPage.no_rec")}: <b>{item.countR}</b>)</p>
                                            <p>({t("unitPage.no_ER")}: <b>{item.countER}</b>)</p>
                                        </div>
                                    }
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditUnit(item)}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        danger
                                        onClick={() => handleDeleteUnit(item)} 
                                    />
                                </Space>
                            </List.Item>
                        )}
                        bordered
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={units.length}
                        onChange={handlePageChange}
                        hideOnSinglePage
                    />
                </>
            ) : (
                <Spin size="large" />
            )}
            {/* Модальное окно для редактирования единицы измерения */}
            <Modal
                title={
                    <>
                        <WarningTwoTone twoToneColor="orange" style={{fontSize:'20px'}} />
                        {' '}
                        {t("modal.editUM")}<u style={{color:'#1890ff'}}>{oldUnitName}</u>
                    </>
                }
                onOk={() => {
                    setConfirmModalVisible(true);
                    setEditModalVisible(false);
                }}
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
            >
                <Input type="text" value={editedUnit.name} onChange={(e) => setEditUnit(prevState => ({ ...prevState, name: e.target.value }))} />
            </Modal>
            {/* Модальное окно для подтверждения изменения единицы измерения */}
            <Modal
                title={
                    <>
                        <WarningTwoTone twoToneColor="orange" style={{fontSize:'20px'}} />
                        {' '}
                        {t("modal.confEditUM1")}
                    </>
                }
                onOk={handleEditModalOk}
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
            >
                <>
                    <p>
                        {t("modal.confEditUM2")}
                        <b>"{oldUnitName}"</b>{" "}
                        {t("table-columns.on")}{" "}
                        <b>"{editedUnit.name}"</b>
                        ? 
                    </p>
                    <p>
                        {t("modal.itWillLead")}  
                    </p>
                    {" "}<b>{editedUnit.countP}</b>
                    {" "}{t("categoryPage.positions")},
                    {" "}<b>{editedUnit.countR}</b>
                    {" "}{t("unitPage.records")},
                    {" "}<b>{editedUnit.countER}</b>
                    {" "}{t("unitPage.extractRecords")},
                </>
            </Modal>
            {/* Модальное окно для удаления единицы измерения */}
            <Modal
                title={
                    <>
                        {deletingUnit.countP || deletingUnit.countR || deletingUnit.countER ? (
                            <StopTwoTone twoToneColor="red" style={{fontSize:'20px'}} />
                        ) : (
                            <WarningTwoTone twoToneColor="orange" style={{fontSize:'20px'}} />
                        )}
                        {' '}
                        {t("modal.delUM")}
                    </>
                }
                onOk={async () => {
                    try {
                        await deleteUM(deletingUnit.id);
                        notification({
                            type: 'success',
                            message:  t("notification.success"),
                            description: `${t("table-columns.um")} ${deletingUnit.name} ${t("notification.successDesc3")}.`,
                        });
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        notification({
                            type: 'error',
                            message:  t("notification.error"),
                            description: `${t("notification.errorDesc12")} ${deletingUnit.name}: ${error.message}.`,
                        });
                    } finally {
                        fetchData();
                        setDeleteModalVisible(false);
                    }
                }}
                open={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                okButtonProps={{
                    style: {
                        display: (deletingUnit.countP === 0 
                            && deletingUnit.countR === 0 
                            && deletingUnit.countER === 0 
                        ) 
                        ? 'inline' : 'none' } 
                    }}
            >
                {deletingUnit.countP > 0 && (
                    <p> {t("modal.umHave1")} <b>{deletingUnit.countP}</b> {t("modal.umHave2")} </p>
                )}
                {deletingUnit.countR > 0 && (
                    <p> {t("modal.umHave1")} <b>{deletingUnit.countR}</b> {t("modal.umHave3")} </p>
                )}
                {deletingUnit.countER > 0 && (
                    <p> {t("modal.umHave1")} <b>{deletingUnit.countER}</b> {t("modal.umHave4")} </p>
                )}
                {(deletingUnit.countP > 0 || deletingUnit.countR > 0 || deletingUnit.countER > 0) && (
                    <p>{t("modal.umHave5")}</p>
                )}
                {(deletingUnit.countP === 0 
                    && deletingUnit.countR === 0 
                    && deletingUnit.countER === 0 
                    ) && (
                        <p>{t("modal.confDelUM")}</p>
                    )
                }
            </Modal>
        </>
    );
}
 
export default Units;