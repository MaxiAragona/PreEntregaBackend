const fs = require("fs");

class CartManager {
    constructor(path) {
        this.path = path;
        this.init();
    }

    async init() {
        const carts = await this.getCarts()
        await this.setCarts(carts);
    }

    async getCarts() {
        try {
            return JSON.parse(fs.readFileSync(this.path));
        } catch {
            return [];
        }
    }

    async setCarts(carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
    }

    async addCart(cart) {
        const { products } = cart
        if (!products) {
            throw new Error("Todos los campos son obligatorios");
        }

        const carts = await this.getCarts()

        const newCart = {
            id: (await this.getLastId())+1,
            products
        }
        carts.push(newCart);
        await this.setCarts(carts);

        return newCart;
    }

    async addProductToCart(id, pid) {
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id === id);

        if (!cart) {
            throw new Error("El carrito solicitado no existe");
        }

        const product = cart.products.find(product => product.product === pid);

        if (product) {
            product.quantity++;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }

        await this.setCarts(carts);

        return cart;
    }

    async getCartById(id) {
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id === id);

        if (!cart) {
            console.error("No se ha encontrado el carrito.");

        } else {
            console.log("Carto encontrado.", cart);
        }
        return cart;
    }

    async getLastId(){
        const carts = await this.getCarts();
        let id = 0;

        carts.forEach(cart => {
            if(cart.id > id ) {
                id = cart.id;
            }
        });
        return id;
    }
}

module.exports = CartManager;
