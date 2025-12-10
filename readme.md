# Lumière Restaurant Website - Full Stack Application

A complete restaurant website with Go backend, PostgreSQL database, Stripe payment integration, and order tracking system.

## 🏗️ Project Structure

```
restaurant-website/
├── frontend/              # Your existing HTML/CSS/JS
│   ├── index.html
│   ├── menu.html
│   ├── about.html
│   ├── contact.html
│   ├── packages.html
│   ├── cart.html         # NEW: Shopping cart
│   ├── checkout.html     # NEW: Stripe payment
│   ├── tracking.html     # NEW: Order tracking
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── script.js
│       └── menu-dynamic.js  # NEW: Dynamic menu loading
│
├── admin/                 # NEW: Admin dashboard
│   └── admin.html
│
└── backend/              # NEW: Go API
    ├── main.go
    ├── go.mod
    └── uploads/          # Created automatically
```

## 🚀 Setup Instructions

### 1. Prerequisites

- **Go 1.21+** - [Download](https://golang.org/dl/)
- **PostgreSQL** (Neon) - [Sign up](https://neon.tech/)
- **Stripe Account** - [Sign up](https://stripe.com/)

### 2. Database Setup (Neon PostgreSQL)

1. Create a Neon PostgreSQL database at https://neon.tech/
2. Copy your connection string (it looks like: `postgresql://user:pass@host/dbname`)
3. The backend will automatically create the necessary tables

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Initialize Go module (if go.mod doesn't exist)
go mod init restaurant-backend

# Install dependencies
go get github.com/gorilla/mux
go get github.com/lib/pq
go get github.com/rs/cors
go get github.com/stripe/stripe-go/v72

# Set environment variables
export DATABASE_URL="your_neon_postgresql_connection_string"
export STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
export PORT="8080"

# Run the server
go run main.go
```

**For Windows:**
```cmd
set DATABASE_URL=your_neon_postgresql_connection_string
set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
set PORT=8080
go run main.go
```

### 4. Get Stripe API Keys

1. Go to https://dashboard.stripe.com/
2. Navigate to **Developers > API Keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)
5. Update in:
   - Backend: `STRIPE_SECRET_KEY` environment variable
   - Frontend: `checkout.html` - Replace `STRIPE_PUBLISHABLE_KEY`

### 5. Frontend Setup

Update API_URL in these files (change `localhost:8080` if needed):
- `frontend/js/menu-dynamic.js`
- `frontend/cart.html`
- `frontend/checkout.html`
- `frontend/tracking.html`
- `admin/admin.html`

**Option 1: Simple Python Server**
```bash
cd frontend
python -m http.server 3000
```

**Option 2: Live Server (VS Code Extension)**
- Install "Live Server" extension
- Right-click on `index.html` > Open with Live Server

Visit: `http://localhost:3000`

### 6. Admin Dashboard

Visit: `http://localhost:3000/admin/admin.html`

**Features:**
- Add menu items with images
- View all orders
- Update order tracking status
- Delete menu items

## 📋 Features

### Customer Features
✅ Dynamic menu loaded from database  
✅ Shopping cart with localStorage  
✅ Stripe payment integration  
✅ Order tracking with real-time updates  
✅ Responsive design  

### Admin Features
✅ Add/delete menu items with image upload  
✅ View all orders  
✅ Update order status and tracking  
✅ Real-time order management  

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:pass@host/database?sslmode=require
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PORT=8080
```

### CORS Configuration

If your frontend is on a different domain, update CORS in `main.go`:

```go
AllowedOrigins: []string{"http://localhost:3000", "https://yourdomain.com"}
```

## 🗄️ Database Schema

### Tables Created Automatically:

**menu_items**
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- category (VARCHAR)
- image_url (TEXT)
- ingredients (TEXT)
- created_at (TIMESTAMP)

**orders**
- id (SERIAL PRIMARY KEY)
- customer_name (VARCHAR)
- customer_email (VARCHAR)
- customer_phone (VARCHAR)
- items (TEXT - JSON)
- total_amount (DECIMAL)
- status (VARCHAR)
- tracking_id (VARCHAR UNIQUE)
- payment_status (VARCHAR)
- created_at (TIMESTAMP)

**order_tracking**
- id (SERIAL PRIMARY KEY)
- order_id (INTEGER FK)
- status (VARCHAR)
- location (VARCHAR)
- update_message (TEXT)
- updated_at (TIMESTAMP)

## 🎯 API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu?category=starters` - Filter by category
- `POST /api/menu` - Add menu item (Admin)
- `DELETE /api/menu/{id}` - Delete menu item (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/tracking/{tracking_id}` - Get order by tracking ID
- `POST /api/orders/{id}/tracking` - Update tracking (Admin)

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment intent

## 🧪 Testing

### Test Stripe Payments

Use these test card numbers:
- **Success:** `4242 4242 4242 4242`
- **Requires authentication:** `4000 0025 0000 3155`
- **Declined:** `4000 0000 0000 9995`

Use any future date for expiry, any 3 digits for CVC, and any ZIP code.

## 📱 Usage Flow

### Customer Journey:
1. Browse menu at `/menu.html`
2. Add items to cart
3. View cart at `/cart.html`
4. Checkout at `/checkout.html`
5. Make payment with Stripe
6. Receive tracking ID
7. Track order at `/tracking.html`

### Admin Workflow:
1. Login to admin at `/admin/admin.html`
2. Add menu items with images
3. View incoming orders
4. Update order status and tracking
5. Customer sees updates in real-time

## 🐛 Troubleshooting

**Backend won't start:**
- Check DATABASE_URL is correct
- Ensure PostgreSQL is accessible
- Verify Go dependencies are installed

**Menu not loading:**
- Check API_URL in frontend files
- Verify backend is running on correct port
- Check browser console for errors

**Payment failing:**
- Verify Stripe keys are correct
- Check you're using test keys for development
- Ensure HTTPS in production

**Images not showing:**
- Check uploads folder permissions
- Verify image paths in database
- Check CORS settings

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy Go application
3. Update frontend API_URL to deployed backend URL

### Frontend (Netlify/Vercel)
1. Build static site
2. Deploy frontend files
3. Update CORS in backend to allow frontend domain

## 📄 License

This project is for educational purposes.

## 👨‍💻 Support

For issues or questions, please check:
- Go documentation: https://golang.org/doc/
- Stripe docs: https://stripe.com/docs
- Neon docs: https://neon.tech/docs

---

**Happy Coding! 🎉**