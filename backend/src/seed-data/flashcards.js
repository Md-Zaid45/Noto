export function getFlashcards(noteIds) {
  const [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10] = noteIds;
  return [
    { question: 'What is Big-O notation?', answer: 'A mathematical notation describing the upper bound of an algorithm growth rate as input size increases.', noteId: n1, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What is the time complexity of binary search?', answer: 'O(log n) because it halves the search space with each comparison.', noteId: n1, interval: 6, easeScore: 2.7, repetitions: 2 },
    { question: 'What does O(n^2) mean?', answer: 'Quadratic time complexity from nested loops. Examples: bubble sort, insertion sort, selection sort.', noteId: n1, interval: 3, easeScore: 2.6, repetitions: 1 },
    { question: 'What does useState return?', answer: 'An array with two elements: the current state value and a setter function to update it.', noteId: n2, interval: 3, easeScore: 2.6, repetitions: 1 },
    { question: 'When does useEffect run by default?', answer: 'After every render. Use an empty dependency array to run once on mount, or specific deps to run when those change.', noteId: n2, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What is the difference between useCallback and useMemo?', answer: 'useCallback memoizes a function definition. useMemo memoizes a computed value. Both prevent unnecessary re-computation.', noteId: n2, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What does an INNER JOIN return?', answer: 'Only rows that have matching values in both tables. Unmatched rows from either table are excluded.', noteId: n3, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What is the difference between LEFT JOIN and FULL OUTER JOIN?', answer: 'LEFT JOIN returns all left rows with matches. FULL OUTER returns all rows from both tables with NULLs where there is no match.', noteId: n3, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What must error-handling middleware have?', answer: 'Four parameters: (err, req, res, next). Express recognizes error handlers by this 4-argument signature.', noteId: n4, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What does express.json() do?', answer: 'It is built-in middleware that parses incoming requests with JSON payloads. Place it before your routes in the middleware chain.', noteId: n4, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'Why reserve pasta water?', answer: 'Pasta water is starchy and helps the sauce cling to the pasta. Adding a splash when tossing creates a creamy, cohesive sauce.', noteId: n5, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What is a Docker image vs container?', answer: 'An image is a read-only template with app code and dependencies. A container is a running instance of an image.', noteId: n8, interval: 3, easeScore: 2.6, repetitions: 1 },
    { question: 'What does git rebase do?', answer: 'Reapplies commits on top of another base tip. It creates a linear history by moving a feature branch to the tip of the main branch.', noteId: n7, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What is the purpose of .dockerignore?', answer: 'Excludes files from the Docker build context, similar to .gitignore. Reduces build time and avoids leaking secrets into images.', noteId: n8, interval: 1, easeScore: 2.5, repetitions: 0 },
    { question: 'What is a cross join?', answer: 'Produces a Cartesian product - every row from the first table paired with every row from the second. 1000 x 1000 = 1M rows.', noteId: n3, interval: 1, easeScore: 2.5, repetitions: 0 },
  ];
}