export const knowledgeChecks = {
  "js-welcome": {
    question: 'Where will console.log("Tea") show Tea?',
    options: [
      "In Console output",
      "As a new page button",
      "In a file named Tea",
    ],
    answer: 0,
    explanation:
      "console.log prints a message in the console. It does not add a visible page element.",
  },
  "js-types": {
    question: 'What is the type of "42"?',
    options: ["number", "boolean", "string"],
    answer: 2,
    explanation:
      'The quotation marks make "42" a string. Use Number("42") when you need the number 42.',
  },
  "js-variables": {
    question: "Which declaration should you use for a score that will change?",
    options: ["const score = 0", "let score = 0", "string score = 0"],
    answer: 1,
    explanation:
      "let allows reassignment, so a score can increase as the program runs.",
  },
  "js-operators": {
    question: "What does the * operator do with two numbers?",
    options: [
      "Joins their names as text",
      "Multiplies them",
      "Checks whether they are equal",
    ],
    answer: 1,
    explanation: "The star multiplies numbers. For example, 4 * 3 produces 12.",
  },
  "js-comparisons": {
    question: "Which expression asks whether total is at least 20?",
    options: ["total = 20", "total >= 20", "total === 20"],
    answer: 1,
    explanation:
      ">= accepts 20 and every larger value. = assigns; === only accepts equality.",
  },
  "js-conditions": {
    question:
      "If stock is 0, which block runs for if (stock > 0) ... else ...?",
    options: ["Only the if block", "Only the else block", "Both blocks"],
    answer: 1,
    explanation: "0 > 0 is false, so the else block runs.",
  },
  "js-functions": {
    question: "What does return do?",
    options: [
      "Repeats the function forever",
      "Sends a value back to the caller",
      "Always prints a value",
    ],
    answer: 1,
    explanation:
      "return ends that function call and gives its result to the caller. console.log is what prints.",
  },
  "js-arrow-functions": {
    question:
      "What is missing in (price) => { price * 2; } if it should return a number?",
    options: [
      "A console",
      "The return keyword inside the block",
      "A second arrow",
    ],
    answer: 1,
    explanation:
      "A block body needs an explicit return. A concise expression body does not.",
  },
  "js-loops": {
    question:
      "How many times does a counter starting at 0 run while count < 3, increasing by 1?",
    options: ["Two", "Three", "Four"],
    answer: 1,
    explanation:
      "The body runs for counter values 0, 1, and 2. It stops before 3.",
  },
  "js-arrays": {
    question: 'What does ["Tea", "Coffee"][0] read?',
    options: ["Tea", "Coffee", "The number of items"],
    answer: 0,
    explanation: "An array’s first position has index 0.",
  },
  "js-array-methods": {
    question: "Which operation keeps only items that pass a comparison?",
    options: ["map", "filter", "typeof"],
    answer: 1,
    explanation: "filter selects items. map transforms every item instead.",
  },
  "js-objects": {
    question: "How do you read the name property of learner?",
    options: ["learner.name", "learner(0)", "name.learner"],
    answer: 0,
    explanation:
      "Dot notation reads a named property. learner.name returns the value stored under name.",
  },
  "react-components": {
    question: "Which is a valid React component name?",
    options: ["welcome", "Welcome", "welcome-card"],
    answer: 1,
    explanation:
      "React uses capitalized names to distinguish your components from built-in HTML tags.",
  },
  "react-jsx": {
    question: "How do you display a variable named score in JSX?",
    options: ["<p>score</p>", "<p>{score}</p>", "<p>(score)</p>"],
    answer: 1,
    explanation:
      "Curly braces switch from markup to a JavaScript expression. Without them, score would be literal text.",
  },
  "react-props": {
    question:
      "A child needs to change data owned by its parent. What should it do?",
    options: [
      "Mutate the prop directly",
      "Call a callback passed by the parent",
      "Rename the prop",
    ],
    answer: 1,
    explanation:
      "Pass a callback as a prop. The child can request a change, and the parent updates its own state.",
  },
  "react-events": {
    question: "Which correctly passes an event handler?",
    options: [
      "onClick={sayHello()}",
      "onClick={sayHello}",
      'onClick="sayHello"',
    ],
    answer: 1,
    explanation:
      "Passing sayHello lets React call it after a click. sayHello() calls the function while rendering.",
  },
  "react-state": {
    question:
      "Which update is best when the next count depends on the previous count?",
    options: ["count++", "setCount(c => c + 1)", "count = count + 1"],
    answer: 1,
    explanation:
      "The updater receives the pending state and returns the next value. Direct assignment does not trigger a React render.",
  },
  "react-conditions": {
    question:
      'In condition ? "Yes" : "No", which text is chosen when condition is false?',
    options: ["Yes", "No", "Both"],
    answer: 1,
    explanation: "The expression after the colon is the false branch.",
  },
  "react-updates": {
    question:
      "Which creates a new object with an updated quantity and the other old fields?",
    options: [
      "product.quantity++",
      "{ ...product, quantity: 2 }",
      "{ quantity: 2 } always preserves everything",
    ],
    answer: 1,
    explanation:
      "Spread copies the old top-level properties, then quantity overrides that field.",
  },
  "react-lists": {
    question: "What makes a good key for a changing list?",
    options: ["Math.random()", "A stable item ID", "The current list length"],
    answer: 1,
    explanation:
      "A stable ID preserves an item’s identity across insertions, removals, and reordering.",
  },
  "react-forms": {
    question: "What does a controlled text input need?",
    options: [
      "Only a placeholder",
      "value and an onChange handler",
      "A new random key on every render",
    ],
    answer: 1,
    explanation:
      "value displays the current state, and onChange keeps that state in sync with the user’s typing.",
  },
  "react-sharing": {
    question: "Where should state shared by two siblings usually live?",
    options: [
      "In their closest shared parent",
      "In two separate copies",
      "In a random DOM element",
    ],
    answer: 0,
    explanation:
      "Their shared parent can own the value and pass the same information to both children.",
  },
  "js-destructuring": {
    question: "What is the value of level in { ...{ level: 1 }, level: 2 }?",
    options: ["1", "2", "undefined"],
    answer: 1,
    explanation:
      "Later properties replace earlier properties with the same key.",
  },
  "js-scope": {
    question: "Where can a const declared inside an if block be read?",
    options: [
      "Anywhere in the file",
      "Inside that block and its nested scopes",
      "Only on the next line",
    ],
    answer: 1,
    explanation:
      "const and let are block-scoped. An inner block can also access them through its surrounding scope.",
  },
  "js-closures": {
    question: "Why does counter remember count?",
    options: [
      "It copies all global variables",
      "It closes over its surrounding environment",
      "JavaScript saves every value forever",
    ],
    answer: 1,
    explanation:
      "The returned function retains access to the environment in which it was created.",
  },
  "js-errors": {
    question: "What should an error message help you understand?",
    options: [
      "Only that something failed",
      "What went wrong and where to look",
      "How to hide all future errors",
    ],
    answer: 1,
    explanation: "A specific message makes recovery and debugging much easier.",
  },
  "js-timers": {
    question:
      "Which runs first after setTimeout(callback, 0) schedules a callback?",
    options: [
      "The remaining current code",
      "The timer must run immediately",
      "Both run in parallel on this thread",
    ],
    answer: 0,
    explanation:
      "The current work finishes first. A zero-delay timer still runs later.",
  },
  "js-promises": {
    question: "Which promise state means the operation completed successfully?",
    options: ["pending", "fulfilled", "rejected"],
    answer: 1,
    explanation:
      "A fulfilled promise has a successful result. A rejected promise represents a failure.",
  },
  "js-async": {
    question: "What does an async function return?",
    options: [
      "Always a string",
      "A promise",
      "Nothing until it is called twice",
    ],
    answer: 1,
    explanation:
      "Even return 5 inside an async function produces a promise fulfilled with 5.",
  },
  "js-event-loop": {
    question: "After synchronous work finishes, what runs first here?",
    options: [
      "The queued promise callback",
      "The timer callback",
      "They run at exactly the same time",
    ],
    answer: 0,
    explanation:
      "The queued promise reaction is a microtask. It runs before the next timer task.",
  },
  "js-prototypes": {
    question:
      "Where is the shared label method stored in this lesson’s example?",
    options: [
      "On each product’s own name field",
      "On the methods object used as its prototype",
      "Inside a string",
    ],
    answer: 1,
    explanation:
      "Object.create(methods) links the product to the shared methods object. The product owns its name and inherits label.",
  },
  "js-classes": {
    question: "What does new Product(4) do?",
    options: [
      "Only copies the class’s source text",
      "Creates an instance and runs its constructor",
      "Turns every property into a constant",
    ],
    answer: 1,
    explanation:
      "new creates an object instance and calls the class constructor with the supplied arguments.",
  },
  "react-effects": {
    question: "Where should you clear an interval created by an effect?",
    options: [
      "In its cleanup function",
      "During every render",
      "You never need to clear it",
    ],
    answer: 0,
    explanation:
      "Cleanup prevents old intervals from continuing after the effect is replaced or the component unmounts.",
  },
  "react-refs": {
    question: "Does changing ref.current trigger a render?",
    options: ["Yes, always", "No", "Only if it contains a number"],
    answer: 1,
    explanation:
      "Refs preserve a mutable value without notifying React to render. Use state when the screen needs to change.",
  },
  "react-reducers": {
    question: "What should a reducer return?",
    options: [
      "The next state",
      "A fetch request",
      "A mutated copy of its arguments",
    ],
    answer: 0,
    explanation:
      "A reducer calculates and returns the next state without mutating the current state.",
  },
  "react-context": {
    question: "Which provider does useContext read?",
    options: [
      "The first provider in the entire app",
      "The closest matching provider above the component",
      "Every provider at once",
    ],
    answer: 1,
    explanation:
      "React searches upward from the reading component for the closest provider of that context.",
  },
  "react-custom-hooks": {
    question: "Two components call useCounter(). Do they share the same count?",
    options: [
      "Yes",
      "No, each call has independent state",
      "Only after the first click",
    ],
    answer: 1,
    explanation:
      "Each hook call belongs to its component instance and keeps its own state.",
  },
  "react-performance": {
    question: "What should you do first when optimizing?",
    options: [
      "Add useMemo everywhere",
      "Measure the slow interaction",
      "Remove every state variable",
    ],
    answer: 1,
    explanation:
      "Measurement helps you solve an actual bottleneck rather than adding unnecessary caching.",
  },
  "react-async-ui": {
    question: "Why ignore or cancel outdated requests?",
    options: [
      "To make all requests synchronous",
      "To prevent old results from replacing current data",
      "To remove the loading screen forever",
    ],
    answer: 1,
    explanation:
      "Responses can arrive out of order. Cleanup keeps stale results from updating the current interface.",
  },
  "react-quality": {
    question: "Which test best describes user-visible behavior?",
    options: [
      "Checks a private state variable name",
      "Clicks Save goal and checks for Goal saved!",
      "Asserts the exact component function text",
    ],
    answer: 1,
    explanation:
      "A behavior test follows what someone can actually do and observe, making it more useful through refactors.",
  },
  "js-pipelines": {
    question: "Why give reduce an initial accumulator?",
    options: [
      "To make the array longer",
      "To handle empty input and define the starting value",
      "To mutate the array automatically",
    ],
    answer: 1,
    explanation:
      "An initial value makes the operation well-defined even when there are no items.",
  },
  "js-collections": {
    question:
      "Which built-in collection naturally removes duplicate string values?",
    options: ["Set", "Promise", "Error"],
    answer: 0,
    explanation: "A Set keeps each distinct value once.",
  },
  "js-modules": {
    question: "How do you import a named export called remaining?",
    options: [
      'import { remaining } from "./budget.js"',
      "import * remaining",
      "require remaining from budget",
    ],
    answer: 0,
    explanation:
      "Named imports use braces and the exported name, unless you explicitly give them a local alias.",
  },
  "js-fetch": {
    question: "Does fetch reject automatically for an HTTP 404 response?",
    options: [
      "Yes, always",
      "No; check response.ok or status",
      "Only if the URL ends in .json",
    ],
    answer: 1,
    explanation:
      "fetch normally fulfills with a Response for HTTP errors. Network failures can reject the promise.",
  },
  "js-concurrency": {
    question: "What happens to other work when Promise.all rejects?",
    options: [
      "It is automatically cancelled",
      "It may continue unless explicitly cancelled",
      "It becomes synchronous",
    ],
    answer: 1,
    explanation:
      "Promise.all coordinates outcomes. It does not cancel the underlying operations.",
  },
  "js-debounce": {
    question:
      "Three quick calls happen within the debounce delay. Which value is used?",
    options: [
      "All three values immediately",
      "The most recent call’s value after the quiet period",
      "The first value forever",
    ],
    answer: 1,
    explanation:
      "Each call cancels the pending timer. The latest arguments are used when activity pauses.",
  },
  "js-testing": {
    question: "Which test is most likely to catch an edge-case bug in total?",
    options: [
      "Checking its variable names",
      "Checking total([]) returns 0",
      "Checking the source contains reduce",
    ],
    answer: 1,
    explanation:
      "Empty input is an important behavioral boundary. A source-text check says little about correctness.",
  },
  "react-composition": {
    question: "What does children let a component receive?",
    options: [
      "Only strings",
      "Content supplied between its opening and closing tags",
      "All global application state automatically",
    ],
    answer: 1,
    explanation:
      "children is the content placed inside the component tag, including other components and markup.",
  },
  "react-boundaries": {
    question: "Which error is an error boundary designed to catch?",
    options: [
      "A descendant throwing during render",
      "Every failed network request anywhere",
      "Every exception inside any event handler",
    ],
    answer: 0,
    explanation:
      "Boundaries catch rendering errors in their descendant tree. Handle request and event errors explicitly.",
  },
  "react-transitions": {
    question:
      "Should a controlled input’s own value update be put in a transition?",
    options: [
      "Yes, always",
      "No; keep the input update urgent",
      "Only for strings longer than five characters",
    ],
    answer: 1,
    explanation:
      "Controlled inputs need their state to update immediately. Defer the slower dependent result view instead.",
  },
  "react-navigation": {
    question: "Which state often belongs in the URL?",
    options: [
      "A temporary hover highlight",
      "The current page or shareable search filter",
      "A private password field",
    ],
    answer: 1,
    explanation:
      "A URL should represent locations and safe, shareable state, so direct links and browser history behave usefully.",
  },
  "react-suspense": {
    question: "Does Suspense automatically handle any fetch inside useEffect?",
    options: [
      "Yes",
      "No; ordinary effect-based fetching is not automatically a Suspense source",
      "Only requests under one second",
    ],
    answer: 1,
    explanation:
      "Suspense works with supported rendering-time sources such as lazy components and framework integrations.",
  },
  "react-production-review": {
    question: "Where should a private API secret be stored?",
    options: [
      "In a React component",
      "In a server environment, never shipped to the browser",
      "In a hidden HTML input",
    ],
    answer: 1,
    explanation:
      "Anything shipped to the browser can be inspected. Keep private secrets on a server and expose only the limited operations the client needs.",
  },
};
