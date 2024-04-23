import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Input, DatePicker, InputNumber, Divider, Tooltip, Checkbox, AutoComplete } from 'antd';
import { CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ROUTES } from '../../constants';
import { Button, Spin, notification } from '../../components/common/index';
import { fetchUMs, createUM } from '../../http/umAPI';
import { createRecord, fetchOneRecord, editRecord } from '../../http/recordsAPI';
import { fetchOnePosition, editPosition } from '../../http/positionsAPI';
import { fetchExtractRecords } from '../../http/extractRecordsAPI';
import dayjs from 'dayjs'; // Import dayjs library
import './style.scss';

const { Title } = Typography;

const RecordConstructor = ({update}) => {
    const { id } = useParams(); // id позиции для которой создаются записи
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Определяем минимальную и максимальную даты
    const minDate = dayjs().subtract(5, 'year');
    const maxDate = dayjs().add(1, 'year');

    const [loading, setLoading] = useState(false);
    const [copyFromPrevious, setCopyFromPrevious] = useState(false);
    const [recordIndex, setRecordIndex] = useState(null);
    const [positionData, setPositionData] = useState({
        quantity: 0,
        um: {
            name: ''
        }
    });
    const [formDataArray, setFormDataArray] = useState([{
        desc_fact: '',
        quantity: 0,
        um: '',
        quantity_um: 1,
        provider: '',
        date: dayjs(), 
    }]);
    const [ums, setUMs] = useState([]);

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
            um: positionData.um.name,
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
            // Проверка на наличие пустых полей в formDataArray
            const hasEmptyFields = formDataArray.some(formData => {
                return Object.values(formData).some(value => value === '' || value === null || value === undefined);
            });
            if (hasEmptyFields) {
                throw new Error(t("recordConstructor.errTitle"));
            }
            let totalQuantity = 0; // Сумма произведений quantity * quantity_um
            let newQuantity = positionData.quantity;
            if (update) {
                const response = await fetchExtractRecords(null, null, null, { recordsId: [id] });
                const totalExistingQuantity = response.rows.reduce((acc, row) => acc + (row.quantity * row.quantity_um), 0);
                // Проверка условия
                if (formDataArray[0].quantity * formDataArray[0].quantity_um < totalExistingQuantity) {
                    throw new Error(t("recordConstructor.errTitle2"));
                }
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
                let foundUM = ums.find(um => um.name === formData.um);
                if (!foundUM) {
                    foundUM = await createUM({ name: formData.um });
                    setUMs(prevUMs => [...prevUMs, foundUM]);
                }
                data.umId = foundUM.id;
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

            // Обновление состояния positionData с новым значением quantity
            setPositionData(prevPositionData => ({
                ...prevPositionData,
                quantity: newQuantity
            }));

            // Очистить поля после успешной отправки
            if (!update) setFormDataArray([{
                desc_fact: '',
                quantity: 0,
                um: positionData.um.name,
                quantity_um: 1,
                provider: '',
                date: dayjs(), 
            }]);
            notification({
                type: 'success',
                message: t("notification.success"),
                description: t("notification.successDesc4"),
            });
        } catch (error) {
            console.error('Ошибка при отправке записи:', error);
            notification({
                type: 'error',
                message: t("notification.error"),
                description: error.message || t("notification.errorDesc6"),
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
                const response = await fetchUMs();
                setUMs(response);
                if (update) {
                    const recordData = await fetchOneRecord(id);
                    recordData.date = dayjs(recordData.date);
                    positionData = await fetchOnePosition(recordData.positionId)
                    setRecordIndex(positionData.records.findIndex(record => record.id == id))
                    setFormDataArray([recordData]); // Установка данных записи
                    setFormDataArray(prevState => prevState.map(formData => ({
                        ...formData,
                        um: recordData.um.name // устанавливаем um из полученных данных о позиции
                    })));
                } else {
                    positionData = await fetchOnePosition(id);
                    // Установка значения um в formDataArray
                    setFormDataArray(prevState => prevState.map(formData => ({
                        ...formData,
                        um: positionData.um.name // устанавливаем um из полученных данных о позиции
                    })));
                }
                setPositionData(positionData); // Установка названия позиции в состояние
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                notification({
                    type: 'error',
                    message: t("notification.error"),
                    description: t("notification.errorDesc7"),
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
                                    <Title>{t("recordConstructor.titleNew")}{' '}
                                        <u style={{ color: '#1890ff' }}>{positionData.name}</u>
                                    </Title>
                                </div>
                            )
                            :(
                                <div className='title-container-create'>
                                    <Title>{t("recordConstructor.titleUpdate")}{' '}
                                        <u style={{ color: '#1890ff' }}>№{recordIndex + 1} - {positionData.name}</u>
                                    </Title>
                                </div>
                            )
                        }
                        {formDataArray.map((formData, index) => (
                            <div className="record-constructor-container" key={index}>
                                <div className="form-group">
                                    <label>{t("recordConstructor.desc_fact")}:</label>
                                    <Input.TextArea 
                                        placeholder={t("positionConstructor.enter") + " " + t("recordConstructor.desc_fact_")}
                                        value={formData.desc_fact} 
                                        onChange={e => handleInputChange(index, 'desc_fact', e.target.value)} 
                                        style={{ height: '20px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t("recordConstructor.quantity")}:</label>
                                    <InputNumber
                                        type='number'
                                        value={formData.quantity}
                                        onChange={value => handleInputChange(index, 'quantity', value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t("recordConstructor.um")}:</label>
                                    <AutoComplete
                                        options={ums.map(um => ({
                                            value: um.name,
                                            label: um.name
                                        }))}
                                        placeholder={t("positionConstructor.choose") + " " + t("table-info.um,name")}
                                        value={formData.um}
                                        onChange={
                                            value => {
                                                handleInputChange(index, 'um', value)
                                                if (formData.um === positionData.um.name){
                                                    handleInputChange(index, 'quantity_um', 1 );
                                                }
                                            }
                                        }
                                        filterOption={(inputValue, option) =>
                                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t("recordConstructor.quantity_um")}:</label>
                                    <InputNumber
                                        type='number'
                                        value={formData.quantity_um}
                                        onChange={value => handleInputChange(index, 'quantity_um', value)}
                                        disabled={formData.um === positionData.um.name}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t("recordConstructor.provider")}:</label>
                                    <Input.TextArea 
                                        placeholder={t("positionConstructor.enter") + " " + t("recordConstructor.provider_")}
                                        value={formData.provider} 
                                        onChange={e => handleInputChange(index, 'provider', e.target.value)} 
                                        style={{ height: '20px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t("recordConstructor.date")}:</label>
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
                                        {t("recordConstructor.recordNum")}: <b style={{ color: '#1890ff' }}>{index + 1}</b>
                                        <Tooltip title={t("recordConstructor.remRec")}>
                                            <Button 
                                                type="danger" 
                                                icon={<CloseCircleOutlined  style={{ color: 'red', fontSize: '18px' }}/>}
                                                onClick={() => removeRecord(index)}
                                            />
                                        </Tooltip>
                                    </Divider>
                                ):(
                                    <>
                                    <Button type='default' onClick={handleBack} text={t("recordConstructor.backToPos")}/>
                                    <Button type="primary" onClick={handleSubmit} text={t("positionConstructor.save")}/>
                                    </>
                                )}
                            </div>
                        ))}
                        {!update &&(<div className="buttons-container">
                            <Button type='default' onClick={addNewRecord} text={t("recordConstructor.addRec")} />
                            <Checkbox checked={copyFromPrevious} onChange={(e) => setCopyFromPrevious(e.target.checked)}>{t("recordConstructor.copy")}</Checkbox> 
                            <Button type="primary" onClick={handleSubmit} text={t("positionConstructor.save")} />
                        </div>)}
                    </>
                )
            }
        </>
    );
};

export default RecordConstructor;