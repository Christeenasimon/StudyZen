<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</p>

# StudyZen – Intelligent Student Burnout Early Warning & Recovery System 🎯

## Basic Details

### Team Name: Groot

### Team Members
- Member 1:Christeena Simon - SSET
- Member 2: Devitheertha V S - SSET

### Hosted Project Link
https://study-zen-teal.vercel.app

### Project Description
StudyZen is an intelligent student wellness platform that predicts burnout risk through comprehensive mood, metrics, and behavioral analysis. It offers dynamic recovery plans, and gamified stress-relief activities to help students maintain mental health while pursuing academic excellence.

### The Problem Statement
Student burnout has become an epidemic in academic environments, with students experiencing chronic exhaustion, decreased motivation, and declining mental health. Traditional approaches fail to:
- **Detect early warning signs** before burnout becomes severe
- **Provide personalized recovery strategies** based on individual patterns
- **Make wellness activities engaging** rather than another chore

### The Solution
StudyZen provides a comprehensive, AI-powered solution that:
- **Predicts burnout risk** using a multi-factor scoring algorithm (mood, sleep, study hours, task load, quiz responses)
- **Generates personalized recovery plans** (3-day or 7-day) based on risk level and individual patterns
- **Gamifies stress relief** with 14 interactive mini-games (Zen Arcade)
- **Tracks wellness trends** with beautiful data visualizations
- **Provides study tools** including Pomodoro timer, task management, and focus sessions
- **Enables private journaling** for emotional expression and reflection

---

## Technical Details

### Technologies/Components Used

**For Software:**
- **Languages:** TypeScript, JavaScript (JSX/TSX)
- **Frontend Framework:** React 19.2.4
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS 
- **Data Visualization:** Recharts 3.7.0
- **State Management:** React Hooks (useState, useEffect, useRef)
- **Data Persistence:** LocalStorage API
- **Type Safety:** TypeScript 5.8.2
- **Font:** Google Fonts (Quicksand)

**Key Libraries & Tools:**
- **recharts**: Interactive wellness trend charts with custom gradients and animations
- **Vite**: Lightning-fast development and optimized production builds
---

## Features

### Core Features

**1. Intelligent Burnout Detection**
- Multi-factor risk assessment algorithm combining:
  - 10-question burnout quiz (weighted questions)
  - Mood tracking (1-10 scale)
  - Sleep hours monitoring
  - Study hours analysis
  - Task load evaluation
- Real-time risk level calculation (LOW, MODERATE, HIGH)
- Energy percentage display (inverse of risk score)

**2. Personalized Recovery Plans**
- **3-Day Plans** for moderate risk levels
- **7-Day Plans** for high-risk burnout situations
- Dynamic task generation based on:
  - Current risk level
  - Sleep deficit patterns
  - Mood indicators
- Activities include:
  - Digital detox protocols
  - Sleep optimization strategies
  - Physical movement recommendations
  - Social connection prompts
  - Reflective journaling exercises
  - Hobby time integration

**3. Zen Arcade – Gamified Stress Relief**
- 14 interactive mini-games designed for quick breaks:
  - 🎴 **Memory Flip**: Find nature pairs
  - 🫧 **Bubble Pop**: Pop away worries
  - 🔁 **Pattern Repeat**: Follow Zen sequences
  - 🎯 **Calm Click**: Focus targeting game
  - 🧩 **Brain Reset**: Puzzle solving
  - ➕ **Quick Math**: Focus-building calculations
  - 🔤 **Word Scramble**: Peace word puzzles
  - 🌡️ **Stress Meter**: Pressure release tapping
  - 🎨 **Color Therapy**: Creative expression
  - 🌬️ **Guided Breath**: Breathing synchronization
  - ⚡ **Quick Catch**: Reaction training
  - 🟣 **Dot Tracker**: Eye coordination
  - ⭐ **Shape Match**: Pattern recognition
  - 🤲 **Gratitude Catch**: Positive vibes collection

**4. Wellness Dashboard**
- **Burnout Meter**: Visual energy gauge with color-coded risk levels
- **Wellness Rhythm Chart**: 7-day trend visualization showing:
  - Mood patterns (green gradient)
  - Sleep hours (blue gradient)
  - Study hours (red gradient)
- Custom chart animations and interactive tooltips
- Star-shaped data points for aesthetic appeal

**5. Study Lab**
- Pomodoro timer with customizable intervals
- Task management system
- Focus session tracking
- Distraction-free study environment
- Mascot companion for motivation

**6. Life Planner**
- Daily schedule management
- Task prioritization
- Goal setting and tracking
- Integration with risk level for workload recommendations
- Visual calendar interface

