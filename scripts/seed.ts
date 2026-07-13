/**
 * Idempotent database seed. Run with: npm run seed
 *
 * Inserts each document only if its natural key (slug / key / name /
 * role+organization / degree+institution / title) is not already present, so
 * re-running never duplicates data and never overwrites content that was
 * edited through the admin UI. Data mirrors Asad E Bukhari's resume.
 */
import { config } from "dotenv";

import dbConnect from "../lib/db";
import Project from "../models/Project";
import Experience from "../models/Experience";
import Education from "../models/Education";
import Activity from "../models/Activity";
import TechStackItem from "../models/TechStackItem";
import SiteContent from "../models/SiteContent";

config();

const siteContent: Array<{ key: string; value: string }> = [
  { key: "hero_name", value: "Asad E Bukhari" },
  { key: "hero_image", value: "" },
  { key: "hero_headline", value: "Full-Stack Developer & Software Engineer" },
  {
    key: "hero_subtext",
    value:
      "I build scalable, AI-integrated web applications with React, Next.js, Node.js, and .NET — from internal tools for regulatory and educational institutions to LLM-powered products.",
  },
  {
    key: "about_text",
    value:
      "I'm a Full-Stack Developer and Software Engineer based in Rawalpindi, Pakistan, with hands-on experience across React.js, Next.js, TypeScript, React Native, Node.js, PHP, Java, C#, and .NET. I specialize in designing intuitive UI/UX, architecting scalable systems, and building internal tools for regulatory and educational institutions, with deep expertise in database design (SQL and NoSQL) and frontend–backend integration. I lean heavily on modern, AI-native workflows — using tools like Claude Code and GitHub Copilot to accelerate development, refactor legacy codebases, and automate complex tasks — while caring about robust CI/CD and high-quality, user-focused production standards.",
  },
  { key: "contact_email", value: "asadebukhari.work@gmail.com" },
  { key: "github_url", value: "https://github.com/asadayy" },
  { key: "linkedin_url", value: "https://www.linkedin.com/in/asad-e-bukhari/" },
  { key: "resume_url", value: "/Asad-E-Bukhari-Resume.pdf" },
];

