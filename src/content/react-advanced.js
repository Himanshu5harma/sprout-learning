import {
  uiCheck as check,
  text,
  click,
  fill,
} from "../learning/lesson-model.js";

export const reactAdvanced = [
  {
    id: "react-effects",
    title: "Synchronize with a timer and clean it up",
    minutes: 35,
    goal: "Start external work after rendering and undo it when the component is removed.",
    prerequisites: ["react-sharing", "js-timers", "js-closures"],
    why: "A shop may connect to a timer, browser event, or request. Its lifetime must match the component that needs it.",
    explanation: [
      "An effect synchronizes a component with something outside React. React.useEffect receives setup work and a dependency array. It runs after React commits the interface. An empty array means the setup has no changing reactive inputs.",
      "Return a cleanup function from the setup to undo the external work. React calls cleanup before replacing the effect and when removing the component. For a timer, cleanup uses its timer ID.",
      "Dependencies are props, state, or other reactive values the setup reads. Include them rather than hiding changes with an empty array. Effects are not needed to calculate a total from quantity; that belongs in rendering. Development Strict Mode can run an extra setup-cleanup cycle, so setup should be safe to restart.",
    ],
    code: 'function App() {\n  const [message, setMessage] = React.useState("Waiting");\n  React.useEffect(() => {\n    const timer = setTimeout(() => setMessage("Ready"), 200);\n    return () => clearTimeout(timer);\n  }, []);\n  return <p>{message}</p>;\n}',
    walkthrough: [
      [1, 2, "Start with a visible waiting message."],
      [
        3,
        4,
        "After commit, the setup schedules a state change. This timer is external work.",
      ],
      [
        5,
        5,
        "Return a cleanup function, rather than calling clearTimeout immediately.",
      ],
      [
        6,
        6,
        "The empty dependency array says no reactive input needs to resynchronize this setup.",
      ],
      [
        7,
        8,
        "The visible paragraph changes when the timer’s setter requests a new render.",
      ],
    ],
    visible:
      "Waiting appears first. After about 200 milliseconds it becomes Ready. Removing the component cancels a still-pending timer.",
    exampleChecks: [
      check("Timer-driven change", text("Waiting"), text("Ready")),
    ],
    prediction: {
      code: "React.useEffect(() => {\n  const timer = setTimeout(report, 200);\n  return () => clearTimeout(timer);\n}, []);",
      question:
        "What standard timer action does cleanup perform? Write its name.",
      answer: ["clearTimeout"],
      explanation:
        "The returned cleanup calls clearTimeout with the timer ID when the effect needs to stop.",
    },
    guided: {
      goal: "Show Loading, then Products ready after the effect’s timer.",
      starting: "The final message is Ready.",
      starter:
        'function App() {\n  const [message, setMessage] = React.useState("Loading");\n  React.useEffect(() => {\n    const timer = setTimeout(() => setMessage("Ready"), 200);\n    return () => clearTimeout(timer);\n  }, []);\n  return <p>{message}</p>;\n}',
      solution:
        'function App() {\n  const [message, setMessage] = React.useState("Loading");\n  React.useEffect(() => {\n    const timer = setTimeout(() => setMessage("Products ready"), 200);\n    return () => clearTimeout(timer);\n  }, []);\n  return <p>{message}</p>;\n}',
      expected:
        "Loading first, then Products ready. Pending timers are cleared on removal.",
      change: "Change the timer’s final message to Products ready.",
      checks: [
        check("Visible update", text("Loading"), text("Products ready")),
        check(
          "Pending work is cleaned up",
          text("Loading"),
          { action: "unmount" },
          { action: "noTimers" },
        ),
      ],
      gap: {
        find: "clearTimeout(timer)",
        with: "clearTimeout()",
        instructions: "Pass the specific timer ID to cleanup.",
      },
      bug: {
        find: "return () => clearTimeout(timer);",
        with: "return clearTimeout(timer);",
        instructions:
          "Cleanup is running immediately. Return a function that can run later.",
        why: "Calling clearTimeout during setup cancels the work before it can change the message.",
        fix: "Return an arrow function that calls clearTimeout.",
      },
      hints: [
        "Setup starts external work; cleanup must be a callable that reverses it.",
        "Use `return () => clearTimeout(timer);`.",
      ],
      explanation:
        "The checks observe the update and separately remove a fresh component before its timer finishes.",
    },
    independent: {
      goal: "Show a delayed order confirmation with cleanup.",
      starting:
        "The component starts with Preparing order. It should confirm after 300 milliseconds.",
      starter: "",
      instructions:
        "Define App with a timer effect that changes the text to Order confirmed. Return cleanup that cancels the pending timer.",
      expected:
        "Preparing order first, then Order confirmed. Removing it while preparing leaves no pending timers.",
      constraints:
        "Use a short timeout, not an interval. Do not start timers during rendering.",
      checks: [
        check(
          "Confirmation arrives",
          text("Preparing order"),
          text("Order confirmed"),
        ),
        check(
          "Cleanup cancels a pending confirmation",
          text("Preparing order"),
          { action: "unmount" },
          { action: "noTimers" },
        ),
      ],
      solution:
        'function App() {\n  const [message, setMessage] = React.useState("Preparing order");\n  React.useEffect(() => {\n    const timer = setTimeout(() => setMessage("Order confirmed"), 300);\n    return () => clearTimeout(timer);\n  }, []);\n  return <p>{message}</p>;\n}',
      hints: [
        "State holds the visible message. The effect owns the timer’s lifetime.",
        "Store setTimeout’s ID in the setup and return a function that clears that ID.",
      ],
      explanation:
        "The cleanup check counts timers created by the example after unmounting it, rather than looking for a particular line of source.",
    },
    project: "shop-data",
    connection:
      "When the shop connects to changing external data, setup and cleanup keep old work from outliving its screen.",
    recap: [
      "Effects synchronize external work; they are not a second place for ordinary calculations.",
      "Cleanup must undo setup and be safe to run before another setup.",
    ],
  },
  {
    id: "react-refs",
    title: "Focus a field with a ref",
    minutes: 25,
    goal: "Access a rendered input without storing its DOM node in state.",
    prerequisites: ["react-effects", "react-forms"],
    why: "A helpful interface can move focus to a field the user chose to edit.",
    explanation: [
      "A DOM node is the browser’s object for a page element. A ref can hold that object. React.useRef(null) returns an object whose current property persists between renders.",
      "Attach the ref through an element’s ref prop. After the element is committed, current points to that node. Read it in an event handler and call focus() to move keyboard focus.",
      "Changing ref.current does not request a render. Keep visible data in state. Use refs for things such as nodes and timer IDs that are not themselves displayed. Avoid reading or changing refs during rendering except predictable initialization.",
    ],
    code: 'function App() {\n  const input = React.useRef(null);\n  return <div>\n    <label htmlFor="search">Product search</label>\n    <input id="search" ref={input} />\n    <button onClick={() => input.current.focus()}>Focus search</button>\n  </div>;\n}',
    walkthrough: [
      [
        1,
        2,
        "Create one persistent ref object. null means it has no node before the element is rendered.",
      ],
      [
        3,
        5,
        "Label the field and attach the ref. React fills current with the input node.",
      ],
      [
        6,
        6,
        "The click handler runs after rendering, when current is available. focus is a browser method on the node.",
      ],
      [7, 8, "Close the container and component."],
    ],
    visible:
      "Clicking Focus search places the typing cursor in the Product search input.",
    exampleChecks: [
      check("Programmatic keyboard focus", click("Focus search"), {
        action: "focused",
        label: "Product search",
      }),
    ],
    prediction: {
      code: "const countRef = React.useRef(0);\n// In an event handler:\ncountRef.current = countRef.current + 1;",
      question:
        "Does changing current itself request a render? Answer yes or no.",
      answer: ["no"],
      explanation:
        "A ref change does not notify React to render. State is for values whose changes must appear in the UI.",
    },
    guided: {
      goal: "Focus the Order note field.",
      starting: "The input’s visible label says Product search.",
      starter:
        'function App() {\n  const input = React.useRef(null);\n  return <div><label htmlFor="note">Product search</label><input id="note" ref={input} /><button onClick={() => input.current.focus()}>Focus note</button></div>;\n}',
      solution:
        'function App() {\n  const input = React.useRef(null);\n  return <div><label htmlFor="note">Order note</label><input id="note" ref={input} /><button onClick={() => input.current.focus()}>Focus note</button></div>;\n}',
      expected: "Focus note focuses the field labeled Order note.",
      change: "Change the label text to Order note.",
      checks: [
        check("Correct field receives focus", click("Focus note"), {
          action: "focused",
          label: "Order note",
        }),
      ],
      gap: {
        find: "ref={input}",
        with: "",
        instructions: "Attach the input ref to the actual field.",
      },
      bug: {
        find: "input.current.focus()",
        with: "input.focus()",
        instructions:
          "The ref object is not the DOM node. Read its current property before calling focus.",
        why: "React’s ref object holds the node under current; the wrapper itself has no focus method.",
        fix: "Use input.current.focus().",
      },
      hints: [
        "Attach the ref, then use the node stored in current.",
        "The handler should call input.current.focus().",
      ],
      explanation:
        "The check inspects the actual active element, not just a focus-related message.",
    },
    independent: {
      goal: "Focus one of two inputs deliberately.",
      starting: "There are Product search and Order note fields.",
      starter: "",
      instructions:
        "Render both visibly labeled inputs and a Focus note button. Clicking it must focus Order note, not Product search.",
      expected:
        "The active input after clicking is the one labeled Order note.",
      constraints:
        "Use a ref for the intended input. Do not move focus automatically during every render.",
      checks: [
        check(
          "The intended input is focused",
          { action: "element", role: "textbox", name: "Product search" },
          click("Focus note"),
          { action: "focused", label: "Order note" },
        ),
      ],
      solution:
        'function App() {\n  const note = React.useRef(null);\n  return <div>\n    <label htmlFor="search">Product search</label><input id="search" />\n    <label htmlFor="note">Order note</label><input id="note" ref={note} />\n    <button onClick={() => note.current.focus()}>Focus note</button>\n  </div>;\n}',
      hints: [
        "A ref should point to the specific field the action describes.",
        "Attach the note ref only to the Order note input.",
      ],
      explanation:
        "Checking document.activeElement distinguishes actual focus from a similar-looking interface.",
    },
    project: "shop-ui",
    connection:
      "An edit action in the shop can guide keyboard focus to the right field.",
    recap: [
      "A ref’s current can hold a DOM node after rendering.",
      "Refs do not rerender; state does. Focus is an explicit interaction, not a rendering side effect.",
    ],
  },
  {
    id: "react-reducers",
    title: "Collect state transitions in a reducer",
    minutes: 35,
    goal: "Describe state changes with actions and calculate them in one pure function.",
    prerequisites: ["react-updates", "js-functions"],
    why: "A cart with add, remove, and reset rules benefits from one place that explains every transition.",
    explanation: [
      'A reducer receives current state and an action, then returns next state. An action is data describing what happened, such as { type: "add" }. The reducer must not mutate its inputs or start network work.',
      "React.useReducer(reducer, initialState) returns the current state and a dispatch function. Event handlers dispatch actions. React calls the reducer to calculate the next state and renders the result.",
      "Use ordinary if statements to make the rules clear. A default return of the old state keeps unknown actions harmless here. Reducers organize transitions; they are not required for every simple state value.",
    ],
    code: 'function reducer(quantity, action) {\n  if (action.type === "add") return quantity + 1;\n  if (action.type === "reset") return 0;\n  return quantity;\n}\nfunction App() {\n  const [quantity, dispatch] = React.useReducer(reducer, 0);\n  return <div><p>Quantity: {quantity}</p><button onClick={() => dispatch({ type: "add" })}>Add one</button><button onClick={() => dispatch({ type: "reset" })}>Reset</button></div>;\n}',
    walkthrough: [
      [
        1,
        4,
        "A pure function chooses a next number from the action’s type. Unknown actions return the current number.",
      ],
      [
        5,
        7,
        "Give React the reducer and initial state. dispatch requests an action rather than directly assigning state.",
      ],
      [
        8,
        9,
        "Each button dispatches a named event; JSX reads the reducer-managed quantity.",
      ],
    ],
    visible:
      "Quantity starts at 0. Add one increases it. Reset returns it to 0.",
    exampleChecks: [
      check(
        "Reducer actions update UI",
        text("Quantity: 0"),
        click("Add one"),
        text("Quantity: 1"),
        click("Reset"),
        text("Quantity: 0"),
      ),
    ],
    prediction: {
      code: 'function reducer(state, action) {\n  if (action.type === "add") return state + 1;\n  return state;\n}\nconsole.log(reducer(2, { type: "unknown" }));',
      question: "What does the fallback return and print?",
      answer: [2],
      explanation:
        "An unrecognized action returns the existing state unchanged.",
    },
    guided: {
      goal: "Start reducer-managed quantity at 2 and reset it to zero.",
      starting: "The initial state is zero.",
      starter:
        'function reducer(q, action) {\n  if (action.type === "add") return q + 1;\n  if (action.type === "reset") return 0;\n  return q;\n}\nfunction App() {\n  const [quantity, dispatch] = React.useReducer(reducer, 0);\n  return <div><p>Quantity: {quantity}</p><button onClick={() => dispatch({ type: "add" })}>Add one</button><button onClick={() => dispatch({ type: "reset" })}>Reset</button></div>;\n}',
      solution:
        'function reducer(q, action) {\n  if (action.type === "add") return q + 1;\n  if (action.type === "reset") return 0;\n  return q;\n}\nfunction App() {\n  const [quantity, dispatch] = React.useReducer(reducer, 2);\n  return <div><p>Quantity: {quantity}</p><button onClick={() => dispatch({ type: "add" })}>Add one</button><button onClick={() => dispatch({ type: "reset" })}>Reset</button></div>;\n}',
      expected: "Quantity: 2 initially; Add one reaches 3; Reset returns to 0.",
      change: "Change useReducer’s initial value to 2.",
      checks: [
        check(
          "Actions and starting value",
          text("Quantity: 2"),
          click("Add one"),
          text("Quantity: 3"),
          click("Reset"),
          text("Quantity: 0"),
        ),
      ],
      gap: {
        find: 'if (action.type === "reset") return 0;',
        with: 'if (action.type === "reset") return q;',
        instructions: "Make the reset action return zero.",
      },
      bug: {
        find: 'dispatch({ type: "add" })',
        with: 'dispatch({ kind: "add" })',
        instructions:
          "The dispatched object uses kind, but the reducer reads type. Make the action contract agree.",
        why: "The reducer sees action.type as undefined and returns unchanged state.",
        fix: "Dispatch an object with type: add.",
      },
      hints: [
        "The action’s field names connect the handler to the reducer.",
        'Use dispatch({ type: "add" }) and return 0 for reset.',
      ],
      explanation:
        "The test follows actions through actual renders rather than inspecting the reducer’s source.",
    },
    independent: {
      goal: "Keep quantity non-negative through reducer actions.",
      starting: "The cart quantity begins at zero.",
      starter: "",
      instructions:
        "Display Quantity:. Add Add one and Remove one buttons. Add increases quantity. Remove decreases it only when above zero.",
      expected:
        "Removing at zero keeps zero. Two additions then one removal leave Quantity: 1.",
      constraints:
        "Use a reducer to group the transition rules. The behaviour check verifies the rules rather than enforcing an API string.",
      checks: [
        check(
          "Boundary and repeated transitions",
          text("Quantity: 0"),
          click("Remove one"),
          text("Quantity: 0"),
          click("Add one"),
          click("Add one"),
          click("Remove one"),
          text("Quantity: 1"),
          click("Remove one"),
          click("Remove one"),
          text("Quantity: 0"),
        ),
      ],
      solution:
        'function reducer(q, action) {\n  if (action.type === "add") return q + 1;\n  if (action.type === "remove" && q > 0) return q - 1;\n  return q;\n}\nfunction App() {\n  const [quantity, dispatch] = React.useReducer(reducer, 0);\n  return <div><p>Quantity: {quantity}</p>\n    <button onClick={() => dispatch({ type: "add" })}>Add one</button>\n    <button onClick={() => dispatch({ type: "remove" })}>Remove one</button>\n  </div>;\n}',
      hints: [
        "Protect the zero boundary in the remove transition, not in a separate copy of state.",
        "Only return q - 1 when the action is remove and q > 0.",
      ],
      explanation:
        "The checks repeat the boundary action, which catches a reducer that allows negative quantities.",
    },
    project: "shop-ui",
    connection:
      "A cart can keep all quantity transition rules together, including boundary cases.",
    recap: [
      "Actions describe events; reducers calculate next state.",
      "Keep reducers pure and protect important boundaries with explicit rules.",
    ],
  },
  {
    id: "react-context",
    title: "Read a shared value through context",
    minutes: 30,
    goal: "Provide a shop-wide value and read it from a descendant.",
    prerequisites: ["react-sharing", "react-updates"],
    why: "A currency or theme may be needed by many distant parts of the shop interface.",
    explanation: [
      "Context lets descendants read a value supplied above them without forwarding it through every intermediate component. Start with props; use context when it makes a shared dependency clearer.",
      "Create the context outside your components. Wrap the relevant tree with its Provider and a value prop. A descendant calls useContext with that same context object. It reads the closest matching provider above it.",
      "Context is not automatically a separate state store. The provider can receive state owned by its component. When its value changes, consumers may render again. Avoid combining unrelated, frequently changing information into one large value.",
    ],
    code: 'const Currency = React.createContext("USD");\nfunction Price() {\n  const currency = React.useContext(Currency);\n  return <p>Currency: {currency}</p>;\n}\nfunction App() {\n  return <Currency.Provider value="INR"><Price /></Currency.Provider>;\n}',
    walkthrough: [
      [
        1,
        1,
        "Create one shared context object. USD is the fallback when no matching provider is above a reader.",
      ],
      [2, 5, "The descendant reads Currency and displays its current value."],
      [
        6,
        8,
        "The provider supplies INR to its descendants. It overrides the fallback for this Price instance.",
      ],
    ],
    visible: "The preview shows Currency: INR.",
    exampleChecks: [check("Provider value is read", text("Currency: INR"))],
    prediction: {
      code: 'const Currency = React.createContext("USD");\nfunction Price() { return <p>{React.useContext(Currency)}</p>; }\nfunction App() { return <Price />; }',
      question: "What value appears without a provider?",
      answer: ["USD"],
      explanation:
        "Without a provider above Price, useContext reads the context’s default value.",
    },
    guided: {
      goal: "Provide EUR to a currency reader.",
      starting: "The provider currently supplies INR.",
      starter:
        'const Currency = React.createContext("USD");\nfunction Price() { return <p>Currency: {React.useContext(Currency)}</p>; }\nfunction App() { return <Currency.Provider value="INR"><Price /></Currency.Provider>; }',
      solution:
        'const Currency = React.createContext("USD");\nfunction Price() { return <p>Currency: {React.useContext(Currency)}</p>; }\nfunction App() { return <Currency.Provider value="EUR"><Price /></Currency.Provider>; }',
      expected: "The reader shows Currency: EUR.",
      change: "Change the provider’s value to EUR.",
      checks: [check("A different provided value", text("Currency: EUR"))],
      gap: {
        find: "React.useContext(Currency)",
        with: '""',
        instructions: "Read the provided value from Currency.",
      },
      bug: {
        find: '<Currency.Provider value="EUR"><Price /></Currency.Provider>',
        with: '<div><Currency.Provider value="EUR" /><Price /></div>',
        instructions:
          "The reader is beside the provider. Put it inside the provider’s children.",
        why: "A context reader only sees providers above it, not siblings.",
        fix: "Wrap Price with Currency.Provider.",
      },
      hints: [
        "Provider position matters: it must be an ancestor.",
        "Place Price between the provider’s opening and closing tags.",
      ],
      explanation:
        "The check confirms the actual reader receives the intended provided value.",
    },
    independent: {
      goal: "Update two distant currency labels together.",
      starting: "The shared currency starts as USD.",
      starter: "",
      instructions:
        "Render text Card currency: USD and Summary currency: USD through readers of one context. An Use EUR button changes both to EUR.",
      expected: "Both labels change to EUR after one click.",
      constraints:
        "Keep currency state in the provider owner. Use context readers for the labels; the checker verifies the resulting synchronized behaviour.",
      checks: [
        check(
          "Two consumers follow the provider",
          text("Card currency: USD"),
          text("Summary currency: USD"),
          click("Use EUR"),
          text("Card currency: EUR"),
          text("Summary currency: EUR"),
        ),
      ],
      solution:
        'const Currency = React.createContext("USD");\nfunction Card() { return <p>Card currency: {React.useContext(Currency)}</p>; }\nfunction Summary() { return <p>Summary currency: {React.useContext(Currency)}</p>; }\nfunction App() {\n  const [currency, setCurrency] = React.useState("USD");\n  return <Currency.Provider value={currency}>\n    <Card /><Summary /><button onClick={() => setCurrency("EUR")}>Use EUR</button>\n  </Currency.Provider>;\n}',
      hints: [
        "Provide the current state value, rather than a fixed literal.",
        "Store currency in App and pass value={currency} around both readers.",
      ],
      explanation:
        "The state still has one owner. Context makes that owner’s value available deeper in the tree.",
    },
    project: "shop-ui",
    connection:
      "A shared display preference such as currency can reach several shop sections without unrelated intermediate props.",
    recap: [
      "Context reads the closest matching provider above a component.",
      "The provider’s owner can hold state; context passes its value through the tree.",
    ],
  },
  {
    id: "react-custom-hooks",
    title: "Reuse stateful behaviour with a custom hook",
    minutes: 30,
    goal: "Extract a reusable quantity control without accidentally sharing its state.",
    prerequisites: ["react-effects", "react-sharing", "js-functions"],
    why: "Two independent cards may need the same incrementing behaviour but different quantities.",
    explanation: [
      "A custom hook is a function whose name starts with use and that can call other hooks. It extracts reusable behaviour from component code. It can return whatever values and callbacks the component needs.",
      "Each call has its own state. Calling useQuantity twice does not share a quantity. Share state by lifting it to an owner or providing it through context when that is actually required.",
      "Call hooks only at the top level of components or other hooks, in a consistent order. Do not call them in a condition, loop, ordinary event handler, or after a conditional early return.",
    ],
    code: "function useQuantity() {\n  const [quantity, setQuantity] = React.useState(0);\n  return { quantity, add: () => setQuantity((q) => q + 1) };\n}\nfunction App() {\n  const tea = useQuantity();\n  const coffee = useQuantity();\n  return <div><button onClick={tea.add}>Tea: {tea.quantity}</button><button onClick={coffee.add}>Coffee: {coffee.quantity}</button></div>;\n}",
    walkthrough: [
      [
        1,
        4,
        "The hook owns a useState call and returns a value plus an event callback. Object shorthand quantity means quantity: quantity.",
      ],
      [
        5,
        7,
        "App calls the hook twice at its top level. Each call has separate state.",
      ],
      [8, 9, "Each button receives its own instance’s callback and quantity."],
    ],
    visible:
      "Tea: 0 and Coffee: 0 initially. Clicking Tea changes only Tea to 1.",
    exampleChecks: [
      check(
        "Logic reuse without state sharing",
        click("Tea: 0"),
        text("Tea: 1"),
        text("Coffee: 0"),
      ),
    ],
    prediction: {
      code: "const first = useQuantity();\nconst second = useQuantity();\n// The user clicks only first.add once.",
      question:
        "What is second.quantity after that click, if both started at zero?",
      answer: [0],
      explanation:
        "Each hook call owns independent state. Reusing logic does not share that state.",
    },
    guided: {
      goal: "Create independent Tea and Milk controls.",
      starting: "The second product label is Coffee.",
      starter:
        "function useQuantity() {\n  const [quantity, setQuantity] = React.useState(0);\n  return { quantity, add: () => setQuantity((q) => q + 1) };\n}\nfunction App() {\n  const tea = useQuantity(); const milk = useQuantity();\n  return <div><button onClick={tea.add}>Tea: {tea.quantity}</button><button onClick={milk.add}>Coffee: {milk.quantity}</button></div>;\n}",
      solution:
        "function useQuantity() {\n  const [quantity, setQuantity] = React.useState(0);\n  return { quantity, add: () => setQuantity((q) => q + 1) };\n}\nfunction App() {\n  const tea = useQuantity(); const milk = useQuantity();\n  return <div><button onClick={tea.add}>Tea: {tea.quantity}</button><button onClick={milk.add}>Milk: {milk.quantity}</button></div>;\n}",
      expected: "Tea and Milk start at zero. A Tea click leaves Milk at zero.",
      change: "Change only the second button’s visible product label to Milk.",
      checks: [
        check(
          "Independent instances",
          click("Tea: 0"),
          text("Tea: 1"),
          text("Milk: 0"),
          click("Milk: 0"),
          text("Milk: 1"),
          text("Tea: 1"),
        ),
      ],
      gap: {
        find: "q + 1",
        with: "q",
        instructions: "Return an incremented value in the hook’s updater.",
      },
      bug: {
        find: "onClick={milk.add}",
        with: "onClick={tea.add}",
        instructions:
          "The Milk control calls the Tea instance. Connect it to its own returned callback.",
        why: "The hook calls are independent, but passing the wrong callback updates the wrong state owner.",
        fix: "Use milk.add for Milk.",
      },
      hints: [
        "Reused logic still returns instance-specific values.",
        "Read milk.quantity and pass milk.add for the Milk control.",
      ],
      explanation:
        "Interleaved clicks check that the two instances stay independent.",
    },
    independent: {
      goal: "Reuse a quantity hook twice.",
      starting: "Left and Right quantities both start at zero.",
      starter: "",
      instructions:
        "Create a useCounter hook with a count and increment callback. Render Left: and Right: values and Add left and Add right buttons. The two counts must remain independent.",
      expected:
        "Add left twice gives Left: 2 and Right: 0. Add right once then gives Right: 1 while Left stays 2.",
      constraints:
        "Call the hook twice at the top level. The checks verify independence, not an exact hook implementation.",
      checks: [
        check(
          "Two independent controls",
          click("Add left"),
          click("Add left"),
          text("Left: 2"),
          text("Right: 0"),
          click("Add right"),
          text("Right: 1"),
          text("Left: 2"),
        ),
      ],
      solution:
        "function useCounter() {\n  const [count, setCount] = React.useState(0);\n  return { count, increment: () => setCount((n) => n + 1) };\n}\nfunction App() {\n  const left = useCounter(); const right = useCounter();\n  return <div><p>Left: {left.count}</p><p>Right: {right.count}</p>\n    <button onClick={left.increment}>Add left</button><button onClick={right.increment}>Add right</button>\n  </div>;\n}",
      hints: [
        "The hook returns a value and a callback for one instance.",
        "Create left and right with separate useCounter calls and connect each button accordingly.",
      ],
      explanation:
        "The test confirms instance behaviour. It does not claim that duplicating the same logic is equivalent to extracting a maintainable hook.",
    },
    project: "shop-ui",
    connection:
      "Extract genuinely repeated stateful behaviour while keeping shared cart data in one explicit owner.",
    recap: [
      "Custom hooks share logic, not state.",
      "Use the use prefix and follow the same top-level call rules as built-in hooks.",
    ],
  },
  {
    id: "react-performance",
    title: "Measure work before adding memoization",
    minutes: 35,
    goal: "Understand a memoized calculation and identify what still needs measurement.",
    prerequisites: ["react-custom-hooks", "react-forms", "js-array-methods"],
    why: "A large product search may feel slow, but adding caching everywhere can make code harder without solving the actual bottleneck.",
    explanation: [
      "Measure a specific slow interaction with browser tools or the React Profiler before changing it. Rendering, calculation, layout, and network waiting are different sources of delay.",
      "useMemo caches a calculated value between renders while its dependencies stay equal. It receives a calculation function and a dependency array. Every reactive value read by the calculation belongs in that array. It is an optimization, not required for correctness.",
      "The small example is deliberately too small to need caching. Its purpose is to show the API. Keep the function correct without the cache, keep state local where possible, and compare measurements before and after a real optimization.",
    ],
    code: 'const products = ["Tea", "Coffee", "Milk"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const matches = React.useMemo(() => products.filter((name) => name.includes(query)), [query]);\n  return <div><label htmlFor="query">Product search</label><input id="query" value={query} onChange={(e) => setQuery(e.target.value)} /><p>Matches: {matches.join(", ")}</p></div>;\n}',
    walkthrough: [
      [
        1,
        1,
        "Keep the fixed example data outside App, so its identity does not change per render.",
      ],
      [2, 3, "Store the typed query."],
      [
        4,
        4,
        "includes checks whether one string contains another, case-sensitively here. filter selects matches. useMemo depends on the changing query.",
      ],
      [
        5,
        6,
        "join combines array items into text separated by a comma and space. The controlled input updates the query.",
      ],
    ],
    visible:
      "All names appear initially. Typing Tea shows Matches: Tea. Search is case-sensitive in this small example.",
    exampleChecks: [
      check(
        "Correct filtering",
        fill("Product search", "Tea"),
        text("Matches: Tea"),
      ),
    ],
    prediction: {
      code: 'const names = ["Tea", "Coffee"];\nconsole.log(names.filter((name) => name.includes("Co")).join(", "));',
      question: "Which product name matches this case-sensitive substring?",
      answer: ["Coffee"],
      explanation: "Coffee contains the exact substring Co; Tea does not.",
    },
    guided: {
      goal: "Include Milk in a case-sensitive product search.",
      starting: "The fixed data contains only Tea and Coffee.",
      starter:
        'const products = ["Tea", "Coffee"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const matches = React.useMemo(() => products.filter((n) => n.includes(query)), [query]);\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} /><p>Matches: {matches.join(", ")}</p></div>;\n}',
      solution:
        'const products = ["Tea", "Coffee", "Milk"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const matches = React.useMemo(() => products.filter((n) => n.includes(query)), [query]);\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} /><p>Matches: {matches.join(", ")}</p></div>;\n}',
      expected:
        "Typing Milk shows Matches: Milk, then typing Tea shows Matches: Tea.",
      change: "Add Milk as a third string in the products array.",
      checks: [
        check(
          "Search reacts to each input",
          fill("Product search", "Milk"),
          text("Matches: Milk"),
          fill("Product search", "Tea"),
          text("Matches: Tea"),
        ),
      ],
      gap: {
        find: "n.includes(query)",
        with: "false",
        instructions:
          "Return the substring comparison from the filter callback.",
      },
      bug: {
        find: "[query]",
        with: "[]",
        instructions:
          "The memo ignores query changes. Include the changing input in its dependencies.",
        why: "An empty dependency array reuses the initial result even when the search text changes.",
        fix: "Include query in the dependency array.",
      },
      hints: [
        "Caching must follow all inputs that change the calculated result.",
        "Use query in both the includes call and useMemo’s dependency array.",
      ],
      explanation:
        "The behaviour test catches stale filtering. It does not measure speed.",
    },
    independent: {
      goal: "Build a search with an explicit no-results state.",
      starting: "Products are Tea, Coffee, and Milk. Search is case-sensitive.",
      starter: "",
      instructions:
        "Render a labeled Product search input. Show matching names as li items. If none match, show No matches. Clearing the search restores all three.",
      expected:
        "Tea matches one item; Nothing shows No matches; an empty query shows all three items.",
      constraints:
        "Keep the result correct. Memoization is optional until a realistic measurement justifies it.",
      checks: [
        check(
          "Filtering and no-results recovery",
          fill("Product search", "Tea"),
          { action: "texts", selector: "li", value: ["Tea"] },
          fill("Product search", "Nothing"),
          text("No matches"),
          { action: "count", selector: "li", value: 0 },
          fill("Product search", ""),
          { action: "count", selector: "li", value: 3 },
        ),
      ],
      solution:
        'const products = ["Tea", "Coffee", "Milk"];\nfunction App() {\n  const [query, setQuery] = React.useState("");\n  const matches = products.filter((name) => name.includes(query));\n  return <div><label htmlFor="q">Product search</label><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />\n    {matches.length === 0 ? <p>No matches</p> : <ul>{matches.map((name) => <li key={name}>{name}</li>)}</ul>}\n  </div>;\n}',
      hints: [
        "Derive matching items from the current query. Handle zero matches explicitly.",
        "filter with includes, then choose between a No matches paragraph and a mapped list.",
      ],
      explanation:
        "This independent exercise establishes correct behaviour first. A separate full-project profiling exercise is needed to make a performance claim.",
    },
    project: "shop-ui",
    connection:
      "Build a correct product search, then profile a realistic catalog before adding an optimization.",
    recap: [
      "Correctness comes before caching.",
      "A behaviour check can detect stale results, but it is not a performance measurement.",
    ],
  },
  {
    id: "react-async-ui",
    title: "Make loading, empty, error, and success explicit",
    minutes: 40,
    goal: "Show the state of asynchronous work and recover from a failure.",
    prerequisites: [
      "react-effects",
      "react-refs",
      "react-conditions",
      "js-async",
    ],
    why: "A shop should tell people whether products are loading, unavailable, empty, or ready.",
    explanation: [
      "A data interface needs more than successful content. Keep an explicit status for the current operation and show a useful message for each state. An empty successful response is different from a failed request.",
      "An effect can start work and ignore an outdated result after cleanup. A boolean active flag guards the state update; a real fetch can also use AbortController to cancel supported work. Check response.ok for HTTP failures, which the fetch lesson covers.",
      "The minimal example simulates a local load, so no external API is required. The independent exercise uses buttons to simulate success, empty data, and failure. This is state modelling practice, not a deployed network service.",
    ],
    code: 'function App() {\n  const [status, setStatus] = React.useState("loading");\n  React.useEffect(() => {\n    let active = true;\n    const timer = setTimeout(() => { if (active) setStatus("success"); }, 200);\n    return () => { active = false; clearTimeout(timer); };\n  }, []);\n  if (status === "loading") return <p role="status">Loading products</p>;\n  return <p>Tea is ready</p>;\n}',
    walkthrough: [
      [1, 2, "Represent the waiting state explicitly."],
      [
        3,
        6,
        "Set up a simulated load. The flag prevents an obsolete completion from updating state; cleanup also cancels this local timer.",
      ],
      [7, 7, "The effect has no reactive inputs in this fixed simulation."],
      [
        8,
        10,
        "Return different content for loading and success. role=status announces non-urgent status text to assistive technology.",
      ],
    ],
    visible:
      "Loading products appears, then Tea is ready after about 200 milliseconds.",
    exampleChecks: [
      check(
        "Loading becomes content",
        text("Loading products"),
        text("Tea is ready"),
      ),
    ],
    prediction: {
      code: 'const products = [];\nconst status = "success";\n// A successful response contains no products.',
      question:
        "Is this an empty result or a network error? Write empty result or network error.",
      answer: ["empty result"],
      explanation:
        "A successful response with an empty collection is not an exception. It deserves its own useful empty message.",
    },
    guided: {
      goal: "Show Coffee after the simulated load.",
      starting: "The successful message currently says Tea is ready.",
      starter:
        'function App() {\n  const [ready, setReady] = React.useState(false);\n  React.useEffect(() => { const timer = setTimeout(() => setReady(true), 200); return () => clearTimeout(timer); }, []);\n  return <p>{ready ? "Tea is ready" : "Loading products"}</p>;\n}',
      solution:
        'function App() {\n  const [ready, setReady] = React.useState(false);\n  React.useEffect(() => { const timer = setTimeout(() => setReady(true), 200); return () => clearTimeout(timer); }, []);\n  return <p>{ready ? "Coffee is ready" : "Loading products"}</p>;\n}',
      expected: "Loading products, then Coffee is ready.",
      change: "Change only the success message to Coffee is ready.",
      checks: [
        check(
          "Current async result",
          text("Loading products"),
          text("Coffee is ready"),
        ),
      ],
      gap: {
        find: "setReady(true)",
        with: "setReady(false)",
        instructions: "Set ready to true when the simulated work completes.",
      },
      bug: {
        find: 'ready ? "Coffee is ready" : "Loading products"',
        with: 'ready ? "Loading products" : "Coffee is ready"',
        instructions:
          "The waiting and success messages are reversed. Show loading before completion.",
        why: "ready is false initially and true only after the callback. The branches must match those meanings.",
        fix: "Put successful content in the true branch and the loading message in the false branch.",
      },
      hints: [
        "Give each state a meaning and make the visible branch match it.",
        "ready false means loading; ready true means content.",
      ],
      explanation:
        "The check waits for the visible transition, rather than relying on a fixed screenshot delay.",
    },
    independent: {
      goal: "Build a recoverable local product loader.",
      starting:
        "The initial text is Ready to load. Three buttons simulate product outcomes.",
      starter: "",
      instructions:
        "Provide Load products, Load empty, and Load error buttons. Each first shows Loading products, then after about 150 milliseconds shows Tea, No products, or Could not load products respectively. A success action must work after an error.",
      expected:
        "Loading is observable for each request; every outcome is distinct; a new success can replace an error.",
      constraints:
        "Use local timers to simulate work. No fetch or external package is needed. Keep a single current status for this exercise.",
      checks: [
        check(
          "All outcomes and recovery",
          text("Ready to load"),
          click("Load empty"),
          text("Loading products"),
          text("No products"),
          click("Load error"),
          text("Loading products"),
          text("Could not load products"),
          click("Load products"),
          text("Loading products"),
          text("Tea"),
          { action: "noText", value: "Could not load products" },
        ),
      ],
      solution:
        'function App() {\n  const [message, setMessage] = React.useState("Ready to load");\n  const timer = React.useRef(null);\n  React.useEffect(() => () => clearTimeout(timer.current), []);\n  function load(result) {\n    clearTimeout(timer.current);\n    setMessage("Loading products");\n    timer.current = setTimeout(() => setMessage(result), 150);\n  }\n  return <div><p role="status">{message}</p>\n    <button onClick={() => load("Tea")}>Load products</button>\n    <button onClick={() => load("No products")}>Load empty</button>\n    <button onClick={() => load("Could not load products")}>Load error</button>\n  </div>;\n}',
      hints: [
        "Use one visible state for the current message and schedule the chosen result.",
        "A load(result) handler can set Loading products immediately, then set result in a short timeout. Cancel the old timeout before another load.",
      ],
      explanation:
        "The checks visit empty, failed, and successful outcomes in one user journey. Real request races still need cancellation or stale-result guards.",
    },
    project: "shop-data",
    connection:
      "The shop’s data screen can communicate waiting and failure while retaining a useful recovery path.",
    recap: [
      "Loading, success, empty, and error are different states.",
      "Guard or cancel outdated work; do not let an old response replace the current one.",
    ],
  },
  {
    id: "react-quality",
    title: "Check the interface as a person uses it",
    minutes: 35,
    goal: "Build a labeled form and verify its visible success and invalid-input behaviour.",
    prerequisites: ["react-forms", "react-async-ui", "js-errors"],
    why: "A working-looking screen can still be difficult to use with a keyboard or unclear when something goes wrong.",
    explanation: [
      "Use semantic elements first: buttons for actions, labels for fields, and forms for submission. Their built-in behaviour supports keyboard interaction and gives assistive technology meaningful roles and names.",
      "A useful behaviour test follows an interaction and observes its result. For example: find a field by its label, type a note, submit, then check the confirmation. It should not depend on a private state variable’s name.",
      "role=status can announce a non-urgent update. role=alert is for an important error. Neither replaces visible text. Automated checks cover particular behaviours; also review focus visibility, keyboard order, contrast, and a screen-reader experience in a full project.",
    ],
    code: 'function App() {\n  const [saved, setSaved] = React.useState(false);\n  return <div><button onClick={() => setSaved(true)}>Save order</button>\n    <p role="status">{saved ? "Order saved" : "Not saved yet"}</p>\n  </div>;\n}',
    walkthrough: [
      [1, 2, "Represent the saved state explicitly."],
      [3, 3, "Use a real button for the action."],
      [
        4,
        6,
        "A visible status paragraph changes after the button updates state.",
      ],
    ],
    visible: "Not saved yet becomes Order saved after Save order is activated.",
    exampleChecks: [
      check(
        "Observable save action",
        text("Not saved yet"),
        click("Save order"),
        text("Order saved"),
      ),
    ],
    prediction: {
      code: "// Test plan:\n// Find button Save order. Activate it.\n// Inspect the resulting visible status.",
      question: "What visible status should a successful save show?",
      answer: ["Order saved"],
      explanation:
        "A useful assertion checks the user-visible result, not the implementation’s internal state name.",
    },
    guided: {
      goal: "Give the action a visible, descriptive name.",
      starting: "The button’s label is only Save.",
      starter:
        'function App() {\n  const [saved, setSaved] = React.useState(false);\n  return <div><button onClick={() => setSaved(true)}>Save</button><p role="status">{saved ? "Order saved" : "Not saved yet"}</p></div>;\n}',
      solution:
        'function App() {\n  const [saved, setSaved] = React.useState(false);\n  return <div><button onClick={() => setSaved(true)}>Save order</button><p role="status">{saved ? "Order saved" : "Not saved yet"}</p></div>;\n}',
      expected:
        "A button named Save order updates the visible status to Order saved.",
      change: "Change the button label to Save order.",
      checks: [
        check(
          "A named action with visible feedback",
          click("Save order"),
          text("Order saved"),
        ),
      ],
      gap: {
        find: "setSaved(true)",
        with: "setSaved(false)",
        instructions: "Set the successful state in the handler.",
      },
      bug: {
        find: "<button onClick={() => setSaved(true)}>Save order</button>",
        with: "<span onClick={() => setSaved(true)}>Save order</span>",
        instructions:
          "The action is a clickable span without native button semantics. Restore a real button.",
        why: "A span is not keyboard-activatable as a button and does not communicate the same role by default.",
        fix: "Use a button element for this action.",
      },
      hints: [
        "Prefer the element with the behaviour and role you need.",
        "Use a button with a visible Save order label and an onClick handler.",
      ],
      explanation:
        "The check finds the action by role and name, then observes the resulting status.",
    },
    independent: {
      goal: "Validate a customer name and let the person fix it.",
      starting: "The Customer name input begins empty.",
      starter: "",
      instructions:
        "Create a visibly labeled Customer name field and Save customer submit button. An empty submission displays Enter a name. Entering Sam and submitting then displays Saved: Sam and removes the old error.",
      expected:
        "Invalid submission gives a useful message; a corrected submission succeeds without page navigation.",
      constraints:
        "Use a form, preventDefault, a real button, and visible messages. Do not rely only on red or green colour.",
      checks: [
        check(
          "Validation and recovery",
          { action: "element", role: "textbox", name: "Customer name" },
          click("Save customer"),
          text("Enter a name"),
          fill("Customer name", "Sam"),
          click("Save customer"),
          text("Saved: Sam"),
          { action: "noText", value: "Enter a name" },
        ),
      ],
      solution:
        'function App() {\n  const [name, setName] = React.useState("");\n  const [message, setMessage] = React.useState("");\n  return <form onSubmit={(e) => { e.preventDefault(); setMessage(name === "" ? "Enter a name" : "Saved: " + name); }}>\n    <label htmlFor="customer">Customer name</label>\n    <input id="customer" value={name} onChange={(e) => setName(e.target.value)} />\n    <button type="submit">Save customer</button><p role="status">{message}</p>\n  </form>;\n}',
      hints: [
        "Handle the invalid and valid branches in the same submit handler.",
        "Check name === empty text, then set one current message. Replace it on the next submission.",
      ],
      explanation:
        "The automated journey checks a label, validation, correction, and recovery. It is not a complete accessibility audit.",
    },
    project: "shop-ui",
    connection:
      "Write a behaviour checklist for the shop: empty order, valid addition, invalid input, successful correction, and keyboard operation.",
    recap: [
      "Test observable behaviour, including failure and recovery.",
      "Use semantic controls and visible feedback. Automated checks complement, not replace, human accessibility review.",
    ],
  },
];
