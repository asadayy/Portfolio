/**
 * Idempotent database seed. Run with: npm run seed
 *
 * Inserts each document only if its natural key (slug / key / name /
 * role+organization) is not already present, so re-running never duplicates
 * data and never overwrites content that was edited through the admin UI.
 */
import { config } from "dotenv";

import dbConnect from "../lib/db";
import Project from "../models/Project";
import Experience from "../models/Experience";
import TechStackItem from "../models/TechStackItem";
import SiteContent from "../models/SiteContent";

config({ path: ".env.local" });
config();

const siteContent: Array<{ key: string; value: string }> = [
  { key: "hero_name", value: "Asad E Bukhari" },
  { key: "hero_image", value: "" },
  {
    key: "hero_headline",
    value: "Full-Stack Developer Building AI-Integrated Web Applications",
  },
  {
    key: "hero_subtext",
    value:
      "Software Engineering graduate specializing in React, Node.js, and LLM-powered products.",
  },
  {
    key: "about_text",
    value:
      "I'm Asad E Bukhari, a full-stack developer who enjoys taking products from idea to production — from AI-powered planning tools to enterprise systems for Pakistan's national power regulator. I work across the stack with React, Next.js, Node.js, and MongoDB, and I have a particular interest in integrating LLMs (Gemini, LLaMA) into real-world applications.",
  },
  { key: "contact_email", value: "asademuhammad96@gmail.com" },
  { key: "github_url", value: "https://github.com/TODO-your-username" },
  { key: "linkedin_url", value: "https://www.linkedin.com/in/TODO-your-handle" },
  { key: "resume_url", value: "TODO-link-to-your-resume.pdf" },
];

