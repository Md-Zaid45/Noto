export function getChats(noteIds) {
  const [n1] = noteIds;
  return [
    {
      name: 'Big-O Questions',
      noteId: n1,
      history: [
        { role: 'user', content: 'What is the difference between O(n) and O(n log n)?' },
        { role: 'assistant', content: 'O(n) means the algorithm processes each element once - linear time. O(n log n) means the algorithm does a linear pass with a logarithmic factor, like merge sort which splits the array (log n levels) and merges each level (n work). For large inputs, O(n) is always faster.' },
        { role: 'user', content: 'When would O(n log n) be preferred over O(n)?' },
        { role: 'assistant', content: 'O(n log n) algorithms like merge sort are preferred when you need guaranteed worst-case performance or stable sorting. O(n) algorithms like counting sort only work when the input has a limited range of values. For general-purpose sorting, O(n log n) is the best comparison-based lower bound.' },
      ],
    },
    {
      name: 'React Hooks Help',
      noteId: null,
      history: [
        { role: 'user', content: 'When should I use useEffect cleanup?' },
        { role: 'assistant', content: 'Use cleanup when your effect subscribes to something or creates a timer. The cleanup function runs before the component unmounts and before the effect re-runs. Common cases: removing event listeners, clearing intervals/timeouts, aborting fetch requests.' },
      ],
    },
    {
      name: 'SQL Queries',
      noteId: null,
      history: [
        { role: 'user', content: 'How do I find users who have never placed an order?' },
        { role: 'assistant', content: 'Use a LEFT JOIN and filter for NULL on the right side: SELECT users.name FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.id IS NULL. This returns all users without matching orders.' },
        { role: 'user', content: 'Is there a faster way?' },
        { role: 'assistant', content: 'Yes, you can use NOT EXISTS which is often faster: SELECT name FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id). The optimizer can short-circuit as soon as it finds one matching row.' },
      ],
    },
  ];
}