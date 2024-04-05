import React, { useState } from 'react';
import { Input, Cascader } from 'antd';
import { useTranslation } from 'react-i18next';
const { Search } = Input;

const SearchContainer = ({ options, onSearch }) => {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('');
    const [selectedOption, setSelectedOption] = useState([]);

    const handleSearch = () => {
        // Проверяем наличие значения value и option
        if (selectedOption?.length > 0 && searchValue.trim()) {
            // Выполняем поиск только если оба условия выполняются
            onSearch({
                value: searchValue.trim(),
                option: selectedOption[0]
            });
        } else if(!selectedOption?.length && !searchValue.trim()) {
            onSearch({
                value: null,
                option: null
            });
        } else {return}
    };    

    const handleInputChange = e => {
        setSearchValue(e.target.value);
    };

    const handleCascaderChange = value => {
        setSelectedOption(value);
    };

    const cascaderOption = (
        <Cascader
            style={{width:'15rem'}}
            options={options}
            onChange={handleCascaderChange}
            placeholder={t("searchContainer.chooseParam")}
        />
    );

    return (
        <Search
            placeholder={t("searchContainer.chooseText")}
            enterButton={t("searchContainer.search")}
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearch}
            addonBefore={cascaderOption}
        />
    );
};

export default SearchContainer;