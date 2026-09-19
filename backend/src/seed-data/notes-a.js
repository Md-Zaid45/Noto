import { doc, h, p, b, it, st, cd, bq, cb, ul, ol, hr } from "./helpers.js";

// 1. Big-O Notation
export const note1 = {
  name: "Big-O Notation",
  folder: "Algorithms",
  content: doc(
    h("Big-O Notation"),
    p(
      "Big-O notation classifies algorithms by how their ",
      b("run time"),
      " or ",
      b("space requirements"),
      " grow as input size increases. It gives an upper bound on the growth rate of a function."
    ),
    hr(),
    h("Common Complexities", 2),
    p("Ranked from fastest to slowest:"),
    ol(
      cd("O(1)") + " - Constant: hash table lookup, array index access",
      cd("O(log n)") + " - Logarithmic: binary search, balanced BST",
      cd("O(n)") + " - Linear: single loop through an array",
      cd("O(n log n)") + " - Linearithmic: merge sort, heap sort",
      cd("O(n^2)") + " - Quadratic: nested loops, bubble sort",
      cd("O(2^n)") + " - Exponential: recursive Fibonacci",
      cd("O(n!)") + " - Factorial: brute-force permutations"
    ),
    hr(),
    h("Key Rules", 2),
    bq(
      "Drop constants: " +
        cd("O(2n)") +
        " simplifies to " +
        cd("O(n)") +
        ". The dominant term is all that matters."
    ),
    p("For example:"),
    cb(
      '// O(n^2 + n) simplifies to O(n^2)\n// O(3n + 5) simplifies to O(n)\n// O(n * log n) stays as O(n log n)',
      "javascript"
    ),
    p("When analyzing nested loops, ", b("multiply"), " the complexities."),
    h("Space Complexity", 2),
    p(
      "Space complexity measures the ",
      it("extra memory"),
      " used relative to input size."
    ),
    cb(
      "function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n// Time: O(n), Space: O(1)",
      "javascript"
    ),
    cb(
      "function copyArray(arr) {\n  const copy = [];\n  for (let i = 0; i < arr.length; i++) {\n    copy.push(arr[i]);\n  }\n  return copy;\n}\n// Time: O(n), Space: O(n)",
      "javascript"
    ),
    hr(),
    h("Amortized Analysis", 2),
    p(
      "Some operations have ",
      b("amortized"),
      " O(1) cost. For example, ",
      cd("Array.push()"),
      " is usually O(1), but occasionally O(n) when the array resizes."
    )
  ),
};

// 2. React Hooks Guide
export const note2 = {
  name: "React Hooks Guide",
  folder: "Web Development",
  content: doc(
    h("React Hooks Guide"),
    p(
      "Hooks let you use state and other React features in ",
      b("functional components"),
      ". Introduced in React 16.8."
    ),
    hr(),
    h("useState", 2),
    p(
      "Manages local component state. Returns a stateful value and a setter function."
    ),
    cb(
      'const [count, setCount] = useState(0);\nconst [user, setUser] = useState({ name: "", email: "" });',
      "javascript"
    ),
    p(
      it("Important:"),
      " State updates are ",
      b("asynchronous"),
      ". Use the functional form when new state depends on previous state:"
    ),
    cb(
      "// Wrong - may miss updates\nsetCount(count + 1);\nsetCount(count + 1);\n\n// Correct - batches both\nsetCount(prev => prev + 1);\nsetCount(prev => prev + 1);",
      "javascript"
    ),
    h("useEffect", 2),
    p("Performs side effects. Runs ", b("after"), " every render by default."),
    cb(
      '// Runs only on mount\nuseEffect(() => {\n  fetchData();\n}, []);\n\n// Runs when count changes\nuseEffect(() => {\n  saveToAPI(count);\n}, [count]);\n\n// Cleanup\nuseEffect(() => {\n  const handler = () => {};\n  window.addEventListener("resize", handler);\n  return () => window.removeEventListener("resize", handler);\n}, []);',
      "javascript"
    ),
    h("useCallback & useMemo", 2),
    p("Both are ", b("memoization"), " hooks:"),
    ul(
      cd("useCallback(fn, deps)") + " - memoizes a function definition",
      cd("useMemo(() => value, deps)") + " - memoizes a computed value"
    ),
    h("Custom Hooks", 2),
    p(
      "Extract reusable logic into custom hooks. Name them starting with ",
      b('"use"'),
      "."
    ),
    cb(
      "function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    setLoading(true);\n    fetch(url)\n      .then(res => res.json())\n      .then(setData)\n      .catch(setError)\n      .finally(() => setLoading(false));\n  }, [url]);\n\n  return { data, loading, error };\n}",
      "javascript"
    ),
    hr(),
    h("Rules of Hooks", 2),
    ol(
      "Only call hooks at the top level",
      "Only call hooks from React functions"
    ),
    bq(
      p(
        "Breaking these rules causes hard-to-trace bugs. The linter plugin ",
        cd("eslint-plugin-react-hooks"),
        " enforces them."
      )
    )
  ),
};

