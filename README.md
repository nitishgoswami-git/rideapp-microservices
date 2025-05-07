# Uber-MicroServices

# 🚀 Backend API Documentation

---

## 👤 `/users/register` Endpoint

### 📝 Description

Registers a new user by creating a user account with the provided information.

### 📩 HTTP Method

`POST`

### 📥 Request Body

JSON format:

* `fullname` (object):

  * `firstname` (string, required): Minimum 3 characters.
  * `lastname` (string, optional): Minimum 3 characters.
* `email` (string, required): Must be a valid email.
* `password` (string, required): Minimum 6 characters.

### 📤 Example Response

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "******"
  },
  "token": "JWT_TOKEN"
}
```

---

## 🔐 `/users/login` Endpoint

### 📝 Description

Authenticates a user and returns a JWT token.

### 📩 HTTP Method

`POST`

### 📥 Request Body

JSON format:

* `email` (string, required): Must be a valid email.
* `password` (string, required): Minimum 6 characters.

### 📤 Example Response

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "******"
  },
  "token": "JWT_TOKEN"
}
```

---

## 🧾 `/users/profile` Endpoint

### 📝 Description

Fetches profile info for the authenticated user.

### 📩 HTTP Method

`GET`

### 🔐 Authentication

`Authorization: Bearer <token>`

### 📤 Example Response

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

---

## 🔓 `/users/logout` Endpoint

### 📝 Description

Logs out the user and blacklists the token.

### 📩 HTTP Method

`GET`

### 🔐 Authentication

`Authorization: Bearer <token>` or token in cookie

### 📤 Example Response

```json
{
  "message": "Logout successfully"
}
```

---

## 🧍‍♂️ `/captains/register` Endpoint

### 📝 Description

Registers a new captain with vehicle details.

### 📩 HTTP Method

`POST`

### 📥 Request Body

JSON format:

* `fullname` (object):

  * `firstname` (string, required): Minimum 3 characters.
  * `lastname` (string, optional): Minimum 3 characters.
* `email` (string, required): Valid email.
* `password` (string, required): Minimum 6 characters.
* `vehicle` (object):

  * `color` (string, required): Minimum 3 characters.
  * `plate` (string, required): Minimum 3 characters.
  * `capacity` (number, required): Minimum 1.
  * `vehicleType` (string, required): 'car', 'motorcycle', or 'auto'.

### 📤 Example Response

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "JWT_TOKEN"
}
```

---

## 🔐 `/captains/login` Endpoint

### 📝 Description

Authenticates a captain and returns a JWT token.

### 📩 HTTP Method

`POST`

### 📥 Request Body

JSON format:

* `email` (string, required)
* `password` (string, required)

### 📤 Example Response

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "JWT_TOKEN"
}
```

---

## 🧾 `/captains/profile` Endpoint

### 📝 Description

Fetches the profile of the authenticated captain.

### 📩 HTTP Method

`GET`

### 🔐 Authentication

`Authorization: Bearer <token>`

### 📤 Example Response

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

## 🔓 `/captains/logout` Endpoint

### 📝 Description

Logs out the captain and blacklists the token.

### 📩 HTTP Method

`GET`

### 🔐 Authentication

`Authorization: Bearer <token>` or token in cookie

### 📤 Example Response

```json
{
  "message": "Logout successfully"
}
```

---

## 📍 `/maps/get-coordinates` Endpoint

### 📝 Description

Returns latitude & longitude for an address.

### 📩 HTTP Method

`GET`

### 🔧 Request Parameters

* `address` (string, required)

### 📤 Example Request

`GET /maps/get-coordinates?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA`

### 📤 Example Response

```json
{
  "ltd": 37.4224764,
  "lng": -122.0842499
}
```

### ❌ Error Response

```json
{
  "message": "Coordinates not found"
}
```

---

## 📏 `/maps/get-distance-time` Endpoint

### 📝 Description

Returns distance & estimated travel time between two locations.

### 📩 HTTP Method

`GET`

### 🔧 Request Parameters

* `origin` (string, required)
* `destination` (string, required)

### 📤 Example Request

`GET /maps/get-distance-time?origin=New+York,NY&destination=Los+Angeles,CA`

### 📤 Example Response

```json
{
  "distance": {
    "text": "2,789 miles",
    "value": 4486540
  },
  "duration": {
    "text": "1 day 18 hours",
    "value": 154800
  }
}
```

### ❌ Error Response

```json
{
  "message": "No routes found"
}
```

---

## 🔎 `/maps/get-suggestions` Endpoint

### 📝 Description

Returns location autocomplete suggestions.

### 📩 HTTP Method

`GET`

### 🔧 Request Parameters

* `input` (string, required)

### 📤 Example Request

`GET /maps/get-suggestions?input=1600+Amphitheatre`

### 📤 Example Response

```json
[
  "1600 Amphitheatre Parkway, Mountain View, CA, USA",
  "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
]
```

### ❌ Error Response

```json
{
  "message": "Unable to fetch suggestions"
}
```

---

## 🚗 `/rides/create` Endpoint

### 📝 Description

Creates a new ride.

### 📩 HTTP Method

`POST`

### 🔐 Authentication

`Authorization: Bearer <token>`

### 📥 Request Body

* `pickup` (string, required)
* `destination` (string, required)
* `vehicleType` (string, required): 'auto', 'car', or 'moto'

### 📤 Example Response

```json
{
  "ride": {
    "user": "user_id",
    "pickup": "Location A",
    "destination": "Location B",
    "fare": 75.0,
    "status": "pending",
    "duration": 1800,
    "distance": 12000,
    "otp": "1234"
  }
}
```

### ❌ Error Response

```json
{
  "message": "Error message"
}
```

---

## 💸 `/rides/get-fare` Endpoint

### 📝 Description

Returns fare estimate for the provided route.

### 📩 HTTP Method

`GET`

### 🔐 Authentication

`Authorization: Bearer <token>`

### 🔧 Request Parameters

* `pickup` (string, required)
* `destination` (string, required)

### 📤 Example Response

```json
{
  "auto": 50.0,
  "car": 75.0,
  "moto": 40.0
}
```

### ❌ Error Response

```json
{
  "message": "Error message"
}
```

---

✅ End of API Documentation
