import React from 'react';

//Reusable Table Component
function Table({ headers, data, emptyMessage = "No se encontraron resultados", onDelete }) {
    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {/* This stuff just tells my table to show Actions button only if on Delete is present */}
                        {
                            onDelete && (
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
                            <td colSpan={headers.length} className="px-6 py-4 text-center">
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
                                    onDelete && (
                                        <td className='px-6 py-4'>
                                            <button onClick={() => onDelete(row[0])} className='text-red-600 hover:text-red-800 font-semibold'>
                                                Eliminar
                                            </button>
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
                                            {cell}
                                        </th>
                                    ) : (
                                        <td key={cellIndex} className="px-6 py-4">
                                            {cell}
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