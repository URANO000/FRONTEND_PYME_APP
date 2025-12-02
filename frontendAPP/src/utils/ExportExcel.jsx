import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';

const ExportExcel = ({data,headers,workbookName, fileName}) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,worksheet, workbookName);
        XLSX.utils.sheet_add_aoa(worksheet, [headers], {origin: "A1"});

        //This is for exporting
        XLSX.writeFile(workbook,fileName, {compression: true});
    };

    return (
            <button
            onClick={exportToExcel}
                className="mb-5 ml-5  py-2 px-4 bg-blue-600 text-white hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl text-l">
                Exportar a Excel
            </button>
    );
};

export default ExportExcel;