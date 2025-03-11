import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';
import { carDatabase } from './db';
import { Bid } from "./Bid";
import { User } from "../models/User";
import {  QueryError } from 'mysql2';
dotenv.config({ path: './src/.env' });



const pool = createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

export const CreateTableIfDontExist = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('Creating tables...');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS auctions (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                currentPrice DECIMAL(10, 2) NOT NULL,
                startingPrice DECIMAL(10, 2) NOT NULL,
                imageUrl TEXT,
                endTime TIMESTAMP NOT NULL,
                status ENUM('active', 'ended') DEFAULT 'active',
                category ENUM('luxury', 'sport', 'classic', 'electric', 'suv', 'family') DEFAULT 'luxury',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS bids (
                id INT AUTO_INCREMENT PRIMARY KEY,
                auctionId VARCHAR(36) NOT NULL,
                name VARCHAR(50) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (auctionId) REFERENCES auctions(id)
            )
        `);
        
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export const initializeDatabase = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM auctions');
        if (rows[0].count === 0) {
            for (const car of carDatabase) {
                await connection.query(
                    `INSERT INTO auctions (id, title, description, currentPrice, startingPrice, 
                    imageUrl, endTime, category) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [car.id, car.name, car.description, car.basePrice, car.basePrice,
                    car.imageUrl, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), car.category]
                );
            }
        }
    } finally {
        connection.release();
    }
};

export const createUser = async (user: User) => {
    const connection = await pool.getConnection();
    try {
        await connection.query('INSERT INTO users (name, email) VALUES (?, ?)', 
            [user.name, user.email]);
        return user;
    } catch (error: QueryError | any) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
            throw new Error('This email is already registered');
        }
        throw new Error('Failed to create user');
    } finally {
        connection.release();
    }
};

export const getAuctions = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM auctions');
        return rows;
    } finally {
        connection.release();
    }
};

export const createBid = async (bid: Bid) => {
    const connection = await pool.getConnection();
    try {
        const [auctions]: any = await connection.query(
            'SELECT id, currentPrice FROM auctions WHERE id = ? AND status = "active"', 
            [bid.auctionId]
        );
        
        if (!auctions[0]) {
            throw new Error('Auction not found or has ended');
        }

        if (bid.amount <= auctions[0].currentPrice) {
            throw new Error(`Bid must be higher than current price: ${auctions[0].currentPrice}`);
        }

        const [result]: any = await connection.query(
            'INSERT INTO bids (auctionId, name, amount) VALUES (?, ?, ?)', 
            [bid.auctionId, bid.name, bid.amount]
        );
        
        await connection.query(
            'UPDATE auctions SET currentPrice = ? WHERE id = ?',
            [bid.amount, bid.auctionId]
        );

        bid.id = result.insertId;
        return bid;
    } finally {
        connection.release();
    }
};
export const getBidByAuctionId = async (auctionId: string) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM bids WHERE auctionId = ?', [auctionId]);
        return rows;
    } finally { 
        connection.release();
    }
};

export const getCarById = async (id: string) => {
    const connection = await pool.getConnection();
    try {
        const [rows]: [any[], any] = await connection.query(
            'SELECT * FROM auctions WHERE id = ?', 
            [id]
        );
        console.log('Query result:', { id, rows });
        return rows[0] || null;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export { pool };