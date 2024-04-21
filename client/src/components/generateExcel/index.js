import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import 'xlsx-js-style';
import { useTranslation } from 'react-i18next';
import { fetchOneExtract } from '../../http/extractsAPI';
import { fetchExtractRecords } from '../../http/extractRecordsAPI';
import { fetchOneRecord } from '../../http/recordsAPI';
import { Button } from '../common/index';

const ExcelGenerator = ({ id }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const generateExcel = async () => {
        try {
            setLoading(true);
            const response1 = await fetchOneExtract(id);
            const response2 = await fetchExtractRecords(null, null, id);
    
            // Создаем новую книгу
            const wb = XLSX.utils.book_new();
    
            // Формируем данные для первого листа
            const data1 = [
                ["Данные по выписке #", "", response1.id],
                ["Дата выписки (от):", "", response1.date],
                ["Создана работником:", "", response1.user.name],
                [""],
                ["Записи из выписки", "", "", "", "", "", "", ""],
                ["Номер", "Описание склада", "Описание поставки", "Количество", "Ед.Изм.", "Проект"]
            ];
    
            // Обработка каждой строки из response2.rows
            for (let row of response2.rows) {
                const record = await fetchOneRecord(row.recordId);
                const record_umName = record.um.name;
                const quantity_R = row.quantity * row.quantity_um / record.quantity_um;
                
                // Добавляем поля в объект row
                row.record_umName = record_umName;
                row.quantity_R = quantity_R;
                
                // Формируем данные для текущей строки
                const rowData = [
                    response2.rows.indexOf(row) + 1,
                    row.record.position.desc,
                    row.record.desc_fact,
                    row.quantity_R,
                    row.record_umName,
                    row.project
                ];
                
                // Добавляем текущую строку в данные
                data1.push(rowData);
            }
    
            // Создаем лист
            const ws1 = XLSX.utils.aoa_to_sheet(data1);
    
            // Объединение ячеек A1, B1, C1
            ws1['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, 
                { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
            ];

            // Устанавливаем ширину столбцов
            ws1['!cols'] = [
                { width: 15 }, 
                { width: 30 },
                { width: 30 }, 
                { width: 20 }, 
                { width: 20 }, 
                { width: 20 }, 
                { width: 20 }, 
                { width: 20 }
            ];
    
            // Добавляем лист к книге
            XLSX.utils.book_append_sheet(wb, ws1, "Информация о выписке");
    
            // Сохраняем книгу в файл
            XLSX.writeFile(wb, "отчёт_выписки_" + response1.id + ".xlsx");
        } catch (error) {
            console.error('Error generating Excel:', error);
        } finally {
            setLoading(false);
        }
    };    

    return (
        <Button onClick={generateExcel} disabled={loading} text={loading ? t("extractPage.genExcelLoading") : t("extractPage.genExcel")}/>
    );
};

export default ExcelGenerator;