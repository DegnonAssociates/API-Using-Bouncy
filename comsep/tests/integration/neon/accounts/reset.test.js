const request = require('supertest');
const config  = require('config');

describe('NEON Account Password Reset', () => {
	let server;
	let loginApiKey;
    let loginOrgId;
    let username;
    let password;

	beforeEach(() => {
        server = require('../../../../index');
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


    it('should return 401 if no x-auth-token passed in header', async () => {
        const response = await request(server)
            .post('/api/v2/neon/accounts/reset/')
            .send({ username: username, password: password });

        expect(response.status).toBe(401);
    });

    it('should return 400 if an invalid x-auth-token passed in header', async () => {
        const response = await request(server)
            .post('/api/v2/neon/accounts/reset/')
            .set('x-auth-token', '11111111111111111111111111111111')
            .send({ username: username, password: password });

        expect(response.status).toBe(400);
    });

    it('should return 400 if an invalid username is submitted', async () => {
        const login = await execLogin();
        username = '';

        const response = await request(server)
            .post('/api/v2/neon/accounts/reset/')
            .set('x-auth-token', login.text)
            .send({ username: username, password: password });

        expect(response.status).toBe(400);
    });

    it('should return 400 if an invalid password is submitted', async () => {
        const login = await execLogin();
        password = '';

        const response = await request(server)
            .post('/api/v2/neon/accounts/reset/')
            .set('x-auth-token', login.text)
            .send({ username: username, password: password });

        expect(response.status).toBe(400);
    });
});