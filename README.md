Email Verification System

A production-style email verification system built on AWS to learn and implement real-world cloud infrastructure.

Live Application  
https://app.yigitlabs.com

## Overview

This project implements a secure email verification workflow using a full-stack architecture deployed on AWS.

The main purpose of this project is to gain hands-on experience with core AWS services and production deployment patterns.

AWS services used in this project:

- Amazon SES – transactional email delivery
- Amazon S3 – static frontend hosting
- Amazon CloudFront – CDN distribution
- Amazon EC2 – backend server hosting
- AWS ACM – SSL certificate management

The system simulates a real SaaS authentication infrastructure where users register, verify their email address, and authenticate using a backend API.

Development and architecture planning were partially supported with AI-assisted tooling.

---

## Architecture

Frontend  
AWS S3 + CloudFront  
Domain: https://app.yigitlabs.com

Backend  
Node.js (Express) running on AWS EC2  
Reverse proxy: Nginx  
Process manager: PM2

Email Infrastructure  
Amazon SES with verified domain, DKIM and SPF

Database  
MySQL

DNS  
Cloudflare

---

## Authentication Flow

1. User registers from the frontend.
2. Backend generates a verification token.
3. Amazon SES sends the verification email.
4. User clicks the verification link.
5. Backend validates the token.
6. User is redirected back to the frontend.

Example verification endpoint:

POST /api/auth/register
POST /api/auth/login
GET /api/auth/verify-email
POST /api/auth/resend-verification

