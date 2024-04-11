import React, { useState } from 'react';
import { Input, Cascader } from 'antd';
import { useTranslation } from 'react-i18next';
const { Search } = Input;

const SearchContainer = ({ options, onSearch, indexR }) => {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('');
    const [selectedOption, setSelectedOption] = useState([]);

    const handleSearch = () => {
        //console.log(!!indexR)
        // Проверяем наличие значения value и option
        if (selectedOption?.length > 0 && searchValue.trim()) {
            // Выполняем поиск только если оба условия выполняются
            if (indexR || indexR===0) {
                onSearch({
                    value: searchValue.trim(),
                    option: selectedOption[0],
                    indexR
                });
            } else {
                onSearch({
                    value: searchValue.trim(),
                    option: selectedOption[0],
                    indexR: null
                });
            }
        } else if(!selectedOption?.length && !searchValue.trim()) {
            if (indexR || indexR===0) {
                onSearch({
                    value: null,
                    option: null,
                    indexR
                });
            } else {
                onSearch({
                    value: null,
                    option: null,
                    indexR: null
                });
            }
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