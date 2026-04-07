# Deployment Guide - Zerostock (Docker Edition)

Follow these steps to publish your Zerostock application to the web using **Docker** on Render. This is the recommended method to avoid system library issues (like GLIBC errors).

## 1. Push Code to GitHub
Ensure your latest changes (including `Dockerfile` and `server.js` updates) are pushed to GitHub:
```bash
git add .
git commit -m "Switch to Docker deployment and add error handling"
git push origin main
```

## 2. Configure Render for Docker
If you have already created a "Web Service" on Render, you need to switch its runtime:

1.  Go to your **Render Dashboard**.
2.  Select your `zerostock` service.
3.  Go to **Settings**.
4.  Find **Runtime** and change it from `Node` to **`Docker`**.
5.  Clear any manual **Build Command** or **Start Command** settings (Docker handles this automatically).
6.  **Save Changes**.

## 3. Deployment
Render will automatically detect the `Dockerfile` and start building the container image. 

- This build might take a few minutes longer the first time because it's installing system dependencies and building `sqlite3` from source.
- Once finished, you will see `Build Successful`.

## 4. (Optional) Initialize Sample Data
Once the container is running:
1. Go to the **"Shell"** tab in your Render dashboard.
2. Run:
   ```bash
   npm run seed
   ```
3. Your data is now ready.

> [!CAUTION]
> On Render's **Free Tier**, the SQLite database file (`database.sqlite`) is **ephemeral**. This means it will be deleted every time the container restarts or you deploy new code. 
> To keep your data permanently, use Render's **Persistent Disk** or switch to a cloud database (PostgreSQL/MongoDB).

## Troubleshooting

### 'throw err' or Crashes
I have added global error handlers to `server.js`. If the app crashes, check the **"Logs"** tab on Render. You will now see a detailed error message instead of an opaque `throw err` stack trace.

### Connection Errors
Ensure that your database connection in `src/db/connection.js` is using a path that the Docker container has access to (the default `./database.sqlite` works fine).
