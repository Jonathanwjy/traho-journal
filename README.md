<h1 align="center">Traho Journal</h1>

# About
This application is designed to manage trade logging process. Traders often struggle to manage their records, such as entry reasons and 
daily updates. Especially when initial analyses shift due to dynamic market conditions. This app solves that problem by allowing users 
to append real-time analysis to their current holdings. It features a user-friendly interface with automated calculations, ensuring that 
all transaction history and notes are organized and easily accessible.
Additionally, integrated charts provide clear data visualization, helping traders evaluate their trading performance

# Technologies
- Laravel API
- React JS
- Tailwind
- ShadCN UI
- MySQL
- Chart JS

# Features
📱 Responsive layout design <br>
🔒 Secure password management <br>
📈 Add and manage stock positions <br>
✏️ Edit stock position details <br>
🔎 Search stocks easily  <br>
👀 View stock data with notes <br>
📝 Add notes to specific stock positions <br> 
✏️ Edit notes on stock positions  <br>
❌ Partially close stock positions  <br>
❌ Close entire stock positions  <br>
📊 View trading statistics with charts  <br> 
📜 View trading history with detailed notes

# Get Started
### Requirement
- PHP 8.1
- Composer
- MySQL
- Node.JS >= 16
- NPM

### Instalation
- Install PHP dependencies
```
composer install
```
- Install frontend dependencies
```
npm install
```
- Install Tailwind
```
npm install tailwindcss @tailwindcss/vite
```
- Generate Application key
```
php artisan key:generate
```
- Database configuration
- - Create a new database
  - Open .env file and configure
    ```
    DB_DATABASE=your_database_name
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```
  - Run migration:
    ```
    php artisan migrate
    ```


- How to run on React.JS:
```
npm run dev
```
- How to run on Laravel API:
```
php artisan serve
```


# API Documentation

## Base URL: http://localhost:8000

## Auth API
### Register User API
- Endpoint: POST /api/v1/register

Request Body:
```json
{
    "email" : "john@gmail.com",
    "password" : "12345678",
}
```

Response Body Success:
```json
{
    "user": {
        "email": "john@gmail.com",
        "updated_at": "2026-03-01T05:54:22.000000Z",
        "created_at": "2026-03-01T05:54:22.000000Z",
        "id": 1
    },
    "token": "token"
}
```

