# **Invyt** 🎉  
A modern event planning and RSVP application built with the **MERN stack** (MongoDB, Express, React, Node.js).  
This project features **Google OAuth authentication**, event creation, email invitations, and RSVP tracking.

## **Features**
✅ **Google OAuth 2.0 Authentication** – Secure sign-in with Google  
✅ **Event Creation** – Users can create events with a title, date, location, and invite guests  
✅ **Email Invitations** – Automatically sends invitations via email  
✅ **RSVP System** – Guests can RSVP to events with their responses tracked  
✅ **User Profiles** – View and manage your events and account  
✅ **Modern UI** – Vibrant and user-friendly interface  

---

## **📌 Technologies Used**
- **Frontend:** React, TypeScript, Bootstrap  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Apollo GraphQL  
- **Authentication:** Google OAuth 2.0, Passport.js  
- **Styling:** Bootstrap, Custom CSS  
- **Email Service:** Nodemailer  

---
## Deployment Link: https://invyt.onrender.com/
## **🛠 Setup Instructions**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/achensen/Invyt
cd invyt
```

### **2️⃣ Install Dependencies**
```sh
npm run install
```
This will install dependencies for both the **server** and **client**.

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the **server** directory and configure the following variables:
```plaintext
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/invytDB
JWT_SECRET=super_secret_key
PORT=3001

# OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

### **4️⃣ Run the Application**
#### **For Development**
```sh
npm run start:dev
```
This will:
- Start the **backend** server on `http://localhost:3001/`
- Start the **frontend** on `http://localhost:3000/`
- Automatically reload on file changes

#### **For Production**
```sh
npm run start:all
```
This will:
- Build both the **client** and **server**
- Start the application in **production mode**

---

## **🚀 Usage**
1. **Sign in with Google**  
   - Click the **Login** button in the navbar.  
   - Authenticate with your Google account.  
   - You will be redirected and automatically logged into **Invyt**.

2. **Create an Event**  
   - Click **Create Event** in the navbar.  
   - Enter event details (Title, Date, Location).  
   - Add email addresses of guests and submit.  
   - Guests will receive an **email invitation** with an RSVP link.

3. **RSVP to Events**  
   - Guests can click on the **RSVP link** in the email.  
   - Select **Yes or No** to confirm attendance.  
   - The event creator can track responses.

4. **Manage Profile**  
   - Click on your name in the navbar.  
   - Navigate to **My Profile** to view your events.  
   - Logout when finished.

---

## **🛠 Troubleshooting**
### **Common Issues & Fixes**
1. **Google OAuth Redirect URI Mismatch**
   - Ensure that your **Google Cloud Console** project has the correct **redirect URI**:  
     ```
     http://localhost:3001/auth/google/callback
     ```

2. **MongoDB Connection Errors**
   - Make sure **MONGO_URI** is correctly set in `.env`.

3. **Port Conflicts**
   - Ensure **PORT=3001** is available or change it in `.env`.

---

## Contributions
Michael Mosquera, Khadijih Garcia, and Erin Jacobsen
 
## Contact Information
* Michael Mosquera - My [GitHub Account Link](https://github.com/Mimosquera)
* Khadijih Garcia - My [GitHub Account Link](https://github.com/KhadijihG)
* Erin Jacobsen - My  [GitHub Account Link](https://github.com/achensen)
 
## Image credit : by Bob Dmyt from Pixabay: Image by <a href="https://pixabay.com/users/ua_bob_dmyt_ua-8820017/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4529717">Bob Dmyt</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4529717">Pixabay</a>
## **📄 License**
This project is **open-source** and available under the **MIT License**.

## Comments: We did receive help on this project from tutoring and utilized some edx class materials for starter code . The app is not finished with full functionality, but after the cohort is complete we want to continute working on it.  