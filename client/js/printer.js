// Thermal Printer Handler (58mm)
class ThermalPrinter {
    constructor() {
        this.device = null;
        this.connected = false;
    }

    // Connect to Bluetooth printer
    async connectBluetooth() {
        try {
            if (!navigator.bluetooth) {
                throw new Error('Bluetooth tidak didukung di browser ini');
            }

            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
            });

            const server = await this.device.gatt.connect();
            this.connected = true;
            
            showNotification('Printer berhasil terhubung!');
            return true;
        } catch (error) {
            console.error('Bluetooth connection error:', error);
            showNotification('Gagal menghubungkan printer: ' + error.message, 'error');
            return false;
        }
    }

    // Generate receipt text (32 characters width for 58mm)
    generateReceipt(transaction, businessInfo) {
        const width = 32;
        const line = '='.repeat(width);
        const dashes = '-'.repeat(width);
        
        let receipt = '';

        // Header
        receipt += this.center(businessInfo.name, width) + '\n';
        receipt += this.center(businessInfo.address, width) + '\n';
        receipt += this.center(businessInfo.phone, width) + '\n';
        receipt += line + '\n';

        // Transaction info
        receipt += `No: ${transaction.transaction_no}\n`;
        receipt += `Tanggal: ${formatDateTime(transaction.created_at)}\n`;
        receipt += `Kasir: ${transaction.cashier_name}\n`;
        
        if (transaction.kapster_name) {
            receipt += `Kapster: ${transaction.kapster_name}\n`;
        }
        
        if (transaction.customer_name) {
            receipt += `Customer: ${transaction.customer_name}\n`;
        }
        
        receipt += line + '\n';

        // Items
        transaction.details.forEach(item => {
            const name = this.truncate(item.item_name, width);
            const qty = item.quantity;
            const price = formatCurrency(item.price);
            const subtotal = formatCurrency(item.subtotal);
            
            receipt += `${name}\n`;
            receipt += this.spaceBetween(`  ${qty} x ${price}`, subtotal, width) + '\n';
        });

        receipt += dashes + '\n';

        // Summary
        receipt += this.spaceBetween('Subtotal:', formatCurrency(transaction.subtotal), width) + '\n';
        
        if (transaction.discount_amount > 0) {
            receipt += this.spaceBetween('Diskon:', formatCurrency(transaction.discount_amount), width) + '\n';
        }
        
        receipt += this.spaceBetween('TOTAL:', formatCurrency(transaction.total), width) + '\n';
        receipt += line + '\n';

        // Payment
        if (transaction.payments) {
            transaction.payments.forEach(payment => {
                const method = this.getPaymentMethodName(payment.payment_method);
                receipt += this.spaceBetween(method + ':', formatCurrency(payment.amount), width) + '\n';
            });

            // Kembalian untuk tunai
            const cashPayment = transaction.payments.find(p => p.payment_method === 'cash');
            if (cashPayment && cashPayment.amount > transaction.total) {
                const change = cashPayment.amount - transaction.total;
                receipt += this.spaceBetween('Kembalian:', formatCurrency(change), width) + '\n';
            }
        }

        receipt += line + '\n';

        // Footer
        receipt += this.center('Terima Kasih', width) + '\n';
        receipt += this.center('Sudah Berkunjung', width) + '\n';
        
        if (businessInfo.instagram) {
            receipt += this.center(`IG: ${businessInfo.instagram}`, width) + '\n';
        }

        receipt += '\n\n\n';

        return receipt;
    }

    // Print receipt
    async print(transaction, copy = false) {
        const businessInfo = {
            name: 'ININOTES BARBERSHOP',
            address: 'Jl. Raya Barbershop No. 123',
            phone: '+62 812-3456-7890',
            instagram: '@ininotes'
        };

        let receipt = this.generateReceipt(transaction, businessInfo);

        if (copy) {
            receipt = '*** COPY ***\n' + receipt;
        }

        // Try different print methods
        if (this.connected && this.device) {
            await this.printViaBluetooth(receipt);
        } else if (window.Android && window.Android.print) {
            // Android WebView with native print
            window.Android.print(receipt);
        } else {
            // Fallback: Browser print dialog
            this.printViaDialog(receipt);
        }
    }

    async printViaBluetooth(text) {
        try {
            // ESC/POS commands
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            
            // Send to printer via Bluetooth
            // This is a simplified version - actual implementation depends on printer model
            console.log('Printing via Bluetooth:', text);
            showNotification('Mencetak struk...');
        } catch (error) {
            console.error('Print error:', error);
            showNotification('Gagal mencetak: ' + error.message, 'error');
        }
    }

    printViaDialog(text) {
        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Struk</title>
                <style>
                    @page { 
                        size: 58mm auto; 
                        margin: 0; 
                    }
                    body { 
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        width: 58mm;
                        margin: 0;
                        padding: 5mm;
                    }
                    pre {
                        margin: 0;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                </style>
            </head>
            <body>
                <pre>${text}</pre>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Helper functions
    center(text, width) {
        const padding = Math.floor((width - text.length) / 2);
        return ' '.repeat(Math.max(0, padding)) + text;
    }

    spaceBetween(left, right, width) {
        const spaces = width - left.length - right.length;
        return left + ' '.repeat(Math.max(1, spaces)) + right;
    }

    truncate(text, width) {
        return text.length > width ? text.substring(0, width - 3) + '...' : text;
    }

    getPaymentMethodName(method) {
        const names = {
            'cash': 'Tunai',
            'qris': 'QRIS',
            'transfer': 'Transfer',
            'debit': 'Debit'
        };
        return names[method] || method;
    }
}

// Initialize printer
const printer = new ThermalPrinter();
