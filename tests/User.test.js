import Chai from 'chai'
import ChaiHTTP from 'chai-http'
import { describe, it as test } from 'mocha'
import app from '../server.js'
import StatusCode from '../config/StatusCode.js'

Chai.should()
Chai.use(ChaiHTTP)

const randomString = Math.random().toString(36).substring(7)

const userMock = {
	username: randomString,
	password: randomString
}
const userId = '60ec993f8cdd8b2ddc0b6ac7'

const wineMock = {
	wineName: randomString,
	country: randomString
}

const testingMonExistingRoute = () => {
	describe('Testing a non existing route', () => {
		test('Expecting 404 not found', (done) => {
			Chai.request(app)
				.get(`/${randomString}`)
				.end((request, response) => {
					response.should.have.a.status(StatusCode.NOTFOUND)
					done()
				})
		})
	})
}

const testCreateUser = () => {
	describe('TESTING TO CREATE(POST) A USER ENTITY\n', () => {
		test('SHOULD CREATE A USER\n', (done) => {
			Chai.request(app)
				.post('/createuser')
				.send(userMock)
				.end((error, response) => {
					response.should.have.status(StatusCode.CREATED)
					response.body.should.be.a('object')
					response.body.should.have.property('username').eq(userMock.username)
					response.body.should.have.property('password').eq(userMock.password)
					done()
				})
		})
	})
}

const testgetAllUSers = () => {
	describe('Fetch all users(GET)', () => {
		test('Expecting to recieve all the users', (done) => {
			Chai.request(app)
				.get('/getall')
				.end((error, response) => {
					response.should.have.a.status(StatusCode.OK)
					response.body.should.be.a('array')
					response.body.length.should.be.eq(21)
					done()
				})
		})
	})
}

const testUpdateUser = () => {
	describe('Updating(PUT) a user in the databse', () => {
		test('Expecting a user to be updated', (done) => {
			Chai.request(app)
				.put(`/user/${userId}`)
				.send(userMock)
				.end((error, response) => {
					response.should.have.status(StatusCode.OK)
					response.body.should.be.a('object')
					response.body.should.have.property('_id').eq(userId)
					response.body.should.have.property('username').eq(userMock.username)
					response.body.should.have.property('password').eq(userMock.password)
					done()
				})
		})
	})
}

const testDeleteUserById = () => {
	describe('Delete (DELETE) a user in the databse', () => {
		test('Expecting a user to be deleted', (done) => {
			Chai.request(app)
				.delete(`/delete/${userId}`)
				.end((error, response) => {
					response.should.have.status(StatusCode.OK)
					done()
				})
		})
	})
}
const testAddWine = () => {
	describe('TESTING TO CREATE(POST) A USER ENTITY\n', () => {
		test('SHOULD CREATE A wine\n', (done) => {
			Chai.request(app)
				.post('/wine') //wineName, country
				.send(wineMock)
				.end((error, response) => {
					response.should.have.status(StatusCode.CREATED)
					response.body.should.be.a('object')
					response.body.should.have.property('wineName').eq(wineMock.wineName)
					response.body.should.have.property('country').eq(wineMock.country)
					done()
				})
		})
	})
}

describe('TESTING THE USER API_ROUTE', () => {
	/* testingMonExistingRoute();
  testCreateUser();
  testgetAllUSers();
  testUpdateUser();
  testDeleteUserById();*/
 
	testAddWine()
})

// const testGetUserByUserNameQuery = () => {
//   describe('', () => {
//     test('Expecting', () => {
//         Chai.request(app)
//     });
//   });
// };
