const request = require('supertest');
const config  = require('config');

describe('NEON Accounts', () => {
	let server;
	let loginApiKey;
	let loginOrgId;

	beforeEach(() => {
		server = require('../../../../index');
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

	describe('GET NEON Account info', () => {
		it('should return 401 if no x-auth-token passed in header', async () => {
			const response = await request(server)
				.get('/api/v2/neon/accounts/individual/');

			expect(response.status).toBe(401);
		});

		it('should return 400 if an invalid x-auth-token passed in header', async () => {
			const response = await request(server)
				.get('/api/v2/neon/accounts/individual/')
				.set('x-auth-token', '11111111111111111111111111111111');

			expect(response.status).toBe(400);
		});

		it('should return a list of member object if request is valid', async () => {
			const login = await execLogin();

			const response = await request(server)
				.get('/api/v2/neon/accounts/individual/')
				.set('x-auth-token', login.text);

			expect(response.status).toBe(200);
			expect(response.body.operationResult).toEqual('SUCCESS');
			expect(Object.keys(response.body)).toEqual(
				expect.arrayContaining(['page', 'searchResults']));
		});

		it('should return the correct page if parameter is passed', async () => {
			const login = await execLogin();

			const response = await request(server)
				.get(`/api/v2/neon/accounts/individual/?page=2`)
				.set('x-auth-token', login.text);
			
			expect(response.body.page.currentPage).toEqual(2);
		});
	});

	describe('GET Single NEON Account', () => {
		it('should return 401 if no x-auth-token passed in header', async () => {
			const response = await request(server)
				.get('/api/v2/neon/accounts/individual/' + 1);

			expect(response.status).toBe(401);
		});

		it('should return a single member object if request is valid', async () => {
			const login = await execLogin();

			const response = await request(server)
				.get('/api/v2/neon/accounts/individual/' + 1)
				.set('x-auth-token', login.text);

			expect(response.status).toBe(200);
			expect(Object.keys(response.body.individualAccount)).toEqual(
				expect.arrayContaining(['accountId']));
		});	
	});
});