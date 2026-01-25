// src/mock/data.js

export const users = [
  {
    id: 1,
    name: "Amit Sharma",
    email: "amit@example.com",
  },
];

/* ================= FOLDERS ================= */
export const folders = [
  {
    id: "f-1",
    userId: 1,
    name: "Programming",
    parentFolderId: "r",
    revisionMark: false,
    type: "folder",
  },
  {
    id:  "f-2",
    userId: 1,
    name: "ramming",
    parentFolderId: 'r',
    revisionMark: false,
    type: "folder",
  },
  {
    id:  "f-3",
    userId: 1,
    name: "Web Development",
    parentFolderId:  "f-1",
    revisionMark: true,
    type: "folder",
  },
  {
    id:  "f-4",
    userId: 1,
    name: "Databases",
    parentFolderId: "f-1",
    revisionMark: false,
    type: "folder",
  },
  {
    id:  "f-5",
    userId: 1,
    name: "React",
    parentFolderId:  "f-2",
    revisionMark: true,
    type: "folder",
  },
];

/* ================= NOTES ================= */
export const notes = [
  {
    id:  "n-1",
    userId: 1,
    folderId: "f-2",
    name: "HTML Basics",
    content: "HTML defines the structure of web pages.",
    revisionMark: false,
    type: "file",
  },
   {
    id: "n-2",
    userId: 1,
    folderId: "r",
    name: "root note",
    content: "root notktnirnn",
    revisionMark: false,
    type: "file",
  },
  {
    id:"n-3",
    userId: 1,
    folderId: "f-2",
    name: "CSS Flexbox",
    content: "Flexbox is used for one-dimensional layouts.",
    revisionMark: true,
    type: "file",
  },
  {
    id: "n-4",
    userId: 1,
    folderId: "f-4",
    name: "React Components",
    content: "Components are reusable UI blocks.",
    revisionMark: true,
    type: "file",
  },
  {
    id: "n-5",
    userId: 1,
    folderId: "f-3",
    name: "SQL Joins",
    content: "INNER, LEFT, RIGHT joins explained.",
    revisionMark: false,
    type: "file",
  },
];

/* ================= FLASHCARDS ================= */
export const flashcards = [
  {
    id: 1,
    noteId: 3,
    userId: 1,
    question: "What is a React component?",
    answer: "A reusable piece of UI logic written as a function or class.",
    reviewTime: "2025-01-01T10:00:00",
    easeScore: 2.5,
    intervalDays: 1,
    reviewCount: 2,
    lastReviewed: "2025-01-01T10:00:00",
  },
  {
    id: 2,
    noteId: 3,
    userId: 1,
    question: "What are props?",
    answer: "Inputs passed from parent to child components.",
    reviewTime: null,
    easeScore: 2.3,
    intervalDays: 2,
    reviewCount: 1,
    lastReviewed: "2024-12-30T09:00:00",
  },
  {
    id: 3,
    noteId: 4,
    userId: 1,
    question: "What is an INNER JOIN?",
    answer: "Returns rows that match in both tables.",
    reviewTime: "2025-01-02T08:00:00",
    easeScore: 2.6,
    intervalDays: 3,
    reviewCount: 3,
    lastReviewed: "2025-01-01T08:00:00",
  },
];
