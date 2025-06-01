## RideApp Microservices – API Endpoint Overview

This project follows a microservices architecture with the following main services:

- **API Gateway**
- **User Services**
- **Captain Services**
- **Ride Services**
- **Map Services**

### How Endpoints Are Structured

Each microservice exposes its own REST API endpoints. The **API Gateway** acts as the single entry point, routing requests to the appropriate service.

A typical endpoint pattern is:
```
http://:/api//
```

---

### Example Endpoints by Service

#### 1. User Services

Handles user registration, authentication, and profile management.

| Method | Endpoint                          | Description                |
|--------|-----------------------------------|----------------------------|
| POST   | `/api/user/register`              | Register a new user        |
| POST   | `/api/user/login`                 | User login                 |
| GET    | `/api/user/profile/:userId`       | Get user profile           |
| PUT    | `/api/user/profile/:userId`       | Update user profile        |

---

#### 2. Captain Services

Manages captain (driver) registration, profile, and status.

| Method | Endpoint                             | Description                 |
|--------|--------------------------------------|-----------------------------|
| POST   | `/api/captain/register`              | Register a new captain      |
| GET    | `/api/captain/profile/:captainId`    | Get captain profile         |
| PUT    | `/api/captain/profile/:captainId`    | Update captain profile      |
| PUT    | `/api/captain/status/:captainId`     | Update captain status       |

---

#### 3. Ride Services

Handles ride booking, status, and history.

| Method | Endpoint                                | Description                   |
|--------|-----------------------------------------|-------------------------------|
| POST   | `/api/ride/book`                        | Book a new ride               |
| GET    | `/api/ride/status/:rideId`              | Get ride status               |
| PUT    | `/api/ride/update/:rideId`              | Update ride details/status    |
| GET    | `/api/ride/history/:userId`             | Get user ride history         |
| GET    | `/api/ride/captain/history/:captainId`  | Get captain ride history      |

---

#### 4. Map Services

Provides location, route, and fare estimation features.

| Method | Endpoint                                 | Description                       |
|--------|------------------------------------------|-----------------------------------|
| POST   | `/api/map/route`                         | Get route between two points      |
| POST   | `/api/map/fare-estimate`                 | Get fare estimate for a route     |
| GET    | `/api/map/nearby-captains`               | Find nearby captains              |

---

### How to Find the Exact Endpoints

- **Check each microservice folder** (`user-services`, `captain-services`, `ride-services`, `map-services`) for route/controller files.
- **Review the API Gateway** (`api-gateway` folder) for route definitions and proxy logic.

---

## Example API Gateway Usage

Suppose your API Gateway runs at `http://localhost:3000`:

- Register User:  
  `POST http://localhost:3000/api/user/register`
- Book Ride:  
  `POST http://localhost:3000/api/ride/book`
- Get Fare Estimate:  
  `POST http://localhost:3000/api/map/fare-estimate`
