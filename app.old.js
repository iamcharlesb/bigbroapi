import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"
import Amadeus from 'amadeus';

const app = express();
const PORT = process.env.PORT || 3000;

app.get(`/flight-search`, (req, res) => {

	const [
		originCode, destinationCode, dateOfDeparture, adults, 
		max, children, infants, travelClass, includedAirlineCodes, 
		excludedAirlineCodes, nonStop, currencyCode, maxPrice, max] = req.query;
	
	let payload = {
		originLocationCode: originCode,
		destinationLocationCode: destinationCode,
		departureDate: dateOfDeparture,
		adults: '1',
		max: '7'
	};

	payload['returnDate'] = req

	// Find the cheapest flights
	amadeus.shopping.flightOffersSearch.get(payload).then(function (response) {
		res.send(response.result);
	}).catch(function (response) {
		res.send(response);
	});
});

app.post(`/flight-confirmation`, (req, res) => {
	const flight = req.body.flight
	// Confirm availability and price
	amadeus.shopping.flightOffers.pricing.post(
		JSON.stringify({
			'data': {
				'type': 'flight-offers-pricing',
				'flightOffers': [flight],
			}
		})
	).then(function (response) {
		res.send(response.result);
	}).catch(function (response) {
		res.send(response)
	})
});

app.post(`/flight-booking`, (req, res) => {
	// Book a flight
	const flight = req.body.flight;
	const name = req.body.name
	amadeus.booking.flightOrders.post(
		JSON.stringify({
			'data': {
				'type': 'flight-order',
				'flightOffers': [flight],
				'travelers': [{
					"id": "1",
					"dateOfBirth": "1982-01-16",
					"name": {
						"firstName": name.first,
						"lastName": name.last
					},
					"gender": "MALE",
					"contact": {
						"emailAddress": "jorge.gonzales833@telefonica.es",
						"phones": [{
							"deviceType": "MOBILE",
							"countryCallingCode": "34",
							"number": "480080076"
						}]
					},
					"documents": [{
						"documentType": "PASSPORT",
						"birthPlace": "Madrid",
						"issuanceLocation": "Madrid",
						"issuanceDate": "2015-04-14",
						"number": "00000000",
						"expiryDate": "2025-04-14",
						"issuanceCountry": "ES",
						"validityCountry": "ES",
						"nationality": "ES",
						"holder": true
					}]
				}]
			}
		})
	).then(function (response) {
		res.send(response.result);
	}).catch(function (response) {
		res.send(response);
	});
});

app.get(`/city-and-airport-search/:parameter`, (req, res) => {
	const parameter = req.params.parameter;
	// Which cities or airports start with the parameter variable
	amadeus.referenceData.locations
			.get({
					keyword: parameter,
					subType: Amadeus.location.any,
			})
			.then(function (response) {
					res.send(response.result);
			})
			.catch(function (response) {
					res.send(response);
			});
});

app.use(bodyParser.json())
app.use(cors({
	origin: ``'http://localhost:4200'
}));
app.listen(PORT, () =>
	console.log(`Server is running on port: http://localhost:${PORT}`)
);

const amadeus = new Amadeus({
	clientId: 'j4HN4piy4WRabC6Rdgg4RhBN8icoDerF',
	clientSecret: 'aCftlcFJHU9se5Tl',
});