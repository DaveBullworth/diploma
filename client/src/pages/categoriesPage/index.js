import React, { useState, useEffect } from 'react';
import { List, Space, Pagination, Typography, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { Spin, Button, notification } from '../../components/common/index';
import { EditOutlined, DeleteOutlined, WarningTwoTone, StopTwoTone } from '@ant-design/icons';
import { fetchCategorys, editCategory, deleteCategory } from "../../http/categorysAPI"; // Импортируем функцию для удаления категории
import { fetchPositions } from '../../http/positionsAPI';
import "./style.scss";

const { Title } = Typography;

const Categories = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [editedCategory, setEditCategory] = useState({});
    const [oldCategoryName, setOldCategoryName] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Новое состояние для модального окна удаления
    const [deletingCategory, setDeletingCategory] = useState({}); // Новое состояние для хранения информации о категории, которую пользователь собирается удалить

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetchCategorys();
            const categoriesWithCounts = await Promise.all(
                response.map(async category => {
                    const positionsResponse = await fetchPositions(null, null, {categoryId: category.id});
                    return {...category, count: positionsResponse.count};
                })
            );
            setCategories(categoriesWithCounts);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const handleEditCategory = async (category) => {
        setEditModalVisible(true);
        setEditCategory(category);
        setOldCategoryName(category.name);
        setConfirmModalVisible(false);
    };

    const handleEditModalOk = async () => {
        try {
            await editCategory(editedCategory.id, { name: editedCategory.name });
            notification({
                type: 'success',
                message: t("notification.success"),
                description: `${t("table-columns.category")} ${oldCategoryName} ${t("notification.editSucc")}.`,
            });
            setConfirmModalVisible(false);
            setEditCategory({});
            setOldCategoryName('');
            fetchData();
        } catch (error) {
            console.error('Error editing category:', error);
            notification({
                type: 'error',
                message: t("notification.error"),
                description: `${t("notification.errorDesc8")} ${oldCategoryName}: ${error.message}`,
            });
        }
    };

    const handleDeleteCategory = async (category) => {
        setDeletingCategory(category); // Устанавливаем информацию о категории, которую пользователь собирается удалить
        setDeleteModalVisible(true);
    };

    return (
        <>
            <Title>{t("categoryPage.title")}</Title>
            {categories && categories.length > 0 ? (
                <>
                    <List
                        header={
                            <div className='category-list-info'>
                                <p style={{width:'6rem'}}><b>#</b></p>
                                <p><b>{t("table-columns.name")}</b></p>
                                <p><b>{t("categoryPage.no_pos")}</b></p>
                            </div>
                        }
                        itemLayout="horizontal"
                        dataSource={categories.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <div className='category-list-info'>
                                            <p style={{width:'6rem'}}><u><b>{(currentPage - 1) * pageSize + index + 1}</b></u></p>
                                            <p>{item.name}</p> 
                                            <p>({t("categoryPage.no_pos")}: <b>{item.count}</b>)</p>
                                        </div>
                                    }
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditCategory(item)}
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        danger
                                        onClick={() => handleDeleteCategory(item)} 
                                    />
                                </Space>
                            </List.Item>
                        )}
                        bordered
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={categories.length}
                        onChange={handlePageChange}
                        hideOnSinglePage
                    />
                </>
            ) : (
                <Spin size="large" />
            )}
            {/* Модальное окно для редактирования категории */}
            <Modal
                title={
                    <>
                        <WarningTwoTone twoToneColor="orange" style={{fontSize:'20px'}} />
                        {' '}
                        {t("modal.editCat")}<u style={{color:'#1890ff'}}>{oldCategoryName}</u>
                    </>
                }
                onOk={() => {
                    setConfirmModalVisible(true);
                    setEditModalVisible(false);
                }}
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
            >
                <Input type="text" value={editedCategory.name} onChange={(e) => setEditCategory(prevState => ({ ...prevState, name: e.target.value }))} />
            </Modal>
            {/* Модальное окно для подтверждения изменения категории */}
            <Modal
                title={
                    <>
                        <WarningTwoTone twoToneColor="orange" style={{fontSize:'20px'}} />
                        {' '}
                        {t("modal.confEditCat1")}
                    </>
                }
                onOk={handleEditModalOk}
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
            >
                <>
                    {t("modal.confEditCat2")} <b>"{oldCategoryName}"</b> {t("table-columns.on")} <b>"{editedCategory.name}"</b>? {t("modal.itWillLead")}  <b>{editedCategory.count}</b> {t("categoryPage.positions")}.
                </>
            </Modal>
            {/* Модальное окно для удаления категории */}
            <Modal
                title={
                    <>
                        {deletingCategory.count ? (
                            <StopTwoTone twoToneColor="red" style={{fontSize:'20px'}} />
                        ) : (
                            <WarningTwoTone twoToneColor="orange" style={{fontSize:'20px'}} />
                        )}
                        {' '}
                        {t("modal.delCat")}
                    </>
                }
                onOk={async () => {
                    try {
                        await deleteCategory(deletingCategory.id);
                        notification({
                            type: 'success',
                            message:  t("notification.success"),
                            description: `${t("table-columns.category")} ${deletingCategory.name} ${t("notification.successDesc3")}.`,
                        });
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        notification({
                            type: 'error',
                            message:  t("notification.error"),
                            description: `${t("notification.errorDesc8")} ${deletingCategory.name}: ${error.message}.`,
                        });
                    } finally {
                        fetchData();
                        setDeleteModalVisible(false);
                    }
                }}
                open={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                okButtonProps={{ style: { display: deletingCategory.count === 0 ? 'inline' : 'none' } }}
            >
                {deletingCategory.count > 0 ? (
                    <p>{t("modal.catHave1")} <b>{deletingCategory.count}</b> {t("modal.catHave2")}</p>
                ) : (
                    <p>{t("modal.confDelCat")} "{deletingCategory.name}"?</p>
                )}
            </Modal>
        </>
    );
};

export default Categories;