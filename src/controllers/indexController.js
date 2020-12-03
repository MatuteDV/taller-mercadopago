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
        const host = 'https://mercadopagomv.herokuapp.com/';
        const url = host + 'callback?status=';

        let item = {
            id: '1234',
            picture_url: 'https://mercadopagomv.herokuapp.com/images/products/jordan.jpg',
            title: 'Nombre del producto',
            description: 'Dispositivo móvil de Tienda e-commerce',
            unit_price: Number(999),
            quantity: 1
        };

        let preference = {
            auto_return: 'approved',
            back_urls: {
                // success: req.address...?,
                success: url + 'success',
                pending: url + 'pending',
                failure: url + 'failure'
            },
            notification_url: host + 'notifications',
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
    },
    callback: (req, res) => {
        console.log(req.query);

        // Guardar en DB toda la query para luego consultar. 
        // EJ: en los cobros de estado pendiente, recibiremos a futuro la notificación en caso de pagado y deberemos marcarlo como pagado.

        // switch (req.query.status) {
        //     case 'success':
        //         return res.render('success')
        //     case 'failure':
        //         return res.render('failure')
        //     case 'pending':
        //         return res.render('pending')
        //     default:
        //         break;
        // }

        if (req.query.status.includes('success')) {
            return res.render('success')
        } else if (req.query.status.includes('pending')) {
            return res.render('pending')
        } else if (req.query.status.includes('failure')) {
            return res.render('failure')
        }

        return res.status(404).end();
    },
    notifications: (req, res) => {
        console.log(req.body);

        return res.status(200).end('ok');
    }
}