import {
  valueCheck as value,
  uiCheck as ui,
  text,
  click,
  fill,
} from "../learning/lesson-model.js";

const task = (specification) => ({
  id: "project",
  revision: 2,
  ...specification,
});

const cartSolution =
  "function cartTotal(items) {\n  let total = 0;\n  for (const item of items) {\n    total = total + item.price * item.quantity;\n  }\n  return total;\n}\nfunction deliveryFor(subtotal) {\n  if (subtotal === 0 || subtotal >= 20) return 0;\n  return 3;\n}";

const shopUiSolution = `${cartSolution}\nfunction ProductCard({ name, quantity, onAdd }) {\n  return <section><h2>{name}</h2><p>{name}: {quantity}</p><button onClick={onAdd}>Add {name}</button></section>;\n}\nfunction App() {\n  const [tea, setTea] = React.useState(0);\n  const [coffee, setCoffee] = React.useState(0);\n  const subtotal = cartTotal([{price:4,quantity:tea},{price:5,quantity:coffee}]);\n  const delivery = deliveryFor(subtotal);\n  return <div><h1>Sprout Store</h1>\n    <ProductCard name="Tea" quantity={tea} onAdd={() => setTea((q) => q + 1)} />\n    <ProductCard name="Coffee" quantity={coffee} onAdd={() => setCoffee((q) => q + 1)} />\n    <p>Subtotal: {subtotal}</p><p>Delivery: {delivery}</p><p>Total: {subtotal + delivery}</p>\n    <p>{subtotal === 0 ? "Cart is empty" : "Ready to order"}</p>\n    <button onClick={() => { setTea(0); setCoffee(0); }}>Clear cart</button>\n  </div>;\n}`;

