const { addBooks,getAllBooks,getBooksById,updateBookById,deleteBookById, } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBooks,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBooksById,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookById,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById,
    },
];

module.exports = routes;