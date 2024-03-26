import React, { useState, useEffect } from 'react';
import { List, Space, Pagination, Typography, Input, Modal } from 'antd';
import { Spin, Button, notification } from '../../components/common/index';
import { EditOutlined, DeleteOutlined, WarningTwoTone, StopTwoTone } from '@ant-design/icons';
import { fetchCategorys, editCategory, deleteCategory } from "../../http/categorysAPI"; // Импортируем функцию для удаления категории
import { fetchPositions } from '../../http/positionsAPI';
import "./style.scss";

const { Title } = Typography;

const Categories = () => {
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
                message: 'Успех',
                description: `Категория ${oldCategoryName} успешно изменена.`,
            });
            setConfirmModalVisible(false);
            setEditCategory({});
            setOldCategoryName('');
            fetchData();
        } catch (error) {
            console.error('Error editing category:', error);
            notification({
                type: 'error',
                message: 'Ошибка',
                description: `Не удалось изменить категорию ${oldCategoryName}: ${error.message}`,
            });
        }
    };

    const handleDeleteCategory = async (category) => {
        setDeletingCategory(category); // Устанавливаем информацию о категории, которую пользователь собирается удалить
        setDeleteModalVisible(true);
    };

    return (
        <>
            <Title>Меню категорий</Title>
            {categories && categories.length > 0 ? (
                <>
                    <List
                        header={
                            <div className='category-list-info'>
                                <p style={{width:'6rem'}}><b>#</b></p>
                                <p><b>Name</b></p>
                                <p><b>N-O positions</b></p>
                            </div>
                        }
                        itemLayout="horizontal"
                        dataSource={categories.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <div className='category-list-info'>
                                            <p><u><b>{(currentPage - 1) * pageSize + index + 1}</b></u></p>
                                            <p>{item.name}</p> 
                                            <p>(Кол-во позиций: <b>{item.count}</b>)</p>
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
                                        onClick={() => handleDeleteCategory(item)} // Добавляем обработчик для удаления категории
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
                        Изменить категорию <u style={{color:'#1890ff'}}>{oldCategoryName}</u>
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
                        Вы уверены, что хотите изменить название категории "${oldCategoryName}" на "${editedCategory.name}"? Это приведет к изменению ${editedCategory.count} позиций.
                    </>
                }
                onOk={handleEditModalOk}
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
            />

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
                        Удаление категории
                    </>
                }
                onOk={async () => {
                    try {
                        await deleteCategory(deletingCategory.id);
                        notification({
                            type: 'success',
                            message: 'Успех',
                            description: `Категория ${deletingCategory.name} успешно удалена.`,
                        });
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        notification({
                            type: 'error',
                            message: 'Ошибка',
                            description: `Не удалось изменить категорию ${deletingCategory.name}: ${error.message}.`,
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
                    <p>У категории есть <b>{deletingCategory.count}</b> принадлежащих позиций. Удаление данной категории невозможно.</p>
                ) : (
                    <p>Вы уверены, что хотите удалить категорию "{deletingCategory.name}"?</p>
                )}
            </Modal>
        </>
    );
};

export default Categories;