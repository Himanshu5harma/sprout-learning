import {
  uiCheck as check,
  text,
  click,
  fill,
} from "../learning/lesson-model.js";

export const appliedReact = [
  {
    id: "react-composition",
    title: "Compose a card instead of adding more switches",
    minutes: 30,
    goal: "Let a reusable container receive content and an action from its caller.",
    prerequisites: ["react-props", "react-sharing"],
    why: "A shop card and an order summary can share a container without forcing all their content into a complicated set of flags.",
    explanation: [
      "Composition means building an interface by combining components. A component can accept other JSX as input rather than decide every possible variant internally.",
      "children is the prop for content placed between a component’s opening and closing tags. Named props such as action can receive JSX for distinct areas. A section gives related content a semantic grouping; a footer can hold the action area.",
      "Extract a stable, useful pattern rather than every similar-looking line. Clear inputs are usually easier to maintain than many interacting boolean flags. The caller still owns any state required by the content it supplies.",
    ],
    code: 'function Card({ title, children, action }) {\n  return <section><h2>{title}</h2><div>{children}</div><footer>{action}</footer></section>;\n}\nfunction App() {\n  const [saved, setSaved] = React.useState(false);\n  return <Card title="Tea" action={<button onClick={() => setSaved(true)}>Save product</button>}>\n    <p>{saved ? "Product saved" : "Price: 4"}</p>\n  </Card>;\n}',
    walkthrough: [
      [
        1,
        3,
        "Read content props and render them into named areas. children is supplied between the Card tags.",
      ],
      [4, 5, "App owns the saved state."],
      [
        6,
        6,
        "Supply an action element as a prop. Its handler still updates App’s state.",
      ],
      [
        7,
        9,
        "Supply paragraph content through children, then close Card and App.",
      ],
    ],
    visible:
      "A Tea card initially shows Price: 4. Save product changes its content to Product saved.",
    exampleChecks: [
      check(
        "Caller-owned content and action",
        text("Tea"),
        text("Price: 4"),
        click("Save product"),
        text("Product saved"),
      ),
    ],
    prediction: {
      code: "function Card({ children }) { return <section>{children}</section>; }\nfunction App() { return <Card><p>Delivery details</p></Card>; }",
      question: "What paragraph is supplied as children?",
      answer: ["Delivery details"],
      explanation: "The JSX between Card’s tags becomes its children prop.",
    },
    guided: {
      goal: "Render a Delivery card with caller-supplied details.",
      starting: "The title currently says Order.",
      starter:
        'function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; }\nfunction App() { return <Card title="Order"><p>Arrives tomorrow</p></Card>; }',
      solution:
        'function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; }\nfunction App() { return <Card title="Delivery"><p>Arrives tomorrow</p></Card>; }',
      expected: "A Delivery heading and Arrives tomorrow paragraph.",
      change: "Change the title input to Delivery.",
      checks: [
        check(
          "Both content inputs render",
          { action: "element", role: "heading", name: "Delivery" },
          text("Arrives tomorrow"),
        ),
      ],
      gap: {
        find: "{children}</section>",
        with: "</section>",
        instructions: "Render the caller-supplied children inside the card.",
      },
      bug: {
        find: "{children}</section>",
        with: "children</section>",
        instructions:
          "The card prints the word children. Evaluate the prop instead.",
        why: "The prop is a JSX value. Without braces, its name is just literal text.",
        fix: "Put children inside JSX braces.",
      },
      hints: [
        "A container must actually render the content it receives.",
        "Use {children} in the intended content area.",
      ],
      explanation:
        "The component can accept different content without knowing its internal details.",
    },
    independent: {
      goal: "Reuse one card around two kinds of content.",
      starting: "You need a Product card and a Delivery card.",
      starter: "",
      instructions:
        "Create Card with title and children. Render Product with a Tea paragraph, and Delivery with an Arrives tomorrow paragraph. Use heading elements for titles.",
      expected: "Both distinct headings and both supplied paragraphs appear.",
      constraints:
        "Keep the container reusable. The behaviour checks cover rendered content, not the component’s private name.",
      checks: [
        check(
          "Two composed uses",
          { action: "element", role: "heading", name: "Product" },
          { action: "element", role: "heading", name: "Delivery" },
          text("Tea"),
          text("Arrives tomorrow"),
        ),
      ],
      solution:
        'function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; }\nfunction App() {\n  return <div><Card title="Product"><p>Tea</p></Card><Card title="Delivery"><p>Arrives tomorrow</p></Card></div>;\n}',
      hints: [
        "Let the caller choose the inner content.",
        "Place the two different paragraphs between two Card opening and closing tags.",
      ],
      explanation:
        "The same shape supports two content responsibilities without a list of variant switches.",
    },
    project: "shop-ui",
    connection:
      "Compose a product card and delivery summary from simple containers and caller-owned content.",
    recap: [
      "Composition passes useful pieces instead of hiding every variation in one component.",
      "children and named JSX props are ordinary component inputs.",
    ],
  },
  {
    id: "react-boundaries",
    title: "Contain a rendering failure with an error boundary",
    minutes: 40,
    goal: "Keep a healthy page section visible when a child fails during rendering.",
    prerequisites: ["react-composition", "js-classes", "react-quality"],
    why: "A broken product detail should have a helpful fallback instead of taking down the entire shop screen.",
    explanation: [
      "An error boundary catches rendering errors in its descendant tree. A class extending React.Component can define static getDerivedStateFromError to return fallback state. static means this method belongs to the class rather than each instance. React invokes this special method after a descendant rendering failure.",
      "In a class component, this.props reads inputs and this.state reads its current state object. A state field initializes it; this.setState requests a class-state update. This is a different API from function-component useState. Most components here should remain functions.",
      "A boundary does not catch every event handler error or asynchronous rejection. Handle those where the work happens. In a full project, componentDidCatch can report diagnostics. Put the boundary around a meaningful feature and keep its fallback visible and specific.",
    ],
    code: 'class Boundary extends React.Component {\n  state = { failed: false };\n  static getDerivedStateFromError() { return { failed: true }; }\n  render() {\n    return this.state.failed ? <p role="alert">Product unavailable</p> : this.props.children;\n  }\n}\nfunction Product() { throw new Error("Practice render failure"); }\nfunction App() {\n  return <div><h1>Shop stays open</h1><Boundary><Product /></Boundary></div>;\n}',
    walkthrough: [
      [
        1,
        3,
        "Inherit React’s class-component API, initialize state, and define the special static error-state method.",
      ],
      [
        4,
        7,
        "render returns the normal children or a visible fallback based on the state.",
      ],
      [
        8,
        8,
        "The example descendant deliberately throws during render. This is an intentional demonstration, not a real product loader.",
      ],
      [
        9,
        11,
        "The heading sits outside the boundary, so only the broken feature is replaced.",
      ],
    ],
    visible:
      "Shop stays open remains visible. The failed child is replaced by Product unavailable.",
    exampleChecks: [
      check(
        "Only the failed feature is replaced",
        text("Shop stays open"),
        text("Product unavailable"),
      ),
    ],
    prediction: {
      code: "// A child throws while rendering inside Boundary.\n// A separate heading is outside that Boundary.",
      question:
        "Should the healthy outside heading remain visible? Answer yes or no.",
      answer: ["yes"],
      explanation:
        "The boundary replaces its own descendant content; it does not replace healthy siblings outside it.",
    },
    guided: {
      goal: "Give the fallback a useful product-specific message.",
      starting: "The fallback currently says Error.",
      starter:
        'class Boundary extends React.Component {\n  state = { failed: false };\n  static getDerivedStateFromError() { return { failed: true }; }\n  render() { return this.state.failed ? <p>Error</p> : this.props.children; }\n}\nfunction Product() { throw new Error("Practice failure"); }\nfunction App() { return <div><h1>Shop stays open</h1><Boundary><Product /></Boundary></div>; }',
      solution:
        'class Boundary extends React.Component {\n  state = { failed: false };\n  static getDerivedStateFromError() { return { failed: true }; }\n  render() { return this.state.failed ? <p>Product unavailable</p> : this.props.children; }\n}\nfunction Product() { throw new Error("Practice failure"); }\nfunction App() { return <div><h1>Shop stays open</h1><Boundary><Product /></Boundary></div>; }',
      expected:
        "A helpful fallback and the healthy shop heading both remain visible.",
      change: "Change the fallback text to Product unavailable.",
      checks: [
        check(
          "Feature-specific fallback",
          text("Shop stays open"),
          text("Product unavailable"),
        ),
      ],
      gap: {
        find: "failed: true",
        with: "failed: false",
        instructions: "Set failed to true when the error-state method runs.",
      },
      bug: {
        find: "<h1>Shop stays open</h1><Boundary><Product /></Boundary>",
        with: "<Boundary><h1>Shop stays open</h1><Product /></Boundary>",
        instructions:
          "The healthy heading is inside the failed section. Move it outside this feature boundary.",
        why: "The fallback replaces all children inside its boundary, including the heading if it is placed there.",
        fix: "Keep the heading as a sibling outside Boundary.",
      },
      hints: [
        "Choose a containment boundary around only the failing feature.",
        "Leave the healthy heading outside the Boundary tags.",
      ],
      explanation:
        "The test checks both the fallback and unaffected page content.",
    },
    independent: {
      goal: "Recover a feature after an intentional render failure.",
      starting: "A product starts healthy and has a Break product button.",
      starter: "",
      instructions:
        "Render Shop stays open outside a boundary. Inside, Break product causes the product component to throw on its next render. Show Product unavailable plus Try again in the fallback. Try again must restore the healthy feature.",
      expected:
        "The outside heading survives. The fallback appears after failure. Retry restores Break product.",
      constraints:
        "Use a boundary for render failure, not an event handler that directly throws. Resetting the boundary should remount the child.",
      checks: [
        check(
          "Failure containment and recovery",
          text("Shop stays open"),
          click("Break product"),
          text("Product unavailable"),
          text("Shop stays open"),
          click("Try again"),
          { action: "element", role: "button", name: "Break product" },
          { action: "noText", value: "Product unavailable" },
        ),
      ],
      solution:
        'class Boundary extends React.Component {\n  state = { failed: false };\n  static getDerivedStateFromError() { return { failed: true }; }\n  render() {\n    if (this.state.failed) return <div><p>Product unavailable</p><button onClick={() => this.setState({ failed: false })}>Try again</button></div>;\n    return this.props.children;\n  }\n}\nfunction Product() {\n  const [broken, setBroken] = React.useState(false);\n  if (broken) throw new Error("Practice render failure");\n  return <button onClick={() => setBroken(true)}>Break product</button>;\n}\nfunction App() { return <div><h1>Shop stays open</h1><Boundary><Product /></Boundary></div>; }',
      hints: [
        "Let the click set state so the child throws while rendering, where the boundary can catch it.",
        "Fallback can call this.setState({ failed: false }); the removed child then mounts with fresh state.",
      ],
      explanation:
        "The test follows failure and recovery while confirming that the healthy outside section remains.",
    },
    project: "shop-ui",
    connection:
      "Wrap a feature that can fail with a contained fallback, and separately handle request and event failures.",
    recap: [
      "Boundaries catch descendant rendering failures.",
      "A useful fallback has clear scope and a deliberate recovery path; it is not a universal error catcher.",
    ],
  },
  {
    id: "react-transitions",
    title: "Keep the input urgent and defer a result view",
    minutes: 35,
    goal: "Understand what a deferred value does and what it does not optimize.",
    prerequisites: ["react-performance", "react-forms"],
    why: "Typing should remain responsive when a dependent result view takes longer to render.",
    explanation: [
      "An urgent update, such as the value of a controlled text input, should respond immediately. React.useDeferredValue(query) returns a value that may lag behind while React prioritizes more urgent work.",
      "Use the current query for the input and the deferred query for a slower result view. A comparison query !== deferred can indicate that displayed results are temporarily behind. Deferring schedules rendering; it does not make the calculation intrinsically faster.",
      "This tiny example is not a performance benchmark. Deferral also is not a network debounce and does not automatically cancel a request. In a full project, profile a realistic slow component before deciding whether this is useful.",
    ],
    code: 'const products = ["Tea", "Coffee", "Milk"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const deferred = React.useDeferredValue(query);\n  const matches = products.filter((name) => name.includes(deferred));\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} /><p>Matches: {matches.join(", ")}</p></div>;\n}',
    walkthrough: [
      [
        1,
        3,
        "Keep fixed products outside the component and current input text in state.",
      ],
      [
        4,
        4,
        "Ask React for a potentially deferred version of the current query.",
      ],
      [
        5,
        5,
        "Calculate the dependent result from deferred, not from a separate manually synchronized state.",
      ],
      [
        6,
        7,
        "Keep the input value tied to urgent query state and display the result.",
      ],
    ],
    visible:
      "The input reflects what you type. Matching names eventually follow the query. On this tiny list, the difference may be too short to notice.",
    exampleChecks: [
      check(
        "Correct eventual search result",
        fill("Product search", "Tea"),
        text("Matches: Tea"),
      ),
    ],
    prediction: {
      code: "// query is the current input state.\n// deferred = React.useDeferredValue(query).",
      question:
        "Should the controlled input use query or deferred as its value?",
      answer: ["query"],
      explanation:
        "The input itself remains urgent. A slower dependent result can use the deferred value.",
    },
    guided: {
      goal: "Include Milk in the deferred search.",
      starting: "The data currently contains Tea and Coffee.",
      starter:
        'const products = ["Tea", "Coffee"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const deferred = React.useDeferredValue(query);\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} /><p>Matches: {products.filter((n) => n.includes(deferred)).join(", ")}</p></div>;\n}',
      solution:
        'const products = ["Tea", "Coffee", "Milk"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const deferred = React.useDeferredValue(query);\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} /><p>Matches: {products.filter((n) => n.includes(deferred)).join(", ")}</p></div>;\n}',
      expected:
        "Typing Milk eventually displays Matches: Milk; typing Tea then displays Matches: Tea.",
      change: "Add Milk to the fixed products array.",
      checks: [
        check(
          "Correctness through changing input",
          fill("Product search", "Milk"),
          text("Matches: Milk"),
          fill("Product search", "Tea"),
          text("Matches: Tea"),
        ),
      ],
      gap: {
        find: "React.useDeferredValue(query)",
        with: '""',
        instructions: "Pass the current query into useDeferredValue.",
      },
      bug: {
        find: "n.includes(deferred)",
        with: 'n.includes("")',
        instructions:
          "The result view ignores all search input. Read the current deferred value.",
        why: "Every string contains empty text, so a fixed empty query always keeps every product.",
        fix: "Filter using deferred.",
      },
      hints: [
        "Keep current input and deferred result responsibilities separate.",
        "Use query for the input and deferred in the filter.",
      ],
      explanation:
        "The check covers eventual result correctness. It does not prove an interaction became faster.",
    },
    independent: {
      goal: "Keep a query and result view logically consistent.",
      starting: "Products are Tea, Coffee, and Milk.",
      starter: "",
      instructions:
        "Render a Product search input, a Query: paragraph showing current typed text, and Matches: listing case-sensitive matches. Clearing the input restores all items.",
      expected:
        "Typing Coffee shows Query: Coffee and Matches: Coffee. Changing to Tea updates both to Tea.",
      constraints:
        "Keep the input urgent. Use a deferred query for results if useful, but do not claim performance based on these small checks.",
      checks: [
        check(
          "Current input and eventual result",
          fill("Product search", "Coffee"),
          text("Query: Coffee"),
          text("Matches: Coffee"),
          fill("Product search", "Tea"),
          text("Query: Tea"),
          text("Matches: Tea"),
          fill("Product search", ""),
          text("Matches: Tea, Coffee, Milk"),
        ),
      ],
      solution:
        'const products = ["Tea", "Coffee", "Milk"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const deferred = React.useDeferredValue(query);\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />\n    <p>Query: {query}</p><p>Matches: {products.filter((name) => name.includes(deferred)).join(", ")}</p>\n  </div>;\n}',
      hints: [
        "One state value owns the typed text. Do not manually synchronize a second query state.",
        "Display query directly and derive matches from useDeferredValue(query).",
      ],
      explanation:
        "The checks verify eventual correct results across changes and clearing. Profiling remains a separate task.",
    },
    project: "shop-ui",
    connection:
      "For a genuinely slow catalog, measure how rendering priority affects typing without confusing it with request debouncing.",
    recap: [
      "Urgent input state stays current; a dependent result can lag.",
      "Deferral changes scheduling, not the underlying cost or network request count.",
    ],
  },
  {
    id: "react-navigation",
    title: "Separate a view model from real URL navigation",
    minutes: 35,
    goal: "Explain which state belongs in a URL and practise switching local views.",
    prerequisites: ["react-composition", "react-effects", "js-modules"],
    why: "People need to share a product page and use their browser’s Back and Forward buttons, not only switch panels in memory.",
    explanation: [
      "A URL is the address displayed by the browser. A route connects a location to a view. The current page and safe shareable filters often belong in the URL; a temporary hover state or private password does not.",
      "Use links for actual navigation and buttons for local actions. A routing library or framework can coordinate URL changes, nested views, and often data loading. A full routing implementation must handle direct entry, history, unknown locations, and focus after navigation.",
      "The sandbox below changes local component state only. Its buttons are deliberately called view controls. It does not create a shareable URL or implement browser history. The local-project instructions describe the additional work needed; this preview’s checks cannot certify routing.",
    ],
    code: 'function App() {\n  const [view, setView] = React.useState("catalog");\n  return <div>\n    <button onClick={() => setView("catalog")}>Catalog view</button>\n    <button onClick={() => setView("cart")}>Cart view</button>\n    <h1>{view === "catalog" ? "Product catalog" : "Your cart"}</h1>\n  </div>;\n}',
    walkthrough: [
      [1, 2, "Store a local view choice. It is not read from the URL."],
      [
        3,
        5,
        "These buttons perform local state actions, so buttons are appropriate here.",
      ],
      [6, 8, "Choose the rendered heading from the current local value."],
    ],
    visible:
      "Catalog view shows Product catalog. Cart view shows Your cart. The browser’s main URL is not changed by this simulation.",
    exampleChecks: [
      check(
        "Local view model",
        text("Product catalog"),
        click("Cart view"),
        text("Your cart"),
        click("Catalog view"),
        text("Product catalog"),
      ),
    ],
    localProject: {
      title: "Routing needs a full project",
      steps: [
        "Create a React project using the setup instructions in the final review lesson. A development server serves your files so the browser can load modules.",
        "Choose the router documented for your project or framework. Follow its current official setup rather than pasting unsupported imports into this one-file lab.",
        "Define real destinations for catalog and cart. Render links for navigation. Open each destination directly, reload it, then test Back, Forward, and an unknown URL.",
        "Check hosting fallback configuration and focus behaviour after navigation. Record which browser and production build you actually tested.",
      ],
      files: [],
      expected:
        "The URL and visible view stay in sync, and direct links and history work. These are manual full-project checks, not verified by the local-view exercise.",
    },
    prediction: {
      code: '// A page stores view = "cart" only in useState.\n// The URL never changes.',
      question:
        "Does that alone give a friend a shareable cart URL? Answer yes or no.",
      answer: ["no"],
      explanation:
        "Local state alone does not describe the location in the URL or implement history.",
    },
    guided: {
      goal: "Label a local empty-cart view clearly.",
      starting: "The cart heading currently says Basket.",
      starter:
        'function App() {\n  const [view, setView] = React.useState("catalog");\n  return <div><button onClick={() => setView("cart")}>Cart view</button><h1>{view === "cart" ? "Basket" : "Product catalog"}</h1></div>;\n}',
      solution:
        'function App() {\n  const [view, setView] = React.useState("catalog");\n  return <div><button onClick={() => setView("cart")}>Cart view</button><h1>{view === "cart" ? "Your cart" : "Product catalog"}</h1></div>;\n}',
      expected: "The local Cart view action shows Your cart.",
      change: "Change the cart heading to Your cart.",
      checks: [
        check("A local action changes content", click("Cart view"), {
          action: "element",
          role: "heading",
          name: "Your cart",
        }),
      ],
      gap: {
        find: 'setView("cart")',
        with: 'setView("catalog")',
        instructions: "Set the requested local view in the handler.",
      },
      bug: {
        find: 'view === "cart"',
        with: 'view === "basket"',
        instructions:
          "The condition and handler disagree about the view identifier. Use the same value.",
        why: "The handler writes cart, while the condition reads for basket. That branch can never match after the action.",
        fix: "Use a consistent cart identifier.",
      },
      hints: [
        "A view model needs a consistent set of identifiers.",
        "The setter and conditional should both use cart.",
      ],
      explanation:
        "This verifies local state switching only. It does not test a router.",
    },
    independent: {
      goal: "Switch two local views and preserve a cart quantity.",
      starting: "The catalog is initially visible and quantity starts at zero.",
      starter: "",
      instructions:
        "Provide Catalog view and Cart view buttons. Catalog shows Product catalog and Add one. Cart shows Your cart and Quantity:. Switching views must preserve the parent-owned quantity.",
      expected:
        "Add twice in catalog, switch to cart, and see Quantity: 2. Switch back and add again, then cart shows 3.",
      constraints:
        "Use local view state deliberately. This exercise does not implement URL routing.",
      checks: [
        check(
          "State survives a local view change",
          text("Product catalog"),
          click("Add one"),
          click("Add one"),
          click("Cart view"),
          text("Your cart"),
          text("Quantity: 2"),
          click("Catalog view"),
          click("Add one"),
          click("Cart view"),
          text("Quantity: 3"),
        ),
      ],
      solution:
        'function App() {\n  const [view, setView] = React.useState("catalog");\n  const [quantity, setQuantity] = React.useState(0);\n  return <div>\n    <button onClick={() => setView("catalog")}>Catalog view</button><button onClick={() => setView("cart")}>Cart view</button>\n    {view === "catalog" ? <div><h1>Product catalog</h1><button onClick={() => setQuantity((q) => q + 1)}>Add one</button></div> : <div><h1>Your cart</h1><p>Quantity: {quantity}</p></div>}\n  </div>;\n}',
      hints: [
        "Keep cart data above the view-specific children so hiding a view does not discard it.",
        "Store both view and quantity in App, then conditionally render only their displays.",
      ],
      explanation:
        "The test checks state ownership across view changes. URL routing remains a separate, explicitly labeled full-project task.",
    },
    project: "shop-ui",
    connection:
      "Start with a clear view model, then add real router integration and verify navigation in the full shop project.",
    recap: [
      "A local view switch is not automatically a route.",
      "Shareable locations need URL and history behaviour, including direct entry.",
    ],
  },
  {
    id: "react-suspense",
    title: "Show a fallback while a supported component loads",
    minutes: 35,
    goal: "Use lazy and Suspense to keep a page shell visible while a component becomes available.",
    prerequisites: ["react-boundaries", "js-promises", "js-modules"],
    why: "A large optional feature can load separately while the rest of a shop remains usable.",
    explanation: [
      "React.lazy receives a function returning a promise for a module whose default export is a component. Suspense displays its fallback while that supported descendant is waiting to render.",
      'A real project usually uses lazy(() => import("./Details.jsx")), allowing its bundler to split a separate file. The playground does not resolve that local file, so the runnable example simulates the promised module with a short timer.',
      "Suspense does not automatically detect any fetch started in an ordinary effect. Data loading needs a compatible source or framework integration. A loading fallback and an error boundary solve different problems: waiting versus failure.",
    ],
    code: "const Details = React.lazy(() => new Promise((resolve) => {\n  setTimeout(() => resolve({ default: () => <p>Tea details ready</p> }), 300);\n}));\nfunction App() {\n  return <div><h1>Product page</h1>\n    <React.Suspense fallback={<p>Loading details</p>}><Details /></React.Suspense>\n  </div>;\n}",
    walkthrough: [
      [
        1,
        3,
        "The lazy factory returns a promised object with a default component. This is a local module simulation.",
      ],
      [4, 5, "Keep the stable page heading outside the waiting boundary."],
      [
        6,
        6,
        "fallback is JSX displayed while Details is unavailable. The child replaces it when ready.",
      ],
      [7, 8, "Close the page. The shell remains visible during waiting."],
    ],
    visible:
      "Product page stays visible. Loading details is replaced by Tea details ready after the lazy result is available.",
    exampleChecks: [
      check(
        "Supported loading boundary",
        text("Product page"),
        text("Loading details"),
        text("Tea details ready"),
        { action: "noText", value: "Loading details" },
      ),
    ],
    prediction: {
      code: "// An ordinary useEffect starts fetch().\n// No compatible Suspense data source is used.",
      question:
        "Will Suspense automatically detect that effect’s request? Answer yes or no.",
      answer: ["no"],
      explanation:
        "Ordinary effect-based fetch is not automatically a supported Suspense source.",
    },
    guided: {
      goal: "Load Coffee details with a visible fallback.",
      starting:
        "The lazy component’s content currently says Tea details ready.",
      starter:
        "const Details = React.lazy(() => new Promise((resolve) => { setTimeout(() => resolve({ default: () => <p>Tea details ready</p> }), 300); }));\nfunction App() { return <React.Suspense fallback={<p>Loading details</p>}><Details /></React.Suspense>; }",
      solution:
        "const Details = React.lazy(() => new Promise((resolve) => { setTimeout(() => resolve({ default: () => <p>Coffee details ready</p> }), 300); }));\nfunction App() { return <React.Suspense fallback={<p>Loading details</p>}><Details /></React.Suspense>; }",
      expected: "Loading details, then Coffee details ready.",
      change: "Change the lazy component’s visible product name to Coffee.",
      checks: [
        check(
          "Lazy component resolves",
          text("Loading details"),
          text("Coffee details ready"),
        ),
      ],
      gap: {
        find: "<Details />",
        with: "",
        instructions: "Render the supported lazy child inside Suspense.",
      },
      bug: {
        find: "default: () => <p>Coffee details ready</p>",
        with: "component: () => <p>Coffee details ready</p>",
        instructions:
          "The promised module has the wrong export field. React.lazy expects default.",
        why: "The lazy contract looks for module.default as its component. An unrelated component field does not supply it.",
        fix: "Return an object with a default component property.",
      },
      hints: [
        "A promise alone is not enough; its fulfilled module shape matters.",
        "The fulfilled object needs `default: () => <p>...</p>`.",
      ],
      explanation:
        "The check waits for supported lazy loading and observes both the fallback and replacement.",
    },
    independent: {
      goal: "Keep a cart shell visible while a summary loads.",
      starting:
        "The shell heading is Your cart. A lazy summary becomes available after about 300 milliseconds.",
      starter: "",
      instructions:
        "Create a locally simulated lazy component that displays Summary ready. Wrap it in Suspense with Loading summary as fallback, leaving Your cart outside the boundary.",
      expected:
        "Your cart stays visible while Loading summary becomes Summary ready.",
      constraints:
        "Use the local promised-module pattern. Real import() file loading requires a full project.",
      checks: [
        check(
          "Shell and lazy summary",
          text("Your cart"),
          text("Loading summary"),
          text("Summary ready"),
          text("Your cart"),
          { action: "noText", value: "Loading summary" },
        ),
      ],
      solution:
        "const Summary = React.lazy(() => new Promise((resolve) => {\n  setTimeout(() => resolve({ default: () => <p>Summary ready</p> }), 300);\n}));\nfunction App() {\n  return <div><h1>Your cart</h1><React.Suspense fallback={<p>Loading summary</p>}><Summary /></React.Suspense></div>;\n}",
      hints: [
        "Keep the stable shell outside the waiting boundary.",
        "Provide a default component from the promise and render it as the Suspense child.",
      ],
      explanation:
        "This verifies local lazy-loading behaviour. It does not verify bundler chunking, network loading, or framework data integration.",
    },
    project: "shop-ui",
    connection:
      "A full shop can load an optional summary separately while preserving the surrounding page.",
    recap: [
      "Suspense coordinates supported waiting work, not every asynchronous action.",
      "The lab simulates a module; real file splitting must be checked in a full production build.",
    ],
  },
  {
    id: "react-production-review",
    title: "Review a small app without claiming mastery",
    minutes: 40,
    goal: "Test important user journeys and identify what still needs full-project review.",
    prerequisites: [
      "react-quality",
      "react-navigation",
      "react-suspense",
      "js-testing",
    ],
    why: "A practical app needs correct calculations, understandable failures, keyboard access, and safe deployment choices together.",
    explanation: [
      "Production readiness comes from explicit decisions and evidence, not a particular hook or a course completion badge. List the main user journeys and the normal, empty, invalid, and failure cases that could change their outcomes.",
      "Keep private API secrets on a server. Anything shipped in browser JavaScript can be inspected. A development server is not a production deployment. Check the built app and the hosting configuration, not only the source preview.",
      "Use automated behaviour checks for concrete flows, then review keyboard use, focus visibility, assistive technology, realistic performance, and observability. Observability means having enough useful diagnostics to understand failures after release. A self-reported checklist records a review; it does not prove the checks were performed.",
    ],
    code: "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><h1>Your cart</h1><p>Quantity: {quantity}</p><p>Total: {quantity * 4}</p>\n    <button onClick={() => setQuantity((q) => q + 1)}>Add Tea</button>\n    <button onClick={() => setQuantity(0)}>Clear cart</button>\n    {quantity === 0 ? <p>Cart is empty</p> : <p>Ready to order</p>}\n  </div>;\n}",
    walkthrough: [
      [1, 2, "Keep one current quantity."],
      [3, 3, "Display a calculated total from that same state."],
      [4, 5, "Provide repeatable add and clear actions."],
      [6, 8, "Explain both empty and ready states, then close the component."],
    ],
    visible:
      "The cart starts empty at zero. Adding Tea updates quantity and total together. Clearing returns every derived display to the empty state.",
    exampleChecks: [
      check(
        "End-to-end cart flow",
        text("Cart is empty"),
        click("Add Tea"),
        text("Total: 4"),
        click("Clear cart"),
        text("Quantity: 0"),
        text("Cart is empty"),
      ),
    ],
    localProject: {
      title: "Build and inspect the same idea outside the playground",
      steps: [
        "Use a supported Node.js LTS release. Node runs JavaScript tools on your computer. npm is its package manager: it installs the libraries listed by a project.",
        "In a terminal, run npm create vite@latest sprout-shop -- --template react. This scaffolds a React learning project. Read any current tool prompts before continuing.",
        "Run cd sprout-shop, then npm install, then npm run dev. cd changes the terminal’s current folder. Save your component in src/App.jsx and import React or the hooks you use at the top.",
        "Use npm run build to create the production output, then npm run preview to serve that output locally. These commands do not publish a site.",
        "Check a cart journey, empty and error states, keyboard-only operation, labels and focus, and direct URL navigation if you added routes. Add automated tests with a runner supported by your project. Follow your host’s deployment guide separately.",
      ],
      files: [
        {
          name: "src/App.jsx import example",
          code: 'import React from "react";\n// Paste your own App component below this import.\n// Export App as default for the scaffolded entry file.\nexport default function App() { return <h1>Your shop</h1>; }',
        },
      ],
      expected:
        "Your local project builds and its real browser journeys work. The small playground cannot inspect your terminal, hosting, external packages, or private server setup.",
    },
    prediction: {
      code: "// A project checklist says: keyboard review complete.\n// No test was run and no keyboard journey was observed.",
      question: "Is that automatically verified evidence? Answer yes or no.",
      answer: ["no"],
      explanation:
        "A checklist is a self-report. Record actual checks and keep their scope clear.",
    },
    guided: {
      goal: "Use price 5 consistently through an add-and-clear journey.",
      starting: "The derived total currently uses price 4.",
      starter:
        "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><p>Total: {quantity * 4}</p><button onClick={() => setQuantity((q) => q + 1)}>Add Tea</button><button onClick={() => setQuantity(0)}>Clear cart</button></div>;\n}",
      solution:
        "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><p>Total: {quantity * 5}</p><button onClick={() => setQuantity((q) => q + 1)}>Add Tea</button><button onClick={() => setQuantity(0)}>Clear cart</button></div>;\n}",
      expected:
        "Two additions yield quantity 2 and total 10; clearing returns both to zero.",
      change: "Change the item price to 5.",
      checks: [
        check(
          "Consistent derived values",
          click("Add Tea"),
          click("Add Tea"),
          text("Quantity: 2"),
          text("Total: 10"),
          click("Clear cart"),
          text("Quantity: 0"),
          text("Total: 0"),
        ),
      ],
      gap: {
        find: "setQuantity(0)",
        with: "setQuantity(1)",
        instructions: "Make Clear cart truly empty the cart.",
      },
      bug: {
        find: "quantity * 5",
        with: "5",
        instructions:
          "The total stays fixed when the cart changes. Derive it from quantity.",
        why: "A fixed price is not the current order total. Empty and multi-item cases expose the mismatch.",
        fix: "Multiply the current quantity by the item price.",
      },
      hints: [
        "Use one source of truth for all derived values.",
        "Calculate quantity * 5 while rendering, and clear quantity to zero.",
      ],
      explanation:
        "The sequence checks normal and empty results after repeated updates.",
    },
    independent: {
      goal: "Build and verify a small checkout interaction.",
      starting:
        "Tea costs 4, quantity starts at zero, and no order has been placed.",
      starter: "",
      instructions:
        "Provide Add Tea, Clear cart, and Place order buttons. Display Quantity: and Total:. Placing an empty order shows Add an item first. A non-empty order shows Order placed. A later clear returns quantity and total to zero.",
      expected:
        "Empty submission is explained; adding twice gives total 8; placing succeeds; clearing restores zero.",
      constraints:
        "Use visible messages and semantic buttons. Keep private APIs and real payment handling out of this local simulation.",
      checks: [
        check(
          "Empty, valid, and cleared checkout",
          text("Quantity: 0"),
          text("Total: 0"),
          click("Place order"),
          text("Add an item first"),
          click("Add Tea"),
          click("Add Tea"),
          text("Quantity: 2"),
          text("Total: 8"),
          click("Place order"),
          text("Order placed"),
          { action: "noText", value: "Add an item first" },
          click("Clear cart"),
          text("Quantity: 0"),
          text("Total: 0"),
        ),
      ],
      solution:
        'function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  const [message, setMessage] = React.useState("");\n  return <div><p>Quantity: {quantity}</p><p>Total: {quantity * 4}</p>\n    <button onClick={() => setQuantity((q) => q + 1)}>Add Tea</button>\n    <button onClick={() => { setQuantity(0); setMessage(""); }}>Clear cart</button>\n    <button onClick={() => setMessage(quantity === 0 ? "Add an item first" : "Order placed")}>Place order</button>\n    <p role="status">{message}</p>\n  </div>;\n}',
      hints: [
        "Use quantity for calculation and eligibility, with one current feedback message.",
        "Place order should choose its message from quantity === 0. Clearing should reset derived data and obsolete feedback.",
      ],
      explanation:
        "This verifies one local checkout journey. It is not payment integration, server validation, deployment verification, or proof of professional mastery.",
    },
    project: "shop-ui",
    connection:
      "Use the connected shop projects to combine logic, UI, and data states, then continue practising with real projects and reviews.",
    recap: [
      "Readiness is supported by specific checks and clear limits.",
      "Finishing these lessons is a foundation for further practice, not a guarantee of professional mastery.",
    ],
  },
];