const projects = [
  {
    title: "VidAI (Shadiyana)",
    slug: "vidai-shadiyana",
    shortDescription:
      "AI-powered wedding planning platform with a dual LLM architecture: Google Gemini Flash in the cloud and LLaMA 3.2 self-hosted via Ollama.",
    longDescription: `## Overview

VidAI is the AI planning engine behind **Shadiyana**, a wedding-planning platform. It turns a couple's budget, guest count, city, and preferences into concrete plans: venue shortlists, vendor suggestions, budget breakdowns, and day-by-day checklists.

## The dual-LLM architecture

The headline engineering challenge was serving AI features reliably **and** affordably:

- **Hosted path — Google Gemini Flash API** for low-latency, structured generation in production traffic.
- **Self-hosted path — LLaMA 3.2 running locally via Ollama** for development, cost control, and flows where data should not leave the server.
- A provider-agnostic service layer normalizes prompts and responses between the two, so switching models is a configuration change rather than a rewrite, and the app degrades gracefully if one provider is unavailable.

## Key features

- Budget-aware venue and vendor recommendations
- Structured JSON outputs validated before they touch the UI, keeping hallucinated fields out of the product
- Conversation-style refinement — users iterate on a plan instead of re-entering details

## Stack

React frontend, Node.js/Express API, MongoDB for persistence, Gemini Flash + Ollama/LLaMA 3.2 for generation.`,
    techStack: ["React", "Node.js", "Express", "MongoDB", "Gemini API", "Ollama"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "LAMS — Enterprise App at NEPRA",
    slug: "lams-nepra",
    shortDescription:
      "Licensing & administration management system built during my full-stack internship at Pakistan's national electric-power regulator.",
    longDescription: `## Case study: digitizing licence administration at NEPRA

> Internal enterprise system — no public demo. Built during my Full-Stack Developer internship at the National Electric Power Regulatory Authority (NEPRA), Pakistan's national power regulator.

### Problem

Licensing workflows — applications, reviews, renewals, and compliance records — were spread across paper files and spreadsheets. Tracking the state of a licence application meant manual cross-checking, and records were hard to audit.

### My role

I worked as a full-stack developer on core LAMS modules: building screens for licence application intake, review, and renewal, and the APIs behind them. I collaborated with regulatory staff to translate existing paper procedures into validated digital forms.

### Stack

React.js with TypeScript on the frontend, Node.js/Express REST APIs, MSSQL for storage, and JWT-based authentication with role-based access for the different departments involved in a licence's lifecycle.

### Outcome

Licensing records became searchable and auditable in one system, application state is visible end-to-end without manual cross-checking, and validated digital forms replaced error-prone re-typing of paper submissions.`,
    techStack: ["React.js", "TypeScript", "Node.js", "Express", "MSSQL", "JWT"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "The Ordinary",
    slug: "the-ordinary",
    shortDescription:
      "MERN skincare e-commerce app with product catalogue, cart and checkout, plus an AI skin analyzer that recommends routines.",
    longDescription: `## Overview

A full MERN e-commerce build of a skincare storefront inspired by The Ordinary: product catalogue with categories and search, cart and checkout flow, order history, and an admin view for managing inventory.

## AI skin analyzer

The differentiating feature is a skin analyzer: users answer a short questionnaire about their skin type and concerns, and the app builds a personalized routine — mapped to actual catalogue products — with an explanation of what each ingredient does and the order to apply products in.

## Highlights

- End-to-end MERN architecture: MongoDB, Express, React, Node.js
- JWT-authenticated user accounts with persistent carts and order history
- Recommendation logic that maps analyzer results onto live catalogue data, so suggestions never point at out-of-stock or removed products`,
    techStack: ["MongoDB", "Express", "React", "Node.js"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 3,
  },
  {
    title: "Veritas AI",
    slug: "veritas-ai",
    shortDescription:
      "Fake-news detection tool: TF-IDF features and scikit-learn classifiers behind a Streamlit interface.",
    longDescription: `## Overview

Veritas AI is an NLP tool that classifies news articles as likely real or fake. Paste an article (or headline) and it returns a prediction with the model's confidence.

## How it works

- Text is cleaned and vectorized with **TF-IDF** over word n-grams
- **scikit-learn** classifiers trained on a labelled fake/real news corpus produce the prediction
- A **Streamlit** UI wraps the pipeline for interactive use, showing the tokens that pushed the decision

## What I learned

This project was my deep dive into classic NLP before the LLM era: the trade-offs between precision and recall on imbalanced data, why evaluation beyond raw accuracy matters, and how far a well-tuned linear model over TF-IDF features can get you with limited compute.`,
    techStack: ["Python", "scikit-learn", "TF-IDF", "Streamlit"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 4,
  },
];

const experiences = [
  {
    role: "Full-Stack Developer Intern",
    organization: "NEPRA (National Electric Power Regulatory Authority)",
    location: "Islamabad, Pakistan",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-09-30"),
    description: `- Built core modules of **LAMS**, NEPRA's internal Licensing & Administration Management System, working across the full stack
- Developed React.js + TypeScript interfaces for licence application, review, and renewal workflows
- Designed Node.js/Express REST APIs over MSSQL, including JWT authentication with role-based access for multiple departments
- Worked with regulatory staff to convert paper-based licensing procedures into validated digital forms with auditable records`,
    techUsed: ["React.js", "TypeScript", "Node.js", "Express", "MSSQL", "JWT"],
    sortOrder: 1,
  },
  {
    role: "Web Development Intern",
    organization: "PMAS Arid Agriculture University",
    location: "Rawalpindi, Pakistan",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-09-30"),
    description: `- Developed and maintained departmental web pages and internal tools used by staff and students
- Built responsive interfaces with HTML, CSS, Bootstrap, and JavaScript
- Added features and fixed bugs in existing PHP/MySQL university web applications
- Gained end-to-end exposure to running live sites: from local changes through deployment and support`,
    techUsed: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
    sortOrder: 2,
  },
];

const techStackItems: Array<{
  name: string;
  category: "Frontend" | "Backend" | "Database" | "AI/ML" | "Tools";
  sortOrder: number;
}> = [
  { name: "React.js", category: "Frontend", sortOrder: 1 },
  { name: "Next.js", category: "Frontend", sortOrder: 2 },
  { name: "TypeScript", category: "Frontend", sortOrder: 3 },
  { name: "JavaScript", category: "Frontend", sortOrder: 4 },
  { name: "React Native", category: "Frontend", sortOrder: 5 },
  { name: "Node.js", category: "Backend", sortOrder: 1 },
  { name: "Express.js", category: "Backend", sortOrder: 2 },
  { name: "FastAPI", category: "Backend", sortOrder: 3 },
  { name: "PHP", category: "Backend", sortOrder: 4 },
  { name: "MongoDB", category: "Database", sortOrder: 1 },
  { name: "MSSQL", category: "Database", sortOrder: 2 },
  { name: "MySQL", category: "Database", sortOrder: 3 },
  { name: "Mongoose", category: "Database", sortOrder: 4 },
  { name: "Python", category: "AI/ML", sortOrder: 1 },
  { name: "scikit-learn", category: "AI/ML", sortOrder: 2 },
  { name: "Gemini API", category: "AI/ML", sortOrder: 3 },
  { name: "Ollama/LLaMA", category: "AI/ML", sortOrder: 4 },
  { name: "RAG", category: "AI/ML", sortOrder: 5 },
  { name: "Git", category: "Tools", sortOrder: 1 },
  { name: "JWT", category: "Tools", sortOrder: 2 },
  { name: "Bootstrap", category: "Tools", sortOrder: 3 },
  { name: "Vercel", category: "Tools", sortOrder: 4 },
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

  for (const experience of experiences) {
    const exists = await Experience.exists({
      role: experience.role,
      organization: experience.organization,
    });
    if (!exists) await Experience.create(experience);
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
