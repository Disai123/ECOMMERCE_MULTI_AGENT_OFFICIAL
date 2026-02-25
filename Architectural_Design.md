# Architectural Design Document - E-commerce Multi-Agent Platform

## 1. Introduction

### 1.1 Purpose of the System
The purpose of this document is to define the technical architecture for the E-commerce Platform with a Multi-Agent Assistant. The system combines a traditional e-commerce engine with an AI-driven automation layer, allowing users to perform complex shopping tasks through natural language.

### 1.2 High-Level Description
The application is a full-stack system comprising:
*   **Customer Frontend:** A React-based SPA for manual browsing and AI interaction.
*   **Admin Frontend:** A dashboard for inventory and order management.
*   **E-commerce Backend:** A FastAPI service for core business logic.
*   **Multi-Agent Assistant:** An AI layer using the Model Context Protocol (MCP) to automate user actions.

---

## 2. Architecture Overview

### 2.1 System Architecture
The system follows a **Micro-Agent Assisted Tiered Architecture**:
1.  **Presentation Layer:** React.js + Tailwind CSS.
2.  **Orchestration Layer:** Multi-Agent system powered by MCP to coordinate specialized tasks.
3.  **Application Layer:** FastAPI RESTful endpoints.
4.  **Data Layer:** PostgreSQL (structured data) + Vector Store (optional, for product embeddings).

### 2.2 Architecture Diagram (Conceptual)
*   **User Client:** Interacts with the React Frontend.
*   **AI Widget:** Communicates with the **Agent Orchestrator** in the backend.
*   **Agent Orchestrator:** Uses LLM (Large Language Model) to route requests to specialized agents (Search, Cart, Checkout).
*   **MCP Protocol:** Standardized interface for agents to access backend "Tools" (API endpoints) and shared context.
*   **Backend Services:** Auth, Product Catalog, Order Processing.
*   **Database:** Persistent storage for all entities.

---

## 3. Application Architecture

### 3.1 Frontend Design (Consistent with @[Ecommerce_webapp])
*   **Framework:** React 18 with Vite.
*   **Styling:** Tailwind CSS (Modern, Responsive).
*   **State Management:** Context API (Auth, Cart) + UI state for the Assistant.
*   **Components:** Modular architecture with shared UI libraries (Lucide React for icons).

### 3.2 Backend Design
*   **Framework:** FastAPI (Python).
*   **Agent framework:** Integration with an MCP-compliant agent library (e.g., LangGraph or custom MCP implementation).
*   **Statelessness:** JWT-based authentication ensures scalability.
*   **Worker Agents:**
    *   **Search Agent:** Translates natural language to SQL/Query filters.
    *   **Action Agent:** Executes "Add to Cart" and "Delete Item" via API calls.
    *   **Checkout Agent:** Validates shipping data and triggers the payment flow.

### 3.3 APIs and Integrations
*   **REST API:** Standard endpoints for CRUD operations.
*   **Agent Tools:** Functional abstraction of API endpoints exposed to the AI agents.
*   **External Integrations:** Stripe for payments, Neon for PostgreSQL hosting.

---

## 4. Data Architecture

### 4.1 Database Design (Schema)
*   **Users:** `id, email, password_hash, full_name, role (admin/user)`.
*   **Products:** `id, name, description, price, stock, category_id, image_url`.
*   **Orders:** `id, user_id, order_total, status, shipping_address`.
*   **Order_Items:** `id, order_id, product_id, quantity, price_at_purchase`.
*   **Agent_Sessions:** `id, user_id, conversation_summary, last_seen_product_ids`.

### 4.2 Data Flow
1.  **Manual:** User Input -> React Component -> FastAPI Endpoint -> DB.
2.  **AI-Assisted:** User Chat -> Orchestrator -> Tool Execution (FastAPI Internal) -> Response to Chat.

---

## 5. Technology Stack

*   **Frontend:** React, Vite, Tailwind CSS, Axios, React Router.
*   **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic.
*   **Agents:** MCP (Model Context Protocol), OpenAI/Anthropic SDKs.
*   **Database:** PostgreSQL (Neon).
*   **Auth:** PyJWT (stateless tokens).
*   **Deployment:** Render (Hosting), GitHub Actions (CI/CD).

---

## 6. Security Architecture

### 6.1 Authentication & Authorization
*   **JWT:** Secure token-based access.
*   **RBAC:** Role-Based Access Control to separate Admin and Customer capabilities.
*   **Agent Scoping:** Agents only have "Write" access to the current active user's cart—never broad database access.

### 6.2 Data Protection
*   **HTTPS:** TLS encryption for all traffic.
*   **Sanitization:** Strict input validation via Pydantic to prevent SQL/Prompt injection.
*   **Compliance:** PCI-DSS compliance by redirecting payment flows to Stripe.

---

## 7. Deployment Architecture

### 7.1 Hosting Environment
*   **Cloud Platform:** Render (Web Services for Backend, Static Sites for Frontend).
*   **Database:** Managed PostgreSQL via Neon.

### 7.2 Scalability & Performance
*   **Horizontal Scaling:** Multiple FastAPI instances behind Render's load balancer.
*   **Latency:** Minimal response time for agents through streaming LLM responses.

---

## 8. Non-Functional Considerations

*   **Reliability:** Agent fallback mechanisms—if an agent fails, the user is prompted to complete the action manually.
*   **Maintainability:** Clean separation between the E-commerce logic and the Agent logic (Clean Architecture).
*   **Performance:** Fast page loads using Vite and optimized Tailwind CSS builds.
*   **Availability:** High availability backed by Render's infrastructure SLA.
