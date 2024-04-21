import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2'; 
import { Typography, DatePicker } from 'antd';
import { fetchExtractRecords } from '../../http/extractRecordsAPI';
import { fetchRecords } from '../../http/recordsAPI';
import { Spin } from "../../components/common/index";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ChartPosition = ({ id }) => {
    const { t } = useTranslation();
    const [incomingData, setIncomingData] = useState(null);
    const [outgoingData, setOutgoingData] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await fetchRecords(null, null, id);
                const filter = { recordsId: response1.rows.map(item => item.id) };
                const response2 = await fetchExtractRecords(null, null, null, filter);
                setIncomingData(response1);
                setOutgoingData(response2);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    if (!incomingData || !outgoingData) {
        return <Spin/>;
    }

    const prepareChartData = () => {
        const toDate = dateString => new Date(dateString);
        const combinedData = [
            ...incomingData.rows.map(item => ({ x: toDate(item.date), y: item.quantity * item.quantity_um, label: true })),
            ...outgoingData.rows.map(item => ({ x: toDate(item.extract.date), y: item.quantity * item.quantity_um, label: false }))
        ];
    
        combinedData.sort((a, b) => a.x - b.x);
    
        const datasets = [];
        let currentValue = { x: null, y: 0, label: null, color: null };
        let quantity = 0;
    
        combinedData.forEach(point => {
            if (currentValue.x === null) {
                currentValue = { ...point };
                quantity = point.y
            } else {
                const lineColor = point.label ? 'green' : 'red';
                const label = point.label ? t("positionPage.receipts") : t("positionPage.expenses");

                let bufQuantity = 0;

                if(point.label) {
                    bufQuantity = quantity + point.y
                } else {
                    bufQuantity = quantity - point.y
                }

                datasets.push({
                    label: label,
                    data: [{ x: currentValue.x, y: quantity }, { x: point.x, y: bufQuantity }],
                    borderColor: lineColor,
                    fill: false,
                });
                
                if(point.label) {
                    quantity += point.y
                } else {
                    quantity -= point.y
                }
    
                currentValue = { ...point };
            }
        });
    
        return {
            labels: [],
            datasets: datasets
        };
    };               

    const chartData = prepareChartData();

    const handleDateChange = (dates) => {
        console.log(dates)
        const toDate = dateString => new Date(dateString);
        
        // Если массив dates пустой, устанавливаем selectedDates в null или пустой массив
        if (!dates) {
            setSelectedDates([]); // или setSelectedDates(null);
        } else {
            const transformedDates = dates.map(toDate); // Преобразование каждого элемента массива dates в дату
            setSelectedDates(transformedDates);
        }
    };    

    return (
        <div>
            <Title>{t("positionPage.chart")}</Title>
            <div style={{ height: '300px', width: '600px' }}>
                <Line
                    data={{
                        datasets: chartData.datasets,
                        labels: chartData.labels
                    }}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                
                                        // Проверяем, что есть предыдущая точка
                                        if (context.dataIndex > 0) {
                                            const previousY = context.chart.data.datasets[context.datasetIndex].data[context.dataIndex - 1].y;
                                            const currentY = context.parsed.y;
                                            let difference = currentY - previousY;
                                            if(difference>0) difference = '+' + difference
                                            label += t("positionPage.diff") + difference;
                                        } else if (context.datasetIndex === 0) {
                                            // Если точка первая
                                            label = t("positionPage.receipts") + t("positionPage.diff") + '+' + context.parsed.y;
                                        }
                                        
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day'
                                },
                                distribution: 'linear',
                                min: selectedDates[0], 
                                max: selectedDates[1] 
                            },
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }}
                />
            </div>
            <div style={{display: 'flex', justifyContent:'center', paddingTop: '1rem'}}>
                <RangePicker
                    showTime={{ format: 'HH:mm', minuteStep: 15 }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={handleDateChange}
                />
            </div>
        </div>
    );
};

export default ChartPosition;