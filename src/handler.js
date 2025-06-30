const { nanoid } = require('nanoid');
const books = require('./books');

// Menambahkan buku baru
const addBooks = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    // ❗ CASE 1: Gagal jika nama buku tidak diisi
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // ❗ CASE 2: Gagal jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // ✅ CASE 3: Tambah buku berhasil
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.find((book) => book.id === id);

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // ❌ CASE 4: Gagal jika push gagal karena alasan tak terduga
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// Mendapatkan semua buku (dengan filter optional)
const getAllBooks = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    // 🔍 CASE 1: Filter berdasarkan nama
    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((b) =>
            b.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // 🔍 CASE 2: Filter berdasarkan status membaca
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((b) => b.reading === !!Number(reading));
    }

    // 🔍 CASE 3: Filter berdasarkan status selesai dibaca
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((b) => b.finished === !!Number(finished));
    }

    // ✅ CASE 4: Menyusun data respon sukses
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

// Mendapatkan detail buku berdasarkan ID
const getBooksById = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((b) => b.id === bookId);

    // ✅ CASE 1: Buku ditemukan
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    // ❌ CASE 2: Buku tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Memperbarui data buku
const updateBookById = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // ❗ CASE 1: Gagal jika nama buku tidak diisi
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // ❗ CASE 2: Gagal jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    // ❌ CASE 3: Gagal jika ID buku tidak ditemukan
    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    // ✅ CASE 4: Update buku berhasil
    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished: pageCount === readPage,
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

// Menghapus buku berdasarkan ID
const deleteBookById = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    // ✅ CASE 1: Buku berhasil dihapus
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    // ❌ CASE 2: Buku tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBooks,
    getAllBooks,
    getBooksById,
    updateBookById,
    deleteBookById,
};
