// const request = require('supertest');

import request from "supertest";
import app from "../app.js";


describe('Auth API - Registration', () => {
  
  it('should register a new user and return a fake token', async () => {
    // 1. Supertest simulates sending a POST request with data
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@dealership.com',
        password: 'secure123'
      });

    // 2. We EXPECT the server to reply with specific things
    expect(res.statusCode).toBe(201); // 201 means "Created"
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body).toHaveProperty('token'); // We expect a token back
  });

  it('should fail if the email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        password: 'secure123'
        // Notice email is missing!
      });

    expect(res.statusCode).toBe(400); // 400 means "Bad Request"
    expect(res.body.error).toBe('Email and password are required');
  });

});