// test/authController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../api/server'); // шлях до вашого серверного файлу
const User = require('../models/User');

describe('Auth Controller', () => {
    beforeAll(async () => {
        // Підключення до тестової БД (наприклад, MongoDB Memory Server)
        await mongoose.connect('mongodb://localhost:27017/cruddb')
            .then(() => console.log('✅ Успішне підключення до test MongoDB'))
            .catch(err => console.error('❌ Помилка підключення до test MongoDB:', err));
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /users/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/users/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: '12345678',
                    role: 'user'
                });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
        });

        it('should not register a user with an invalid role', async () => {
            const res = await request(app)
                .post('/users/register')
                .send({
                    name: 'Test User',
                    email: 'test2@example.com',
                    password: '12345678',
                    role: 'admin'
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toMatch(/Invalid role/);
        });
    });

    describe('POST /users/login', () => {
        beforeEach(async () => {
            const hashed = await require('bcrypt').hash('12345678', 10);
            await User.create({
                name: 'Test User',
                email: 'login@example.com',
                password: hashed,
                role: 'user',
                publish: 'yes'
            });
        });

        it('should log in a user with correct credentials', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({
                    email: 'login@example.com',
                    password: '12345678'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe('login@example.com');
        });

        it('should not log in a user with an incorrect password', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toMatch(/Incorrect email or password/);
        });
    });

    describe('POST /users/auth', () => {

        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .post('/users/auth');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error', 'No token provided');
        });

        it('should return 401 if token is invalid', async () => {
            const res = await request(app)
                .post('/users/auth')
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error', 'Invalid token');
        });

        it('should return 200 and user data if token is valid', async () => {
            const testUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: '12345678',
                role: 'user'
            };
            
            // before
            const registerRes = await request(app)
                .post('/users/register')
                .send(testUser);
            expect(registerRes.statusCode).toBe(201);

            const loginRes = await request(app)
                .post('/users/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });
            expect(loginRes.statusCode).toBe(200);
            
            const token = loginRes.body.token;
            const createdUser = loginRes.body.user;

            //when
            const res = await request(app)
                .post('/users/auth')
                .set('Authorization', `Bearer ${token}`);

            //then
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', testUser.email);
            expect(res.body.user).toHaveProperty('name', testUser.name);
            expect(res.body.user).toHaveProperty('id', createdUser.id.toString());
            expect(res.body.user).not.toHaveProperty('password');
        });
    });
});
