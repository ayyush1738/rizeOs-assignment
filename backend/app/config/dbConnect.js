import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const initDb = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to the PostgreSQL database.');

        const createTables = `
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,

            -- Profile Fields
            full_name TEXT,
            wallet_address TEXT UNIQUE NOT NULL,
            location TEXT,
            address TEXT,
            bio TEXT,
            skills TEXT[], -- PostgreSQL supports string arrays
            profile_picture TEXT,
            resume_url TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS connections (
            id SERIAL PRIMARY KEY,
            requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            target_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE (requester_id, target_id) -- Prevent duplicate requests
        );

        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS post_likes (
            id SERIAL PRIMARY KEY,
            post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            UNIQUE(post_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS post_comments (
            id SERIAL PRIMARY KEY,
            post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            skills TEXT[],
            budget NUMERIC,
            location TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS job_applications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            cover_letter TEXT,
            status TEXT DEFAULT 'applied', -- 'applied', 'reviewed', 'accepted', etc.
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(user_id, job_id) -- prevent duplicate applications
        );
    `;

        await client.query(createTables);
        client.release();
        console.log('✅ Tables ensured for Vaultify EVM architecture.');
    } catch (err) {
        console.error('❌ Database initialization error:', err.stack);
    }
};

initDb();