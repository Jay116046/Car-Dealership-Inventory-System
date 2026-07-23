import request from 'supertest';
import app from '../app.js';
import User from '../Model/User.js';
import Vehicle from '../Model/Vehicles.js';

const uniqueSuffix = Date.now();
const testUser = {
  userName: `tester_${uniqueSuffix}`,
  email: `tester_${uniqueSuffix}@dealership.com`,
  password: 'secure123',
};

const createVehiclePayload = {
  image: 'https://example.com/car.jpg',
  make: 'Tesla',
  model: `Model X ${uniqueSuffix}`,
  category: 'SUV',
  price: 69999,
  quantity: 3,
};

let createdVehicleId = null;
const agent = request.agent(app);

describe('Car Inventory API endpoints', () => {
  afterAll(async () => {
    if (createdVehicleId) {
      await Vehicle.findByIdAndDelete(createdVehicleId);
    }

    await User.deleteOne({ email: testUser.email });
  });

  it('POST /api/auth/register should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('register successfully');
  });

  it('POST /api/auth/register should reject duplicate email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.messege).toBe('User already exist with same email! please enter unique email');
  });

  it('POST /api/auth/login should login the user and set a cookie', async () => {
    const response = await agent
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('successfully logged-in');
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('GET /api/admin/vehicles/getList should return vehicle list', async () => {
    const response = await agent.get('/api/admin/vehicles/getList');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/admin/vehicles/add should add a new vehicle', async () => {
    const response = await agent
      .post('/api/admin/vehicles/add')
      .send(createVehiclePayload);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.newlyAddvehicle.make).toBe(createVehiclePayload.make);
    expect(response.body.newlyAddvehicle.model).toBe(createVehiclePayload.model);
    createdVehicleId = response.body.newlyAddvehicle._id;
  });

  it('PUT /api/admin/vehicles/update/:id should update a vehicle', async () => {
    const response = await agent
      .put(`/api/admin/vehicles/update/${createdVehicleId}`)
      .send({
        make: 'BMW',
        model: 'Z4',
        category: 'Sports',
        price: 85000,
        quantity: 4,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.findvehicle.make).toBe('BMW');
    expect(response.body.findvehicle.model).toBe('Z4');
    expect(response.body.findvehicle.quantity).toBe(4);
  });

  it('POST /api/user/vehicles/:id/purchase should purchase a vehicle', async () => {
    const response = await agent.post(`/api/user/vehicles/${createdVehicleId}/purchase`);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.findvehicle.quantity).toBe(3);
  });

  it('DELETE /api/admin/vehicles/delete/:id should delete a vehicle', async () => {
    const response = await agent.delete(`/api/admin/vehicles/delete/${createdVehicleId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.messege).toBe('vehicle successfully deleted');
    createdVehicleId = null;
  });

  it('POST /api/auth/logout should logout the user', async () => {
    const response = await agent.post('/api/auth/logout');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('logout successfully');
  });
});
