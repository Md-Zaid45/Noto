import { doc, h, p, b, it, st, cd, bq, cb, ul, ol, hr } from "./helpers.js";

export const note6 = {
  name: "Project Ideas",
  folder: "Projects",
  content: doc(
    h("Project Ideas"),
    p("A collection of ideas for portfolio and practice."),
    hr(),
    h("Web Applications", 2),
    ul(
      "Real-time collaborative whiteboard using WebSockets",
      "AI-powered note-taking app with RAG (like Noto!)",
      "URL shortener with analytics dashboard",
      "Personal finance tracker with charts and budgets"
    ),
    h("System Design", 2),
    ul(
      "Design a URL shortener at scale (hashing, caching, rate limiting)",
      "Design a chat system (presence, message ordering, delivery guarantees)",
      "Design a news feed (fan-out on read vs write)"
    ),
    h("CLI Tools", 2),
    ul(
      "Markdown to PDF converter with custom themes",
      "Git commit message linter",
      "Automated database backup script"
    )
  ),
};

export const note7 = {
  name: "Git Cheatsheet",
  folder: "Computer Science",
  content: doc(
    h("Git Cheatsheet"),
    p("Essential Git commands for daily development."),
    hr(),
    h("Branching", 2),
    cb(
      "git branch feature/login       # create branch\ngit checkout feature/login      # switch to it\ngit checkout -b feature/login   # create + switch\ngit branch -d feature/login     # delete branch\ngit branch -a                   # list all branches",
      "bash"
    ),
    h("Staging & Committing", 2),
    cb(
      "git add .                       # stage all changes\ngit add src/App.jsx             # stage specific file\ngit commit -m \"feat: add login\"  # commit with message\ngit commit --amend              # amend last commit",
      "bash"
    ),
    h("Undoing Changes", 2),
    ul(
      cd("git reset HEAD file.js") + " - unstage a file",
      cd("git checkout -- file.js") + " - discard changes",
      cd("git revert HEAD") + " - undo last commit (creates new commit)",
      cd("git reset --hard HEAD~1") + " - discard last commit (destructive)"
    ),
    h("Remote & Collaboration", 2),
    cb(
      "git remote add origin https://github.com/user/repo.git\ngit push -u origin main\ngit pull --rebase origin main    # pull with rebase\ngit fetch                        # fetch without merging",
      "bash"
    ),
    h("Useful Aliases", 2),
    cb(
      "[alias]\n  co = checkout\n  br = branch\n  ci = commit\n  st = status\n  lg = log --oneline --graph --all",
      "ini"
    ),
    bq(
      "Pro tip: Use ",
      cd("git log --oneline --graph --all"),
      " to visualize branch history in the terminal."
    )
  ),
};

export const note8 = {
  name: "Docker Basics",
  folder: "Computer Science",
  content: doc(
    h("Docker Basics"),
    p(
      "Docker packages applications into ",
      b("containers"),
      " - lightweight, isolated environments that run anywhere."
    ),
    hr(),
    h("Key Concepts", 2),
    ul(
      b("Image") + " - a read-only template with app code, runtime, and dependencies",
      b("Container") + " - a running instance of an image",
      b("Dockerfile") + " - a script of instructions to build an image",
      b("Volume") + " - persistent data storage outside the container"
    ),
    h("Dockerfile Example", 2),
    cb(
      "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"src/index.js\"]",
      "dockerfile"
    ),
    h("Docker Compose", 2),
    p("Define multi-container apps with a YAML file:"),
    cb(
      "version: \"3.8\"\nservices:\n  app:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      - MONGO_DB_URI=mongodb://mongo:27017\n    depends_on:\n      - mongo\n  mongo:\n    image: mongo:7\n    volumes:\n      - mongo-data:/data/db\n\nvolumes:\n  mongo-data:",
      "yaml"
    ),
    h("Common Commands", 2),
    cb(
      "docker build -t myapp .           # build image\ndocker run -p 3000:3000 myapp       # run container\ndocker compose up -d               # start all services\ndocker compose down                # stop all services\ndocker logs <container>            # view logs\ndocker exec -it <container> sh     # shell into container",
      "bash"
    ),
    bq(
      "Best practice: Use ",
      cd(".dockerignore"),
      " to exclude node_modules, .env, and unnecessary files from the build context."
    )
  ),
};

export const note9 = {
  name: "Sprint Planning - Week 38",
  folder: null,
  content: doc(
    h("Sprint Planning - Week 38"),
    p(b("Date:"), " September 15, 2025"),
    hr(),
    h("Discussion", 2),
    p(
      "Last sprint velocity: ",
      b("34 story points"),
      " completed out of 40 planned. The authentication refactor took longer due to edge cases in token refresh."
    ),
    h("Action Items", 2),
    ul(
      "Migrate user endpoints to new auth middleware - assigned to Zaid",
      "Add rate limiting to public API routes - assigned to team",
      "Write integration tests for flashcard scheduling - backlog",
      "Set up staging environment on Render - assigned to DevOps"
    ),
    h("Notes", 2),
    p("Team agreed to reduce scope on search. Ship basic full-text search first, add vector search next sprint."),
  ),
};

export const note10 = {
  name: "Morning Routine",
  folder: "Daily Journal",
  content: doc(
    h("Morning Routine"),
    p(b("Date:"), " September 19, 2025"),
    hr(),
    p("Woke up at ", b("6:30 AM"), ". Feeling focused today after a good night of sleep."),
    h("Routine", 2),
    ol(
      "6:30 - Wake up, drink a glass of water",
      "6:45 - Quick 15-minute stretch routine",
      "7:00 - Breakfast (oatmeal + coffee)",
      "7:30 - Review daily goals and priorities",
      "8:00 - Start deep work session"
    ),
    h("Reflections", 2),
    p(
      it("The key to consistency is not motivation but discipline. Show up even when you don't feel like it."),
    ),
    p("Today's focus: Finish the seed data and deploy the staging environment."),
    h("Gratitude", 2),
    ul(
      "Grateful for a quiet morning to think clearly",
      "The project is coming together nicely",
      "Good coffee makes everything better"
    )
  ),
};