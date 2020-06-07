
var supertest = require('supertest');
var chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp)
var uuid = require('uuid');
let server = require('../server.js')

describe('Testing GET methods', ()=>{

    it('expect /drug to return 200', ()=>{
        chai.request(server).get("/drug").end((err,resp)=> { 
            chai.expect(resp.status).to.equal(200)
        })
    })

    it('expect /drug/byId/:id to return drug with specified id', () =>{
        chai.request(server).get("/drug/byId/3").end((err,resp)=>{
            chai.expect(resp.text).to.equal('drug 3')
        })
    } )

    it('expect /drug/byName/:name to return drug with specified id', () =>{
        chai.request(server).get("/drug/byId/coldrex").end((err,resp)=>{
            chai.expect(resp.text).to.equal('drug coldrex')
        })
    } )

    it('expect wrong url to return 404', () => {
        chai.request(server).get("/drugs").end((err,resp) => {
            chai.expect(resp.status).to.equal(404)
        })
    })

}) 

describe('Testing PATCH methods', ()=> {
    it('expect /drug/updateById/:id/:availability/:amount to return 200', () => {
        chai.request(server).patch("/drug/updateById/3/true/10").end((err,resp) => {
            chai.expect(resp.status).to.equal(200)
        })
    })

    it('expect /drug/updateById/:id/:availability/:amount take a correct route and form correct request to db', () => {
        chai.request(server).patch("/drug/updateById/3/true/10").end((err,resp) => {
            chai.expect(resp.body._id).to.equal('3')
            chai.expect(resp.body.available).to.equal('true')
            chai.expect(resp.body.amount).to.equal('10')
        })
    })

    it('expect /drug/updateById/:id/:availability/:amount to return 200 when no id not a number', () => {
        chai.request(server).patch("/drug/updateById/f/true/10").end((err,resp) => {
            chai.expect(resp.status).to.equal(200)
        })
    })
})

describe('Testing POST methods', ()=> {
    it('expect post /drug/:name/:availability to trigger createDrug', () => {
        chai.request(server).post("/drug/coldrex/true").end((err,resp) => {
            chai.expect(resp.text).to.equal('creating coldrex')
        })
    })
    it('expect post /drug/:name/:availability to return 200', () => {
        chai.request(server).post("/drug/coldrex/true").end((err,resp) => {
            chai.expect(resp.status).to.equal(200)
        })
    })

    it('expect post /drug/deleteById/:id to return 200', () => {
        chai.request(server).post("/drug/deleteById/3").end((err,resp) => {
            chai.expect(resp.status).to.equal(200)
        })
    })

    it('expect post /drug/deleteById/:id to return 200 when ID is not a number', () => {
        chai.request(server).post("/drug/deleteById/f").end((err,resp) => {
            chai.expect(resp.status).to.equal(200)
        })
    })
})