**7. Zen Diary (Private Journal)**
- Secure, encrypted personal journal
- Mood-tagged entries
- Reflection prompts based on risk level
- Search and filter capabilities
- Export options for personal records

**8. Personalized Experience**
- **Mascot Selection**: Choose between 🐻 Bear, 🌱 Sprout, or ☁️ Cloud
- **Persistent State**: All data saved to localStorage
- **User-specific greetings** and personalized messaging
- **Risk-adaptive UI**: Interface elements respond to burnout level

**9. Floating Wellness Widget**
- Always-accessible quick actions
- Current energy level display
- One-click access to chatbot
- Instant break game trigger
- Non-intrusive design

---

## Implementation

### Installation

```bash
# Clone the repository
git clone https://github.com/Christeenasimon/StudyZen
cd studyzen

# Install dependencies
npm install

```


### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Documentation

### Architecture Overview

**System Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login/     │  │   Wellness   │  │  Study Lab   │      │
│  │   Onboarding │→│   Dashboard  │←→│  & Planner   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓              │
│  ┌──────────────────────────────────────────────────┐       │
│  │         State Management (React Hooks)            │       │
│  │  • useState  • useEffect  • useRef  • Context     │       │
│  └──────────────────────────────────────────────────┘       │
│         ↓                  ↓                               │
│  ┌─────────────┐  ┌──────────────┐         │
│  │  LocalStorage│  │ Risk Logic   │          │
│  │  Persistence │  │  Algorithm   │                         │
│  └─────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

**Component Hierarchy:**

```
App.tsx (Main Container)
├── Login.tsx (Authentication)
├── Quiz.tsx (Burnout Assessment)
├── Wellness Dashboard
│   ├── BurnoutMeter.tsx (Energy Gauge)
│   ├── Wellness Chart (Recharts)
│   ├── RecoveryPlanView.tsx (Action Plans)
│   └── ZenArcade Grid
├── StudyLab.tsx (Study Tools)
├── LifePlanner.tsx (Schedule Management)
├── ZenDiary.tsx (Private Journal)
├── FloatingWidget.tsx (Quick Actions)
└── ZenArcade.tsx (Mini-games)
```

**Data Flow:**

```
User Input → Quiz/Metrics → Risk Calculation → Assessment Storage
                 ↓                                      ↓
         History Tracking ←──────── Recovery Plan Generation
                 ↓                                      ↓
         Wellness Chart ←──────────→ Dashboard UI Update
                                                        ↓
                                            Personalized Recommendations
```

### Algorithm: Burnout Risk Calculation

**Formula:**
```
Total Risk Score (0-100) = 
  (Quiz Score × 0.4) +
  (Mood Score × 0.15) +
  (Study Score × 0.15) +
  (Sleep Score × 0.2) +
  (Task Score × 0.1)

Where:
- Mood Score = (10 - mood) × 10
- Sleep Score = max(0, (8 - sleepHours) × 12.5)
- Study Score = max(0, min(100, (studyHours - 5) × 14.2))
- Task Score = taskLoad × 10

Risk Levels:
- LOW: Score 0-35
- MODERATE: Score 36-65
- HIGH: Score 66-100

Energy Percent = 100 - Risk Score
```

**Weighted Quiz Questions:**
- Questions weighted from 1.0 to 1.5 based on burnout severity indicators
- Covers emotional drainage, concentration, productivity, social withdrawal, exhaustion, overwhelm, cynicism, anxiety, isolation, and physical symptoms
### Project Demo

### Screenshots

**1. Login & Onboarding**
https://drive.google.com/file/d/1-CF77dyPhY-HvvL6f9lyQw3dnKJ3fZWy/view?usp=drive_link

**2. Wellness Dashboard**
https://drive.google.com/file/d/1VveiVvZ9QHhhl6iQL5RDcMuG4tSR65Qv/view?usp=drive_link

**3. Burnout Assessment Quiz**
https://drive.google.com/file/d/1SI1LJyK9cQ-PWseSDtLC4lcmTD6mmRqQ/view?usp=drive_link

**4. Zen Arcade**
https://drive.google.com/file/d/13dQFOPBHFjGAPkXBlsnTwiz2Jpb87ykc/view?usp=drive_link

**5. Study Lab**
https://drive.google.com/file/d/1Q5QeZEVB9nxwO28KjnQTNurgBOjUc0Db/view?usp=drive_link

**6.Planner**
https://drive.google.com/file/d/1XpO9A_VnYqjIjXLDDPgTJXadK9uBzFjB/view?usp=drive_link

**7.Diary**
https://drive.google.com/file/d/11fwtSgYLFHb-28jP_i4MXCKR4NnYLcHh/view?usp=drive_link
---

