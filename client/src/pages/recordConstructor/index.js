import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Input, DatePicker, InputNumber, Divider, Tooltip, Checkbox } from 'antd';
import { CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ROUTES } from '../../constants';
import { Button, Spin, notification } from '../../components/common/index';
import { createRecord, fetchOneRecord, editRecord } from '../../http/recordsAPI';
import { fetchOnePosition, editPosition } from '../../http/positionsAPI';
import dayjs from 'dayjs'; // Import dayjs library
import './style.scss';

const { Title } = Typography;

const RecordConstructor = ({update}) => {
    const { id } = useParams(); // id позиции для которой создаются записи
    const navigate = useNavigate();
    // Определяем минимальную и максимальную даты
    const minDate = dayjs().subtract(5, 'year');
    const maxDate = dayjs().add(1, 'year');

    const [loading, setLoading] = useState(false);
    const [copyFromPrevious, setCopyFromPrevious] = useState(false);
    const [recordIndex, setRecordIndex] = useState(null);
    const [positionData, setPositionData] = useState({});
    const [formDataArray, setFormDataArray] = useState([{
        desc_fact: '',
        quantity: 0,
        um: '',
        quantity_um: 1,
        provider: '',
        date: dayjs(), 
    }]);

    const handleInputChange = (index, key, value) => {
        const newDataArray = [...formDataArray];
        newDataArray[index][key] = value;
        setFormDataArray(newDataArray);
    };

    const handleDateChange = (index, date) => {
        const newDataArray = [...formDataArray];
        newDataArray[index].date = date;
        setFormDataArray(newDataArray);
    };

    const addNewRecord = () => {
        const newData = copyFromPrevious ? { ...formDataArray[formDataArray.length - 1] } : {
            desc_fact: '',
            quantity: 0,
            um: positionData.um,
            quantity_um: 1,
            provider: '',
            date: dayjs(), 
        };

        setFormDataArray(prevState => [...prevState, newData]);
    };

    const removeRecord = (indexToRemove) => {
        setFormDataArray(prevState => prevState.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true)
            let totalQuantity = 0; // Сумма произведений quantity * quantity_um
            let newQuantity = positionData.quantity;
            if (update) {
                const record = await fetchOneRecord(id)
                const oldQuantity = record.quantity*record.quantity_um
                newQuantity -= oldQuantity
            }
            await Promise.all(formDataArray.map(async (formData) => {
                const data = {
                    ...formData,
                    date: formData.date.format('YYYY-MM-DD HH:mm:ss'), // Format date before sending
                    positionId: id
                };
                if (update) {
                    data.positionId = positionData.id
                    await editRecord(id, data);
                } else {
                    await createRecord(data);
                }
                totalQuantity += formData.quantity * formData.quantity_um;
            }));

            newQuantity += totalQuantity
            // Вызов функции редактирования позиции с новыми данными
            await editPosition(positionData.id, {quantity: newQuantity});

            // Очистить поля после успешной отправки
            if (!update) setFormDataArray([{
                desc_fact: '',
                quantity: 0,
                um: positionData.um,
                quantity_um: 1,
                provider: '',
                date: dayjs(), 
            }]);
            notification({
                type: 'success',
                message: 'Success!',
                description: 'New records added successfully!',
            });
        } catch (error) {
            console.error('Ошибка при отправке записи:', error);
            notification({
                type: 'error',
                message: 'Error!',
                description: 'Failed to add new records!',
            });
        } finally {
            setLoading(false)
        }
    };

    const handleBack = () => {
        navigate(ROUTES.POSITION.replace(':id', positionData.id));
    };

    useEffect(() => {
        // Функция для получения данных о позиции или записи
        const fetchData = async () => {
            try {
                let positionData = {};
                setLoading(true)
                if (update) {
                    const recordData = await fetchOneRecord(id);
                    recordData.date = dayjs(recordData.date);
                    positionData = await fetchOnePosition(recordData.positionId)
                    setRecordIndex(positionData.records.findIndex(record => record.id == id))
                    setFormDataArray([recordData]); // Установка данных записи
                } else {
                    positionData = await fetchOnePosition(id);
                    // Установка значения um в formDataArray
                    setFormDataArray(prevState => prevState.map(formData => ({
                        ...formData,
                        um: positionData.um // устанавливаем um из полученных данных о позиции
                    })));
                }
                setPositionData(positionData); // Установка названия позиции в состояние
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                notification({
                    type: 'error',
                    message: 'Error!',
                    description: 'Failed to fetch data!',
                });
            } finally {
                setLoading(false)
            }
        };

        fetchData(); // Вызов функции при монтировании компонента
    }, [id, update]); // Передаем id в зависимости, чтобы useEffect вызывался при изменении id

    return (    
            <>
                {loading ? ( // Check if loading is true
                    <Spin size="large" /> // Display Spin component if loading is true
                ) : (
                    <>
                        {!update ? (
                                <div className='title-container-update'>
                                    <ArrowLeftOutlined 
                                        className="back-icon" 
                                        style={{ color: 'green', fontSize: '28px' }} 
                                        onClick={() => navigate(ROUTES.POSITION.replace(':id', id))}
                                    />
                                    <Title>Добавление записей для позиции{' '}
                                        <u style={{ color: '#1890ff' }}>{positionData.name}</u>
                                    </Title>
                                </div>
                            )
                            :(
                                <div className='title-container-create'>
                                    <Title>Изменение записи{' '}
                                        <u style={{ color: '#1890ff' }}>№{recordIndex + 1} - {positionData.name}</u>
                                    </Title>
                                </div>
                            )
                        }
                        {formDataArray.map((formData, index) => (
                            <div className="record-constructor-container" key={index}>
                                <div className="form-group">
                                    <label>Описание с завода:</label>
                                    <Input.TextArea 
                                        placeholder="Введите описание с завода" 
                                        value={formData.desc_fact} 
                                        onChange={e => handleInputChange(index, 'desc_fact', e.target.value)} 
                                        style={{ height: '20px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Поступившее количество:</label>
                                    <InputNumber
                                        type='number'
                                        value={formData.quantity}
                                        onChange={value => handleInputChange(index, 'quantity', value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Единица измерения:</label>
                                    <Input 
                                        placeholder="Введите единицу измерения" 
                                        value={formData.um} 
                                        onChange={e => handleInputChange(index, 'um', e.target.value)} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Множитель (количество единиц измерения):</label>
                                    <InputNumber
                                        type='number'
                                        value={formData.quantity_um}
                                        onChange={value => handleInputChange(index, 'quantity_um', value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Поставщик:</label>
                                    <Input.TextArea 
                                        placeholder="Введите поставщика" 
                                        value={formData.provider} 
                                        onChange={e => handleInputChange(index, 'provider', e.target.value)} 
                                        style={{ height: '20px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Дата поставки:</label>
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        value={formData.date}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onChange={date => handleDateChange(index, date)}
                                    />
                                </div>
                                {!update ?(
                                    <Divider>
                                        Порядковый номер добавляемой записи: <b style={{ color: '#1890ff' }}>{index + 1}</b>
                                        <Tooltip title='Убрать запись'>
                                            <Button 
                                                type="danger" 
                                                icon={<CloseCircleOutlined  style={{ color: 'red', fontSize: '18px' }}/>}
                                                onClick={() => removeRecord(index)}
                                            />
                                        </Tooltip>
                                    </Divider>
                                ):(
                                    <>
                                    <Button type='default' onClick={handleBack} text='Вернуться к позиции'/>
                                    <Button type="primary" onClick={handleSubmit} text='Сохранить'/>
                                    </>
                                )}
                            </div>
                        ))}
                        {!update &&(<div className="buttons-container">
                            <Button type='default' onClick={addNewRecord} text='Ещё запись' />
                            <Checkbox checked={copyFromPrevious} onChange={(e) => setCopyFromPrevious(e.target.checked)}>скопировать предыдущую</Checkbox> 
                            <Button type="primary" onClick={handleSubmit} text='Сохранить' />
                        </div>)}
                    </>
                )
            }
        </>
    );
};

export default RecordConstructor;