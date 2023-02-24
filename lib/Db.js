import { MongoClient } from 'mongodb';

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;

const client = new MongoClient(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

try {
    await client.connect();
    // eslint-disable-next-line no-unused-vars
    const db = client.db();
    console.log('DB connection established');
} catch (e) {
    console.error(e);
    process.exit();
}

// eslint-disable-next-line no-undef
export default db;
