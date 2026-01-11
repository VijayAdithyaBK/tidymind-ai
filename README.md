<a name="readme-top"></a>
<div align="center">

# 🧹 TidyMind AI

### AI-Powered Room Organization & Decluttering Assistant
**Your personal AI decluttering coach that turns messy rooms into organized sanctuaries.**

[![Built with React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Powered by Gemini](https://img.shields.io/badge/Gemini-AI-8E75FF?logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)

[Report Bug](https://github.com/VijayAdithyaBK/tidymind-ai/issues) · [Request Feature](https://github.com/VijayAdithyaBK/tidymind-ai/issues)

</div>

---

## 💡 Problem Statement

Decluttering and organizing living spaces is a common challenge that leaves many people feeling overwhelmed. Traditional organization apps focus on task management, but they don't provide intelligent, context-aware guidance based on the actual state of your room.

**TidyMind AI bridges this gap** by leveraging computer vision and generative AI to:
- Analyze the current state of any room
- Generate personalized, actionable organization plans
- Track progress through before/after image comparisons
- Provide motivation and validation through gamified scoring

---

## 🎯 Overview

**TidyMind AI** transforms the overwhelming task of room organization into an achievable, step-by-step action plan. Simply upload a photo of your messy space, and our AI generates personalized decluttering strategies, organization tips, and aesthetic improvements—all delivered through an intuitive chalkboard-themed interface.

---

## 📸 Usage Workflow

### 1. Upload Room Photo
Users upload a photo of their messy room through an intuitive drag-and-drop interface.

### 2. AI Analysis
Review the generated 3-step action plan:
- **Decluttering Phase**: What to throw away or move.
- **Organization Phase**: Where to put things.
- **Aesthetic Phase**: How to make it look good.

### 3. Progress Tracking
Upload an "after" photo to:
- Verify it's the same room
- Get a detailed score (0-100)
- See improvements and remaining tasks
- Celebrate achievements with confetti! 🎉

---

## ✨ Key Features

- 📸 **Smart Image Analysis** - Upload photos and receive instant, AI-powered room organization insights
- 📝 **Step-by-Step Action Plans** - Get clear, actionable tasks broken down by priority and time estimates
- 📊 **Progress Tracking** - Upload "after" photos to compare your progress and get a detailed report card
- 🎨 **Aesthetic Suggestions** - Receive tailored recommendations for color schemes, furniture placement, and décor
- 💾 **History Management** - Save analyses for future reference with local storage
- 🔒 **100% Private** - All processing uses your own Gemini API key; no data is stored externally
- 🎓 **Guided Onboarding** - Interactive tour helps new users get started quickly

---

## 🛠️ Technology Stack

| Category             | Technologies                                                 |
| -------------------- | ------------------------------------------------------------ |
| **Frontend**         | React 19.2, TypeScript 5.8                                   |
| **Build Tool**       | Vite 6.2                                                     |
| **AI/ML**            | Google Gemini API (@google/genai)                            |
| **UI/UX**            | Lucide React (icons), Canvas Confetti (celebrations)         |
| **State Management** | React Hooks (useState, useCallback, useEffect)               |
| **Storage**          | LocalStorage for history & preferences                       |
| **Deployment**       | Optimized for static hosting (Vercel, Netlify, GitHub Pages) |

---

## 🎨 Design Philosophy

**Chalkboard Classroom Theme**: The UI mimics a classroom chalkboard to make organization feel approachable and friendly—like having a helpful teacher guide you through the process.

**Key Design Elements**:
- Chalk-style typography and handwritten aesthetics
- Teal/purple accent colors for visual hierarchy
- Smooth animations and micro-interactions
- Responsive design for mobile and desktop
- Accessibility-first approach

---

## 📂 Project Structure

```
tidymind-ai/
├── components/          # React components
├── services/
├── utils/
├── types.ts             # TypeScript definitions
├── App.tsx              # Main application logic
└── index.tsx            # Entry point
```

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v18+ recommended)
- **Gemini API Key** ([Get one free here](https://ai.google.dev/))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/VijayAdithyaBK/tidymind-ai.git
   cd tidymind-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create or edit `.env.local` and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` and start tidying! 🧹

---

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Deployment Steps

1. **Enable GitHub Pages**
   - Go to your repository → **Settings** → **Pages**
   - Under "Build and deployment", set **Source** to **GitHub Actions**

2. **Add API Key to GitHub Secrets**
   - Go to repository → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click **Add secret**

3. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```
   The GitHub Action will automatically build and deploy your site.

4. **🔒 Secure Your API Key (IMPORTANT)**
   
   Since this is a client-side app, the API key will be visible in the browser. To prevent unauthorized use:
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** → **Credentials**
   - Click on your Gemini API key
   - Under **Application restrictions**, select **Websites**
   - Click **Add an item**, then add: `https://<YOUR-USERNAME>.github.io/tidymind-ai/*`
   - **Important**: Also add `https://<YOUR-USERNAME>.github.io/*` (some browsers like Firefox strip the path).
   - Click **Done**, then **Save**
   
   This ensures your API key only works from your GitHub Pages domain.

5. **Access Your Deployed Site**
   
   Your site will be available at: `https://yourusername.github.io/tidymind-ai/`

---

## 🧪 Future Enhancements

- [ ] Multi-room support with room-switching interface
- [ ] Export action plans to PDF or calendar integrations
- [ ] Social sharing of before/after transformations
- [ ] AR overlay for furniture placement suggestions
- [ ] Community templates for common room types
- [ ] Integration with smart home devices

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 👨‍💻 Connect with me

- 💼 [LinkedIn](https://www.linkedin.com/in/vijayadithyabk/)
- 🐙 [GitHub](https://github.com/VijayAdithyaBK)
- 🌐 [Portfolio](https://vijayadithyabk.github.io/data-nexus/)

---

## 📄 License

This project is available under the MIT License. Feel free to use it for personal or commercial projects.

---

<div align="center">

### ⭐ Star this repo if you find it helpful!
[Back to Top](#readme-top)

</div>

<p align="center">
  <i>⚡ Crafted by Vijay Adithya B K</i>
</p>
