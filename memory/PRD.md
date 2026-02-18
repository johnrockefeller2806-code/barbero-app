# ClickBarber - Product Requirements Document

## Project Overview
**ClickBarber** is a mobile-first web application connecting barbers with clients in the Dublin metropolitan area. It allows clients to find nearby barbers, join queues in real-time, and request home services.

## Core Features

### Client Features
- **Landing Page**: Hero section with "FIND YOUR BARBER IN REAL TIME"
- **Authentication**: Email/password and Google OAuth login
- **Barber Discovery**: View available barbers with ratings, specialties, and queue status
- **Real-time Queue**: Join barber queues and track position
- **Home Service**: Request barbers to come to your location
- **Reviews**: Rate and review barbers after service

### Barber Features
- **Dashboard**: Manage online status, view queue, track earnings
- **Stripe Connect**: Receive payments directly (10% platform fee)
- **Wallet & Payouts**: View balance, request withdrawals (instant or standard)
- **Verification System**: 
  - Contract signing with electronic signature
  - Passport photo upload
  - Selfie with passport verification
  - Daily selfie validation
- **Home Service**: Accept/decline home service requests
- **Location Tracking**: Share live location with clients
- **Subscription Plans**: Basic (€9.99/mo) and Premium (€19.99/mo)

## Technical Stack
- **Frontend**: React, TailwindCSS, React-Leaflet for maps
- **Backend**: FastAPI (Python), MongoDB
- **Payments**: Stripe Connect for barber payouts
- **Maps**: Leaflet with CartoDB dark theme
- **Auth**: JWT + Google OAuth

## Database Collections
- `users`: Clients and barbers
- `queue`: Queue entries for services
- `reviews`: Client reviews for barbers
- `wallets`: Barber wallet balances
- `transactions`: Financial transactions
- `payouts`: Payout requests history
- `verifications`: Barber verification documents
- `subscriptions`: Barber subscription status

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Barbers
- `GET /api/barbers`
- `GET /api/barbers/{barber_id}`
- `PUT /api/barbers/status`
- `PUT /api/barbers/profile`

### Queue
- `POST /api/queue/join`
- `GET /api/queue/my-position`
- `GET /api/queue/barber`
- `PUT /api/queue/{entry_id}/status`

### Stripe Connect
- `POST /api/connect/onboard`
- `GET /api/connect/status`
- `GET /api/connect/dashboard`

### Wallet
- `GET /api/wallet/balance`
- `GET /api/wallet/transactions`
- `GET /api/wallet/payouts`
- `POST /api/wallet/payout`
- `POST /api/wallet/auto-payout`

### Verification
- `GET /api/verification/status`
- `GET /api/verification/contract`
- `POST /api/verification/accept-contract`
- `POST /api/verification/submit-documents`

### Subscription
- `GET /api/subscription/plans`
- `GET /api/subscription/status`
- `POST /api/subscription/checkout`

## Implementation Status

### Completed (2025-02-18)
- [x] Core backend API routes (auth, barbers, queue, reviews)
- [x] Stripe Connect integration for barber payouts
- [x] Wallet system with balance tracking
- [x] Payout requests (instant and standard)
- [x] Auto-payout configuration
- [x] Verification system (contract + documents)
- [x] Subscription plans
- [x] Frontend pages for all features

### Known Issues
- Some frontend routes call APIs that expect different parameter formats
- Stripe Connect requires barbers to have verified Stripe accounts

## Configuration
- MongoDB: Uses `MONGO_URL` from `.env`
- Stripe: Uses `STRIPE_API_KEY` from `.env`
- Frontend URL: `FRONTEND_URL` for Stripe callbacks

## Test Credentials (Seed Data)
Barbers:
- `liam@barberx.com` / `123456`
- `sean@barberx.com` / `123456`
- `conor@barberx.com` / `123456`
- `patrick@barberx.com` / `123456`
