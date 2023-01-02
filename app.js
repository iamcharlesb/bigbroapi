import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Amadeus from 'amadeus';
import Stripe from 'stripe';

const app = express();
const PORT = process.env.PORT || 3000;

const amadeus = new Amadeus({
	clientId: 'j4HN4piy4WRabC6Rdgg4RhBN8icoDerF',
	clientSecret: 'aCftlcFJHU9se5Tl',
});

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/book', (req, res) => {
    const book = req.body;

    // We will be coding here
    console.log(book);

    res.send('Book is added to the database');
});

app.get(`/flight-search`, (req, res) => {

	/*const [
		originCode, destinationCode, dateOfDeparture, adults, 
		max, children, infants, travelClass, includedAirlineCodes, 
    excludedAirlineCodes, nonStop, currencyCode, maxPrice] = req.query;*/

  console.log('req.query - ', req.query)
    
  /*const [
    originCode, destinationCode, dateOfDeparture, adults, 
    max, children, infants, travelClass, includedAirlineCodes, 
    nonStop, currencyCode, maxPrice] = req.query;*/
	
	let payload = {
		originLocationCode: req.query.originLocationCode,
		destinationLocationCode: req.query.destinationLocationCode,
    departureDate: req.query.departureDate,
    returnDate: req.query.returnDate,
    adults: req.query.adults,
    children: req.query.children,
    infants: req.query.infants,
    travelClass: req.query.travelClass,
    includedAirlineCodes: req.query.includedAirlineCodes,
    excludedAirlineCodes: req.query.excludedAirlineCodes,
    nonStop: req.query.nonStop,
    currencyCode: req.query.currencyCode,
    maxPrice: req.query.maxPrice,
    max: req.query.max,    
	};

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
    
    console.log('Result - ', {
        "data": {
            "type": "flight-offers-pricing",
            "flightOffers": [flight]
        }
    });

	amadeus.shopping.flightOffers.pricing.post(
		JSON.stringify({
            "data": {
              "type": "flight-offers-pricing",
              "flightOffers": [flight]
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
    
    console.log('Booking payload - ', JSON.stringify({
        "data": {
          "type": "flight-order",
          "flightOffers": [flight],                  
          "travelers": [
            {
              "id": "1",
              "dateOfBirth": "1982-01-16",
              "name": {
                "firstName": name.first,
                "lastName": name.last
              },
              "gender": "MALE",
              "contact": {
                "emailAddress": "jorge.gonzales833@telefonica.es",
                "phones": [
                  {
                    "deviceType": "MOBILE",
                    "countryCallingCode": "34",
                    "number": "480080076"
                  }
                ]
              },
              "documents": [
                {
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
                }
              ]
            }
          ],
          "remarks": {
            "general": [
              {
                "subType": "GENERAL_MISCELLANEOUS",
                "text": "ONLINE BOOKING FROM INCREIBLE VIAJES"
              }
            ]
          },
          "ticketingAgreement": {
            "option": "DELAY_TO_CANCEL",
            "delay": "6D"
          },
          "contacts": [
            {
              "addresseeName": {
                "firstName": "PABLO",
                "lastName": "RODRIGUEZ"
              },
              "companyName": "INCREIBLE VIAJES",
              "purpose": "STANDARD",
              "phones": [
                {
                  "deviceType": "LANDLINE",
                  "countryCallingCode": "34",
                  "number": "480080071"
                },
                {
                  "deviceType": "MOBILE",
                  "countryCallingCode": "33",
                  "number": "480080072"
                }
              ],
              "emailAddress": "support@increibleviajes.es",
              "address": {
                "lines": [
                  "Calle Prado, 16"
                ],
                "postalCode": "28014",
                "cityName": "Madrid",
                "countryCode": "ES"
              }
            }
          ]
        }
      }));

	amadeus.booking.flightOrders.post(
		JSON.stringify({
                "data": {
                  "type": "flight-order",
                  "flightOffers": flight,
                  "travelers": [
                    {
                      "id": "1",
                      "dateOfBirth": "1982-01-16",
                      "name": {
                        "firstName": name.first,
						"lastName": name.last
                      },
                      "gender": "MALE",
                      "contact": {
                        "emailAddress": "jorge.gonzales833@telefonica.es",
                        "phones": [
                          {
                            "deviceType": "MOBILE",
                            "countryCallingCode": "34",
                            "number": "480080076"
                          }
                        ]
                      },
                      "documents": [
                        {
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
                        }
                      ]
                    }
                  ],
                  "remarks": {
                    "general": [
                      {
                        "subType": "GENERAL_MISCELLANEOUS",
                        "text": "ONLINE BOOKING FROM INCREIBLE VIAJES"
                      }
                    ]
                  },
                  "ticketingAgreement": {
                    "option": "DELAY_TO_CANCEL",
                    "delay": "6D"
                  },
                  "contacts": [
                    {
                      "addresseeName": {
                        "firstName": "PABLO",
                        "lastName": "RODRIGUEZ"
                      },
                      "companyName": "INCREIBLE VIAJES",
                      "purpose": "STANDARD",
                      "phones": [
                        {
                          "deviceType": "LANDLINE",
                          "countryCallingCode": "34",
                          "number": "480080071"
                        },
                        {
                          "deviceType": "MOBILE",
                          "countryCallingCode": "33",
                          "number": "480080072"
                        }
                      ],
                      "emailAddress": "support@increibleviajes.es",
                      "address": {
                        "lines": [
                          "Calle Prado, 16"
                        ],
                        "postalCode": "28014",
                        "cityName": "Madrid",
                        "countryCode": "ES"
                      }
                    }
                  ]
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

const YOUR_DOMAIN = 'http://localhost:3001';

const stripe = new Stripe('sk_test_51MKzLNBe5HirBj2t288YoMXZdgqtCRYdqfTCoLvkdCIgtXKKRWG2P5TrmqxeWejkFgKs8nXD3JDecM1ooxtvMYnO00pwd2ynFS');

const listAllProducts = async () => {
  const products = await stripe.products.list();
  return products;
}

const createProduct = async ( total_price ) => {

  console.log('total_price - ', total_price,'&& - ', Math.floor(total_price, 2));

  const product = await stripe.products.create({
    name: 'test_v3',
    default_price_data: {
      currency: 'USD',
      unit_amount_decimal: total_price.replace('.','')
    }
  });
  return product;
}

app.post('/create-checkout-session', async (req, res) => {

  console.log('req - ', req.bdoy);

  //listAllProducts().then(response => console.log('Response - ', response));

  createProduct(req.body.total_price).then( async (response)=> {
    console.log('response - ', response)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: response.default_price,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/preview?success=true`,
      cancel_url: `${YOUR_DOMAIN}/preview?canceled=true`,
    });
  
    res.redirect(303, session.url);
  });
  
});

app.listen(PORT, () => console.log(`Hello world app listening on port ${PORT}!`));