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
- **Referral System**: Get €5 for referring friends

### Barber Features
- **Dashboard**: Manage online status, view queue, track earnings
- **Instagram Link**: Add Instagram profile link to share with clients
- **Referral System**: €5 for each friend referred (code sharing)
- **Stripe Connect**: Receive payments directly (10% platform fee)
- **Wallet & Payouts**: View balance, request withdrawals (instant or standard)
- **Verification System**: 
  - Contract signing with electronic signature
  - Passport photo upload
  - Selfie with passport verification
  - Daily selfie validation
- **Home Service**: Accept/decline home service requests with travel fee (€1/km)
- **Location Tracking**: Share live location with clients (GPS + Map)
- **Subscription Plans**: Basic (€9.99/mo) and Premium (€19.99/mo)
- **Sound Notifications**: Audio alerts for new clients

## Technical Stack
- **Frontend**: React, TailwindCSS, React-Leaflet for maps
- **Backend**: FastAPI (Python), MongoDB
- **Payments**: Stripe Connect for barber payouts
- **Maps**: Leaflet with CartoDB dark theme
- **Auth**: JWT + Google OAuth
- **Email**: Resend for password recovery

## Database Collections
- `users`: Clients and barbers
- `queue`: Queue entries for services
- `reviews`: Client reviews for barbers
- `wallets`: Barber wallet balances
- `transactions`: Financial transactions
- `payouts`: Payout requests history
- `verifications`: Barber verification documents
- `subscriptions`: Barber subscription status
- `referrals`: Referral codes and stats
- `referral_uses`: Track who used which code
- `password_resets`: Password recovery codes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Send reset code
- `POST /api/auth/reset-password` - Reset password

### Barbers
- `GET /api/barbers` - List all barbers
- `GET /api/barbers/{barber_id}` - Get barber details
- `PUT /api/barbers/status` - Update online status
- `PUT /api/barbers/profile` - Update profile (instagram, phone, etc)

### Referral System
- `GET /api/referral/info` - Get referral code and stats
- `POST /api/referral/apply` - Apply a referral code

### Stripe Connect
- `POST /api/connect/onboard` - Start Stripe onboarding
- `GET /api/connect/status` - Check Stripe status
- `GET /api/connect/dashboard` - Get Stripe dashboard link
- `POST /api/connect/payment` - Create payment checkout

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transactions
- `POST /api/wallet/payout` - Request payout
- `POST /api/wallet/auto-payout` - Configure auto-payout

### Verification
- `GET /api/verification/status` - Get verification status
- `GET /api/verification/contract` - Get contract text
- `POST /api/verification/accept-contract` - Sign contract
- `POST /api/verification/submit-documents` - Submit documents

## Implementation Status (2025-02-18)

### Completed
- [x] Core backend API (auth, barbers, queue, reviews)
- [x] Frontend pages restored from original project
- [x] Stripe Connect integration
- [x] Wallet system with payouts
- [x] Verification system (contract + documents)
- [x] Subscription plans
- [x] Password recovery with email (Resend)
- [x] **Instagram link** for barber profiles
- [x] **Referral system** (€5 per referral)
- [x] ReferralSection component
- [x] DailySelfieModal component
- [x] Sound notifications for barbers

## Test Credentials
**Barbeira:**
- `zezitha19@gmail.com` / `teste123` (Cecilia Rivero)
- Stripe: Connected ✅
- Referral Code: `Q2BTG3XY`

**Cliente:**
- `jw3428812@gmail.com` / `teste123`
