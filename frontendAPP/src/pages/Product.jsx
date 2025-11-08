import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';


//First thing I need to do is start my function
const Product = () => {
    //I define my necessary params here
    const [products, setProducts] = useState([]); //because it's a list of products
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [state, setState] = useState(true);
    const [pageNumber, setPageNumber] = useState(1); //my default
    const [pageSize, setPageSize] = useState(10); //use default
    const [totalCount, setTotalCount] = useState(0);

    //For AJAX sort of action, the loading after user types
    const [loading, setLoading] = useState(false);
    //sort of reminds me of encapsulation

    //This for my dropdown stuff
    const [categories, setCategories] = useState([]);

    //This is mostly for my confirm dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    //Just for the rest
    const [error, setError] = useState('');


    //Now I call my API using axios
    const fetchProducts = async () => {
        setLoading(true);
        try {
            console.log('Fetching products with token:', localStorage.getItem('token')); // Debug

            const response = await api.get('Product/GetAllProducts', {
                params: {
                    search,
                    categoryId,
                    minPrice,
                    maxPrice,
                    state,
                    pageNumber,
                    pageSize
                }
            });

            console.log('Response received:', response); // Debug
            console.log('Response data:', response.data); // Debug

            //Ok, now that I have my response supposedly filled up with the JSON response
            //I will set my products array as the data inside my response

            const items = response.data.items || [];

            setProducts(items);
            setTotalCount(response.data.totalCount || 0);

            //My categories for my dropdown
            const categoryMap = new Map();
            items.forEach(product => {
                if (product.category) {
                    categoryMap.set(product.category.categoryId, product.category);
                }
            });
            setCategories(Array.from(categoryMap.values()));



        } catch (error) {
            console.error('Error getting products, please check the error: ', error);
            //I formerly had an alert, but, quite honestly, I hate it
        } finally {
            setLoading(false);  //If it didn't work, then it isn't loading!
            console.log(":D hello!");
        }
    }

    //Ok, enough playing around. Now, the initial load of data
    //This calls my functions every single time page number and page size changes!
    useEffect(() => {
        fetchProducts();
    }, [pageNumber, pageSize]);

    //And this calls my function every time search, categoryId or min/max price changae
    //All with a 500ms delay in between to give some time for my user to finish typing
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts();
        }, 500)

        return () => clearTimeout(delay);
    }, [search, categoryId, minPrice, maxPrice]);

    //total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    //Handle click on delete
    const handleDeleteClick = (id) => {
        setSelectedProductId(id);
        setShowConfirm(true);
    }

    //Call my API on delete
    const confirmDelete = async () => {
        setError('');
        try {

            await api.delete(`Product/DeleteProduct/${selectedProductId}`);

        } catch (error) {
            console.log("Error eliminando producto", error);
            setError('No se pudo eliminar el producto!')
        } finally {
            setShowConfirm(false);
            setSelectedProductId(null);
        }
    }


    //Defining items for table

    const headers = ['ID', 'Nombre', 'Categoría', 'Precio', 'IVA', 'Stock', 'Imágen', 'Estado']

    const data = products.map(p => [
        p.productId,
        p.name,
        p.category.name,
        `₡${p.price.toFixed(2)}`,
        `${p.taxPercentage}%`,
        p.stock,
        p.image,
        p.state ? 'Activo' : 'Inactivo'
    ]);

    //Okay, make the filters work..

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5 dark:text-gray-50">Productos</h2>

            {/* Filters */}

            <div>
                <input
                    className=""
                    type="text"
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageNumber(1);
                    }}
                />

                <select className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={categoryId}
                    onChange={(e) => {
                        setCategoryId(e.target.value);
                        setPageNumber(1);
                    }}
                >
                    <option value="">Todas las Categorías</option>
                    {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder='MinPrice'
                    value={minPrice}
                    onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPageNumber(1);
                    }}

                />
                <input
                    type="number"
                    placeholder='MaxPrice'
                    value={maxPrice}
                    onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPageNumber(1);
                    }}

                />
            </div>
            {/* Table goes here, reuse my table component - If loading is null, then display message */}
            {
                loading ? (
                    <p>Loading...</p>
                ) : (

                    <Table
                        headers={headers}
                        data={data}
                        emptyMessage="No se encontraron productos"
                        onDelete={handleDeleteClick}
                    />
                )}


            {/*Pagination goes heeeerrr */}
            <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={(newPage) => setPageNumber(newPage)}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setPageNumber(1);
                }}
                pageSizeOptions={[5, 10, 25, 50]}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                message="¿Seguro que deseas eliminar este producto?"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
};


export default Product;