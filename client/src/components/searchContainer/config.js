import { TABLES } from '../../constants';

export const options = () => {
    const optionsPositions = [
        { value: 'name', label: 'По названию' },
        { value: 'desc', label: 'По описанию' },
        { value: 'article', label: 'По артикулу' },
        { value: 'factory', label: 'По производителю' }
    ]
    const optionsRecords = [
        { value: 'desc_fact', label: 'По описанию завода' },
        { value: 'provider', label: 'По поставщику' },
        { value: 'date', label: 'По дате' }
    ]
    return (keyWord) => {
        switch (keyWord) {
            case TABLES.POSITION:
                return optionsPositions ;
            case TABLES.RECORD:
                return optionsRecords ;
            default:
                console.error('Unknown keyWord:', keyWord);
                return [];
        }
    };
}