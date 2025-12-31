# 📋 Pastebin-Lite: The "Self-Destructing" Note App 🚀

> "This message will self-destruct in 5... 4... 3..."

## 🌟 The Big Idea (For Everyone)
Have you ever wanted to send a secret password or a private note but didn't want it to stay on the internet forever? 

**Pastebin-Lite** is like a digital disappearing ink. You create a note, send the link, and you decide when it vanishes—either after a certain amount of **time** (like 10 minutes) or after a certain number of **views** (like only 1 person can see it). Once the limit is hit, the link breaks, and the secret is gone!

---

## 🛠️ How I Built It (The "Lego" Bricks)

To make this app work, I connected four main parts:

| Brick | Technology | What it does (The Kid Version) |
| :--- | :--- | :--- |
| **The Brain** | **Node.js** | The engine that runs the whole show. |
| **The Logic** | **Express.js** | The "traffic cop" that directs people to the right pages. |
| **The Memory**| **Cloud Redis** | A super-fast "Cloud Notepad" that remembers secrets and counts views. |
| **The Face** | **EJS & CSS** | The pretty pages you see on your screen. |

---

## 🧠 Why is this "Impressive"?

I didn't just build a website; I built a **Cloud-Native System**.

1. **Smart Memory (Redis Persistence):** Most apps forget everything if the server restarts. I used **Upstash Redis**, so the data lives in the cloud. Even if the server sleeps, the "Memory" stays awake.
2. **Security First:** I used **EJS Escaping**. If a hacker tries to put "virus code" into a note, my app treats it like plain text. It can't be tricked!
3. **Time Travel Testing:** I built a special "Time Helper" (`getNow`). This allows testers to "fake" the current time to prove that a note truly expires exactly when it's supposed to.
4. **Serverless Ready:** The app is optimized for **Vercel**, meaning it can handle 1 user or 1,000 users without breaking a sweat.

---

## 🚀 How to Play With It

### 1. Run it on your computer:
* **Clone it:** `git clone https://github.com/vijayaramireddy9999/pastebin-lite`
* **Install it:** `npm install`
* **Start it:** `npm start`

### 2. The Secret Recipe (.env):
To make it work, you need a `.env` file with your Redis password:
`REDIS_URL=your_redis_link_here`
`TEST_MODE=1`

---

## 📁 Project Map
* 📂 `public/` - The dashboard where you create your notes.
* 📂 `views/` - The "Viewing Room" where the secret note is displayed.
* 📄 `server.js` - The master code that handles the timers and view counts.

---
**Created with ❤️ by Vijayarami Reddy** *Looking for a developer who thinks about speed, security, and smart design? Let's talk!*
