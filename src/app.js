const ProductManager = require("./ProductManager")
const express = require('express')
const app = express()
const port = 8080

app.use(express.json());

// creamos la instancia del manager
const manager = new ProductManager("./src/maxProducts.json");

app.get('/products', async (req, res) => {
    const products = await manager.getProducts();
    let limit = parseInt(req.query.limit);

    if(isNaN(limit)){
        res.send(products);
    } else {
        res.send(products.slice(0, limit))
    }
})

app.get("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await manager.getProductById(id);

    if(product) {
        res.send(product);
    } else {
        res.status(404).send("producto no encontrado");
    }
})

app.post('/products', async (req, res) => {
    try {
        const product = await manager.addProduct(req.body);
        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.put('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await manager.updateProduct(id, req.body);
        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);   
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

