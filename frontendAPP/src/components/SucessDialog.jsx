//This is my great very great success dialog that I am going to do very poorly because I am not very good at this
import React from "react";

//Simple, doesn't actually need any parameters more than 'isOpen' and 'onClose'

const SuccessDialog = ({ isOpen, onClose }) => {
    //if my dialog isn't opened, don't return this, don't show this!!!!
    if (!isOpen) {
        return null;
    } //else

    return (
        <>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 h-80 text-center">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <span className="text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </span>


                    </div>
                    <br />

                    <h1 className="text-gray-900 text-2xl font-semibold dark:text-white mb-2">

                        Éxito!
                    </h1>
                    <p className="mb-6 text-gray-900 dark:text-gray-50">Su acción fue procesada con éxito!</p>
                    <div className="flex justify-center gap-4">
                        <button className="py-2 px-4 bg-indigo-500 rounded-xl" onClick={onClose}>Entendido</button>
                    </div> 
                </div>
            </div>

        </>
    )
};

export default SuccessDialog;