const projects = [
  {
    title: "VidAI — AI-Powered Wedding Planning Platform",
    slug: "vidai",
    shortDescription:
      "AI-powered wedding planning platform on a three-tier architecture (React + Vite web, React Native + Expo mobile, Python FastAPI AI microservice) with dual AI systems — Google Gemini and a self-hosted LLaMA 3.2.",
    longDescription: `## Overview

VidAI is an AI-powered wedding planning platform that connects couples with vendors, built as a full-stack, three-tier system so each layer can scale independently.

## Architecture

- **Web** — React + Vite single-page app
- **Mobile** — React Native + Expo
- **AI microservice** — Python FastAPI, kept separate so AI workloads scale independently of the core API

## Backend & auth

A Node.js/Express REST API backed by MongoDB (Mongoose/Atlas), with schemas for users, vendors, bookings, reviews, and AI conversations. Authentication uses **JWT with refresh-token rotation** and bcrypt hashing, plus role-based access control for customer, vendor, and admin roles via server-side middleware.

## Dual AI systems

- **Google Gemini Flash API** powers the conversational chatbot and image generation.
- A **locally-hosted LLaMA 3.2 (Ollama)** model drives the vendor recommendation engine and budget planning — keeping sensitive planning data on the server and controlling cost.

## Stack

React, React Native (Expo), Node.js/Express, Python FastAPI, MongoDB, Gemini API, Ollama/LLaMA 3.2.`,
    techStack: [
      "React",
      "React Native",
      "Node.js",
      "Express",
      "FastAPI",
      "MongoDB",
      "Gemini API",
      "Ollama",
    ],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "The Ordinary — Skincare E-Commerce + AI Skin Analyzer",
    slug: "the-ordinary",
    shortDescription:
      "Full-stack MERN skincare e-commerce app with an AI skin analyzer that turns an uploaded photo into personalized product recommendations. Deployed on Vercel.",
    longDescription: `## Overview

A full-stack **MERN** skincare e-commerce application: a React SPA (Context API for auth/cart state, Axios for API calls) paired with a Node.js/Express backend in an MVC layout. The RESTful API covers products, auth, cart, orders, ratings, chat, and subscriber management.

## Authentication & sessions

Secure authentication and session handling with express-session — environment-driven config, production-secure cookies, and CORS with credentials pinned to the deployed frontend — surfaced to the UI through a client-side AuthContext.

## AI skin analyzer

The standout feature is an AI skin-analysis pipeline: a React drag-and-drop uploader with client-side validation performs a multipart/form-data upload to the API, which returns analysis, recommendations, and a usage plan rendered into personalized product suggestions.

## Stack

React, Node.js/Express, MongoDB, Gemini API. Deployed on Vercel.`,
    techStack: ["React", "Node.js", "Express", "MongoDB", "Gemini API", "Vercel"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "Veritas AI — Fake News Detection",
    slug: "veritas-ai",
    shortDescription:
      "End-to-end NLP pipeline that classifies news as real or fake at 94.5% accuracy, with a per-word explainability module and an interactive Streamlit dashboard.",
    longDescription: `## Overview

Veritas AI is an end-to-end NLP system that classifies news articles as real or fake, wrapped in an interactive analytics dashboard.

## Model

A **TF-IDF** (unigram + bigram, 50K-feature) representation feeds a Logistic Regression classifier, trained on ~45,000 labeled articles and reaching **94.5% accuracy**.

## Explainability

A custom explainability module maps each prediction back to its highest-impact TF-IDF terms via the model coefficients, surfacing per-word "fake" vs "real" signals instead of a black-box score.

## Dashboard

An interactive **Streamlit** dashboard provides real-time inference, TextBlob sentiment analysis, and Plotly/Seaborn visualizations (confidence gauges, confusion matrices, word clouds), plus on-demand PDF report generation via a custom FPDF subclass. The joblib-serialized model layer is decoupled from the UI.

## Stack

Python, Streamlit, scikit-learn, NLTK, Plotly, FPDF.`,
    techStack: ["Python", "Streamlit", "scikit-learn", "NLTK", "Plotly", "FPDF"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 3,
  },
  {
    title: "CPU Scheduling Algorithm Simulator",
    slug: "cpu-scheduling-simulator",
    shortDescription:
      "JavaFX desktop app that simulates and visualizes four CPU scheduling algorithms with a live, color-coded Gantt chart.",
    longDescription: `## Overview

A JavaFX desktop application that simulates and visualizes four CPU scheduling algorithms — **FCFS, SJF, Round Robin, and Priority Scheduling** — built to demonstrate operating-system concepts.

## Design

A modular, object-oriented architecture cleanly separates scheduling logic from the UI, so new algorithms can be added without modifying existing code (Open/Closed principle).

## Features

- Add, edit, and delete processes interactively
- Instant computation of waiting time, turnaround time, and averages
- A dynamic, color-coded **Gantt chart** visualizing execution order and timing in real time

## Stack

Java, JavaFX, Maven, JPMS.`,
    techStack: ["Java", "JavaFX", "Maven", "JPMS"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 4,
  },
  {
    title: "FAEDED — Desktop Music Player",
    slug: "faeded-music-player",
    shortDescription:
      "JavaFX desktop music player (MVC) with a SQLite-backed library, full playback controls, and automatic metadata/album-art extraction.",
    longDescription: `## Overview

FAEDED is a JavaFX desktop music player built on the MVC pattern, using JFoenix for a Material Design UI and SQLite for persistent song-library storage.

## Features

- Core playback — play/pause, seek, shuffle, repeat, and volume — via JavaFX MediaPlayer
- Automatic metadata and album-art extraction
- A searchable library drawer with custom list-cell rendering
- A frameless, custom-styled interface

## Stack

Java, JavaFX, JFoenix, SQLite, Maven.`,
    techStack: ["Java", "JavaFX", "JFoenix", "SQLite", "Maven"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 5,
  },
  {
    title: "Tetris — Desktop App",
    slug: "tetris",
    shortDescription:
      "Fully playable Tetris clone in C#/WinForms with hold/swap, progressive difficulty, GDI+ rendering, and custom binary leaderboards.",
    longDescription: `## Overview

A fully playable Tetris clone built in C# / Windows Forms, featuring piece movement, rotation, hold/swap, drop scoring, line-clear detection, and progressive difficulty.

## Architecture

A layered design separates game state, board/collision logic, and UI rendering, using an event-driven pattern to keep the UI in sync with game state.

## Highlights

- Custom **GDI+** rendering of the board and pieces, with embedded bitmap resources for tiles and overlays
- Custom binary file persistence for **dual leaderboards** (high scores and survival time) with bespoke ranking/sorting logic

## Stack

C#, .NET Framework, Windows Forms, GDI+.`,
    techStack: ["C#", ".NET", "Windows Forms", "GDI+"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 6,
  },
  {
    title: "FASAD — E-Commerce Web Application",
    slug: "fasad-ecommerce",
    shortDescription:
      "Full-stack PHP/MySQL e-commerce site with an AJAX-driven storefront and a separate admin dashboard for catalog, orders, and sales analytics.",
    longDescription: `## Overview

FASAD is a full-stack e-commerce web application with a product catalog, cart, checkout, and order processing on a normalized MySQL schema.

## Storefront

An AJAX-driven storefront handles filtering, dynamic product loading, and cart updates for a responsive, no-reload shopping experience.

## Admin

A separate admin dashboard manages products, users, and orders, with sales analytics and activity logging. Session-based authentication protects a multi-table checkout flow that persists orders and line items.

## Stack

PHP, MySQL, JavaScript/jQuery, AJAX, XAMPP.`,
    techStack: ["PHP", "MySQL", "jQuery", "AJAX"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 7,
  },
];

const experiences = [
  {
    role: "WebDev & Digital Marketing Specialist — QA, Team Lead & Content Creator",
    organization: "Ardent Thrive",
    location: "Remote",
    startDate: new Date("2024-03-01"),
    endDate: null,
    description: `- Developed, deployed, and hosted a **MERN** website with a complete, WordPress-style admin dashboard
- Trained and managed a team of 3 interns, assigning websites for off-page SEO initiatives and monitoring individual and team performance against quality standards
- Enhanced website authority and search-engine rankings through strategic link-building and detailed backlink audits against SEO best practices
- Produced digital content and oversaw social-media account management`,
    techUsed: ["MongoDB", "Express", "React", "Node.js", "SEO"],
    sortOrder: 1,
  },
  {
    role: "Full Stack Developer Intern",
    organization: "NEPRA (National Electric Power Regulatory Authority)",
    location: "Islamabad, Pakistan",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-02-28"),
    description: `- Built a **Leave & Attendance Management System** with a team of interns using TypeScript, Tailwind CSS, Node.js, and Express.js — adopted for internal HR operations
- Architected and optimized a Microsoft SQL Server database with normalized schemas, indexes, triggers, and stored procedures for employee records, attendance, and role-based access control
- Built secure RESTful APIs with JWT authentication, engineering end-to-end leave-approval and attendance-tracking workflows
- Developed a responsive intranet interface and performed testing, debugging, and QA using Git/GitHub and Postman in an agile team environment`,
    techUsed: ["TypeScript", "Tailwind CSS", "Node.js", "Express", "MSSQL", "JWT"],
    sortOrder: 2,
  },
  {
    role: "Full Stack Developer Intern",
    organization: "PMAS Arid Agriculture University",
    location: "Rawalpindi, Pakistan",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-09-30"),
    description: `- Developed and enhanced a dynamic web application using PHP, HTML5, CSS3, and JavaScript for the university website redesign, focusing on seamless frontend–backend integration
- Designed responsive user interfaces and GUI enhancements, improving usability, accessibility, and overall UX across devices
- Built modular, reusable components and a structured content architecture, improving maintainability and reducing page-load times
- Integrated Oracle database operations with PHP to handle dynamic content, CRUD operations, and data-driven pages`,
    techUsed: ["PHP", "JavaScript", "HTML5", "CSS3", "Oracle"],
    sortOrder: 3,
  },
];

const education = [
  {
    degree: "B.Sc. Software Engineering",
    institution: "Bahria School of Engineering & Applied Sciences",
    location: "",
    startDate: new Date("2022-09-01"),
    endDate: new Date("2026-06-30"),
    grade: "CGPA: 3.2 / 4.00",
    description: "",
    sortOrder: 1,
  },
];

const activities = [
  {
    title: "Athletics",
    description:
      "Captain of the Department Futsal Team and goalkeeper for the University Futsal Team. Captain of a championship-winning school football team.",
    sortOrder: 1,
  },
  {
    title: "Event Coordination",
    description:
      "Logistics Lead for Aurex'26 and the MLSA BSEAS Society, and Logistics Coordinator for CCode'23 and BUMUN'25. Active member of the University Media, Sports, E-Sports, and Music Clubs.",
    sortOrder: 2,
  },
  {
    title: "Public Speaking",
    description:
      "Active debater, skilled at articulating complex ideas clearly to diverse audiences.",
    sortOrder: 3,
  },
];

const techStackItems: Array<{
  name: string;
  category: "Frontend" | "Backend" | "Database" | "AI/ML" | "Tools";
  sortOrder: number;
}> = [
  { name: "React.js", category: "Frontend", sortOrder: 1 },
  { name: "Next.js", category: "Frontend", sortOrder: 2 },
  { name: "React Native", category: "Frontend", sortOrder: 3 },
  { name: "TypeScript", category: "Frontend", sortOrder: 4 },
  { name: "JavaScript", category: "Frontend", sortOrder: 5 },
  { name: "HTML5", category: "Frontend", sortOrder: 6 },
  { name: "CSS3", category: "Frontend", sortOrder: 7 },
  { name: "Tailwind CSS", category: "Frontend", sortOrder: 8 },
  { name: "Bootstrap", category: "Frontend", sortOrder: 9 },
  { name: "Node.js", category: "Backend", sortOrder: 1 },
  { name: "Express.js", category: "Backend", sortOrder: 2 },
  { name: ".NET", category: "Backend", sortOrder: 3 },
  { name: "PHP", category: "Backend", sortOrder: 4 },
  { name: "Java", category: "Backend", sortOrder: 5 },
  { name: "C#", category: "Backend", sortOrder: 6 },
  { name: "Python", category: "Backend", sortOrder: 7 },
  { name: "FastAPI", category: "Backend", sortOrder: 8 },
  { name: "MongoDB", category: "Database", sortOrder: 1 },
  { name: "SQL Server (MSSQL)", category: "Database", sortOrder: 2 },
  { name: "MySQL", category: "Database", sortOrder: 3 },
  { name: "Oracle", category: "Database", sortOrder: 4 },
  { name: "Gemini API", category: "AI/ML", sortOrder: 1 },
  { name: "LLaMA / Ollama", category: "AI/ML", sortOrder: 2 },
  { name: "scikit-learn", category: "AI/ML", sortOrder: 3 },
  { name: "NLTK", category: "AI/ML", sortOrder: 4 },
  { name: "Git & GitHub", category: "Tools", sortOrder: 1 },
  { name: "Docker", category: "Tools", sortOrder: 2 },
  { name: "VS Code", category: "Tools", sortOrder: 3 },
  { name: "IntelliJ", category: "Tools", sortOrder: 4 },
  { name: "Expo", category: "Tools", sortOrder: 5 },
  { name: "Postman", category: "Tools", sortOrder: 6 },
  { name: "P6 Primavera", category: "Tools", sortOrder: 7 },
  { name: "JWT", category: "Tools", sortOrder: 8 },
];

async function seed() {
  await dbConnect();

  let created = 0;
  let skipped = 0;
  const tally = (didCreate: boolean) => (didCreate ? created++ : skipped++);

  for (const item of siteContent) {
    const exists = await SiteContent.exists({ key: item.key });
    if (!exists) await SiteContent.create(item);
    tally(!exists);
  }

  for (const project of projects) {
    const exists = await Project.exists({ slug: project.slug });
    if (!exists) await Project.create(project);
    tally(!exists);
  }

  // Match on organization/institution only — titles are freely edited in the
  // admin, and a stricter match would re-insert edited entries as duplicates.
  for (const experience of experiences) {
    const exists = await Experience.exists({
      organization: experience.organization,
    });
    if (!exists) await Experience.create(experience);
    tally(!exists);
  }

  for (const entry of education) {
    const exists = await Education.exists({
      institution: entry.institution,
    });
    if (!exists) await Education.create(entry);
    tally(!exists);
  }

  for (const activity of activities) {
    const exists = await Activity.exists({ title: activity.title });
    if (!exists) await Activity.create(activity);
    tally(!exists);
  }

  for (const tech of techStackItems) {
    const exists = await TechStackItem.exists({ name: tech.name });
    if (!exists) await TechStackItem.create(tech);
    tally(!exists);
  }

  const counts = {
    siteContent: await SiteContent.countDocuments(),
    projects: await Project.countDocuments(),
    experiences: await Experience.countDocuments(),
    education: await Education.countDocuments(),
    activities: await Activity.countDocuments(),
    techStackItems: await TechStackItem.countDocuments(),
  };

  console.log(`Seed complete: ${created} created, ${skipped} already present.`);
  console.log("Collection totals:", counts);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
