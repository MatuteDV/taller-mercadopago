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
            picture_url: host + 'images/products/jordan.jpg',
            title: req.body.name,
            description: 'Dispositivo móvil de Tienda e-commerce',
            unit_price: Number(req.body.price),
            quantity: 1
        };
        let preference = {
            auto_return: 'approved',
            back_urls: {
                success: url + 'success',
                pending: url + 'pending',
                failure: url + 'failure'
            },
            notification_url: host + 'notifications',
            payment_methods: {
                excluded_payment_methods: [
                    {id: 'amex'}
                ],
                excluded_payment_types: [
                    {id: 'atm'}
                ],
                installments: 6
            },
            items: [
              item
            ],
            payer: {
                name: 'Lalo',
                surname: 'Landa',
                email: 'test_user_63274575@testuser.com',
                phone: {
                    area_code: '11',
                    number: 22223333
                },
                address: {
                    zip_code: '1111',
                    street_name: 'False',
                    street_number: 123
                }
            },
            external_reference: 'matiasvieira0@gmail.com'
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

        if (req.query.status.includes('success')) {
            return res.render('success',{
                payment_type: req.query.payment_type,   // ver esto
                external_reference: req.query.external_reference,
                payment_id: req.query.payment_id,
                collection_id: req.query.collection_id
            });
        } else if (req.query.status.includes('pending')) {
            return res.render('pending')
        } else if (req.query.status.includes('failure')) {
            return res.render('failure')
        }

        return res.status(404).end();
    },
    notifications: (req, res) => {
        console.log('webhook', req.body);

        return res.status(200).end('ok');
    }
}