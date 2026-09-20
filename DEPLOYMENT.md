# Render Deployment Guide — Eco Lifestyle Agent

This project is configured for **one-click, zero-config automatic deployment** on [Render](https://render.com).

---

## Architecture on Render
The application runs as a **unified high-performance container/service**:
- **Frontend**: React 19 + TypeScript + Vite single-page application (pre-compiled into static assets).
- **Backend**: FastAPI ASGI server with ChromaDB vector store and IBM Granite AI integration.
- **Unified Port & Domain**: FastAPI serves the SPA at `/` and client routes (`/chat`, `/schemes`, `/sustainable`, `/admin`), while handling all `/api/*` requests natively without CORS complexity.

---

## Deployment Options

### Option 1: Automatic Blueprint (Recommended)
1. In your **Render Dashboard**, click **New +** -> **Blueprint**.
2. Connect your GitHub repository: `https://github.com/Nandu9052/Eco_lifestyle`.
3. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **Environment**: Docker
   - **Health Check**: `/api/health`
   - **Service Name**: `eco-lifestyle-agent`
4. Enter your secret environment variables:
   - `IBM_GRANITE_API_KEY` (Your IBM Cloud API Key)
   - `IBM_GRANITE_PROJECT_ID` (Your watsonx Project ID)
   - `ECO_ADMIN_KEY` (Defaults to `Nandu123`)
5. Click **Apply**. Render will automatically build and deploy the application.

---

### Option 2: Existing or Manual Web Service (Docker)
If you already created a Web Service on Render:
1. In your Web Service settings on Render:
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Health Check Path**: `/api/health`
2. Under **Environment Variables**, add:
   - `PORT`: `8000`
   - `ECO_ADMIN_KEY`: `Nandu123`
   - `IBM_GRANITE_API_KEY`: *(your IBM Cloud API Key)*
   - `IBM_GRANITE_PROJECT_ID`: *(your watsonx Project ID)*
   - `IBM_GRANITE_API_URL`: `https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29`
   - `IBM_GRANITE_MODEL_ID`: `ibm/granite-3-8b-instruct`
3. Click **Manual Deploy** -> **Deploy latest commit** (or let auto-deploy trigger on git push).

---

### Option 3: Native Python Environment
If your Render Web Service is set to the **Python** runtime:
- **Build Command**: `bash render-build.sh` (or `./build.sh`)
- **Start Command**: `uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Same as Option 2.

---

## Verifying Deployment
Once the deploy is live:
1. **Frontend App**: Navigate to your Render URL (`https://<service-name>.onrender.com`).
2. **Health Check**: `https://<service-name>.onrender.com/api/health` (should return `{"status":"ok",...}`).
3. **Interactive API Docs**: `https://<service-name>.onrender.com/docs`.
4. **Admin Portal**: `https://<service-name>.onrender.com/admin` (unlock with passkey `Nandu123`).
