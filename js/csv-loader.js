// CSV Data Loader for Products
class CSVProductLoader {
    constructor() {
        this.products = [];
        this.categories = this.initializeCategories();
        this.loaded = false;
    }

    // Initialize category definitions
    initializeCategories() {
        return {
            'health-tests': {
                name: 'Domácí zdravotní testy',
                description: 'Poznáte svůj zdravotní stav díky jednoduchým domácím testům'
            },
            'omega': {
                name: 'Doplňky stravy Omega',
                description: 'Prémiové omega-3 produkty pro optimální zdraví'
            },
            'restore': {
                name: 'Doplňky na regeneraci',
                description: 'Podpora obnovy a regenerace organizmu'
            },
            'immune': {
                name: 'Doplňky na imunitu',
                description: 'Posílení imunitního systému přirozenou cestou'
            },
            'gut-health': {
                name: 'Zdravá střeva',
                description: 'Podpora zdravého střevního mikrobiomu'
            },
            'weight-management': {
                name: 'Podpora hubnutí',
                description: 'Produkty pro kontrolu hmotnosti a zdravý životní styl'
            },
            'skin-care': {
                name: 'Péče o pleť',
                description: 'Komplexní péče o pleť pro všechny typy pokožky'
            },
            'skin-nutrition': {
                name: 'Výživa pleti',
                description: 'Výživa pro krásnou pleť zevnitř'
            },
            'accessories': {
                name: 'Doplňky',
                description: 'Užitečné doplňky a příslušenství'
            }
        };
    }

    // Parse CSV data and convert to product objects
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(';');
        
        this.products = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            
            if (values.length === headers.length) {
                const product = {
                    id: parseInt(values[0]),
                    code: values[1],
                    name: values[2],
                    description: values[3].replace(/"/g, ''), // Remove quotes
                    price: parseInt(values[4]),
                    originalPrice: values[5] ? parseInt(values[5]) : null,
                    savings: values[6] ? parseInt(values[6]) : null,
                    image: values[7],
                    category: values[8],
                    featured: values[9] === 'ANO',
                    badge: values[10] || null
                };
                
                this.products.push(product);
            }
        }
        
        this.loaded = true;
        return this.products;
    }

    // Parse CSV line handling quotes and commas
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ';' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // Load products from CSV file
    async loadProducts() {
        try {
            console.log('Loading products from CSV...');
            const response = await fetch('data/produkty.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            console.log('CSV loaded, length:', csvText.length);
            console.log('First 200 chars:', csvText.substring(0, 200));
            
            const products = this.parseCSV(csvText);
            console.log('Parsed products:', products.length);
            
            return products;
        } catch (error) {
            console.error('Error loading products from CSV:', error);
            // Fallback to empty array if CSV loading fails
            return [];
        }
    }

    // Get all products
    getProducts() {
        return this.products;
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Get products by category
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Get featured products
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    // Search products
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.code.toLowerCase().includes(searchTerm)
        );
    }

    // Get products by price range
    getProductsByPriceRange(min, max) {
        return this.products.filter(product => product.price >= min && product.price <= max);
    }

    // Get categories
    getCategories() {
        return this.categories;
    }
}

// Global instance
const productLoader = new CSVProductLoader();

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await productLoader.loadProducts();
    
    // Dispatch custom event when products are loaded
    document.dispatchEvent(new CustomEvent('productsLoaded', { 
        detail: { products: productLoader.getProducts() }
    }));
});