Response Body Error:
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```
---

### Login User API
- Endpoint: POST /api/v1/login

Request Body:
```json
{
    "email" : "john@gmail.com",
    "password" : "12345678",
}
```

Reponse Body Success:
```json
{
    "token": "token"
}
```
Response Body Error:
```json
{
    "error": "invalid credentials"
}
```
---

### Logout User API
- Endpoint: POST /api/v1/logout
- Headers:
```json
Authorization: token
Accept: Application/json
```

Reponse Body Success:
```json
{
    "success": true,
    "message": "Logout berhasil"
}
```

Response Body Error:
```json
{
    "error": "Token not valid"
}
```
---

#### Change Password API
- Endpoint: POST api/v1/change-password
- Headers:
```json
Authorization: token
Accept: Application/json
```

Request Body:
```json
{
    "old_password": "12345678",
    "new_password": "11111111"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Password berhasil diubah."
}
```

Reponse Body Error:
```json
{
    "success": false,
    "message": "Password lama tidak sesuai"
}
```
<br>
<br>

## Stocks API
### Store Stocks API
- Endpoint: POST /api/v1/stocks/store
- Headers:
```json
Authorization: token
Accept: Application/json
```

Request Body:
```json
{
  "name": "BBCA",
  "buy_price": 6000,
  "lot_size": 1,
  "buy_date": "2025-01-20",
  "action": "long",
  "conviction": "Harga Bottom"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Stock created successfully",
    "data": {
        "user_id": 1,
        "name": "BBCA",
        "buy_price": 6000,
        "average_price": 6000,
        "lot_size": 1,
        "buy_date": "2025-01-20",
        "action": "long",
        "conviction": "Harga Bottom",
        "balance": 600000,
        "updated_at": "2026-03-01T06:52:13.000000Z",
        "created_at": "2026-03-01T06:52:13.000000Z",
        "id": 1
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "errors": {
        "buy_price": [
            "The buy price field is required."
        ]
    }
}
```
---
### Get Stocks List API
- Endpoint: GET /api/v1/stocks/index
- Headers:
```json
Authorization: token
Accept: Application/json
```

Response Body Success:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "name": "BBCA",
            "buy_price": 9250,
            "average_price": 9300,
            "lot_size": 2,
            "buy_date": "2025-01-20",
            "action": "long",
            "conviction": "Sangat Gacor",
            "created_at": "2026-01-29T12:06:21.000000Z",
            "updated_at": "2026-01-29T13:00:13.000000Z",
            "status": "close",
            "balance": null
        },
    ]
}
```

Response Body Error:
```json
{
    "error": "Token not valid"
}
```
---

### Update Stock API
- Endpoint: PATCH /api/v1/stocks/{id}/update
- Headers:
```json
Authorization: token
Accept: Application/json
```

Request Body:
```json
{
    "buy_price": 7000,
    "lot_size": 3
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Stock berhasil diupdate",
    "data": {
        "id": 21,
        "user_id": 1,
        "name": "BBCA",
        "buy_price": 7000,
        "average_price": 7000,
        "lot_size": 3,
        "buy_date": "2025-01-20",
        "action": "long",
        "conviction": "Harga Bottom",
        "created_at": "2026-03-01T06:52:13.000000Z",
        "updated_at": "2026-03-01T06:57:25.000000Z",
        "status": "open",
        "balance": 2100000
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "errors": {
        "lot_size": [
            "The lot size field must be at least 1."
        ]
    }
}
```
---

### Show Detail Stock API
- Endpoint: GET /api/v1/stocks/{id}/show
- Headers:
```json
Authorization: token
Accept: Application/json
```

Response Body Success:
```json
{
    "success": true,
    "message": "Detail stock dan notes berhasil diambil",
    "data": {
        "id": 21,
        "user_id": 1,
        "name": "BBCA",
        "buy_price": 7000,
        "average_price": 7000,
        "lot_size": 3,
        "buy_date": "2025-01-20",
        "action": "long",
        "conviction": "Harga Bottom",
        "created_at": "2026-03-01T06:52:13.000000Z",
        "updated_at": "2026-03-01T06:57:25.000000Z",
        "status": "open",
        "balance": 2100000,
        "notes": []
    }
}
```

Response Body Error
```json
{
    "success": false,
    "message": "Data stock tidak ditemukan"
}
```
---

### Close Position Stock API
- Endpoint: POST /api/v1/stocks/{id}/close
- Headers:
```json
Authorization: token
Accept: Application/json
```

Request Body:
```json
{
    "lot" : 1,
    "sell_price": 6000,
    "close_date": "2026-03-01",
    "reason": "Sudah hit target TP"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Posisi berhasil ditutup",
    "data": {
        "stock_id": 21,
        "name": "BBCA",
        "buy_price": 7000,
        "sell_price": 6000,
        "lot_size": 1,
        "buy_date": "2025-01-20",
        "close_date": "2026-03-01",
        "action": "long",
        "realized_gain": -100000,
        "reason": "Sudah hit target TP",
        "percentage_gain": -14.29,
        "updated_at": "2026-03-01T07:11:25.000000Z",
        "created_at": "2026-03-01T07:11:25.000000Z",
        "id": 28
    }
}
```

Reponse Body Error:
```json
{
    "success": false,
    "errors": {
        "sell_price": [
            "The sell price field must be at least 1."
        ]
    }
}
```

<br>
<br>

## Notes API
### Store Notes API
- Endpoint: POST /api/v1/stocks/{id}/notes
- Headers:
```json
Authorization: token
Accept: Application/json
```

Request Body:
```json
{
    "type" : "avg_up",
    "price": 6000,
    "lot": 3,
    "content": "Akumulasi Besar"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Note berhasil ditambahkan",
    "data": {
        "user_id": 1,
        "stock_id": 21,
        "type": "avg_up",
        "note_date": "2026-03-01",
        "price": 6000,
        "lot": 3,
        "content": "Akumulasi Besar",
        "updated_at": "2026-03-01T07:17:35.000000Z",
        "created_at": "2026-03-01T07:17:35.000000Z",
        "id": 43
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "errors": {
        "price": [
            "The price field must be at least 1."
        ]
    }
}
```
---

### Notes List API
- Endpoint: GET /api/v1/stocks/{id}/notes
- Headers:
```json
Authorization: token
Accept: Application/json
```

Response Body Success:
```json
{
    "success": true,
    "data": [
        {
            "id": 43,
            "user_id": 1,
            "stock_id": 21,
            "type": "avg_up",
            "note_date": "2026-03-01",
            "price": 6000,
            "content": "Akumulasi Besar",
            "created_at": "2026-03-01T07:17:35.000000Z",
            "updated_at": "2026-03-01T07:17:35.000000Z",
            "lot": 3
        }
    ]
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Stock tidak ditemukan atau bukan milik Anda"
}
```
---

### Update Notes API
- Endpoint: GET /api/v1/notes/{id}
- Headers:
```json
Authorization: token
Accept: Application/json
```

Request Body:
```json
{
    "type": "avg_up",
    "price": 7000,
    "lot": 3,
    "content": "Akumulasi"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Catatan berhasil diperbarui",
    "data": {
        "id": 43,
        "user_id": 1,
        "stock_id": 21,
        "type": "avg_up",
        "note_date": "2026-03-01",
        "price": 7000,
        "content": "Akumulasi",
        "created_at": "2026-03-01T07:17:35.000000Z",
        "updated_at": "2026-03-01T07:31:43.000000Z",
        "lot": 3
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "errors": {
        "type": [
            "The type field is required."
        ],
        "content": [
            "The content field is required."
        ]
    }
}
```

<br>
<br>

## Stats API
### Show Stats API
- Endpoint: GET /api/v1/stats/show
- Headers:
```json
Authorization: token
Accept: Application/json
```

Response Body Succes:
```json
{
    "success": true,
    "message": "Berhasil mengambil data statistik",
    "data": {
        "id": 1,
        "user_id": 1,
        "total_trades": 12,
        "total_win": 4,
        "total_loss": 8,
        "realized_earn": 735002,
        "total_balance": 3705000,
        "realized_loss": -785000,
        "realized_profit": 1520002,
        "win_rate": 33.33,
        "created_at": "2026-01-31T03:33:23.000000Z",
        "updated_at": "2026-01-31T04:15:54.000000Z"
    }
}
```

Response Body Error:
```json
{
    "error": "Token not valid"
}
```
---

### Refresh Stats API
- Endpoint: POST /api/v1/stats/refresh
- Headers:
```json
Authorization: token
Accept: Application/json
```

Response Body Success:
```json
{
    "success": true,
    "message": "Statistik berhasil diperbarui",
    "data": {
        "id": 1,
        "user_id": 1,
        "total_trades": 13,
        "total_win": 4,
        "total_loss": 9,
        "realized_earn": 635002,
        "total_balance": 7205000,
        "realized_loss": -885000,
        "realized_profit": 1520002,
        "win_rate": 30.77,
        "created_at": "2026-01-31T03:33:23.000000Z",
        "updated_at": "2026-03-02T05:32:55.000000Z"
    }
}
```

Reponse Body Error
```json
{
    "error": "Token not valid"
}
```
---

### Detail Closed Position API
- Endpoint: /api/v1/stats/detail/{id}
- Headers:
```json
Authorization: token
Accept: Application/json
```

Reponse Body Success:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "stock_id": 1,
        "name": "BBCA",
        "buy_price": 7000,
        "sell_price": 6000,
        "lot_size": 1,
        "buy_date": "2025-01-20",
        "close_date": "2026-03-01",
        "action": "long",
        "realized_gain": -100000,
        "reason": "Sudah hit target TP",
        "percentage_gain": -14.29,
        "created_at": "2026-03-01T07:11:25.000000Z",
        "updated_at": "2026-03-01T07:11:25.000000Z",
        "stock": {
            "id": 1,
            "user_id": 1,
            "name": "BBCA",
            "buy_price": 7000,
            "average_price": 7000,
            "lot_size": 5,
            "buy_date": "2025-01-20",
            "action": "long",
            "conviction": "Harga Bottom",
            "created_at": "2026-03-01T06:52:13.000000Z",
            "updated_at": "2026-03-01T07:31:43.000000Z",
            "status": "open",
            "balance": 3500000
        }
    },
    "notes": [
        {
            "id": 1,
            "user_id": 1,
            "stock_id": 1,
            "type": "avg_up",
            "note_date": "2026-03-01",
            "price": 7000,
            "content": "Akumulasi",
            "created_at": "2026-03-01T07:17:35.000000Z",
            "updated_at": "2026-03-01T07:31:43.000000Z",
            "lot": 3
        }
    ]
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Data Closed Position tidak ditemukan atau bukan milik Anda"
}
```

