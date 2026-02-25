# Deployment Guide: Multi-Agent E-commerce Extension

This guide details the deployment of the Multi-Agent Assistant into your existing E-commerce infrastructure on Render.

## 1. Environment Configuration
The Multi-Agent system relies on **LangGraph Orchestration**. Ensure the following production-ready environment variables are set in Render:
-   `OPENAI_API_KEY`: Production key for GPT-4o-mini.
-   `DATABASE_URL`: Connection string for the Neon PostgreSQL database.
-   `DEBUG`: Set to `False` to prevent sensitive trace leakage.

## 2. Code Synchronization
The project is structure to merge the Assistant directly into the main application.
1.  **Commit Agents**: Ensure the `backend/agents/agent_graph.py` and `backend/agents/tools.py` are included in the main branch.
2.  **Dependencies**: Verify `langgraph` and `langchain-openai` are in the root `requirements.txt`.
3.  **Push**:
    ```bash
    git push origin main
    ```

## 3. Database & Migrations
The agents require specific tables to persist conversation history and short-term state.
-   **Run Migrations**: Use the Render shell or an automated startup script to create `agent_sessions` and `agent_logs` tables.
-   **Direct Command**:
    ```bash
    python -m backend.seed # Run once to ensure core product/user data exists
    ```

## 4. Scaling the Assistant
To handle high conversational traffic:
- **Horizontal Scaling**: Render allows spinning up multiple web service instances. The LangGraph state is kept in the database (or shared memory if configured), allowing for seamless handoffs across instances.
- **Log Monitoring**: Monitor the `/chat` endpoint latency. If it exceeds 3s, consider moving to a higher Render tier or optimizing the Supervisor prompt.

## 5. Security Checklist
- [ ] Verify that all tool calls in production are strictly scoped by `user_id`.
- [ ] Ensure the `/chat` endpoint is protected by the `get_current_user` dependency.
- [ ] Check CORS settings to allow only your production frontend domain.

---

# Recreation Prompt: Render Deployment Guide

> **Requirement**: Provide a deployment guide for Render explaining:
> **Task**: How to deploy the updated multi-agent Assistant code and update the existing deployed e-commerce application.
> **Sections Required**: Pull latest changes, Apply migrations, Update environment variables, Restart services safely.
> **Guidelines**: Create this as a deployment guide document.

