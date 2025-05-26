# 🧠 AI TechNews

**AI-curated tech news delivered via Telegram with fake news detection (MVP stage)**

---

## 📦 Project Structure (Monorepo)

---

## 🚀 Environments & Branch Strategy

| Branch   | Environment | Render Service              | Purpose                  |
|----------|-------------|-----------------------------|--------------------------|
| `main`   | Production  | `ai-technews-frontend`, `ai-technews-backend` | Live site |
| `develop`| Staging     | `ai-technews-staging-*`     | QA before production     |
| `feature/*` | Local/PR | Not deployed directly        | In-progress features     |

### ✅ CI/CD Strategy

- **Develop** is auto-deployed to staging on push
- **Main** is deployed to production via PR approval
- PRs must be reviewed before merging to `main`

---

## 📦 Deployment Summary

| Folder        | Stack           | Deployed as        |
|---------------|------------------|---------------------|
| `frontend-ui` | React + Vite     | Static Site (Render)|
| `backend-api` | FastAPI + Python | Web Service (Render)|

---

## 🧪 Setup (Locally)

```bash
# Frontend
cd frontend-ui
npm install
npm run dev

# Backend
cd backend-api
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## ✅ Next Steps

- [ ] Add the above to each branch (`main`, `develop`, `feature/...`)
- [ ] You can tweak section titles to reflect branch-specific notes like:
  - “This is the staging environment.”
  - “This is under development for XYZ feature.”

Let me know if you want a separate README layout for staging (`develop`) or a CI badge setup!

