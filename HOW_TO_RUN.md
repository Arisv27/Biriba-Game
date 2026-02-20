# HOW TO RUN THE BIRIBA GAME

## 1. Download & Install:
* **Node.js** from [nodejs.org](https://nodejs.org) (just download and install)
* **This zip file** (the BIRIBA-game.zip you just opened)

## 2. Setup (One-time):
* Open terminal/command prompt in the BIRIBA folder
* Run: `npm install` (installs dependencies)

## 3. Start the Game:
* Run: `node server.js`
* Open browser to: `http://localhost:3000`

## 4. Play Locally (Same WiFi):
* Find your IP address:
  * **Mac/Linux:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
  * **Windows:** `ipconfig`
* Share URL: `http://YOUR_IP_ADDRESS:3000`
* Example: `http://192.168.1.100:3000`

## 5. Play Online (Different Locations):

### ngrok (Recommended)
1. **Download ngrok:**
   * Go to [ngrok.com](https://ngrok.com)
   * Sign up for free account
   * Download and extract ngrok

2. **Setup ngrok:**
   * Get auth token from ngrok.com
   * Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

3. **Start game with ngrok (Two different Terminal/Command prompt windows):**
   * Terminal 1: `node server.js`
   * Terminal 2: `ngrok http 3000`
   * Share the ngrok URL (e.g., `https://abc123.ngrok.io`)

## 6. How to Play:
* Each person opens the URL in their browser
* Join as different players (Player 1, 2, 3, or 4)
* Host clicks "Start Game" when everyone is ready