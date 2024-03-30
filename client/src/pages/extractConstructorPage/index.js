import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Avatar, Typography, Input, InputNumber, DatePicker } from 'antd';
import { WarningTwoTone, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchOneUser } from '../../http/userAPI'
import { fetchPositions, fetchOnePosition, editPosition } from "../../http/positionsAPI"
import { fetchOneRecord, fetchRecords } from "../../http/recordsAPI"
import { createExtract, editExtract, fetchOneExtract, deleteExtract } from "../../http/extractsAPI"
import { createExtractRecord, deleteExtractRecord, fetchExtractRecords } from "../../http/extractRecordsAPI"
import { Button, Spin, notification, Modal } from '../../components/common/index';
import { options } from '../../components/searchContainer/config'
import { TABLES, ROUTES } from '../../constants';
import SearchContainer from '../../components/searchContainer';
import PositionModal from '../../components/modals/PositionModal';
import RecordModal from '../../components/modals/RecordModal';
import dayjs from 'dayjs'; 
import './style.scss'

const { Meta } = Card;
const { Title } = Typography;

const ExtractConstructor = ({update}) => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    // Определяем минимальную и максимальную даты
    const minDate = dayjs().subtract(5, 'year');
    const maxDate = dayjs().add(1, 'year');

    // Получение данных о текущем пользователе из Redux store
    const currentUserId = useSelector(state => state.user.user.id);

    const [creationDate, setCreationDate] = useState(dayjs())
    const [formDataArray, setFormDataArray] = useState([
        {
            project: '',
            quantity: 0,
            recordId: null,
            desc_fact: '',
            quantity_r: 0,
            quantity_left: 0,
            um: '',
            provider: '',
            date: ''
        }
    ]);
    const [currentUserInfo, setCurrentUserInfo] = useState({})
    const [extractUserInfo, setExtractUserInfo] = useState('')
    //////// для поиска нужной записи
    const [loading, setLoading] = useState(false);
    const [positionModalVisible, setPositionModalVisible] = useState(false);
    const [recordModalVisible, setRecordModalVisible] = useState(false);
    const [searchFilters, setSearchFilters] = useState({});
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [positions, setPositions] = useState([]);
    const [records, setRecords] = useState([]);
    const [positionPagination, setPositionPagination] = useState({ current: 1, pageSize: 2 });
    const [recordPagination, setRecordPagination] = useState({ current: 1, pageSize: 1 });
    const [totalResponse, setTotalResponse] = useState([0,0])
    // Хранение индекса текущего блока поиска
    const [currentSearchBlockIndex, setCurrentSearchBlockIndex] = useState(null); 

    const showConfirm = () => {
        const content = `Sure to delete: ${id} extract?`;
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
                message: 'Success!',
                description: `${id} extract deleted successfully!`,
            });
    
            navigate(ROUTES.EXTRACTS);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    };

    // Функция для открытия модального окна выбора позиции
    const showPositionModal = () => setPositionModalVisible(true);

    // Функция для закрытия модального окна выбора позиции
    const hidePositionModal = () => setPositionModalVisible(false);

    // Функция для обработки выбора позиции из модального окна
    const handleSelectPosition = (position) => {
        setSelectedPosition(position);
        setRecordPagination({ ...recordPagination, current: 1 }); 
        showRecordModal();
    };

    // Функция для открытия модального окна выбора записи
    const showRecordModal = () => setRecordModalVisible(true);

    // Функция для закрытия модального окна выбора записи
    const hideRecordModal = () => setRecordModalVisible(false);

    const handleSelectRecord = async (record) => {
        try {
            const updatedFormDataArray = formDataArray.map((formData, index) => {
                if (index === currentSearchBlockIndex) {
                    return {
                        ...formData,
                        recordId: record.id,
                        desc_fact: record.desc_fact,
                        quantity_r: record.quantity,
                        um: record.um,
                        provider: record.provider,
                        date: record.date,
                    };
                }
                return formData;
            });
            
            setFormDataArray(updatedFormDataArray);
    
            // Фильтрация записей выписки для получения суммарного количества использованных записей
            const filter = { recordsId: [record.id] };
            const response = await fetchExtractRecords(null, null, null, filter);
            
            // Суммирование количества использованных записей
            const quantity_gone = response.rows.reduce((total, extractRecord) => total + extractRecord.quantity, 0);
            
            // Обновление значения поля quantity_left
            const updatedFormDataArrayWithQuantityLeft = updatedFormDataArray.map(formData => {
                if (formData.recordId === record.id) {
                    return {
                        ...formData,
                        quantity_left: formData.quantity_r - quantity_gone // quantity_r - quantity_gone для каждого объекта
                    };
                }
                return formData;
            });
    
            setFormDataArray(updatedFormDataArrayWithQuantityLeft);
            hideRecordModal();
            hidePositionModal();
        } catch (error) {
            console.error('Error while handling record selection:', error);
            // Обработка ошибок
        }
    };    

    // Функция для загрузки списка позиций
    const fetchPositionsAndUpdateModal = useCallback(
        async (index, { value, option }) => {
            try {
                setCurrentSearchBlockIndex(index); // Устанавливаем текущий индекс блока поиска
                let response;
                setSearchFilters({ value, option })
                const filters = {};
                if (value !== undefined && option !== undefined && value !== null && option !== null) {
                    filters[option] = value;
                    response = await fetchPositions(positionPagination.current, positionPagination.pageSize, filters);
                } else {
                    response = await fetchPositions(positionPagination.current, positionPagination.pageSize);
                }
                setTotalResponse(prevState => [response.count, prevState[1]]);
                setPositions(response.rows);
                showPositionModal();
            } catch (error) {
                console.error('Error fetching positions:', error);
                // Обработка ошибки
            }
        },
        [positionPagination]
    );

    // Функция для загрузки списка записей
    const fetchRecordsAndUpdateModal = useCallback(
        async () => {
            try {
                const response = await fetchRecords(recordPagination.current, recordPagination.pageSize, selectedPosition.id);
                setTotalResponse(prevState => [prevState[0], response.count]);
                setRecords(response.rows);
                showRecordModal();
            } catch (error) {
                console.error('Error fetching records:', error);
                // Обработка ошибки
            }
        },
        [recordPagination, selectedPosition]
    );

    // useEffect для обновления содержимого модальных окон при изменении пагинации
    useEffect(() => {
        if (recordModalVisible) {
            fetchRecordsAndUpdateModal();
        } else if (positionModalVisible) {
            fetchPositionsAndUpdateModal(currentSearchBlockIndex, searchFilters);
        }
    }, [recordPagination, positionPagination, positionModalVisible, recordModalVisible]);

    /////////////////

    useEffect(() => {
        fetchCurrentUserInfo();
        if (update) {
            fetchExtractData();
            fetchExtractRecordsData();
        }
    }, []);

    const fetchExtractData = async () => {
        try {
            const response1 = await fetchOneExtract(id);
            const response2 = await fetchOneUser(response1.userId);
            setExtractUserInfo(response2.login)
            setCreationDate(dayjs(response1.date));
        } catch (error) {
            console.error('Error fetching extract data:', error);
        }
    };

    const fetchExtractRecordsData = async () => {
        try {
            const response2 = await fetchExtractRecords(null, null, id);
            const newDataArray = [];
            for (const ER of response2.rows) {
                const response3 = await fetchOneRecord(ER.recordId);
                const filter = { recordsId: [ER.recordId] };
                const response = await fetchExtractRecords(null, null, null, filter);
                const quantity_gone = response.rows.reduce((total, extractRecord) => total + extractRecord.quantity, 0);
                const data = {
                    project: ER.project,
                    quantity: ER.quantity,
                    recordId: ER.recordId,
                    desc_fact: response3.desc_fact,
                    quantity_r: response3.quantity,
                    quantity_left: response3.quantity - quantity_gone,
                    um: response3.um,
                    provider: response3.provider,
                    date: response3.date
                };
                newDataArray.push(data);
            }
            setFormDataArray(newDataArray);
        } catch (error) {
            console.error('Error fetching extract records data:', error);
        }
    };

    const fetchCurrentUserInfo = async () => {
        try {
            const response = await fetchOneUser(currentUserId);
            setCurrentUserInfo(response)
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    // Функция обработки изменения значения DatePicker
    const handleDateChange = (date) => {
        setCreationDate(date);
    };

    const handleInputChange = (index, value, field) => {
        const newFormDataArray = [...formDataArray];
        newFormDataArray[index][field] = value;
        setFormDataArray(newFormDataArray);
    };

    const addNewRecord = () => {
        setFormDataArray([
            ...formDataArray,
            {
                project: '',
                quantity: 0,
                recordId: null,
                desc_fact: '',
                quantity_r: 0,
                quantity_left: 0,
                um: '',
                provider: '',
                date: ''
            }
        ]);
    };

    const removeRecord = index => {
        const newFormDataArray = [...formDataArray];
        newFormDataArray.splice(index, 1);
        setFormDataArray(newFormDataArray);
    };

    const saveData = async() => {
        try {
            setLoading(true);
            let actionsExecuted = false;
            // Проверяем, нужно ли изменять выписку
            if (update) {
                // Получаем информацию о выписке
                const response1 = await fetchOneExtract(id);
                // Проверяем, создана ли выписка текущим пользователем
                if (response1.userId !== currentUserInfo.id) {
                    // Получаем информацию о пользователе, создавшем выписку
                    const response2 = await fetchOneUser(response1.userId);
                    // Показываем модальное окно с предупреждением
                    Modal.confirm({
                        title: 'Внимание',
                        icon: <WarningTwoTone twoToneColor="#faad14" />,
                        content: `Вы хотите изменить выписку, созданную другим пользователем (${response2.name}). Подтверждая, вы присвоите данную выписку себе (${currentUserInfo.name}).`,
                        okText: 'Подтверждаю',
                        cancelText: 'Отмена',
                        onOk: async () => {
                            // Продолжаем работу функции saveData
                            if (!actionsExecuted) {
                                actionsExecuted = true;
                            }
                            const extractData = {
                                date: creationDate,
                                userId: currentUserInfo.id
                            };
                            await editExtract(id, extractData);
                            await saveExtractRecordsData(id);
                            fetchExtractData();
                            fetchExtractRecordsData();
                            notification({
                                type: 'success',
                                message: 'Success!',
                                description: 'Extract modified successfully!',
                            });
                        },
                        onCancel: () => {
                            // Прерываем работу функции saveData
                            setLoading(false);
                        },
                    });
                    return; // Прерываем выполнение функции
                }
            }
    
            // Проверка наличия пустых записей в formDataArray при создании новой выписки
            if (!update && (formDataArray.length === 0 || formDataArray.some(formData => Object.values(formData).some(value => value === '' || value === null || value === 0)))) {
                throw new Error("Attempt to create extract with empty records");
            }
    
            // Проверка наличия записей с quantity больше, чем quantity_left
            if (formDataArray.some(formData => formData.quantity > formData.quantity_left)) {
                throw new Error("Attempt to " + (update ? "modify" : "create") + " extract with records exceeding available quantity");
            }
    
            let newExtract = {};
            const extractData = {
                date: creationDate,
                userId: currentUserInfo.id
            };
            if (update && !actionsExecuted) {
                await editExtract(id, extractData);
                await saveExtractRecordsData(id);
                fetchExtractData();
                fetchExtractRecordsData();
            } else {
                newExtract = await createExtract(extractData);
                await saveExtractRecordsData(newExtract.id);
            }
            if (!update) setFormDataArray([{
                project: '',
                quantity: 0,
                recordId: null,
                desc_fact: '',
                quantity_r: 0,
                quantity_left: 0,
                um: '',
                provider: '',
                date: ''
            }]);
            notification({
                type: 'success',
                message: 'Success!',
                description: 'Extract ' + (update ? 'modified' : 'created') + ' successfully!',
            });
        } catch (error) {
            console.error('Ошибка при ' + (update ? 'изменении' : 'создании') + ' выписки:', error);
            notification({
                type: 'error',
                message: 'Failed to ' + (update ? 'edit' : 'add') + ' extract!',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };    

    const saveExtractRecordsData = async (extractId) => {
        try {
            if (update) {
                const savedER = []; // Массив для хранения id сохраненных записей
                await Promise.all(formDataArray.map(async (formData) => {
                    const data = {
                        quantity: formData.quantity,
                        project: formData.project,
                        extractId: extractId,
                        recordId: formData.recordId,
                    };
        
                    // Проверяем существует ли запись в выписке с такими же данными
                    const response1 = await fetchExtractRecords(null, null, extractId);
                    const existingRecord = response1.rows.find(record => 
                        record.quantity === data.quantity && 
                        record.project === data.project &&
                        record.recordId === data.recordId
                    );
        
                    let recordIdToAdd;
                    if (existingRecord) {
                        recordIdToAdd = existingRecord.id;
                    } else {
                        // Создаем новую запись выписки
                        const response2 = await createExtractRecord(data);
                        recordIdToAdd = response2.id;
                    }
        
                    // Обновляем количество для соответствующей позиции
                    const recordExtractRecord = await fetchOneRecord(data.recordId);
                    const positionExtractRecord = await fetchOnePosition(recordExtractRecord.positionId);
                    const newQuantity = positionExtractRecord.quantity - (data.quantity * recordExtractRecord.quantity_um);
                    await editPosition(positionExtractRecord.id, { quantity: newQuantity });
        
                    savedER.push(recordIdToAdd); // Добавляем id сохраненной записи в массив
                }));

                // Получаем все записи выписки и обрабатываем те, которые были удалены
                const response3 = await fetchExtractRecords(null, null, extractId);
                const deleteER = response3.rows.filter(record => !savedER.includes(record.id));
                await Promise.all(deleteER.map(async (deleteRecord) => {
                    // Обновляем количество для соответствующей позиции
                    const recordExtractRecord = await fetchOneRecord(deleteRecord.recordId);
                    const positionExtractRecord = await fetchOnePosition(recordExtractRecord.positionId);
                    const newQuantity = positionExtractRecord.quantity + (deleteRecord.quantity * recordExtractRecord.quantity_um);
                    await editPosition(positionExtractRecord.id, { quantity: newQuantity });

                    // Удаляем запись
                    await deleteExtractRecord(deleteRecord.id);
                }));
            } else {
                await Promise.all(formDataArray.map(async (formData) => {
                    const data = {
                        quantity: formData.quantity,
                        project: formData.project,
                        extractId: extractId,
                        recordId: formData.recordId,
                    };
                    await createExtractRecord(data)
                    const recordExtractRecord = await fetchOneRecord(data.recordId)
                    const positionExtractRecord = await fetchOnePosition(recordExtractRecord.positionId);
                    const newQuantity = positionExtractRecord.quantity - (data.quantity*recordExtractRecord.quantity_um)
                    await editPosition(positionExtractRecord.id, {quantity: newQuantity});
                }));
            }
        } catch(error){
            console.error('Ошибка при ' + (update ? 'изменении' : 'создании') + ' записей выписки:', error);
            notification({
                type: 'error',
                message: 'Error!',
                description: 'Failed to ' + (update ? 'edit' : 'add') + ' extract records!',
            });
        }
    }

    return ( 
        <>
            {loading ? ( // Check if loading is true
                <Spin size="large" /> // Display Spin component if loading is true
            ) : (
                <div>
                    {/* Заголовок новой выписки */}
                    <Card title={
                        update ?
                        <span >
                            <ArrowLeftOutlined 
                                className="back-icon" 
                                style={{ color: 'green', fontSize: '28px' }} 
                                onClick={() => navigate(ROUTES.EXTRACTS)}
                            />
                            Изменить выписку <strong style={{color: '#1890ff'}}>#{id}</strong> пользователя <u style={{color: '#1890ff'}}>{extractUserInfo}</u> в качестве пользователя
                            <DeleteOutlined 
                                className="delete-icon" 
                                style={{ color: 'red', fontSize: '28px' }} 
                                onClick={() => showConfirm()} 
                            />
                        </span>
                        :
                        'Создать новую выписку в качестве пользователя:'}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                            title={
                                <div className='user-info-card-meta-block-container'>
                                    <div>
                                        <u style={{color: '#1890ff'}}>Login:</u>
                                        <span style={{marginLeft:'20px'}}>{currentUserInfo.login}</span>
                                    </div>
                                    <div className='right-allight'>
                                        <b style={{color: '#1890ff', marginRight:'65px'}}>ДАТА ВЫПИСКИ:</b>
                                    </div>
                                </div>
                            }
                            description={
                                <div className='user-info-card-meta-block-container'>
                                    <div>
                                        <u style={{color: '#1890ff'}}>Name:</u>
                                        <span style={{marginLeft:'20px'}}>{currentUserInfo.name}</span>
                                    </div>
                                    <div className='right-allight'>
                                        <span style={{marginRight:'25px'}}>
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                                value={creationDate} // Передача значения creationDate
                                                minDate={minDate}
                                                maxDate={maxDate}
                                                onChange={handleDateChange} // Передача функции handleDateChange
                                            />
                                        </span>
                                    </div>
                                </div>
                            }
                        />
                    </Card>
                    <div className="form-record">
                    {formDataArray.map((formData, index) => (
                        <div className="record" key={index}>
                            <div className="record-header">
                                <Title level={4}>Запись выписки <u style={{color:'#1890ff'}}>№{index + 1}</u></Title>
                                <Button danger type='default' onClick={() => removeRecord(index)}>
                                    Убрать эту запись
                                </Button>
                            </div>
                            <div style={{marginBottom:'1rem'}}>
                                <SearchContainer
                                    options={options()(TABLES.POSITION)} 
                                    onSearch={(value) => fetchPositionsAndUpdateModal(index, value)} // Добавляем передачу индекса блока поиска
                                />
                            </div>
                            <div className="record-body">
                                <div className="record-body-block" >
                                    <div className="input-field">
                                        <label>Название проекта:</label>
                                        <Input
                                            value={formData.project}
                                            onChange={e => handleInputChange(index, e.target.value, 'project')}
                                            placeholder="Название проекта"
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>
                                            {formData.recordId ? 'Количество ' : 'Количество'} 
                                            <span style={{ fontWeight: 'bold' }}>{formData.um}</span>:
                                        </label>
                                        <InputNumber
                                            type='number'
                                            value={formData.quantity}
                                            onChange={value => handleInputChange(index, value, 'quantity')}
                                            placeholder="Количество"
                                        />
                                    </div>
                                </div>
                                <div className="record-body-block">
                                    <Card
                                        title={formData.recordId ? formData.desc_fact : "Запись не выбрана"}
                                    >
                                        {formData.recordId ? (
                                            <>
                                                <p>
                                                    <b>Количество:</b> {formData.quantity_r}{" "}{formData.um}{" "}
                                                    <b>Остаток:</b> {formData.quantity_left}{" "}{formData.um}
                                                </p>
                                                <p><b>Поставщик:</b> {formData.provider}</p>
                                                <p><b>Дата поставки:</b> {new Date(formData.date).toLocaleString(
                                                    'en-GB', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: 'numeric', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    }
                                                )}</p>
                                            </>
                                        ) : (
                                            <p>Выберете запись для выписки</p>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ))}
                        <div className='action-btns'>
                            <Button 
                                type="primary" 
                                onClick={addNewRecord}
                            >
                                Добавить ещё запись
                            </Button>
                            <Button 
                                danger
                                type="primary" 
                                onClick={saveData} 
                                style={{ marginLeft: '10px' }}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                    <PositionModal
                        visible={positionModalVisible}
                        positions={positions}
                        onSelectPosition={handleSelectPosition}
                        onCancel={hidePositionModal}
                        pagination={positionPagination}
                        onPageChange={(page) => setPositionPagination({ ...positionPagination, current: page })}
                        total={totalResponse[0]}
                    />
                    <RecordModal
                        visible={recordModalVisible}
                        records={records}
                        onSelectRecord={handleSelectRecord}
                        onCancel={hideRecordModal}
                        pagination={recordPagination}
                        onPageChange={(page) => setRecordPagination({ ...recordPagination, current: page })}
                        total={totalResponse[1]}
                    />
                </div>
            )}
        </>
    );
}
 
export default ExtractConstructor;