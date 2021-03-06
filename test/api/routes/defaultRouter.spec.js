const chaiHttp = require('chai-http')
const chai = require('chai')

const app = require('../../../api/app')

chai.use(chaiHttp)
const expect = chai.expect

describe('DefaultRouter', () => {
  describe('GET request on /', () => {
    it('should be json', () => {
      return chai.request(app).get('/')
        .then(res => {
          expect(res.type).to.eql('application/json')
        })
    })
    it('should return a 200 status', () => {
      return chai.request(app).get('/')
        .then(res => {
          expect(res.status).to.eql(200)
        })
    })
    it('should return the correct message', () => {
      return chai.request(app).get('/')
        .then(res => {
          expect(JSON.parse(res.text).message).to.eql('Welcome')
        })
    })
  })
})
