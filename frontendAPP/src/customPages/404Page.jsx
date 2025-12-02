import React from "react";

const PageNotFound = () => {
    return (
        <div className="text-center mt-60">
            <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                <span className="underline underline-offset-3 decoration-8 decoration-[#bb70e7] dark:decoration-[#b770e7] text-transparent bg-clip-text bg-linear-to-r to-[#ae6fff] from-[#5a83ff] dark:bg-clip-text dark:bg-linear-to-r dark:to-[#d9bcff] dark:from-[#90abff]">
                    404 Error
                </span>
            </h2>
            <p className="mb-4 mt-5 text-xl font-semibold">Oops! La página que busca no existe!</p>
        </div>
    );
};

export default PageNotFound;