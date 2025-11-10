import React from 'react';

//Reusable Table Component
function Table({ headers, data, emptyMessage = "No se encontraron resultados", onDelete, onEdit, onDetail, imageColumns = [] }) {

    const hasActions = onDelete || onEdit || onDetail;
    
    //Helper function to check if a column should render as an image
    const isImageColumn = (cellIndex) => {
        return imageColumns.includes(cellIndex);
    };
    
    // Helper function to render cell content
    const renderCellContent = (cell, cellIndex) => {
        if (isImageColumn(cellIndex)) {
            //Render image if the column is marked as an image column
            return cell ? (
                <img 
                    src={cell} 
                    alt="Producto" 
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg'; //me when I don't have a placeholder.....eyet
                    }}
                />
            ) : (
                <span className="text-gray-400">Sin imágen</span>
            );
        }
        return cell;
    };
    
    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#363850] dark:text-gray-400">
                    <tr>
                        {/* This stuff just tells my table to show Actions button only if on Delete is present */}
                        {
                            hasActions && (
                                <th scope="col" className="px-6 py-3">
                                    Acciones
                                </th>
                            )}
                        {headers.map((header, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr className="bg-white dark:bg-gray-800">
                            <td colSpan={headers.length + (hasActions ? 1 : 0)} className="px-6 py-4 text-center">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                            >
                                {
                                    hasActions && (
                                        <td className="px-6 py-4 text-center space-x-2">
                                            {onDelete &&
                                                <button onClick={() => onDelete(row[0])} className='text-red-600 hover:text-red-800'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            }
                                            {
                                                onEdit &&
                                                <button
                                                    onClick={() => onEdit(row[0])}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                            }
                                            {onDetail &&
                                                <button
                                                    onClick={() => onDetail(row[0])}
                                                    className='text-cyan-500 hover:text-cyan-800'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>
                                            }
                                        </td>
                                    )
                                }
                                {row.map((cell, cellIndex) => (
                                    cellIndex === 0 ? (
                                        <th
                                            key={cellIndex}
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {renderCellContent(cell, cellIndex)}
                                        </th>
                                    ) : (
                                        <td key={cellIndex} className="px-6 py-4">
                                            {renderCellContent(cell, cellIndex)}
                                        </td>
                                    )
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;