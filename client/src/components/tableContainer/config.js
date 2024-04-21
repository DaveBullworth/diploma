import {Tag, Space, Tooltip} from 'antd';
import { TABLES } from '../../constants';
import { PlayCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons';
import i18n from "../../i18n";

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
            title: i18n.t("table-columns.category"),
            dataIndex: ['category', 'name'], 
            key: 'category',
            ...filterCategoriesOrUsers(TABLES.POSITION)
        },
        {
            title:  i18n.t("table-columns.name"),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title:  i18n.t("table-columns.desc"),
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title:  i18n.t("table-columns.article"),
            dataIndex: 'article',
            key: 'article',
        },
        {
            title:  i18n.t("table-columns.factory"),
            dataIndex: 'factory',
            key: 'factory',
        },
        {
            title:  i18n.t("table-columns.quantity"),
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: { multiple: 1 }, // Добавляем флаг сортировки
            sortOrder: sort.quantity, // Устанавливаем порядок сортировки
        },
        {
            title:  i18n.t("table-columns.um"),
            dataIndex: ['um', 'name'],
            key: 'um',
        },
        {
            title:  i18n.t("table-columns.shortage"),
            dataIndex: 'quantity_min',
            key: 'shortage',
            render: (quantity_min, record) => {
                if (quantity_min >= record.quantity) {
                    return <Tag color="red">{i18n.t("table-columns.low")}</Tag>;
                } else {
                    return null; // Нет дефицита, не отображаем тег
                }
            },
            sorter: { multiple: 2 }, // Добавляем флаг сортировки
            sortOrder: sort.quantity_min, // Устанавливаем порядок сортировки
        },
        {
            title: i18n.t("table-columns.action"),
            key: 'action',
            render: (text, record) => (
                <Space className="ActionIcons" size="small">
                    <Tooltip title={i18n.t("table-columns.tooltip.show")}>
                        <PlayCircleOutlined style={{ color: 'green', fontSize: '18px' }} onClick={() => handleShow(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.edit")}>
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.delete")}>
                        <DeleteOutlined style={{ color: 'red', fontSize: '18px' }} onClick={() => showConfirm(record.id, record.name)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.newRecord")}>
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: i18n.t("table-columns.user"),
            dataIndex: 'user',
            key: 'user',
            ...filterCategoriesOrUsers(TABLES.EXTRACT)
        },
        {
            title: i18n.t("extractsPage.noER"),
            dataIndex: 'extracts',
            key: 'extracts',
        },
        {
            title: i18n.t("table-columns.date"),
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
            title: i18n.t("table-columns.action"),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title={i18n.t("table-columns.tooltip.show")}>
                        <PlayCircleOutlined style={{ color: 'green', fontSize: '18px' }} onClick={() => handleShow(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.edit")}>
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.delete")}>
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
            title: i18n.t("table-columns.desc"),
            dataIndex: 'desc_fact',
            key: 'desc_fact',
        },
        {
            title: i18n.t("table-columns.quantity"),
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: i18n.t("extractConstructor.left"),
            dataIndex: 'left',
            key: 'left',
        },
        {
            title: i18n.t("table-columns.um"),
            dataIndex: ['um', 'name'],
            key: 'um',
        },
        {
            title: i18n.t("table-columns.QY"),
            dataIndex: 'quantity_um',
            key: 'quantity_um',
            render: (quantity_um, record) => {
                const displayQuantity = quantity_um !== 1 ?
                    `${i18n.t("table-columns.by")} ${quantity_um} ${i18n.t("table-columns.in")} 1 ${record.um.name}` 
                    : i18n.t("table-columns.apart");
                return displayQuantity;
            },
        },        
        {
            title: i18n.t("table-columns.provider"),
            dataIndex: 'provider',
            key: 'provider',
        },
        {
            title: i18n.t("table-columns.date"),
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
            title: i18n.t("table-columns.action"),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title={i18n.t("table-columns.tooltip.edit")}>
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.delete")}>
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
            title: i18n.t("table-columns.desc_pos"),
            dataIndex: ['record', 'position', 'desc'],
            key: 'desc',
        },
        {
            title: i18n.t("table-columns.desc_fact"),
            dataIndex: ['record', 'desc_fact'],
            key: 'desc_fact',
        },
        {
            title: i18n.t("table-columns.quantity"),
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: true,
            sortOrder: sort.quantity, // Устанавливаем порядок сортировки
        },
        {
            title: i18n.t("table-columns.um"),
            dataIndex: ['um', 'name'],
            key: 'um',
        },
        {
            title: i18n.t("table-columns.QY"),
            dataIndex: 'quantity_um',
            key: 'quantity_um',
            render: (quantity_um, record) => {
                const displayQuantity = quantity_um !== 1 ?
                    `${i18n.t("table-columns.by")} ${quantity_um} ${i18n.t("table-columns.in")} 1 ${record.um.name}` 
                    : i18n.t("table-columns.apart");
                return displayQuantity;
            },
        },
        {
            title: i18n.t("table-columns.user"),
            dataIndex: ['extract', 'user', 'login'],
            key: 'user',
        },
        {
            title: i18n.t("table-columns.project"),
            dataIndex: 'project',
            key: 'project',
        }
    ]

    const columnsOrders = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: i18n.t("table-columns.recordsNO"),
            dataIndex: 'records',
            key: 'records',
        },
        {
            title: i18n.t("table-columns.active"),
            dataIndex: 'active',
            key: 'active',
            sorter: true,
            render: (active) => (
                <Tag color={active ? 'green' : 'blue'}>
                   {active ? i18n.t("table-columns.activeTagTrue") : i18n.t("table-columns.activeTagFalse")} 
                </Tag>
            )
        },
        {
            title: i18n.t("table-columns.date"),
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
            title: i18n.t("table-columns.action"),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title={i18n.t("table-columns.tooltip.show")}>
                        <PlayCircleOutlined style={{ color: 'green', fontSize: '18px' }} onClick={() => handleShow(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.edit")}>
                        <EditOutlined style={{ color: 'blue', fontSize: '18px' }} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title={i18n.t("table-columns.tooltip.delete")}>
                        <DeleteOutlined style={{ color: 'red', fontSize: '18px' }} onClick={() => showConfirm(record.id, '#' + record.id)} />
                    </Tooltip>
                </Space>
            ),
        }
    ]

    const columnsOrderRecords = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: i18n.t("table-columns.desc_pos"),
            dataIndex: [ 'position', 'desc'],
            key: 'desc',
            ...getColumnSearchProps('position_desc'),
        },
        {
            title: i18n.t("table-columns.quantity"),
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: { multiple: 1 },
            sortOrder: sort.quantity, // Устанавливаем порядок сортировки
        },
        {
            title: i18n.t("table-columns.um"),
            dataIndex: [ 'position', 'um', 'name'],
            key: 'um',
        },
        {
            title: i18n.t("table-columns.active"),
            dataIndex: 'active',
            key: 'active',
            sorter: { multiple: 2 },
            sortOrder: sort.active, // Устанавливаем порядок сортировки
            render: (active) => (
                <Tag color={active ? 'green' : 'blue'}>
                   {active ? i18n.t("table-columns.activeTagTrue") : i18n.t("table-columns.activeTagFalse")} 
                </Tag>
            )
        },
    ]

    return (keyWord) => {
        switch (keyWord) {
            case TABLES.POSITION:
                if (!dataOut){
                    return columnsPositions.map(column => {
                        if (column.key == 'name' 
                            || column.key == 'desc' 
                            || column.key == 'article' 
                            || column.key == 'factory') {
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
                    if ( column.key == 'desc_fact' || column.key == 'provider' ) {
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
                        || column.key == 'project') {
                        return {
                            ...column,
                            ...getColumnSearchProps(column.dataIndex + '+'), 
                        };
                    }
                    return column;
                });
            case TABLES.ORDER:
                return columnsOrders
            case TABLES.ORDERRECORD:
                return columnsOrderRecords
            default:
                console.error('Unknown keyWord:', keyWord);
                return [];
        }
    };
}