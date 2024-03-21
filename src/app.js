const ProductManager = require("./ProductManager")
const CartManager = require("./CartManager")
const express = require('express')
const app = express()
const port = 8080

app.use(express.json());

// creamos la instancia del manager para los productos
const productsManager = new ProductManager("./src/products.json");

// creamos la instancia del manager para el carrito
const cartsManager = new CartManager("./src/carts.json");

app.get('/api/products', async (req, res) => {
    const products = await productsManager.getProducts();
    let limit = parseInt(req.query.limit);

    if(isNaN(limit)){
        res.send(products);
    } else {
        res.send(products.slice(0, limit))
    }
})

app.get('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await productsManager.getProductById(id);

    if(product) {
        res.send(product);
    } else {
        res.status(404).send("producto no encontrado");
    }
})

app.post('/api/products', async (req, res) => {
    try {
        const product = await productsManager.addProduct(req.body);
        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.put('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productsManager.updateProduct(id, req.body);
        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await productsManager.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.post('/api/carts', async (req, res) => {
    try {
        const cart = await cartsManager.addCart(req.body);
        res.send(cart);
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.get('/api/carts/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const cart = await cartsManager.getCartById(id);

    if(cart) {
        res.send(cart.products);
    } else {
        res.status(404).send("carrito no encontrado");
    }
})

app.post('/api/carts/:id/product/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pid = parseInt(req.params.pid);
        const cart = await cartsManager.addProductToCart(id, pid);

        res.send(cart);
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

