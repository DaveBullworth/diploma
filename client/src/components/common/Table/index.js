import React from 'react';
import { Table as AntTable } from 'antd';

const Table = ({ columns, ...restProps }) => {
  const modifiedColumns = columns.map((column) => ({
    ...column,
    align: 'center',
    showSorterTooltip: false
  }));

  return <AntTable {...restProps} columns={modifiedColumns} />;
};

Table.defaultProps = {
  bordered: true,
};

export default Table;