const request = require('supertest');
const config  = require('config');

describe('NEON User Authentication', () => {
    let server;
	let username;
    let password;
    let loginApiKey;
	let loginOrgId;

	beforeEach(() => {
		server = require('../../../index');
		username = 'HL-Member';
        password = 'YCD35Q4CDM';
        loginApiKey = config.get('loginApiKey');
		loginOrgId = config.get('loginOrgId');
	});
	afterEach(async () => {
		await server.close();
    });
    
    const execLogin = () => {
		return request(server)
			.post('/api/v2/neon/login')
			.send({ organizationId: loginOrgId, apiKey: loginApiKey });
    }

    it('should return 401 if no x-auth-token is sent', async () => {
        const response = await request(server)
            .post('/api/v2/neon/auth')
            .send({ username: username, password: password });

        expect(response.status).toBe(401);
    });
    
    it('should return 400 if invalid credentials are sent', async () => {
        const login = await execLogin();
        password = '1234';

        const response = await request(server)
            .post('/api/v2/neon/auth')
            .set('x-auth-token', login.text)
            .send({ username: username, password: password });

        expect(response.status).toBe(400);
    });

    it('should return a member object if valid credentials are sent', async () => {
        const login = await execLogin();

        const response = await request(server)
            .post('/api/v2/neon/auth')
            .set('x-auth-token', login.text)
            .send({ username: username, password: password });

        expect(response.status).toBe(200);
        expect(response.body.responseMessage).toBe('User logged in.');
        expect(Object.keys(response.body)).toEqual(
            expect.arrayContaining(['accountId']));
    });
});