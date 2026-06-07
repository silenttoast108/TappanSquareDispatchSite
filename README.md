# Tappan Square Dispatch Website

This repository contains the source code for the TSD Website, a custom-built digital home for immersive, community-focused storytelling. This project serves as a bridge between the student body and the local college town, providing a "Wix-style" interface for journalists to publish long-form audio content.

---

### Key Features:
* **Content Editor:** Custom admin interface for publishing interactive articles.
* **Audio Integration:** Custom-built players designed for long-form investigative journalism.
* **Data Library:** Years of archived podcast data migrated and structured for high-performance retrieval.

---

## Tech Stack & Attributions

* **[Next.js](https://nextjs.org/)**: The React framework for production, used to handle server-side rendering and static site generation.
* **[React.js](https://reactjs.org/)**: The core library for building the modular UI components and interactive editor.
* **[Sanity.io](https://www.sanity.io/)**: Our chosen "Content Lake," providing real-time collaborative editing and schema architecture.

---

## Getting Started Locally

To start the development environment on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd [repository-folder]

2. **Install Frontend Deps:**
   ```bash
   cd /tsd-site/
   npm i -y

3. **Install Backend Deps:**
   ```bash
   cd ../studio-tappan-square-dispatch/
   npm i -y
   
4. **Start Sanity.io**
   ```bash
   cd /studio-tappan-square-dispatch/
   npm run dev
   
5. **Start Next.js App**
   ```bash
   cd ../tsd-site/
   npm run dev
 
