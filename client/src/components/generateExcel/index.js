import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import 'xlsx-js-style';
import { useTranslation } from 'react-i18next';
import { fetchOneExtract } from '../../http/extractsAPI';
import { fetchExtractRecords } from '../../http/extractRecordsAPI';
import { Button } from '../common/index';

const ExcelGenerator = ({ id }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const generateStyle = (font, alignment) => {
        const style = {};
        // Проверяем наличие объекта font и добавляем его свойства в стиль
        if (font) {
            style.font = font;
        }
        // Проверяем наличие объекта alignment и добавляем его свойства в стиль
        if (alignment) {
            style.alignment = alignment;
        }
        return style;
    };

    const generateExcel = async () => {
        try {
            setLoading(true);
            const response1 = await fetchOneExtract(id);
            const response2 = await fetchExtractRecords(null, null, id)

            XLSX = require('xlsx-js-style');
            // Создаем новую книгу
            const wb = XLSX.utils.book_new();

            // Формируем данные для первого листа
            const data1 = [
                ["Данные по выписке #", "", response1.id],
                ["Дата выписки (от):", "", response1.date],
                ["Создана работником:", "", response1.user.name],
                ["Записи из выписки", "", "", "", "", "", "", ""],
                ["Номер", "Описание склада", "Описание поставки", "Количество", "Ед.Изм.(Выписки)", "Ед.Изм.(Поставки)", "Коэф-нт Позиции", "Проект"]
            ];

            response2.rows.forEach((row, index) => {
                data1.push([
                    index + 1,
                    row.record.position.desc,
                    row.record.desc_fact,
                    row.quantity,
                    row.um.name,
                    row.record.um.name,
                    row.quantity_um,
                    row.project
                ]);
            });

            // Создаем лист
            const ws1 = XLSX.utils.aoa_to_sheet(data1);

            // Стили
            ws1["A1"].s = generateStyle({ bold: true }, { horizontal: "center" });
            ws1["C1"].s = generateStyle(null, { horizontal: "center" });
            ws1["A2"].s = generateStyle(null,{horizontal: "right"})
            ws1["C2"].s = generateStyle(null, {horizontal: "left"})
            ws1["C2"].t = 'd';
            ws1["A3"].s = generateStyle(null,{horizontal: "right"})
            ws1["C3"].s = generateStyle({ italic: true }, null)
            ws1["A4"].s = generateStyle(null, { horizontal: "center" })
            Object.keys(ws1).forEach(cell => {
                if (cell.includes('5')) {
                    ws1[cell].s = generateStyle({ bold: true }, { horizontal: "center" }); // Замените yourStyle на ваш объект стиля
                }
            });
            Object.keys(ws1).forEach(cell => {
                if (parseInt(cell[1]) >= 6) {
                    ws1[cell].s = generateStyle(null, { horizontal: "center" }); // Применяем стиль к клеткам ниже или равно 5ой строке
                }
            });

            // Объединение ячеек A1, B1, C1
            ws1['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, 
                { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
                { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
            ];

            // Устанавливаем ширину столбцов
            ws1['!cols'] = [
                { width: 15 }, 
                { width: 20 },
                { width: 20 }, 
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