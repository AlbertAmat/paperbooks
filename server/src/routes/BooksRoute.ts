import {Router, Request, Response} from 'express';
import {appService} from "../AppService";
import axios, {AxiosError} from "axios";
import {v4 as uuidv4} from 'uuid';
import {requireAuth} from "../middlewares/AuthMiddleware";
import multer from "multer";
import {IBookAddMd} from "../types/book/IBookAddMd";
import {Pool, PoolClient} from "pg";
import {AppErrors} from "../types/AppErrors";
import {SearchFilter} from "../types/search/SearchFilter";
//@ts-ignore
const router: Router = Router();

// Multer setup - store in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {fileSize: 4 * 1024 * 1024}, // 4MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
        // @ts-ignore
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
            return cb(new Error("Only PNG or JPG images are allowed"), false);
        }
        cb(null, true);
    }
});

/**
 * Path: /book/search
 */
//@ts-ignore
router.get('/search', requireAuth, async (req: Request, res: Response) => {
    // Params
    const query = req.query.query ? String(req.query.query) : undefined;
    // Array of categories
    const category_id = req.query.category_id;
    const page = Math.max(0, Number(req.query.page)) || 0;
    const filters: SearchFilter[] = req.query.filters ? String(req.query.filters).split(",") as SearchFilter[] : [];

    const userId = appService.getSessionUser(req);

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    try {
        const MAX_ROWS = 50;
        const skip = MAX_ROWS * page;

        const params: any[] = [userId];
        const conditions: Array<String> = [
            `books.user_id = $1`
        ];

        let sqlStatement = `
            SELECT books.id,
                   books.name,
                   books.image_url,
                   books.isbn,
                   books.category_id,
                   books.language_code,
                   COALESCE(
                           json_agg(
                                   json_build_object(
                                           'id', authors.id,
                                           'name', authors.name
                                   )
                           ) FILTER(WHERE authors.id IS NOT NULL),
                           '[]'
                   ) AS authors
            FROM books
                     LEFT JOIN book_authors ON books.id = book_authors.book_id
                     LEFT JOIN authors ON book_authors.author_id = authors.id
        `;


        if (query) {
            conditions.push(`LOWER(books.name) ILIKE $${params.push(`%${query.toLocaleLowerCase()}%`)} OR LOWER(books.isbn) ILIKE $${params.push(`%${query.toLocaleLowerCase()}%`)}`);
        }

        if (category_id) {
            const ids = Array.isArray(category_id)
                ? category_id.map(Number)
                : String(category_id).split(',').map(Number);

            conditions.push(`category_id = ANY($${conditions.length + 1})`);
            params.push(ids);
        }

        if (filters.length > 0) {
            filters.forEach((filter) => {
                switch (filter) {
                    case SearchFilter.NO_STOCK: {
                        conditions.push(`books.id NOT IN (SELECT book_id FROM book_stocks WHERE user_id = $${conditions.length + 1})`);
                        params.push(userId);
                        break;
                    }
                    case SearchFilter.HAS_STOCK: {
                        conditions.push(`books.id IN (SELECT book_id FROM book_stocks WHERE user_id = $${conditions.length + 1})`);
                        params.push(userId);
                        break;
                    }
                }
            })
        }

        if (conditions.length > 0) {
            sqlStatement += ` WHERE ${conditions.join(' AND ')}`;
        }

        /**
         * Total results
         */
        let totalQuery = "SELECT COUNT(*) FROM books";
        if (conditions.length > 0) {
            totalQuery += ` WHERE ${conditions.join(' AND ')}`;
        }
        console.log("execute total results query: ", totalQuery)
        const totalResults = await client.query(totalQuery, params);

        /**
         * Results
         */
        sqlStatement += `
            GROUP BY 
                books.id,
                books.name,
                books.image_url,
                books.isbn,
                books.category_id,
                books.language_code
            ORDER BY books.name
            LIMIT ${MAX_ROWS} OFFSET ${skip};
        `;

        // Use a prepared statement to fetch items by name
        console.log("executing query: ", sqlStatement);
        const result = await client.query(sqlStatement, params);

        // Return the result (found rows)
        res.status(200).json({
            total: totalResults.rows[0] ? Number(totalResults.rows[0].count) : -1,
            limit: MAX_ROWS,
            books: result.rows
        });
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * Path: /book/{id}
 */
//@ts-ignore
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Get book, id:", id)
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);
    try {
        const result = await client.query(`
            SELECT books.id,
                   books.name,
                   books.description,
                   books.image_url,
                   books.isbn,
                   books.category_id,
                   books.language_code,
                   books.publisher,
                   books.published_date,
                   books.date_created,
                   books.date_updated,
                   books.pages,
                   books.format_id,
                   COALESCE(
                           json_agg(
                               DISTINCT jsonb_build_object(
                   'id', book_stocks.id,
                   'code', book_stocks.code,
                   'status', book_stocks.status,
                   'location_id', locations.id,  -- Using correct column from locations table
                   'location_name', locations.name,
                   'customer_id', customers.id,
                   'customer_name', customers.name
               )
           ) FILTER(WHERE book_stocks.id IS NOT NULL), '[]'
                   )                                                                    AS stocks,
                   COALESCE(
                           json_agg(
                               DISTINCT jsonb_build_object(
                   'id', authors.id,
                   'name', authors.name
               )
           ) FILTER(WHERE authors.id IS NOT NULL), '[]') AS authors
            FROM books
                     LEFT JOIN book_stocks ON books.id = book_stocks.book_id
                     LEFT JOIN locations ON book_stocks.location_id = locations.id
                     LEFT JOIN customers ON book_stocks.customer_id = customers.id
                     LEFT JOIN book_authors ON books.id = book_authors.book_id
                     LEFT JOIN authors ON book_authors.author_id = authors.id
            WHERE books.id = $1
              AND books.user_id = $2
            GROUP BY books.id,
                     books.name,
                     books.description,
                     books.image_url,
                     books.isbn,
                     books.category_id,
                     books.language_code,
                     books.publisher,
                     books.published_date,
                     books.date_created,
                     books.date_updated,
                     books.pages,
                     books.format_id;
        `, [id, userId]);

        if (result.rows.length !== 1) {
            res.status(404).send("Book not found");
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * Path: /book/{id}
 */
//@ts-ignore
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Update book, id:", id);
    const userId = appService.getSessionUser(req);

    // Body params
    const {
        name,
        image_url,
        isbn,
        category_id,
        language_code,
        authors,
        description,
        publisher,
        published_date,
        pages,
        format_id
    } = req.body;

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        // Validate the existence of the book
        const bookCheck = await client.query('SELECT id FROM books WHERE id = $1', [id]);
        if (bookCheck.rowCount === 0) {
            return res.status(404).send({error: "Book not found"});
        }

        // Start transaction
        await client.query('BEGIN');

        // Update the books table
        const updateQuery = `
            UPDATE books
            SET name           = $1,
                description    = $2,
                image_url      = $3,
                isbn           = $4,
                category_id    = $5,
                format_id      = $6,
                publisher      = $7,
                published_date = $8,
                language_code  = $9,
                pages          = $10,
                date_updated   = CURRENT_TIMESTAMP
            WHERE id = $11
              AND user_id = $12
        `;
        const updateValues = [
            name,
            description,
            image_url,
            isbn,
            category_id,
            format_id,
            publisher,
            published_date,
            language_code,
            pages,
            id,
            userId
        ];
        await client.query(updateQuery, updateValues);

        // Handle authors relationship in the book_authors table
        if (authors && Array.isArray(authors)) {
            // Fetch existing authors associated with the book
            const existingAuthorsResult = await client.query(
                'SELECT author_id FROM book_authors WHERE book_id = $1',
                [id]
            );
            const existingAuthors = existingAuthorsResult.rows.map(row => row.author_id);

            // Determine authors to remove (present in the database but not in the new list)
            const authorsToRemove = existingAuthors.filter(authorId => !authors.includes(authorId));

            // Determine authors to add (present in the new list but not in the database)
            const authorsToAdd = authors.filter(authorId => !existingAuthors.includes(authorId));

            // Remove authors no longer associated with the book
            for (const authorId of authorsToRemove) {
                await client.query(
                    'DELETE FROM book_authors WHERE book_id = $1 AND author_id = $2 AND user_id = $3',
                    [id, authorId, userId]
                );
            }

            // Add new authors to the book
            for (const authorId of authorsToAdd) {
                // Ensure the author exists in the authors table
                const authorCheck = await client.query('SELECT id FROM authors WHERE id = $1 AND user_id = $2', [authorId, userId]);
                if (authorCheck.rowCount !== 0) {
                    // Associate the author with the book
                    await client.query(
                        'INSERT INTO book_authors (book_id, author_id, user_id) VALUES ($1, $2, $3)',
                        [id, authorId, userId]
                    );
                } else {
                    console.warn(`Author with ID ${authorId} not found, skipping association.`);
                }
            }
        }

        // Commit transaction
        await client.query('COMMIT');
        res.send({message: "Book updated successfully"});
    } catch (e) {
        // Rollback transaction in case of error
        await client.query('ROLLBACK');
        console.error("Error while updating book", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * Path: /book/{id}
 */
//@ts-ignore
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Delete book, id:", id);

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    const userId = appService.getSessionUser(req);

    try {
        // Validate the existence of the book
        const bookCheck = await client.query('SELECT id FROM books WHERE id = $1 AND user_id = $2', [id, userId]);
        if (bookCheck.rowCount === 0) {
            return res.status(404).send({error: "Book not found"});
        }

        await client.query('DELETE FROM books WHERE id = $1 AND user_id = $2', [id, userId]);

        res.send({message: "Book deleted successfully"});
    } catch (e) {
        console.error("Error while deleting book", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});


/**
 * Change book image
 */
router.post('/:id/image', requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    let imageUrl = "";

    if (req.file) {
        const base64 = req.file.buffer.toString("base64");
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        const updatedBook = await pool.query(
            "UPDATE books SET image_url = $1 WHERE id = $2 AND user_id = $3",
            [imageUrl, id, userId]
        );

        res.status(200).json(updatedBook.rowCount);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error adding book");
    }
});

/**
 * Create book manually
 */
//@ts-ignore
router.post('', requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const isbn = req.body.isbn;
    let imageUrl = "";

    if (req.file) {
        const base64 = req.file.buffer.toString("base64");
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        // If the user give us a isbn code, check if exist
        if (isbn) {
            const existIsbn = await pool.query(
                'SELECT id FROM books WHERE isbn = $1 AND user_id = $2',
                [isbn, userId]
            );
            if (existIsbn.rowCount == 1) {
                res.status(404).send("Book with provided ISBN code already exist");
            }
        }

        const insertBook = await pool.query(
            "INSERT INTO books (name, description, image_url, isbn, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [name, description, imageUrl, isbn, userId]
        );

        const bookId = insertBook.rows[0].id;

        /************************************************************
         * LOCATION
         * Try to add the book to a location
         * *********************************************************/
        await __automaticallyAddBookToLocation(pool, bookId, userId);

        res.status(200).json(bookId);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error adding book");
    }
});

/**
 * Create book automatically base on isbn
 */
//@ts-ignore
router.post(
    '/isbn/:isbn',
    requireAuth,
    async (req: Request, res: Response) => {
        const isbnCode = req.params.isbn;
        if (!isbnCode) {
            return res.status(400).send('No ISBN code provided');
        }

        const locationId: string | null = req.body.location;
        const userId = appService.getSessionUser(req);

        try {
            /**
             * =========================
             * FETCH BOOK (Google → fallback OpenLibrary)
             * =========================
             */
            const bookData = await fetchBookData(isbnCode);

            if (!bookData) {
                return res.status(404).send('Book not found');
            }

            const {
                title: name,
                authors,
                description,
                categories,
                publisher,
                publishedDate,
                pageCount: pages,
                language,
                imageLinks,
            } = bookData;

            // books.name is NOT NULL - without a title there's nothing to insert.
            if (!name) {
                return res.status(404).send('Book not found');
            }

            const formattedPublishedDate = formatPublishedDate(publishedDate);

            /**
             * IMAGE (Google → OpenLibrary Covers fallback)
             */
            let imageUrl: string | null = null;

            if (imageLinks?.thumbnail) {
                imageUrl = imageLinks.thumbnail;
            } else {
                imageUrl = await fetchOpenLibraryCover(isbnCode);
            }

            const categoryName = truncate(categories?.[0] ?? null, 100);
            const languageCode = normalizeLanguageCode(language);

            /**
             * =========================
             * DATABASE TRANSACTION ONLY
             * =========================
             */
            const pool = appService.getDatabasePool();
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                /**
                 * LANGUAGE
                 */
                await ensureLanguage(client, languageCode);

                /**
                 * CATEGORY
                 */
                const categoryId = await __ensureCategory(
                    client,
                    categoryName,
                    userId
                );

                /**
                 * BOOK
                 */
                let bookId = await __getOrCreateBook(
                    client,
                    {
                        name: truncate(name, 255),
                        description,
                        imageUrl,
                        isbnCode,
                        categoryId,
                        publisher: truncate(publisher, 100),
                        formattedPublishedDate,
                        languageCode,
                        pages,
                    },
                    userId
                );

                /**
                 * AUTHORS
                 */
                if (authors?.length) {
                    await __ensureAuthors(
                        client,
                        bookId,
                        authors.map((author: string) => truncate(author, 100)),
                        userId
                    );
                }

                /**
                 * LOCATION
                 */
                if (locationId) {
                    await __addBookToLocation(
                        client,
                        bookId,
                        locationId,
                        userId
                    );
                } else {
                    await __automaticallyAddBookToLocation(
                        client,
                        bookId,
                        userId
                    );
                }

                await client.query('COMMIT');
                res.status(200).json(bookId);
            } catch (dbError) {
                await client.query('ROLLBACK');
                console.error('DB transaction error:', dbError);
                return res
                    .status(500)
                    .send('Error processing book in database');
            } finally {
                client.release();
            }
        } catch (error: unknown) {
            console.error('Error fetching book details:', error);

            if (axios.isAxiosError(error)) {
                return res.status(502).send('External book service failed');
            }

            return res
                .status(500)
                .send('Unexpected server error');
        }
    }
);

/**
 * =========================================================
 * EXTERNAL API: GOOGLE BOOKS (with retry + backoff)
 * =========================================================
 */
async function fetchBookData(isbn: string, retries = 3): Promise<any> {
    try {
        const apiKey = appService.getGoogleApiKey();
        if (!apiKey) {
            throw new Error("Missing GOOGLE_BOOKS_API_KEY");
        }

        const { data } = await axios.get(
            'https://www.googleapis.com/books/v1/volumes',
            {
                params: {
                    q: `isbn:${isbn}`,
                    key: apiKey
                },
                timeout: 9000,
                headers: {
                    'User-Agent': 'paperbooks-server/1.0',
                },
            },
        );

        return data?.items?.[0]?.volumeInfo ?? null;
    } catch (error: unknown) {
        if (
            axios.isAxiosError(error) &&
            error.response?.status === 429 &&
            retries > 0
        ) {
            const delay = (4 - retries) * 1000;

            await new Promise(r => setTimeout(r, delay));

            return fetchBookData(isbn, retries - 1);
        }

        console.warn('Google Books failed, trying fallback...', error);
        return __fetchOpenLibraryMetadata(isbn);
    }
}

/**
 * =========================================================
 * FALLBACK: OPEN LIBRARY METADATA
 * =========================================================
 */
async function __fetchOpenLibraryMetadata(isbn: string): Promise<any> {
    try {
        const { data } = await axios.get(
            `https://openlibrary.org/search.json?isbn=${isbn}`,
            { timeout: 9000 }
        );

        // The search endpoint returns matches under `docs`, not on the top-level object.
        const doc = data?.docs?.[0];

        if (!doc) {
            return null;
        }

        return {
            title: doc.title,
            authors: doc.author_name ?? [],
            description: undefined,
            categories: doc.subject ?? [],
            publisher: doc.publisher?.[0],
            publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
            pageCount: doc.number_of_pages_median,
            language: doc.language?.[0],
            imageLinks: null,
        };
    } catch (error) {
        console.error('OpenLibrary fallback failed:', error);
        return null;
    }
}

/**
 * =========================================================
 * OPEN LIBRARY COVER
 * =========================================================
 */
async function fetchOpenLibraryCover(isbn: string): Promise<string | null> {
    try {
        const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 3000,
        });

        const contentType = res.headers['content-type'];

        if (res.status === 200 && contentType?.startsWith('image/')) {
            return url;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * =========================================================
 * DB HELPERS
 * =========================================================
 */
/**
 * Truncates a string to fit a VARCHAR(maxLen) column instead of letting
 * Postgres reject the whole insert with "value too long for type character varying".
 */
function truncate(value: string | null | undefined, maxLen: number): string | null {
    if (value === null || value === undefined) return null;
    return value.length > maxLen ? value.substring(0, maxLen) : value;
}

/**
 * languages.code / books.language_code are CHAR(2) and optional, so any value
 * that isn't a clean 2-letter code (missing, "unknown", ISO 639-2 3-letter
 * codes, etc.) is dropped instead of overflowing the column.
 */
function normalizeLanguageCode(language: string | null | undefined): string | null {
    if (!language) return null;
    const code = language.trim().toLowerCase();
    return /^[a-z]{2}$/.test(code) ? code : null;
}

async function ensureLanguage(client: any, code: string | null) {
    if (!code) return;

    const result = await client.query(
        'SELECT code FROM languages WHERE code = $1',
        [code]
    );

    if (result.rowCount === 0) {
        await client.query(
            'INSERT INTO languages (code, name) VALUES ($1, $2)',
            [code, code]
        );
    }
}

async function __ensureCategory(
    client: any,
    name: string | null,
    userId: number
): Promise<number | null> {
    if (!name) return null;

    const result = await client.query(
        'SELECT id FROM categories WHERE name = $1 AND user_id = $2',
        [name, userId]
    );

    if (result.rowCount > 0) {
        return result.rows[0].id;
    }

    const insert = await client.query(
        'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id',
        [name, userId]
    );

    return insert.rows[0].id;
}

async function __getOrCreateBook(client: any, book: any, userId: number) {
    const existing = await client.query(
        'SELECT id FROM books WHERE isbn = $1 AND user_id = $2',
        [book.isbnCode, userId]
    );

    if (existing.rowCount > 0) {
        return existing.rows[0].id;
    }

    const insert = await client.query(
        `INSERT INTO books (
            name, description, image_url, isbn, category_id,
            publisher, published_date, language_code, pages, user_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING id`,
        [
            book.name,
            book.description,
            book.imageUrl,
            book.isbnCode,
            book.categoryId,
            book.publisher,
            book.formattedPublishedDate,
            book.languageCode,
            book.pages,
            userId,
        ]
    );

    return insert.rows[0].id;
}

async function __ensureAuthors(
    client: any,
    bookId: number,
    authors: string[],
    userId: number
) {
    for (const author of authors) {
        let result = await client.query(
            'SELECT id FROM authors WHERE name = $1 AND user_id = $2',
            [author, userId]
        );

        let authorId: number;

        if (result.rowCount === 0) {
            const insert = await client.query(
                'INSERT INTO authors (name, user_id) VALUES ($1,$2) RETURNING id',
                [author, userId]
            );
            authorId = insert.rows[0].id;
        } else {
            authorId = result.rows[0].id;
        }

        await client.query(
            `INSERT INTO book_authors (book_id, author_id, user_id)
             VALUES ($1,$2,$3)
             ON CONFLICT DO NOTHING`,
            [bookId, authorId, userId]
        );
    }
}

async function __addBookToLocation(
    client: any,
    bookId: number,
    locationId: string,
    userId: number
) {
    const exist = await client.query(
        'SELECT id FROM locations WHERE id = $1 AND user_id = $2',
        [locationId, userId]
    );

    if (exist.rowCount !== 1) return;

    const code = await generateBookStockCode();

    await client.query(
        `INSERT INTO book_stocks
         (book_id, code, status, location_id, customer_id, user_id)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [bookId, code, 0, locationId, null, userId]
    );
}

/**
 *
 */
//@ts-ignore
router.post('/:id/stock', requireAuth, async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const status = req.body.status;
    const customerId = req.body.customer_id;
    const locationId = req.body.location_id;
    if (!bookId) {
        return res.status(400).send('No book ID provided');
    }

    const BOOKED_STATUS = 2;
    if (status == BOOKED_STATUS) {
        return res.status(406).send('Status "booked" not allowed in add stock action');
    }

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    const userId = appService.getSessionUser(req);

    try {
        const existLocation = await pool.query(
            'SELECT id FROM locations WHERE id = $1 AND user_id =$2',
            [locationId, userId]
        );
        if (existLocation.rowCount != 1) {
            res.status(404).send("Location not found");
        }

        console.log(`Adding book stock with status ${status} in book id: ${bookId}`);
        await client.query("BEGIN");

        const code = await generateBookStockCode();

        const insertStock = await client.query(
            "INSERT INTO book_stocks (book_id, code, status, location_id, customer_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [bookId, code, status, locationId, customerId, userId]
        );

        await client.query("COMMIT");

        // fetch new data
        const result = await pool.query(
            `SELECT book_stocks.id,
                    book_stocks.code,
                    book_stocks.status,
                    book_stocks.location_id,
                    locations.name as location_name,
                    customers.id   as customer_id,
                    customers.name as customer_name
             FROM book_stocks
                      LEFT JOIN customers ON book_stocks.customer_id = customers.id
                      LEFT JOIN locations ON book_stocks.location_id = locations.id
             WHERE book_stocks.id = $1
               AND book_stocks.user_id = $2
            `,
            [insertStock.rows[0].id, userId]
        );


        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Rollback on error
        await client.query("ROLLBACK");
        console.error("Transaction error:", error);
        res.status(500).send("Error adding the book stock");
    } finally {
        client.release();
    }
});

/**
 *
 */
//@ts-ignore
router.delete('/:id/stock/:stock_id', requireAuth, async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const stockId = req.params.stock_id;
    if (!bookId || !stockId) {
        return res.status(400).send('No book ID or stock ID provided');
    }

    const userId = appService.getSessionUser(req);

    const pool = appService.getDatabasePool();

    try {
        console.log(`Removing book stock with status ${stockId} and book id: ${bookId}`);

        const deleteQueryResult = await pool.query(
            'DELETE FROM book_stocks WHERE book_id = $1 AND id = $2 AND user_id = $3',
            [bookId, stockId, userId]
        );

        res.status(200).json(deleteQueryResult.rowCount === 1);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error deleting the book stock");
    }
});

/**
 *
 */
//@ts-ignore
router.put('/:id/stock/:stock_id', requireAuth, async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const stockId = req.params.stock_id;
    if (!bookId || !stockId) {
        return res.status(400).send('No book ID or stock ID provided');
    }

    const userId = appService.getSessionUser(req);

    // Body params
    const {
        status,
        location_id,
        customer_id
    } = req.body;

    const pool = appService.getDatabasePool();

    try {
        console.log(`Updating book stock ${stockId}`);

        const existLocation = await pool.query(
            'SELECT id FROM locations WHERE id = $1 AND user_id = $2',
            [location_id, userId]
        );
        if (existLocation.rowCount != 1) {
            res.status(404).send("Location not found");
        }

        const queryResult = await pool.query(
            'UPDATE book_stocks SET status = $1, location_id = $2, customer_id = $3 WHERE book_id = $4 AND id = $5 AND user_id = $6',
            [status, location_id, customer_id, bookId, stockId, userId]
        );

        if (queryResult.rowCount != 1) {
            res.status(500).send();
        }

        const stockQueryResult = await pool.query(
            `SELECT book_stocks.id,
                    book_stocks.code,
                    book_stocks.status,
                    book_stocks.location_id,
                    locations.name as location_name,
                    customers.id   as customer_id,
                    customers.name as customer_name
             FROM book_stocks
                      LEFT JOIN customers ON book_stocks.customer_id = customers.id
                      LEFT JOIN locations ON book_stocks.location_id = locations.id
             WHERE book_stocks.id = $1
               AND book_stocks.user_id = $2
            `,
            [stockId, userId]
        );

        res.status(200).json(stockQueryResult.rows[0]);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error deleting the book stock");
    }
});

/**
 * Path: /:bookCode/add/md
 * given a book stock code get the book metadata necessary for adding a book
 */
//@ts-ignore
//@ts-ignore
router.get('/:bookCode/add/md', requireAuth, async (req: Request, res: Response) => {
    const bookCode = String(req.params.bookCode).trim();
    const userId = appService.getSessionUser(req);

    const pool = appService.getDatabasePool();

    try {
        // 1. Try to match a stock code
        const stockResult = await pool.query(
            `
                SELECT b.id    AS book_id,
                       b.name,
                       b.image_url,
                       b.isbn,
                       bs.id   AS stock_id,
                       bs.code AS stock_code,
                       bs.status
                FROM book_stocks bs
                         INNER JOIN books b ON b.id = bs.book_id
                WHERE bs.code = $1
                  AND bs.user_id = $2 LIMIT 1
            `,
            [bookCode, userId]
        );

        if (stockResult.rows.length == 0) {
            return res.status(404).send("Book stock not found");
        }

        const row = stockResult.rows[0];
        const response: IBookAddMd = {
            id: row.book_id,
            name: row.name,
            image_url: row.image_url,
            isbn: row.isbn,
            stocks: [
                {
                    id: row.stock_id,
                    code: row.stock_code,
                    status: row.status
                }
            ]
        };
        return res.status(200).json(response);
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).send("Error retrieving the book data");
    }
});

/**
 * Create book manually
 */
//@ts-ignore
router.post('/return', requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    const books: string[] = req.body.books;
    const pool = appService.getDatabasePool();
    const userId = appService.getSessionUser(req);

    try {
        books.forEach(async (bookStockCode: string) => {
            await pool.query(
                'UPDATE book_stocks SET customer_id = $1, status = $2 WHERE code = $3 AND user_id = $4',
                [null, 0, bookStockCode, userId]
            );
        })

        res.status(200).send();
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error returning books");
    }
});

// Helper function to format date to YYYY-MM-DD
function formatPublishedDate(date: string | undefined): string | null {
    if (!date) return null;

    // Attempt to parse the date and format it to YYYY-MM-DD
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return null; // Return null if the date is invalid
    }

    // Return the date in the format YYYY-MM-DD
    return parsedDate.toISOString().split('T')[0];
}

/**
 *
 */
async function generateBookStockCode(): Promise<string> {
    let code: string = "";
    let isUnique = false;

    const pool = appService.getDatabasePool();


    while (!isUnique) {
        // Generate a random 10-character code
        code = uuidv4().replace(/-/g, '').substring(0, 10);

        // Check if the code already exists
        const {rowCount} = await pool.query(
            "SELECT 1 FROM book_stocks WHERE code = $1",
            [code]
        );

        if (rowCount === 0) {
            isUnique = true;
        }
    }

    return code;
}

/**
 * Try to automatically create a book stock if user has only one location
 * @param client
 * @param bookId
 * @param userId
 */
async function __automaticallyAddBookToLocation(client: Pool | PoolClient, bookId: number, userId: number) {

    const locations = await client.query(`
        SELECT id
        FROM locations
        WHERE user_id = $1
    `, [userId]);

    if (locations.rowCount != null && locations.rowCount == 1) {
        const locationId = locations.rows[0].id;

        const code = await generateBookStockCode();

        await client.query(
            "INSERT INTO book_stocks (book_id, code, location_id, user_id) VALUES ($1, $2, $3, $4)",
            [bookId, code, locationId, userId]
        );
    }
}

export default router;