## Key Features Deep Dive

### 1. Intelligent Risk Detection System

**Multi-Factor Analysis:**
- **Psychological Indicators**: 10 weighted questions covering emotional, behavioral, and cognitive symptoms
- **Physiological Metrics**: Sleep duration tracking and fatigue correlation
- **Behavioral Patterns**: Study hour analysis and overwork detection
- **Subjective Well-being**: Daily mood self-assessment (1-10 scale)
- **Workload Stress**: Task load perception and deadline pressure

**Adaptive Thresholds:**
- Algorithm adjusts sensitivity based on historical patterns
- Prevents false positives while catching early warning signs
- Normalizes scores to 0-100 scale for consistent interpretation

### 2. Dynamic Recovery Planning

**Plan Generation Logic:**
```typescript
HIGH Risk (66-100) → 7-Day Comprehensive Recovery Protocol
  Day 1: Digital detox, sleep priority, work reduction (50%)
  Day 2: Physical movement, nutrition focus, social connection
  Days 3-7: Reflective journaling, Pomodoro study, hobby time
  + Emergency interventions (power naps, gratitude lists)

MODERATE Risk (36-65) → 3-Day Maintenance & Reset Plan
  Day 1: Screen time management, sleep optimization, task prioritization
  Day 2: Light exercise, healthy eating, friend contact
  Day 3: Self-reflection, focused study blocks, leisure activities

LOW Risk (0-35) → No formal plan, maintenance suggestions
```

**Personalization Triggers:**
- Sleep < 5 hours → Emergency nap recommendation
- Mood < 4 → Gratitude practice assignment
- Study > 10 hours → Mandatory break enforcement
- Task load > 8 → Workload reduction strategies


### 3. Gamification Strategy

**Design Principles:**
- **Short duration**: 1-3 minute games for quick breaks
- **Low cognitive load**: Simple mechanics to reduce mental fatigue
- **Positive reinforcement**: Uplifting feedback and visual rewards
- **Variety**: Different cognitive and motor skills engaged
- **Progress tracking**: Completion stats and personal bests

**Game Categories:**
- Memory & Attention (Memory Flip, Dot Tracker)
- Stress Release (Bubble Pop, Stress Meter)
- Focus Training (Calm Click, Quick Catch, Reaction)
- Creative Expression (Color Therapy)
- Mindfulness (Guided Breath)
- Cognitive Flexibility (Pattern Repeat, Brain Reset)

---

## Data Persistence & Privacy

**LocalStorage Schema:**
```javascript
studyzen_user: { name: string, mascot: string }
studyzen_assessment: BurnoutAssessment object
studyzen_history: Array<UserStats> (last 7 entries)
zen_diary_entries: Array<DiaryEntry> (encrypted)
study_lab_tasks: Array<Task>
life_planner_schedule: Array<ScheduleItem>
```

**Privacy Features:**
- All data stored locally on user's device
- No server-side data collection
- Diary entries encrypted before storage
- User can clear all data via logout
- No personal information shared with AI (only anonymized patterns)

---

## Responsive Design

**Breakpoints:**
- Mobile: < 640px (compact navigation, single column layout)
- Tablet: 640px - 1024px (adaptive grid, side-by-side components)
- Desktop: > 1024px (full dashboard, all features visible)

**Mobile Optimizations:**
- Bottom navigation bar for easy thumb access
- Touch-optimized tap targets (min 44x44px)
- Swipe gestures for tab switching
- Reduced chart complexity on small screens
- Floating action button for quick access

---

## Performance Optimizations

**Code Splitting:**
- Lazy loading for heavy components (ZenArcade, EmotionalChatbot)
- Dynamic imports for game modules
- Route-based code splitting with React.lazy

**State Management:**
- Minimal re-renders with proper dependency arrays
- Memoization for expensive calculations (risk scoring)
- Debounced inputs for form fields
- LocalStorage caching to reduce recalculations

**Asset Optimization:**
- CDN-hosted dependencies (Tailwind, fonts)
- ESM imports for tree-shaking
- Vite's automatic code minification and bundling
- SVG icons instead of image files

---

## Browser Compatibility

**Supported Browsers:**
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Opera: 76+

**Required Features:**
- ES6+ JavaScript support
- LocalStorage API
- CSS Grid and Flexbox

---


## Deployment Guide

### Deploying to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**MIT License Summary:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ No liability or warranty provided

---



## Team Contributions

- **Christeena Simon**: Frontend development, UI/UX design,Zen Arcade games
- **Devitheertha V S**: Backend logic, Risk assessment algorithm,Wellness Dashboard,Data visualization

---


**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Active Development 🚀
