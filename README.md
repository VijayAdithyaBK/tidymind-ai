<div align="center">

# 🧹 TidyMind AI

### AI-Powered Room Organization & Decluttering Assistant
**Built by [Vijay Adithya B K](https://github.com/VijayAdithyaBK)**

[![Built with React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Powered by Gemini](https://img.shields.io/badge/Gemini-AI-8E75FF?logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)

[GitHub Repository](https://github.com/VijayAdithyaBK/tidymind-ai) • [Report Bug](https://github.com/VijayAdithyaBK/tidymind-ai/issues) • [Request Feature](https://github.com/VijayAdithyaBK/tidymind-ai/issues)

</div>

---

## 🎯 Overview

**TidyMind AI** transforms the overwhelming task of room organization into an achievable, step-by-step action plan. Simply upload a photo of your messy space, and our AI generates personalized decluttering strategies, organization tips, and aesthetic improvements—all delivered through an intuitive chalkboard-themed interface.

### ✨ Key Features

- 📸 **Smart Image Analysis** - Upload photos and receive instant, AI-powered room organization insights
- 📝 **Step-by-Step Action Plans** - Get clear, actionable tasks broken down by priority and time estimates
- 📊 **Progress Tracking** - Upload "after" photos to compare your progress and get a detailed report card
- 🎨 **Aesthetic Suggestions** - Receive tailored recommendations for color schemes, furniture placement, and décor
- 💾 **History Management** - Save analyses for future reference with local storage
- 🔒 **100% Private** - All processing uses your own Gemini API key; no data is stored externally
- 🎓 **Guided Onboarding** - Interactive tour helps new users get started quickly

---



## 💡 Problem Statement

Decluttering and organizing living spaces is a common challenge that leaves many people feeling overwhelmed. Traditional organization apps focus on task management, but they don't provide intelligent, context-aware guidance based on the actual state of your room.

**TidyMind AI bridges this gap** by leveraging computer vision and generative AI to:
- Analyze the current state of any room
- Generate personalized, actionable organization plans
- Track progress through before/after image comparisons
- Provide motivation and validation through gamified scoring

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19.2, TypeScript 5.8 |
| **Build Tool** | Vite 6.2 |
| **AI/ML** | Google Gemini API (@google/genai) |
| **UI/UX** | Lucide React (icons), Canvas Confetti (celebrations) |
| **State Management** | React Hooks (useState, useCallback, useEffect) |
| **Storage** | LocalStorage for history & preferences |
| **Deployment** | Optimized for static hosting (Vercel, Netlify, GitHub Pages) |

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v18+ recommended)
- **Gemini API Key** ([Get one free here](https://ai.google.dev/))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tidymind-ai.git
   cd tidymind-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create or edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` and start tidying! 🧹

---

## 📸 Screenshots & Workflow

### 1. Upload Room Photo
Users upload a photo of their messy room through an intuitive drag-and-drop interface.

### 2. AI Analysis
The Gemini AI analyzes the image and generates:
- Organization priorities
- Step-by-step tasks with time estimates
- Aesthetic and design suggestions
- Color scheme recommendations

### 3. Progress Tracking
Upload an "after" photo to:
- Verify it's the same room
- Get a detailed score (0-100)
- See improvements and remaining tasks
- Celebrate achievements with confetti! 🎉

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
│   ├── Header.tsx       # Navigation and branding
│   ├── UploadZone.tsx   # Image upload interface
│   ├── ResultsView.tsx  # Analysis results display
│   ├── HistoryList.tsx  # Saved analyses
│   └── OnboardingTour.tsx # First-time user guide
├── services/
│   └── geminiService.ts # Gemini API integration
├── utils/
│   └── storageUtils.ts  # LocalStorage helpers
├── types.ts             # TypeScript definitions
├── App.tsx              # Main application logic
└── index.tsx            # Entry point
```

---

## 🧪 Future Enhancements

- [ ] Multi-room support with room-switching interface
- [ ] Export action plans to PDF or calendar integrations
- [ ] Social sharing of before/after transformations
- [ ] AR overlay for furniture placement suggestions
- [ ] Community templates for common room types
- [ ] Integration with smart home devices

---

## 👨‍💻 About the Developer

**Vijay Adithya B K** - Data Engineer & Full-Stack Developer

Passionate about building user-centric AI applications that solve real-world problems. TidyMind AI demonstrates:
- Full-stack development expertise (React, TypeScript)
- AI/ML integration (Gemini API)
- UX/UI design thinking
- Product development from concept to deployment

**Connect with me**:
- 💼 [LinkedIn](https://www.linkedin.com/in/vijayadithyabk/)
- 🐙 [GitHub](https://github.com/VijayAdithyaBK)
- 🌐 [Portfolio](https://vijayadithyabk.github.io/data-nexus/)

---

## 📄 License

This project is available under the MIT License. Feel free to use it for personal or commercial projects.

---

## 🙏 Acknowledgments

- Google Gemini team for the powerful AI API
- The React and Vite communities for excellent tooling
- Open-source community for inspiration and support

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ and 🖍️ by Vijay Adithya B K**

[Back to Top](#-tidymind-ai)

</div>
