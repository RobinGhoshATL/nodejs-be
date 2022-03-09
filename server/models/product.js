
module.exports = {
    getPModel(req) {
        return inputs = {
            "Products": {
                'id': req.body.id != 'undefiend' ? req.body.id : '',
                'epid': req.body.epid != 'undefiend' ? req.body.epid : '',
                'product_id': req.body.product_id != 'undefiend' ? req.body.product_id : '',
                'bottler_id': req.body.bottler_id != 'undefiend' ? req.body.bottler_id : '',
                'customer_id': req.body.customer_id != 'undefiend' ? req.body.customer_id : '',
                'store_id': req.body.store_id != 'undefiend' ? req.body.store_id : '',
                'name': req.body.name != 'undefiend' ? req.body.name : '',
                'retail_price': req.body.retail_price != 'undefiend' ? req.body.retail_price : '',
                'sale_price': req.body.sale_price != 'undefiend' ? req.body.sale_price : '',
                'skuid': req.body.skuid != 'undefiend' ? req.body.skuid : '',
                'small_image': req.body.small_image != 'undefiend' ? req.body.small_image : '',
                'active': 'active',
                'availability': '',
                'description': req.body.description != 'undefiend' ? req.body.description : '',
                'promotion': '',
                'size': '',
                'configuration': '',
                'color': '',
                'picture': '',
                'contract': '',
                'store': '',
                'created_at': new Date().toLocaleString(),
                'ReturnCode': ''
            }
        }
    }
}