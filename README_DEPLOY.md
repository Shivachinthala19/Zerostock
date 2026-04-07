# Deployment Guide - Zerostock

Follow these steps to publish your Zerostock application to the web using **Render**.

## 1. Push Code to GitHub
Ensure all your latest changes (including `package.json` updates) are pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## 2. Create a Render Account
1. Go to [Render.com](https://render.com/) and sign up (GitHub login is easiest).
2. Once logged in, click **"New +"** and select **"Web Service"**.

## 3. Connect Your Repository
1. Connect your GitHub account to Render if you haven't already.
2. Search for your repository `Zerostock` and click **"Connect"**.

## 4. Configure the Web Service
Set the following configurations on the Render dashboard:

- **Name**: `zerostock` (or any name you like)
- **Region**: Select the one closest to you (e.g., Singapore or US East)
- **Branch**: `main`
- **Root Directory**: (Leave blank)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run start`
- **Instance Type**: Select the **Free** tier.

## 5. (Optional) Initialize Sample Data
By default, the application will create a blank database on startup. If you want to populate it with the sample data provided in `seed.js`:

1. Go to the **"Shell"** tab in your Render dashboard after the service is live.
2. Run the following command:
   ```bash
   npm run seed
   ```
3. Restart the service or refresh the page.

> [!CAUTION]
> On Render's **Free Tier**, the SQLite database file (`database.sqlite`) is **ephemeral**. This means it will be deleted every time the server restarts or you deploy new code. 
> To keep your data permanently, you would need to use Render's **Persistent Disk** (which starts at $7/month) or switch to a cloud database like **MongoDB Atlas** or **Neon (PostgreSQL)**.

## 6. Access Your App
Once Render finishes building (`Build Successful`), you will see a URL at the top of the page (e.g., `https://zerostock.onrender.com`). Click it to see your live application!
