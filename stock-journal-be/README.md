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
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL3YxL3JlZ2lzdGVyIiwiaWF0IjoxNzcyMzQ0NDYyLCJleHAiOjE3NzIzNDgwNjIsIm5iZiI6MTc3MjM0NDQ2MiwianRpIjoiRkN6YVY1S0VrZ3U4eERmZyIsInN1YiI6IjgiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.X3Y7-orkdQyhVgz5xW8MIzcZwIG6HFRftL_r-sP9s6w"
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
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL3YxL2xvZ2luIiwiaWF0IjoxNzcyMzQ0NzY0LCJleHAiOjE3NzIzNDgzNjQsIm5iZiI6MTc3MjM0NDc2NCwianRpIjoia1BHTHdmNldEUEtwVkJQZSIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.HmNs9LpnvDaEyyU0aIxZD7xSiuEccHTihH_0Mjlj4OQ"
}
```
Response Body Error:
```json
{
    "error": "invalid credentials"
}
```


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

