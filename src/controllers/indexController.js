const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },
    buy: (req, res) => {
        let item = {
            id: '1',
            picture_url: 'https://mercadopagomv.herokuapp.com/images/products/jordan.jpg',
            title: 'Nombre del producto',
            description: 'Descripción del producto',
            unit_price: 16500,
            quantity: 3
        };

        let preference = {
            payment_methods: {
                excluded_payment_methods: [
                    {id: 'visa'}
                ],
                excluded_payment_types: [
                    {id: 'amt'}
                ],
                installments: 12
            },
            items: [
              item
            ],
            payer: {
                name: 'Ryan',
                surname: 'Dahl',
                email: 'test_user_63274575@testuser.com',
                phone: {
                    area_code: '011',
                    number: 55556666
                },
                address: {
                    zip_code: '1234',
                    street_name: 'monroe',
                    street_number: 860
                }
            },
            // external_references: 'string(256)'
        };

        mercadopago.preferences.create(preference)
        .then(response =>{
            global.init_point = response.body.init_point;
            return res.render('confirm');
        })
        .catch(err => {
            console.log(err);
            return res.send('error');
        });
    }
}