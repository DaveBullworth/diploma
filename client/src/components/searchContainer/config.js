import { TABLES } from '../../constants';
import i18n from "../../i18n"


export const options = () => {
    const optionsPositions = [
        { value: 'name', label: i18n.t("searchContainer.field.name") },
        { value: 'desc', label:  i18n.t("searchContainer.field.desc") },
        { value: 'article', label:  i18n.t("searchContainer.field.article") },
        { value: 'factory', label:  i18n.t("searchContainer.field.factory") }
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