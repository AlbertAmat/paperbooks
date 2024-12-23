import {Router, Request, Response} from 'express';
import {appService} from "../AppService";
import axios from "axios";

const router: Router = Router();

/**
 * Path: /book/search
 */
router.get('/search', async (req: Request, res: Response) => {
    // Params
    const name = req.query.name;
    const isbn = req.query.isbn;
    const author = req.query.author;
    // Array of categories
    const category_id = req.query.category_id;
    const page = Math.max(0, Number(req.query.page)) || 0;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    try {
        const MAX_ROWS = 50;
        const skip = MAX_ROWS * page;

        const params = [];
        const conditions: Array<String> = [];

        let query = `
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
                       ) FILTER (WHERE authors.id IS NOT NULL),
                       '[]'
                   ) AS authors
            FROM books
             LEFT JOIN book_authors ON books.id = book_authors.book_id
             LEFT JOIN authors ON book_authors.author_id = authors.id        
        `;

        if (name) {
            conditions.push(`name ILIKE $${conditions.length + 1}`);
            params.push(`%${name}%`);
        }

        if (isbn) {
            conditions.push(`isbn ILIKE $${conditions.length + 1}`);
            params.push(`%${isbn}%`); // Use ILIKE for case-insensitive search with partial match
        }

        if (author) {
            conditions.push(`author ILIKE $${conditions.length + 1}`);
            params.push(`%${author}%`); // Use ILIKE for case-insensitive search with partial match
        }

        if (category_id) {
            conditions.push(`category_id IN $${conditions.length + 1}`);
            params.push(`[${category_id}]`); // Use ILIKE for case-insensitive search with partial match
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        /**
         * Total results
         */
        let totalQuery = "SELECT COUNT(*) FROM books";
        if (conditions.length > 0) {
            totalQuery += ` WHERE ${conditions.join(' AND ')}`;
        }
        const totalResults = await client.query(totalQuery, params);

        /**
         * Results
         */
        query += `
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
        console.log("executing query: ", query);
        const result = await client.query(query, params);

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
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Get book, id:", id)
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
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
                                  json_build_object(
                                          'id', authors.id,
                                          'name', authors.name
                                  )
                          ) FILTER (WHERE authors.id IS NOT NULL),
                          '[]'
                  ) AS authors
           FROM books
                    LEFT JOIN book_authors ON books.id = book_authors.book_id
                    LEFT JOIN authors ON book_authors.author_id = authors.id
           WHERE books.id = $1
           GROUP BY
               books.id,
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
               books.format_id
       `, [id]);

       if(result.rows.length !== 1) {
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
 *
 */
router.get('/:id/locations', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Get locations for book, id:", id)
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT locations.id     as     location_id,
                   locations.name   as     location_name,
                   locations.description as location_desc,
                   book_locations.quantity
            FROM book_locations
                     LEFT JOIN locations ON book_locations.location_id = locations.id
            WHERE book_locations.book_id = $1
        `, [id])

        res.status(200).json(result.rows);
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release()
    }
});

//@ts-ignore
router.post('/isbn/:isbn', async (req: Request, res: Response) => {
    const isbnCode = req.params.isbn;
    if (!isbnCode) {
        return res.status(400).send('No ISBN code provided');
    }

    try {
        // Fetch book details from Google Books API
        const {data} = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnCode}`);
        if (!data.items || data.items.length === 0) {
            return res.status(404).send('Book not found');
        }

        const bookData = data.items[0].volumeInfo;
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

        // Format the publishedDate
        const formattedPublishedDate = formatPublishedDate(publishedDate);

        const imageUrl = imageLinks?.thumbnail || null;
        const categoryName = categories ? categories[0] : null;
        const languageCode = language;

        // Begin a transaction
        const pool = appService.getDatabasePool();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Check and insert language if not exists
            let languageResult = await client.query(
                "SELECT code FROM languages WHERE code = $1",
                [languageCode]
            );
            if (languageResult.rowCount === 0) {
                await client.query(
                    "INSERT INTO languages (code, name) VALUES ($1, $2)",
                    [languageCode, languageCode] // Replace with proper language name if available
                );
            }

            // Check and insert category if not exists
            let categoryId: number | null = null;
            if (categoryName) {
                let categoryResult = await client.query(
                    "SELECT id FROM categories WHERE name = $1",
                    [categoryName]
                );
                if (categoryResult.rowCount === 0) {
                    const insertCategoryResult = await client.query(
                        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
                        [categoryName]
                    );
                    categoryId = insertCategoryResult.rows[0].id;
                } else {
                    categoryId = categoryResult.rows[0].id;
                }
            }

            // Check if the book already exists
            let bookId: number | null = null;
            let bookResult = await client.query(
                "SELECT id FROM books WHERE isbn = $1",
                [isbnCode]
            );
            if (bookResult.rowCount === 0) {
                // Insert the book into the books table
                const insertBookResult = await client.query(
                    `INSERT INTO books (name, description, image_url, isbn, category_id,
                                        publisher, published_date, language_code, pages)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
                    [
                        name, description, imageUrl, isbnCode, categoryId,
                        publisher, formattedPublishedDate, languageCode, pages
                    ]
                );
                bookId = insertBookResult.rows[0].id;
            } else {
                bookId = bookResult.rows[0].id;
            }

            // Insert authors into the authors and book_authors tables
            if (authors && bookId) {
                for (const author of authors) {
                    // Check if the author exists
                    let authorResult = await client.query(
                        "SELECT id FROM authors WHERE name = $1",
                        [author]
                    );
                    let authorId: number | null = null;
                    if (authorResult.rowCount === 0) {
                        const insertAuthorResult = await client.query(
                            "INSERT INTO authors (name) VALUES ($1) RETURNING id",
                            [author]
                        );
                        authorId = insertAuthorResult.rows[0].id;
                    } else {
                        authorId = authorResult.rows[0].id;
                    }

                    // Insert into book_authors
                    await client.query(
                        "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                        [bookId, authorId]
                    );
                }
            }

            // Commit transaction
            await client.query("COMMIT");
            res.status(200).send("Book added successfully");
        } catch (error) {
            // Rollback on error
            await client.query("ROLLBACK");
            console.error("Transaction error:", error);
            res.status(500).send("Error processing the book");
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send("Error fetching book details");
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

export default router;