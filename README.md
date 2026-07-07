🏢 Krupa Industries - Enterprise Resource Planning & Catalog Portal
A full-stack, production-ready ERP dashboard and public storefront developed as a freelance solution for Krupa Industries to manage real estate developments, wholesale furniture inventory, and corporate financial ledgers.

📖 Overview
This project is a high-performance Monorepo comprising a modern Angular 17+ frontend and a Spring Boot 3 REST API backend. It was architected from scratch to solve real-world business constraints, featuring a zero-latency reactive administration panel and a dynamic, SEO-friendly public catalog.

The infrastructure is fully containerized using Docker and deployed across a decoupled cloud environment (Hostinger VPS for backend/database, Vercel for the frontend UI).

✨ Key Features & Business Logic
🌍 Public Storefront (Visitor Mode)
Dynamic Media Streaming: Serves high-resolution real estate elevation plans and furniture assets using on-demand binary stream endpoints (@Lob byte conversion).

Interactive Filtering: Visitors can seamlessly filter ongoing vs. completed real estate ventures and furniture categories.

🔐 Secure Administrative Dashboard
Zero-Latency UI (Angular Signals): The admin panel completely bypasses legacy Zone.js change detection. Dashboard tables and metric cards update in under 50ms using reactive Angular Signals.

Complex Relational Data: Financial expenditure vouchers are dynamically mapped to specific Real Estate projects (@ManyToOne JPA relations) to track localized profit/loss ratios.

Multipart Form Handling: Custom HTTP Interceptors and Spring Boot @ModelAttribute bindings seamlessly process text payloads and heavy image uploads in a single network request.

Bulletproof Security: Bypasses default browser popup-loops with custom Spring Security AuthenticationEntryPoint configurations and strict CORS preflight (OPTIONS) handling.

🛠️ Technology Stack & Architecture
Frontend (Client-Side)
Framework: Angular 17+ (Standalone Component Architecture)

State Management: Angular Signals (signal<T>, computed) for reactive DOM rendering.

Forms: Reactive Forms with strict synchronous validation.

Security: Stateful sessionStorage token tracking with Functional HTTP Interceptors.

Deployment: Vercel Global CDN (Configured with custom vercel.json SPA routing rewrites).

Backend (Server-Side)
Core: Java 17, Spring Boot 3.x, Spring Web.

Security: Spring Security 6 (Stateless REST protection, BCrypt Password Encoding, Custom CORS filters).

Data Transfer: Immutable Java record classes for zero-boilerplate DTOs.

Persistence: Spring Data JPA / Hibernate.

Database & DevOps (Infrastructure)
Database: PostgreSQL 16 (Relational schemas, foreign key constraints).

Containerization: Multi-stage Dockerfile (Maven builder stage -> Alpine JRE runtime) reducing image size by >80%.  

Orchestration: docker-compose.yml bridging the Spring Boot API and PostgreSQL containers via an isolated virtual bridge network.  

Hosting: Deployed on an Ubuntu Linux Virtual Private Server (VPS).

🚀 System Architecture Flow
📱 Client Browser (Vercel CDN)
│
▼ (Intercepted by Functional Auth Guard / JWT headers injected)
🌐 HTTP REST API (Cross-Origin Resource Sharing handled)
│
▼ (Hostinger VPS / Port 8080)
🐳 Docker Container: Spring Boot API
│   ├─ Controller (@ModelAttribute / Multipart Processing)
│   ├─ Service (DTO to Entity Mapping / Business Logic)
│   └─ Repository (Spring Data JPA)
│
▼ (Internal Docker Bridge Network / Port 5432)
🐘 Docker Container: PostgreSQL Database

💻 Local Development Setup
To run this project locally on your machine:

1. Clone the repository

Bash
git clone https://github.com/yourusername/Krupa-Groups-pvt-lmt.git
cd Krupa-Groups-pvt-lmt
2. Start the Backend & Database (Docker required)

Bash
# Spins up PostgreSQL and compiles the Spring Boot backend
docker compose up -d --build
The API will be available at http://localhost:8080

3. Start the Frontend

Bash
cd krupa_Web/krupa-industries
npm install
ng serve
The UI will be available at http://localhost:4200
