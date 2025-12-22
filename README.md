# MyCookBook 🍳

This project was developed for the **"Web Development"** course unit of the **Master's in Design and Multimedia** at the **Faculty of Sciences and Technology of the University of Coimbra (FCTUC)**.

MyCookBook is a hybrid web application and social network that allows users to submit and share cooking recipes, as well as save their favorite ones to their profile.

**Authors:**

* Estêvão Abreu
* Nuno Pinto

---

## Screenshots

![Home](https://raw.githubusercontent.com/NETERNOT/ProjetoDW/main/screenshots/home.png)
![Recipe](https://raw.githubusercontent.com/NETERNOT/ProjetoDW/main/screenshots/recipe.png)
![Profile](https://raw.githubusercontent.com/NETERNOT/ProjetoDW/main/screenshots/profile.png)
![Login](https://raw.githubusercontent.com/NETERNOT/ProjetoDW/main/screenshots/login.png)

---

## Tech Stack

* **Desktop Environment:** [Electron](https://www.electronjs.org/)
* **Frontend:** [React.js](https://reactjs.org/)
* **Backend:** [Node.js](https://nodejs.org/)
* **Database:** [MongoDB](https://www.mongodb.com/)
* **Styling:** CSS3

---

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

Ensure you have the following installed:

* **Node.js**
* **Git**
* **MongoDB Community Server**
* **MongoDB Database Tools** (Required for mongoimport)

### 2. Start the MongoDB Service

The database service must be running in the background before you can import data or run the app.

**Windows: Open a generic Command Prompt as Administrator and run:**

 ```bash
net start MongoDB
```

*Alternatively, open "Services" (Win+R -> services.msc), find "MongoDB Server", and click "Start".*

**macOS (Homebrew):**

 ```bash
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**

 ```bash
sudo systemctl start mongod
```

### 3. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/NETERNOT/ProjetoDW

# Go into the project folder
cd ProjetoDW

# Install dependencies
npm install
```

### 4. Database Setup

Before running the application, you need to populate your local MongoDB instance with the default data.

**Note:** Ensure your MongoDB service is running (Step 2) before executing these commands.

```bash
# Import Users
mongoimport --db mycookbook --collection users --file src/backend/default/users.json --jsonArray

# Import Recipes
mongoimport --db mycookbook --collection recipes --file src/backend/default/recipes.json --jsonArray

# Import Comments
mongoimport --db mycookbook --collection comments --file src/backend/default/comments.json --jsonArray
```

### 4. Running the Application

```bash
# To open Electron app (Desktop version)
npm run app:electron

# To open Browser app (Web version)
npm run app:browser

# To open both versions simultaneously
npm run dev
```
