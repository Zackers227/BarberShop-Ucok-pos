// Shopping Cart Management
class Cart {
    constructor() {
        this.items = [];
        this.customer = null;
        this.kapster = null;
        this.discount = null;
    }

    addItem(item) {
        const existingItem = this.items.find(
            i => i.item_id === item.item_id && i.item_type === item.item_type
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                item_id: item.id,
                item_type: item.type, // 'service' or 'product'
                item_name: item.name,
                price: item.price,
                quantity: 1
            });
        }

        this.render();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.render();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.render();
        }
    }

    setCustomer(customerId) {
        this.customer = customerId;
    }

    setKapster(kapsterId) {
        this.kapster = kapsterId;
    }

    setDiscount(discount) {
        this.discount = discount;
        this.render();
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getDiscountAmount() {
        if (!this.discount) return 0;

        const subtotal = this.getSubtotal();
        
        if (this.discount.type === 'percentage') {
            let amount = subtotal * (this.discount.value / 100);
            if (this.discount.max_discount && amount > this.discount.max_discount) {
                amount = this.discount.max_discount;
            }
            return amount;
        } else {
            return this.discount.value;
        }
    }

    getTotal() {
        return this.getSubtotal() - this.getDiscountAmount();
    }

    clear() {
        this.items = [];
        this.customer = null;
        this.discount = null;
        this.render();
    }

    render() {
        const cartItemsEl = document.getElementById('cartItems');
        
        if (this.items.length === 0) {
            cartItemsEl.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Keranjang kosong</p>';
        } else {
            cartItemsEl.innerHTML = this.items.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.item_name}</h4>
                        <small>${formatCurrency(item.price)}</small>
                    </div>
                    <div class="cart-item-controls">
                        <div class="qty-control">
                            <button onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                        <span class="remove-btn" onclick="cart.removeItem(${index})">🗑️</span>
                    </div>
                </div>
            `).join('');
        }

        // Update summary
        document.getElementById('subtotal').textContent = formatCurrency(this.getSubtotal());
        document.getElementById('discount').textContent = formatCurrency(this.getDiscountAmount());
        document.getElementById('total').textContent = formatCurrency(this.getTotal());

        // Enable/disable payment button
        const paymentBtn = document.getElementById('paymentBtn');
        paymentBtn.disabled = this.items.length === 0;
    }

    getData() {
        return {
            customer_id: this.customer || null,
            kapster_id: this.kapster,
            items: this.items,
            discount_id: this.discount?.id || null,
            discount_amount: this.getDiscountAmount(),
            subtotal: this.getSubtotal(),
            total: this.getTotal()
        };
    }
}

// Initialize cart
const cart = new Cart();