// 3. SQL JOIN Types
export const note3 = {
  name: "SQL JOIN Types",
  folder: "Databases",
  content: doc(
    h("SQL JOIN Types"),
    p(
      "JOIN clauses combine rows from tables based on related columns. Essential for writing ",
      b("correct"),
      " and ",
      b("efficient"),
      " queries."
    ),
    hr(),
    h("INNER JOIN", 2),
    p("Returns only rows with ", b("matching values"), " in both tables."),
    cb(
      "SELECT users.name, orders.total\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;",
      "sql"
    ),
    p("Example data:"),
    cb(
      "-- users:           -- orders:\n-- | id | name |    -- | id | user_id | total |\n-- | 1  | Ali  |    -- | 1  | 1       | 50    |\n-- | 2  | Sara |    -- | 2  | 1       | 30    |\n-- | 3  | Omar |    -- | 3  | 4       | 100   |",
      "sql"
    ),
    p(
      "Result: Ali appears twice. Sara and Omar are ",
      st("excluded"),
      " - no matching orders."
    ),
    h("LEFT JOIN", 2),
    p(
      "Returns ",
      b("all rows from the left table"),
      " and matching rows from the right. NULLs fill unmatched right-side columns."
    ),
    cb(
      "SELECT users.name, orders.total\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;",
      "sql"
    ),
    p(
      "Result: All 3 users appear. Omar shows ",
      cd("NULL"),
      " for total."
    ),
    h("RIGHT JOIN", 2),
    p(
      "Returns ",
      b("all rows from the right table"),
      " and matching from the left. Usually rewritten as a LEFT JOIN."
    ),
    h("FULL OUTER JOIN", 2),
    p(
      "Returns all rows from ",
      b("both tables"),
      ". NULLs fill where there is no match on either side."
    ),
    h("CROSS JOIN", 2),
    p(
      "Produces a ",
      b("Cartesian product"),
      " - every row from the first paired with every row from the second. ",
      st("Use with caution."),
      " 1000 x 1000 = 1,000,000 rows."
    ),
    hr(),
    h("Performance Tips", 2),
    ul(
      "Always " + b("index") + " JOIN columns for large tables",
      "Use " + cd("EXPLAIN") + " to analyze query execution plans",
      "Prefer " + cd("INNER JOIN") + " when you only need matching rows",
      "Avoid joining on functions - index the raw column instead"
    )
  ),
};

// 4. Express.js Middleware
export const note4 = {
  name: "Express.js Middleware",
  folder: "Web Development",
  content: doc(
    h("Express.js Middleware"),
    p(
      "Middleware functions have access to ",
      cd("req"),
      ", ",
      cd("res"),
      ", and ",
      cd("next"),
      ". They can modify the request/response, end the cycle, or pass control."
    ),
    hr(),
    h("Middleware Signature", 2),
    cb(
      'function logger(req, res, next) {\n  console.log(req.method, req.originalUrl);\n  next(); // MUST call next() or end the request\n}',
      "javascript"
    ),
    h("Built-in Middleware", 2),
    ul(
      cd("express.json()") + " - parses JSON request bodies",
      cd("express.urlencoded()") + " - parses URL-encoded form data",
      cd("express.static()") + " - serves static files from a directory"
    ),
    h("Application-level Middleware", 2),
    cb(
      '// Runs on EVERY request\napp.use(logger);\n\n// Runs only on /api routes\napp.use("/api", apiAuth);\n\n// Runs on specific route\napp.get("/users/:id", validateUser, (req, res) => {\n  res.json({ user: req.user });\n});',
      "javascript"
    ),
    h("Error-handling Middleware", 2),
    p(
      "Must have ",
      b("4 parameters"),
      " - Express recognizes error handlers by the signature:"
    ),
    cb(
      "app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(err.status || 500).json({\n    success: false,\n    message: err.message\n  });\n});",
      "javascript"
    ),
    h("Middleware Execution Order", 2),
    p(
      "Express executes middleware ",
      b("in the order they are registered"),
      ". If one does not call ",
      cd("next()"),
      " or send a response, the chain stops."
    ),
    bq(
      "Always define error-handling middleware ",
      b("last"),
      " in the chain, after all other app.use() and route calls."
    )
  ),
};

// 5. Creamy Garlic Pasta
export const note5 = {
  name: "Creamy Garlic Pasta",
  folder: "Recipes",
  content: doc(
    h("Creamy Garlic Pasta"),
    p("A quick weeknight dinner. Ready in under ", b("25 minutes"), "."),
    hr(),
    h("Ingredients", 2),
    ul(
      "400g penne pasta",
      "4 cloves garlic, minced",
      "2 tbsp butter",
      "1 cup heavy cream",
      "1/2 cup parmesan cheese, grated",
      "Fresh basil leaves",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)"
    ),
    h("Instructions", 2),
    ol(
      p(
        b("Step 1:"),
        " Cook pasta in salted boiling water until al dente. Reserve 1 cup of pasta water before draining."
      ),
      p(
        b("Step 2:"),
        " Melt butter in a large pan over medium heat. Add minced garlic and saute for 1 minute until fragrant."
      ),
      p(
        b("Step 3:"),
        " Pour in heavy cream and bring to a gentle simmer. Let it reduce for 3-4 minutes."
      ),
      p(
        b("Step 4:"),
        " Add parmesan cheese and stir until melted and smooth. Season with salt, pepper, and red pepper flakes."
      ),
      p(
        b("Step 5:"),
        " Toss in the cooked pasta and a splash of pasta water. Stir until coated. Garnish with fresh basil."
      )
    ),
    hr(),
    h("Tips", 2),
    ul(
      "Add grilled chicken or shrimp for protein",
      "Use half-and-half instead of cream for a lighter version",
      "Freshly grated parmesan melts better than pre-shredded"
    )
  ),
};
