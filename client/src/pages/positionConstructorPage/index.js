import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Typography, List, Pagination, Empty, AutoComplete, Modal } from 'antd';
import { PlusOutlined, CheckOutlined, ArrowLeftOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { notification, Button } from '../../components/common/index';
import { options } from '../../components/searchContainer/config'
import { fetchCategorys, createCategory } from '../../http/categorysAPI';
import { fetchPositions, fetchOnePosition, createPosition, editPosition } from '../../http/positionsAPI';
import { createPositionHierarchy, editPositionHierarchy, fetchPositionsHierarchy, deletePositionHierarchy } from '../../http/positionsHierarchyAPI';
import './style.scss';
import { TABLES, ROUTES } from '../../constants';
import SearchContainer from '../../components/searchContainer';
import TableContainer from "../../components/tableContainer"

const { Title } = Typography;

const PositionConstructor = ({update}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [inputValues, setInputValues] = useState({
        category: '',
        name: '',
        desc: '',
        article: null,
        factory: '',
        quantity: 0,
        um: 'шт.',
        quantity_min: 0
    });
    const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
    const [modalContent, setModalContent] = useState(null); // State to manage modal content
    const [searchFilters, setSearchFilters] = useState({});

    const handleEdit = () => {
        navigate(ROUTES.POSITION.replace(':id', id));
    }

    const handleInputChange = (key, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleAdd = (item) => {
        setSelectedPositions(prevState => [...prevState, item]);
    };

    const handleRemoveRelated = (id) => {
        setSelectedPositions(prevState => prevState.filter(item => item.id !== id));
    };

    const showModal = useCallback(() => {
        setModalVisible(true); // Set modal visibility to true
    }, []);

    const hideModal = useCallback(() => {
        setModalVisible(false); // Set modal visibility to false
    }, []);

    const fetchPositionsAndUpdateModal = useCallback(async ({ value, option }) => {
        try {
            let response;
            setSearchFilters({ value, option })
            const filters = {};
            if (value !== undefined && option !== undefined && value !== null && option !== null) {
                filters[option] = value;
                if (update) {
                    response = await fetchPositions(pagination.current, pagination.pageSize, filters, null, id);
                }
                else {
                    response = await fetchPositions(pagination.current, pagination.pageSize, filters);
                }
            } else {
                if (update) {
                    response = await fetchPositions(pagination.current, pagination.pageSize, null, null, id);
                } else {
                    response = await fetchPositions(pagination.current, pagination.pageSize);
                }
            }
            const modalContent = (
                <>
                    {response.rows.length === 0 ? (
                        <Empty description="There are no matches" />
                    ) : (
                        <>
                            <List
                                itemLayout="horizontal"
                                dataSource={response.rows}
                                renderItem={(item, index) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={<span>{((pagination.current - 1) * pagination.pageSize) + index + 1}. {item.desc}</span>}
                                            description={`Article: ${item.article}`}
                                        />
                                        {selectedPositions.some(selectedItem => selectedItem.id === item.id) ? (
                                            <CheckOutlined style={{ color: 'green' }} />
                                        ) : (
                                            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(item)} />
                                        )}
                                    </List.Item>
                                )}
                            />
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={response.count}
                                onChange={(page, pageSize) => setPagination({ ...pagination, current: page })}
                                showSizeChanger={false}
                                hideOnSinglePage={true}
                            />
                        </>
                    )}
                </>
            );
            setModalContent(modalContent); // Update modal content
            showModal(); // Show modal
        } catch (error) {
            console.error('Error fetching positions:', error);
            notification({
                type: 'error',
                message: 'Error!',
                description: 'Failed to fetch Positions data!',
            });
        }
    }, [pagination, selectedPositions, showModal]);

    useEffect(() => {
        const fetchPositionById = async () => {
            try {
                if (update) {
                    // Выполняем запрос только если id существует
                    const response = await fetchOnePosition(id);
                    // Заполняем inputValues данными из ответа
                    setInputValues({
                        category: response.category.name,
                        name: response.name,
                        desc: response.desc,
                        article: response.article,
                        factory: response.factory,
                        quantity: response.quantity,
                        um: response.um,
                        quantity_min: response.quantity_min
                    });
                    setSelectedPositions(response.ChildPositions)
                }
            } catch (error) {
                notification({
                    type: 'error',
                    message: 'Error!',
                    description: 'Failed to fetch Position data!',
                });
                console.error('Ошибка при получении позиции:', error);
            }
        };
    
        const fetchCategoriesData = async () => {
            try {
                const response = await fetchCategorys();
                setCategories(response);
            } catch (error) {
                notification({
                    type: 'error',
                    message: 'Error!',
                    description: 'Failed to fetch categorys!',
                });
                console.error('Ошибка при получении категорий:', error);
            }
        };
        fetchPositionById(); 
        fetchCategoriesData();
    }, [id]);

    // Добавляем useEffect для отслеживания изменений в пагинации и обновления контента модального окна
    useEffect(() => {
        // Этот эффект будет отслеживать изменения в пагинации и вызывать функцию для загрузки обновленного контента модального окна
        if(modalVisible)fetchPositionsAndUpdateModal(searchFilters);
    }, [pagination, selectedPositions]);

    const handleSubmit = async () => {
        try {
            let description = 'New Position added successfully!'
            const formData = {
                ...inputValues,
                selectedPositions: selectedPositions.map(position => position.id)
            };
    
            let foundCategory = categories.find(category => category.name === formData.category);
            if (!foundCategory) {
                foundCategory = await createCategory({ name: formData.category });
                setCategories(prevCategories => [...prevCategories, foundCategory]);
            }
    
            formData.categoryId = foundCategory.id;
    
            if(update) {
                const editedPosition = await editPosition(id, formData);

                description = `Position ${editedPosition.name} edited successfully!`
    
                const hierarchies = await fetchPositionsHierarchy(id);
    
                //существующие у позиции childId(старые)
                const existingChildIds = hierarchies.map(hierarchy => hierarchy.childId);
                //те childId из выбранных новых, которых нет сейчас у позиции
                const newSelectedPositions = formData.selectedPositions.filter(positionId => !existingChildIds.includes(positionId));
                //те childId(старые) у позиции которых нет в childId(новыe) которые надо изменить/удалить 
                const deletedHierarchyIds = hierarchies.filter(hierarchy => !formData.selectedPositions.includes(hierarchy.childId)).map(hierarchy => hierarchy.id);
                
                //если нету новых выбранных позиций, то удаляем старые childId, которые не были повторно выбраны
                //случай когда мы просто решили убрать какие-то позиции из ChildPosition
                if (newSelectedPositions.length === 0) {
                    if (deletedHierarchyIds.length > 0) {
                        for (const hierarchyId of deletedHierarchyIds) {
                            await deletePositionHierarchy(hierarchyId);
                        }
                    }
                    //если новых позиций на добавление(которых нет в ChildPositions) 
                    //меньше чем старых которые не выбраны заного(т.е. должны быть изменены/удалены)
                    //меняем по количеству новых старые, остальные старые удляем
                } else if (newSelectedPositions.length < deletedHierarchyIds.length) {
                    for (let i = 0; i < newSelectedPositions.length; i++) {
                        await editPositionHierarchy(deletedHierarchyIds[i], { parentId: editedPosition.id, childId: newSelectedPositions[i] });
                    }
                    deletedHierarchyIds.splice(0, newSelectedPositions.length);
                    for (const hierarchyId of deletedHierarchyIds) {
                        await deletePositionHierarchy(hierarchyId);
                    }
                    //если новых позиций на добавление(которых нет в ChildPositions) 
                    //больше чем старых которые не выбраны заного(т.е. должны быть изменены/удалены)
                    //меняем по количеству старых старые, остальные новые добавляем
                } else {
                    for (let i = 0; i < deletedHierarchyIds.length; i++) {
                        await editPositionHierarchy(deletedHierarchyIds[i],{ parentId: editedPosition.id, childId: newSelectedPositions[i] });
                    }
                    newSelectedPositions.splice(0, deletedHierarchyIds.length);
                    if (newSelectedPositions.length > 0) {
                        for (const selectedPositionId of newSelectedPositions) {
                            await createPositionHierarchy({ parentId: editedPosition.id, childId: selectedPositionId });
                        }
                    }
                }
            } else {
                const newPosition = await createPosition(formData);
    
                for (const selectedPositionId of formData.selectedPositions) {
                    await createPositionHierarchy({ parentId: newPosition.id, childId: selectedPositionId });
                }
            }
            if(!update){
                setInputValues({
                    category: '',
                    name: '',
                    desc: '',
                    article: null,
                    factory: '',
                    quantity: 0,
                    um: 'шт.',
                    quantity_min: 0
                })
            }
            notification({
                type: 'success',
                message: 'Success!',
                description: description,
            });
        } catch (error) {
            console.error('Error handling submit:', error);
            notification({
                type: 'error',
                message: 'Error!',
                description: 'Failed to add position!',
            });
        }
    };    

    return (
        <div className="position-constructor-container">
            <div className="position-constructor-title">
                {update &&(
                    <>
                        <ArrowLeftOutlined 
                            className="back-icon" 
                            style={{ color: 'green', fontSize: '28px' }} 
                            onClick={() => navigate(ROUTES.POSITIONS)}
                        />
                        <PlayCircleOutlined
                            className="edit-icon" 
                            style={{ color: 'green', fontSize: '28px' }} 
                            onClick={() => handleEdit()}
                        />
                    </>
                )}
                <Title>{update ? `Редактирование позиции ` : 'Создание новой позиции '}<u style={{ color: '#1890ff' }}>{inputValues.name}</u></Title>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Категория:</label>
                    <AutoComplete
                        options={categories.map(category => ({
                            value: category.name,
                            label: category.name
                        }))}
                        placeholder="Выберите категорию"
                        value={inputValues.category}
                        onChange={value => handleInputChange('category', value)}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                </div>
                <div className="form-group">
                    <label>Название:</label>
                    <Input 
                        placeholder="Введите название" 
                        value={inputValues.name} 
                        onChange={e => handleInputChange('name', e.target.value)} 
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Описание:</label>
                    <Input.TextArea 
                        placeholder="Введите описание" 
                        style={{ height: '18px' }} 
                        value={inputValues.desc} 
                        onChange={e => handleInputChange('desc', e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Артикул:</label>
                    <Input 
                        placeholder="Введите артикул" 
                        value={inputValues.article} 
                        onChange={e => handleInputChange('article', e.target.value)} 
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Производитель:</label>
                    <Input 
                        placeholder="Введите производителя" 
                        value={inputValues.factory} 
                        onChange={e => handleInputChange('factory', e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Количество:</label>
                    <Input 
                        type="number" 
                        placeholder="Введите количество" 
                        disabled={true}
                        value={inputValues.quantity} 
                        onChange={e => handleInputChange('quantity', e.target.value)} 
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Единица измерения:</label>
                    <Input 
                        defaultValue="шт." 
                        placeholder="шт." 
                        value={inputValues.um} 
                        onChange={e => handleInputChange('um', e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Минимальное количество:</label>
                    <Input 
                        type="number" 
                        placeholder="Введите минимальное количество" 
                        value={inputValues.quantity_min} 
                        onChange={e => handleInputChange('quantity_min', e.target.value)} 
                    />
                </div>
            </div>
            <div className="form-group full-width">
                <label>Принадлежности:</label>
                <SearchContainer options={options()(TABLES.POSITION)} onSearch={fetchPositionsAndUpdateModal} />
            </div>
            {selectedPositions.length > 0 &&
                <TableContainer
                    keyWord={TABLES.POSITIONADD}
                    dataOut={selectedPositions}
                    handleRemoveRelated={(id) => handleRemoveRelated(id)}
                />
            }
            <Button className="submit-btn" onClick={handleSubmit} text='Сохранить'/>

            {/* Render modal */}
            <Modal
                open={modalVisible}
                title="Search Results"
                onCancel={hideModal}
                footer={null}
            >
                {modalContent}
            </Modal>
        </div>
    );
}

export default PositionConstructor;