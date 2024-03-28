import {Tag, Space, Tooltip} from 'antd';
import { TABLES } from '../../constants';
import { PlayCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons';

export const columns = (
            handleShow,
            handleEdit, 
            showConfirm, 
            handleForm, 
            handleRemoveRelated, 
            getColumnSearchProps, 
            filterCategoriesOrUsers,
            sort,
            getDateSearchProps,
            dataOut
        ) => 
{
    const columnsPositions = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'], 
            key: 'category',
            ...filterCategoriesOrUsers(TABLES.POSITION)
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'Article',
            dataIndex: 'article',
            key: 'article',
        },
        {
            title: 'Factory',
            dataIndex: 'factory',
            key: 'factory',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: { multiple: 1 }, // Добавляем флаг сортировки
            sortOrder: sort.quantity, // Устанавливаем порядок сортировки
        },
        {
            title: 'U.M.',
            dataIndex: 'um',
            key: 'um',
        },
        {
            title: 'Shortage',
            dataIndex: 'quantity_min',
            key: 'shortage',
            render: (quantity_min, record) => {
                if (quantity_min >= record.quantity) {
                    return <Tag color="red">LOW</Tag>;
                } else {
                    return null; // Нет дефицита, не отображаем тег
                }
            },
            sorter: { multiple: 2 }, // Добавляем флаг сортировки
            sortOrder: sort.quantity_min, // Устанавливаем порядок сортировки
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space className="ActionIcons" size="small">
                    <Tooltip title="Show">
                        <PlayCircleOutlined style={{ color: 'green', fontSize: '18px' }} onClick={() => handleShow(record.id)} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined style={{ color: 'red', fontSize: '18px' }} onClick={() => showConfirm(record.id, record.name)} />
                    </Tooltip>
                    <Tooltip title="New Record">
                        <FormOutlined style={{ color: 'black', fontSize: '18px' }} onClick={() => handleForm(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const columnsExtracts = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            ...filterCategoriesOrUsers(TABLES.EXTRACT)
        },
        {
            title: 'ID',
            dataIndex: 'extracts',
            key: 'extracts',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: date => {
                const formattedDate = new Date(date).toLocaleString(
                    'en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                        //, timeZone: 'UTC'
                    }
                );
                return formattedDate;
            },
            ...getDateSearchProps(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Show">
                        <PlayCircleOutlined style={{ color: 'green', fontSize: '18px' }} onClick={() => handleShow(record.id)} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined style={{ color: 'red', fontSize: '18px' }} onClick={() => showConfirm(record.id, record.user + '#' + record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const columnsRecords = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Description',
            dataIndex: 'desc_fact',
            key: 'desc_fact',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'U.M.',
            dataIndex: 'um',
            key: 'um',
        },
        {
            title: 'Q-Y',
            dataIndex: 'quantity_um',
            key: 'quantity_um',
            render: (quantity_um, record) => {
                const displayQuantity = quantity_um !== 1 ? `по ${quantity_um} в 1 ${record.um}` : 'отдельно';
                return displayQuantity;
            },
        },        
        {
            title: 'Provider',
            dataIndex: 'provider',
            key: 'provider',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: date => {
                const formattedDate = new Date(date).toLocaleString(
                    'en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                        //, timeZone: 'UTC'
                    }
                );
                return formattedDate;
            },
            ...getDateSearchProps(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined style={{ color: 'red', fontSize: '18px' }} onClick={() => showConfirm(record.id, record.desc_fact)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const columnsExtractRecords = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Description(Position)',
            dataIndex: ['record', 'position', 'desc'],
            key: 'desc',
        },
        {
            title: 'Description(Record)',
            dataIndex: ['record', 'desc_fact'],
            key: 'desc_fact',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: true,
            sortOrder: sort.quantity, // Устанавливаем порядок сортировки
        },
        {
            title: 'U.M.',
            dataIndex: ['record', 'um'],
            key: 'um',
        },
        {
            title: 'User',
            dataIndex: ['extract', 'user', 'login'],
            key: 'user',
        },
        {
            title: 'Project',
            dataIndex: 'project',
            key: 'project',
        }
    ]

    return (keyWord) => {
        switch (keyWord) {
            case TABLES.POSITION:
                if (!dataOut){
                    return columnsPositions.map(column => {
                        if (column.key == 'name' 
                            || column.key == 'desc' 
                            || column.key == 'article' 
                            || column.key == 'factory'
                            || column.key == 'um') {
                            return {
                                ...column,
                                ...getColumnSearchProps(column.dataIndex), 
                            };
                        }
                        return column;
                    });
                } else {
                    return columnsPositions.map(column => {
                        if (column.key === 'category') {
                            // Убираем фильтр из столбца "category"
                            return {
                                title: 'Category',
                                dataIndex: ['category', 'name'], 
                                key: 'category',
                            };
                        }
                        if (column.key === 'quantity' || column.key === 'shortage') {
                            // Убираем sorter из столбцов "quantity" и "shortage"
                            return {
                                ...column,
                                sorter: null,
                                sortOrder: null
                            };
                        }
                        return column;
                    });
                }
            case TABLES.RECORD:
                return columnsRecords.map(column => {
                    if ( column.key == 'desc_fact' || column.key == 'provider' || column.key == 'um') {
                        return {
                            ...column,
                            ...getColumnSearchProps(column.dataIndex + '-'),
                        };
                    }
                    return column;
                });
            case TABLES.POSITIONADD:
                return columnsPositions.map(column => {
                    if (column.key === 'action') {
                        return {
                            ...column,
                            render: (text, record) => (
                                <Space size="middle">
                                    <CloseOutlined style={{ color: 'red', fontSize: '18px' }} onClick={() => handleRemoveRelated(record.id)} />
                                </Space>
                            ),
                        };
                    }
                    if (column.key === 'category') {
                        // Убираем фильтр из столбца "category"
                        return {
                            title: 'Category',
                            dataIndex: ['category', 'name'], 
                            key: 'category',
                        };
                    }
                    if (column.key === 'quantity' || column.key === 'shortage') {
                        // Убираем sorter из столбцов "quantity" и "shortage"
                        return {
                            ...column,
                            sorter: null,
                            sortOrder: null
                        };
                    }
                    return column;
                });
            case TABLES.EXTRACT:
                return columnsExtracts
            case TABLES.EXTRACTRECORD:
                return columnsExtractRecords.map(column => {
                    if (column.key == 'desc' 
                        || column.key == 'desc_fact' 
                        || column.key == 'um' 
                        || column.key == 'project') {
                        return {
                            ...column,
                            ...getColumnSearchProps(column.dataIndex + '+'), 
                        };
                    }
                    return column;
                });
            default:
                console.error('Unknown keyWord:', keyWord);
                return [];
        }
    };
}