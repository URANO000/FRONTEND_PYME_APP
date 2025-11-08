import React, { useState } from 'react';

// Reusable Pagination Component
function Pagination({ 
    currentPage, 
    totalPages, 
    pageSize, 
    totalItems,
    onPageChange, 
    onPageSizeChange,
    pageSizeOptions = [5, 10, 25, 50]
}) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col items-center gap-4 py-4">
            {/* Help text */}
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Mostrando{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span>
                {' '}a{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span>
                {' '}de{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
                {' '}Registros
            </span>

            {/* Navigation and Page Size Selector */}
            <div className="flex items-center gap-4">
                {/* Buttons */}
                <div className="inline-flex">
                    <button 
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                    >
                        Anterior
                    </button>
                    <button 
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                    >
                        Siguiente
                    </button>
                </div>

                {/* Page Size Selector */}
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="h-10 px-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size} por página</option>
                    ))}
                </select>
            </div>
        </div>
    );
}


export default Pagination;