export const connectedProjects = [
  {
    id: "shop-logic",
    title: "Your shop, one calculation at a time",
    subtitle: "Journey 1 · JavaScript logic",
    category: "JavaScript",
    level: "Foundations",
    color: "yellow",
    icon: "budget",
    description:
      "Build the calculation behind one small shop. Use whole-number teaching prices, not a real payment system. The console helps inspect values; it is not the shop interface yet.",
    prerequisites: ["js-objects", "js-loops", "js-functions"],
    requirements: [
      "Represent Tea and Coffee as product objects.",
      "Store price and quantity as numbers.",
      "Write a reusable cartTotal(items) function.",
      "Apply the delivery rule in deliveryFor(subtotal).",
      "Check zero quantity, an empty cart, and the free-delivery boundary.",
    ],
    milestones: [
      "Start with one product name, then add its price and quantity.",
      "Calculate one line, then loop over multiple product objects.",
      "Extract cartTotal so the UI can reuse the same calculation.",
      "Add deliveryFor: 0 for an empty subtotal or subtotal at least 20, otherwise 3.",
      "Run the behaviour checks. Change an input by hand and explain the result.",
    ],
    starter: "",
    task: task({
      goal: "Calculate a cart and its delivery fee using reusable functions.",
      starting:
        "items is an array of objects with numeric price and non-negative whole-number quantity. Prices are whole numbers in this teaching project.",
      instructions:
        "Write cartTotal(items) to return the sum of price × quantity. Write deliveryFor(subtotal) to return 0 for subtotal 0 or at least 20, otherwise 3.",
      expected:
        "4×2 plus 5×1 gives subtotal 13 and delivery 3. Empty gives 0 and 0. Subtotal 20 gives delivery 0.",
      constraints:
        "No DOM, React, or network is needed. Do not mutate the inputs. A loop or reduce solution is accepted.",
      checks: [
        value(
          "Multiple line items",
          "cartTotal([{price:4,quantity:2},{price:5,quantity:1}])",
          13,
          "Multiply within each line, then add line totals.",
        ),
        value(
          "Empty cart",
          "cartTotal([])",
          0,
          "Start the accumulation at zero.",
        ),
        value(
          "Zero quantity",
          "cartTotal([{price:5,quantity:0}])",
          0,
          "A product with zero quantity contributes nothing.",
        ),
        value(
          "Delivery boundaries",
          "[deliveryFor(0),deliveryFor(19),deliveryFor(20),deliveryFor(25)]",
          [0, 3, 0, 0],
          "Treat empty, below threshold, exactly threshold, and above threshold deliberately.",
        ),
        value(
          "Input remains unchanged",
          "(()=>{const items=[{price:4,quantity:2}];cartTotal(items);return items;})()",
          [{ price: 4, quantity: 2 }],
          "Read fields without modifying them.",
        ),
      ],
      solution: cartSolution,
      hints: [
        "Keep the calculation and delivery decision as two small, independent functions.",
        "Accumulate item.price * item.quantity. For delivery, first handle subtotal === 0 or subtotal >= 20.",
      ],
      explanation:
        "cartTotal handles data independently of any screen. deliveryFor expresses the boundary rule. Returned values can later be displayed by React.",
    }),
  },
  {
    id: "shop-ui",
    title: "Bring your shop to the screen",
    subtitle: "Journey 2 · React product cards and cart",
    category: "React",
    level: "Build together",
    color: "blue",
    icon: "tasks",
    description:
      "Reuse your JavaScript calculations in a visible shop. React owns the changing quantities and displays the results; it does not replace the calculation logic.",
    prerequisites: ["react-sharing", "react-conditions", "react-updates"],
    requirements: [
      "Reuse cartTotal and deliveryFor from the logic project.",
      "Create reusable Tea and Coffee product cards.",
      "Add quantities through real buttons and parent-owned state.",
      "Display subtotal, delivery, and total from current data.",
      "Show an empty-cart message and clear all quantities consistently.",
    ],
    milestones: [
      "Place your tested functions above App in this one-file lab. A full project can import them from another module.",
      "Render product names and their quantities through props.",
      "Lift quantities to one owner and connect Add callbacks.",
      "Calculate subtotal and delivery from the current quantities.",
      "Check repeated additions, the delivery threshold, and clearing.",
    ],
    starter: "function App() {\n  return <h1>Sprout Store</h1>;\n}",
    task: task({
      goal: "Build an interactive cart using the same calculation rules.",
      starting:
        "Tea costs 4. Coffee costs 5. Both quantities start at zero. Delivery is 3 for a non-empty subtotal below 20, otherwise 0.",
      instructions:
        "Show Tea: and Coffee: quantities, Add Tea, Add Coffee, and Clear cart buttons, and Subtotal:, Delivery:, and Total: paragraphs. Show Cart is empty at zero and Ready to order otherwise.",
      expected:
        "Two Tea and one Coffee give subtotal 13, delivery 3, total 16. Five Tea give subtotal 20 and delivery 0. Clearing resets every displayed amount.",
      constraints:
        "Use component state and derived totals. Preserve the JavaScript calculation contracts. Do not introduce external packages.",
      checks: [
        ui(
          "Empty, additions, and clear",
          text("Cart is empty"),
          text("Total: 0"),
          click("Add Tea"),
          click("Add Tea"),
          click("Add Coffee"),
          text("Tea: 2"),
          text("Coffee: 1"),
          text("Subtotal: 13"),
          text("Delivery: 3"),
          text("Total: 16"),
          text("Ready to order"),
          click("Clear cart"),
          text("Tea: 0"),
          text("Coffee: 0"),
          text("Total: 0"),
          text("Cart is empty"),
        ),
        ui(
          "Free-delivery boundary",
          click("Add Tea"),
          click("Add Tea"),
          click("Add Tea"),
          click("Add Tea"),
          click("Add Tea"),
          text("Subtotal: 20"),
          text("Delivery: 0"),
          text("Total: 20"),
        ),
      ],
      solution: shopUiSolution,
      hints: [
        "Keep quantities in one parent. Derive the totals from them rather than storing extra copies.",
        "Use two quantity states, pass callbacks to cards, and calculate subtotal with cartTotal before calling deliveryFor.",
      ],
      explanation:
        "The check follows a complete order-building journey and a separate delivery-boundary case. Styling and component organization can vary.",
    }),
  },
  {
    id: "shop-data",
    title: "Handle the parts that do not go to plan",
    subtitle: "Journey 3 · Loading, empty, failure, recovery",
    category: "React",
    level: "Applied practice",
    color: "peach",
    icon: "library",
    description:
      "Add a local data-loading simulation to the shop. Make every state understandable and preserve cart state across a recoverable load failure. External APIs and deployment are separate full-project steps.",
    prerequisites: [
      "react-async-ui",
      "react-effects",
      "react-refs",
      "react-quality",
      "js-fetch",
    ],
    requirements: [
      "Explain the initial state before loading products.",
      "Show observable loading and distinct success, empty, and error results.",
      "Offer Retry after a failure.",
      "Keep the selected quantity when product data is retried.",
      "Clean up pending work and review keyboard operation.",
    ],
    milestones: [
      "Use the state model from the async-interface lesson.",
      "Simulate a response with a short timeout; use a real fetch only in a full project after response handling is understood.",
      "Keep quantity above the replaceable product-data display.",
      "Cancel an old timer before starting another and clean up on removal.",
      "Test failure, recovery, addition, empty data, and keyboard controls.",
    ],
    starter: "function App() {\n  return <h1>Product loading practice</h1>;\n}",
    task: task({
      goal: "Build a recoverable product display without losing cart quantity.",
      starting:
        "Start with Ready to load and Quantity: 0. Use local timers of about 150 milliseconds, not an external API.",
      instructions:
        "Add Load products, Load empty, and Load error controls. Show Loading products while waiting, then Tea with Add Tea, No products, or Could not load products. After an error, Retry loads Tea. Keep Quantity: visible and preserve it through retries.",
      expected:
        "Load products, add Tea, trigger an error, then Retry: Tea returns and Quantity remains 1. Load empty shows No products.",
      constraints:
        "This is a local simulation. Use labeled semantic controls and cancel obsolete timers. The checks do not claim to verify a real network service.",
      checks: [
        ui(
          "Failure and recovery preserve state",
          text("Ready to load"),
          text("Quantity: 0"),
          click("Load products"),
          text("Loading products"),
          { action: "element", role: "button", name: "Add Tea" },
          click("Add Tea"),
          text("Quantity: 1"),
          click("Load error"),
          text("Loading products"),
          text("Could not load products"),
          click("Retry"),
          text("Loading products"),
          { action: "element", role: "button", name: "Add Tea" },
          text("Quantity: 1"),
          click("Load empty"),
          text("No products"),
        ),
        ui(
          "Removal cleans up pending work",
          click("Load products"),
          text("Loading products"),
          { action: "unmount" },
          { action: "noTimers" },
        ),
      ],
      solution:
        'function App() {\n  const [status, setStatus] = React.useState("idle");\n  const [quantity, setQuantity] = React.useState(0);\n  const timer = React.useRef(null);\n  React.useEffect(() => () => clearTimeout(timer.current), []);\n  function load(next) {\n    clearTimeout(timer.current); setStatus("loading");\n    timer.current = setTimeout(() => setStatus(next), 150);\n  }\n  return <div><h1>Product loading practice</h1><p>Quantity: {quantity}</p>\n    <button onClick={() => load("success")}>Load products</button>\n    <button onClick={() => load("empty")}>Load empty</button>\n    <button onClick={() => load("error")}>Load error</button>\n    {status === "idle" && <p>Ready to load</p>}\n    {status === "loading" && <p role="status">Loading products</p>}\n    {status === "empty" && <p>No products</p>}\n    {status === "error" && <div><p role="alert">Could not load products</p><button onClick={() => load("success")}>Retry</button></div>}\n    {status === "success" && <div><h2>Tea</h2><button onClick={() => setQuantity((q) => q + 1)}>Add Tea</button></div>}\n  </div>;\n}',
      hints: [
        "Separate the product-load status from the cart quantity so a retry does not reset the order.",
        "Use a ref for the pending timer, a status state for each outcome, and one parent-owned quantity state.",
      ],
      explanation:
        "The checks verify local loading transitions, a retry that preserves quantity, and timer cleanup. A real request additionally needs HTTP, parsing, data validation, and stale-response handling.",
    }),
  },
];

