/// <reference types="cypress" />

describe('Update booking', () => {

  var token = '';
  var bookingid = '';

  before('Login', () => {
    cy.request({
      method: 'POST',
      url: '/auth',
      failOnStatusCode: false,
      body: {
        "username": "admin",
        "password": "password123"
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        token = response.body.token;
      })
  })

  beforeEach('Create a booking', () => {
    cy.request({
      method: 'POST',
      url: '/booking',
      failOnStatusCode: false,
      body: {
        "firstname": "Cezar",
        "lastname": "Neto",
        "totalprice": 2500,
        "depositpaid": true,
        "bookingdates":
        {
          "checkin": "2026-03-23",
          "checkout": "2026-04-01"
        },
        "additionalneeds": "Breakfast"
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.bookingid).to.be.a('number');
        expect(response.body.booking.firstname).to.eq('Cezar');
        expect(response.body.booking.lastname).to.eq('Neto');
        expect(response.body.booking.totalprice).to.eq(2500);
        expect(response.body.booking.depositpaid).to.eq(true);
        expect(response.body.booking.bookingdates).to.be.an('object');
        expect(response.body.booking.bookingdates.checkin).to.eq('2026-03-23');
        expect(response.body.booking.bookingdates.checkout).to.eq('2026-04-01');
        expect(response.body.booking.additionalneeds).to.eq('Breakfast');
        bookingid = response.body.bookingid;

      })
  })

  it('Update a booking', () => {

    const body = {
      "firstname": "Cezar",
      "lastname": "Neto",
      "totalprice": 3000,
      "depositpaid": true,
      "bookingdates":
      {
        "checkin": "2026-04-01",
        "checkout": "2026-04-10"
      },
      "additionalneeds": "Breakfast"
    }

    cy.request({
      method: 'PUT',
      url: `/booking/${bookingid}`,
      failOnStatusCode: false,
      body: body,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`
      }
    })
      // Validações do update
      .then((Response) => {
        expect(Response.status).to.eq(200);
        expect(Response.body.totalprice).to.eql(3000);
        expect(Response.body.bookingdates.checkin).to.eq('2026-04-01');
        expect(Response.body.bookingdates.checkout).to.eq('2026-04-10');
      })
  })

  it('Update a booking no auth', () => {

    const bodyupdate = {
      "firstname": "Cezar",
      "lastname": "Neto",
      "totalprice": 2500,
      "depositpaid": true,
      "bookingdates":
      {
        "checkin": "2026-04-01",
        "checkout": "2026-04-10"
      },
      "additionalneeds": "Breakfast"
    }

    cy.request({
      method: 'PUT',
      url: `/booking/${bookingid}`,
      failOnStatusCode: false,
      body: bodyupdate,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cookie': `token=${token}`
      }
    })
      // Validações do update
      .then((updateResponse) => {
        expect(updateResponse.status).to.eq(403);
      })
  })

  it('Update a booking with invalid token', () => {

    const bodyupdate = {
      "firstname": "Cezar",
      "lastname": "Neto",
      "totalprice": 2500,
      "depositpaid": true,
      "bookingdates":
      {
        "checkin": "2026-04-01",
        "checkout": "2026-04-10"
      },
      "additionalneeds": "Breakfast"
    }

    cy.request({
      method: 'PUT',
      url: `/booking/${bookingid}`,
      failOnStatusCode: false,
      body: bodyupdate,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}123` // token inválido
      }
    })
      // Validações do update
      .then((updateResponse) => {
        expect(updateResponse.status).to.eq(403);
      })
  })
})