export function enrichProjects(projects) {
  const greeting = projects.find((project) => project.id === "greeting");
  greeting.starter =
    "function App() {\n  return <h1>Your welcome card</h1>;\n}";
  greeting.prerequisites = ["react-forms", "react-conditions"];
  greeting.milestones = [
    "Render a labeled name field.",
    "Connect its value and change handler to one state value.",
    "Derive the greeting from the current name, including empty input.",
  ];
  greeting.task = task({
    goal: "Create a live greeting that handles empty input.",
    starting: "The name is initially empty.",
    instructions:
      "Render a field labeled Your name. Show Hello, friend when it is empty, otherwise Hello, followed by the current name.",
    expected:
      "Sam gives Hello, Sam. Alex gives Hello, Alex. Clearing restores Hello, friend.",
    constraints:
      "Use a visible label and controlled state. No submit action is required.",
    checks: [
      ui(
        "Typing, changing, and clearing",
        text("Hello, friend"),
        fill("Your name", "Sam"),
        text("Hello, Sam"),
        fill("Your name", "Alex"),
        text("Hello, Alex"),
        fill("Your name", ""),
        text("Hello, friend"),
      ),
    ],
    solution:
      'function App() {\n  const [name, setName] = React.useState("");\n  return <div><label htmlFor="name">Your name</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} /><p>Hello, {name === "" ? "friend" : name}</p></div>;\n}',
    hints: [
      "Derive the greeting from the same state that controls the input.",
      "Use name === empty text to choose friend; otherwise show name.",
    ],
    explanation:
      "The input is changed twice and cleared, so a static greeting cannot satisfy the check.",
  });

  const budget = projects.find((project) => project.id === "budget");
  budget.level = "Intermediate";
  budget.prerequisites = ["js-pipelines", "js-array-methods"];
  budget.milestones = [
    "Keep expenses as objects with amount fields.",
    "Write remainingBudget from the total of those amounts.",
    "Select large expenses with a clear threshold.",
    "Check empty data and the threshold itself.",
  ];
  budget.task = task({
    goal: "Calculate a budget balance and select large expenses.",
    starting:
      "Each expense has a name and numeric amount. Threshold values themselves should be included.",
    instructions:
      "Write remainingBudget(budget, expenses) and largeExpenses(expenses, minimum). Return a numeric remaining balance and a filtered array respectively.",
    expected:
      "A budget of 100 with amounts 5 and 25 leaves 70. At minimum 25, only the 25 expense is kept. Empty expenses preserve the budget.",
    constraints:
      "Do not mutate input data. A negative balance is allowed when spending exceeds the budget.",
    checks: [
      value(
        "Remaining balance",
        'remainingBudget(100,[{name:"Coffee",amount:5},{name:"Books",amount:25}])',
        70,
        "Subtract the sum of expense amounts from the budget.",
      ),
      value(
        "Empty list",
        "remainingBudget(100,[])",
        100,
        "An empty expense total is zero.",
      ),
      value(
        "Overspending",
        "remainingBudget(10,[{amount:20}])",
        -10,
        "Return the actual balance; do not force it to zero.",
      ),
      value(
        "Includes threshold",
        'largeExpenses([{name:"Coffee",amount:5},{name:"Books",amount:25}],25)',
        [{ name: "Books", amount: 25 }],
        "Use >= for the requested boundary.",
      ),
    ],
    solution:
      "function remainingBudget(budget, expenses) {\n  return budget - expenses.reduce((sum, expense) => sum + expense.amount, 0);\n}\nfunction largeExpenses(expenses, minimum) {\n  return expenses.filter((expense) => expense.amount >= minimum);\n}",
    hints: [
      "Separate summarizing expenses from selecting them.",
      "Use reduce for a sum and filter for the amount >= minimum comparison.",
    ],
    explanation:
      "The two functions expose different data operations, each checked with a relevant boundary.",
  });

  const tasks = projects.find((project) => project.id === "tasks");
  tasks.starter = "function App() {\n  return <h1>Pocket tasks</h1>;\n}";
  tasks.prerequisites = ["react-lists", "react-forms", "react-refs"];
  tasks.milestones = [
    "Add one labeled form before building the list.",
    "Give each new item a stable ID at creation time, not while rendering.",
    "Use map and filter for immutable toggling and deletion.",
    "Test the last-item removal as an empty-state transition.",
  ];
  tasks.task = task({
    goal: "Create, complete, and remove a task.",
    starting: "The list starts empty. A Task input supplies text.",
    instructions:
      "Provide a Task input and Add task submit button. Render li items. For a task named Read, provide Complete Read and Delete Read controls. Completion shows Read (done). Deleting the last item shows No tasks.",
    expected:
      "Add Read, complete it, delete it, and return to an empty list. A second new task can still be added.",
    constraints:
      "Use stable IDs and new arrays for updates. Ignore empty submissions. The automated checks observe behaviour; review key stability separately.",
    checks: [
      ui(
        "A complete task journey",
        text("No tasks"),
        fill("Task", "Read"),
        click("Add task"),
        { action: "count", selector: "li", value: 1 },
        click("Complete Read"),
        text("Read (done)"),
        click("Delete Read"),
        text("No tasks"),
        { action: "count", selector: "li", value: 0 },
        fill("Task", "Practice"),
        click("Add task"),
        { action: "element", role: "button", name: "Delete Practice" },
      ),
    ],
    solution:
      'function App() {\n  const [tasks, setTasks] = React.useState([]); const [text, setText] = React.useState("");\n  const nextId = React.useRef(1);\n  function add(e) {\n    e.preventDefault(); if (text === "") return;\n    const task = { id: nextId.current, text: text, done: false }; nextId.current = nextId.current + 1;\n    setTasks((old) => [...old, task]); setText("");\n  }\n  return <div><form onSubmit={add}><label htmlFor="task">Task</label><input id="task" value={text} onChange={(e) => setText(e.target.value)} /><button type="submit">Add task</button></form>\n    {tasks.length === 0 ? <p>No tasks</p> : <ul>{tasks.map((task) => <li key={task.id}>\n      <span>{task.text}{task.done ? " (done)" : ""}</span>\n      <button onClick={() => setTasks((old) => old.map((item) => item.id === task.id ? {...item,done:!item.done} : item))}>Complete {task.text}</button>\n      <button onClick={() => setTasks((old) => old.filter((item) => item.id !== task.id))}>Delete {task.text}</button>\n    </li>)}</ul>}\n  </div>;\n}',
    hints: [
      "Store task data with identity. A ref counter can give each newly created item an ID.",
      "Append through spread, toggle through map, and remove through filter using the same stable ID.",
    ],
    explanation:
      "The checks follow add, toggle, delete, and add-again behaviour while your manual checklist records implementation review.",
  });

  const library = projects.find((project) => project.id === "library");
  library.starter =
    "function App() {\n  return <h1>Your reading corner</h1>;\n}";
  library.prerequisites = [
    "react-reducers",
    "react-performance",
    "react-forms",
    "react-refs",
  ];
  library.milestones = [
    "Represent each book with id, title, and favorite fields.",
    "Keep adding, removing, and favoriting transitions in a reducer.",
    "Derive search results from current books and query.",
    "Test no results separately from an actually empty library.",
    "Write three full-project behaviour tests after trying the same journeys manually.",
  ];
  library.task = task({
    goal: "Search, favorite, and remove items in a small library.",
    starting:
      "Start with The Little Prince and A Book of Small Things, neither favorited.",
    instructions:
      "Provide a Book search input and li items. Show Favorites: count. Favorite The Little Prince marks it as a favorite. Remove The Little Prince removes it. A search with no matches shows No matches.",
    expected:
      "Filtering and clearing restore the right items. Favoriting increases the count; removing that favorite reduces it.",
    constraints:
      "Use a reducer for the project’s state transitions. These checks verify listed behaviours, not all possible library operations.",
    checks: [
      ui(
        "Search, favorite, remove",
        fill("Book search", "Nothing"),
        text("No matches"),
        fill("Book search", ""),
        { action: "count", selector: "li", value: 2 },
        click("Favorite The Little Prince"),
        text("Favorites: 1"),
        click("Remove The Little Prince"),
        text("Favorites: 0"),
        { action: "count", selector: "li", value: 1 },
        text("A Book of Small Things"),
      ),
    ],
    solution:
      'const initialBooks = [{id:1,title:"The Little Prince",favorite:false},{id:2,title:"A Book of Small Things",favorite:false}];\nfunction reducer(books, action) {\n  if (action.type === "favorite") return books.map((book) => book.id === action.id ? {...book,favorite:!book.favorite} : book);\n  if (action.type === "remove") return books.filter((book) => book.id !== action.id);\n  return books;\n}\nfunction App() {\n  const [books, dispatch] = React.useReducer(reducer, initialBooks); const [query, setQuery] = React.useState("");\n  const matches = books.filter((book) => book.title.includes(query));\n  return <div><label htmlFor="search">Book search</label><input id="search" value={query} onChange={(e) => setQuery(e.target.value)} />\n    <p>Favorites: {books.filter((book) => book.favorite).length}</p>\n    {matches.length === 0 ? <p>No matches</p> : <ul>{matches.map((book) => <li key={book.id}>{book.title}\n      <button onClick={() => dispatch({type:"favorite",id:book.id})}>Favorite {book.title}</button>\n      <button onClick={() => dispatch({type:"remove",id:book.id})}>Remove {book.title}</button>\n    </li>)}</ul>}\n  </div>;\n}',
    hints: [
      "Keep all books in state and derive matches from them. Do not replace the source data with filtered results.",
      "The favorite count should use all current books, not only visible search matches.",
    ],
    explanation:
      "The check combines filtering with changes to the underlying collection. The original add-book and full-project testing checklist steps remain self-reported extensions.",
  });
  projects.unshift(...connectedProjects);
}
