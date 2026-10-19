import {
  uiCheck as check,
  text,
  click,
  fill,
} from "../learning/lesson-model.js";

export const reactBasics = [
  {
    id: "react-components",
    title: "Display a product with a React component",
    minutes: 25,
    goal: "Describe a heading on the page with a small component.",
    prerequisites: ["js-destructuring", "js-functions"],
    why: "JavaScript calculates with product data. React uses JavaScript components to describe and update the visible interface.",
    explanation: [
      "An interface is the part of an application a person sees and interacts with. A component is a reusable piece of that interface. Here, a component is a JavaScript function that returns a description of what should appear.",
      "The <h1>Tea</h1> notation is JSX: JavaScript syntax for describing interface elements. h1 means a main heading. The opening and closing tags surround its text; the slash marks the closing tag. JSX is translated to ordinary JavaScript before the browser runs it.",
      "Component names begin with a capital letter. This playground renders the function named App as its starting component. It supplies React and the page setup for you. You do not need an import or an installation to run this one-file example. In a full application, setup creates a root and renders your component into it.",
    ],
    code: "function App() {\n  return <h1>Tea</h1>;\n}",
    walkthrough: [
      [1, 1, "Define the component function App. It takes no inputs yet."],
      [
        2,
        2,
        "Return JSX describing an h1 heading containing Tea. Unlike console.log, this describes visible page content.",
      ],
      [
        3,
        3,
        "Close the function. The preview setup calls React to render App.",
      ],
    ],
    visible:
      "The preview shows a heading Tea. Nothing is printed to the JavaScript console by this component.",
    exampleChecks: [
      check("A visible product heading", {
        action: "element",
        role: "heading",
        name: "Tea",
      }),
    ],
    prediction: {
      code: "function App() {\n  return <h1>Coffee</h1>;\n}",
      question: "What word will appear in the heading?",
      answer: ["Coffee"],
      explanation: "The component returns a heading whose content is Coffee.",
    },
    guided: {
      goal: "Display Coffee as the product heading.",
      starting: "App currently describes a Tea heading.",
      starter: "function App() {\n  return <h1>Tea</h1>;\n}",
      solution: "function App() {\n  return <h1>Coffee</h1>;\n}",
      expected: "A visible heading Coffee.",
      change: "Replace the text between the h1 tags with Coffee.",
      checks: [
        check("Coffee heading", {
          action: "element",
          role: "heading",
          name: "Coffee",
        }),
      ],
      gap: {
        find: "Coffee",
        with: "",
        instructions: "Add the missing visible text between the heading tags.",
      },
      bug: {
        find: "return <h1>",
        with: "<h1>",
        instructions:
          "The function creates JSX but does not return it. Return the heading.",
        why: "A function without a returned interface description gives React nothing to display here.",
        fix: "Write return before the JSX.",
      },
      hints: [
        "Keep the component’s structure; change the content it describes.",
        "The body should return `<h1>Coffee</h1>`.",
      ],
      explanation: "The returned JSX determines the heading in the preview.",
    },
    independent: {
      goal: "Make a small shop welcome heading.",
      starting: "The editor is empty. The preview expects an App component.",
      starter: "",
      instructions: "Define App and return a heading that says Sprout Store.",
      expected: "A visible heading named Sprout Store.",
      constraints:
        "Use a semantic heading element such as h1. Do not use console.log to display the page.",
      checks: [
        check("Shop heading", {
          action: "element",
          role: "heading",
          name: "Sprout Store",
        }),
      ],
      solution: "function App() {\n  return <h1>Sprout Store</h1>;\n}",
      hints: [
        "Write a normal function with a capitalized name and return JSX.",
        "Define `function App()` and return `<h1>Sprout Store</h1>`.",
      ],
      explanation:
        "The check finds the rendered heading by its role and accessible text. Styling and formatting can vary.",
    },
    project: "shop-ui",
    connection:
      "This is the first visible piece of the shop. The calculations from JavaScript remain ordinary functions.",
    recap: [
      "A component describes visible UI with returned JSX.",
      "The playground supplies the rendering setup. console.log and rendering do different jobs.",
    ],
  },
  {
    id: "react-jsx",
    title: "Put JavaScript values into JSX",
    minutes: 25,
    goal: "Display a product value and a calculated total in markup.",
    prerequisites: ["react-components", "js-operators"],
    why: "A product card must display current data, not only hard-coded words.",
    explanation: [
      "JSX can contain literal text or JavaScript expressions. Curly braces switch from markup into an expression: <h1>{name}</h1> displays the value stored in name. Without braces, name would be the word ‘name’.",
      "Return one parent element. A div is a general container for several elements; a fragment, written <>...</>, groups elements without adding a container. p describes a paragraph. Close every tag, including <input /> for an element without children.",
      "JSX attributes pass values to elements. Use className for a CSS class and htmlFor to connect a label to an input ID. String attributes use quotes; expressions use braces. A statement such as if belongs before the return, while an expression that produces a value can go inside braces.",
    ],
    code: 'function App() {\n  const name = "Tea";\n  const total = 4 * 2;\n  return (\n    <div>\n      <h1>{name}</h1>\n      <p>Total: {total}</p>\n    </div>\n  );\n}',
    walkthrough: [
      [
        1,
        3,
        "Define App, then calculate ordinary JavaScript values before returning UI.",
      ],
      [
        4,
        5,
        "Parentheses group the multi-line return expression. div is the single parent.",
      ],
      [6, 6, "Braces read the stored name inside the heading."],
      [
        7,
        7,
        "The paragraph combines literal text Total: with the value in total.",
      ],
      [8, 10, "Close the container, return parentheses, and function."],
    ],
    visible:
      "A Tea heading and a paragraph Total: 8 appear. The total is calculated with JavaScript before React displays it.",
    exampleChecks: [
      check("Product data and total", text("Tea"), text("Total: 8")),
    ],
    prediction: {
      code: "function App() {\n  const price = 5;\n  return <p>Total: {price * 3}</p>;\n}",
      question: "What complete paragraph will the preview display?",
      answer: ["Total: 15"],
      explanation:
        "The expression inside braces multiplies 5 by 3. JSX combines it with the literal label.",
    },
    guided: {
      goal: "Display a total of 12 from a price of 4 and quantity 3.",
      starting: "The expression currently uses quantity 2.",
      starter:
        "function App() {\n  const price = 4;\n  return <p>Total: {price * 2}</p>;\n}",
      solution:
        "function App() {\n  const price = 4;\n  return <p>Total: {price * 3}</p>;\n}",
      expected: "The paragraph says Total: 12.",
      change: "Change the multiplier in the JSX expression to 3.",
      checks: [check("Calculated paragraph", text("Total: 12"))],
      gap: {
        find: "price * 3",
        with: "0",
        instructions:
          "Fill the braces with the price-times-quantity expression.",
      },
      bug: {
        find: "{price * 3}",
        with: "price * 3",
        instructions:
          "The expression is being displayed as literal text. Put it inside JSX expression braces.",
        why: "JavaScript expressions are evaluated inside JSX braces. Without them, this is ordinary visible text.",
        fix: "Use {price * 3}.",
      },
      hints: [
        "The calculation belongs inside curly braces in the paragraph.",
        "Use `<p>Total: {price * 3}</p>`.",
      ],
      explanation:
        "React receives the expression’s result, not the expression’s source text.",
    },
    independent: {
      goal: "Show a different product and its total.",
      starting: "Coffee costs 5 and quantity is 2.",
      starter: "",
      instructions:
        "Define App. Store the product name, price, and quantity as JavaScript values. Show a Coffee heading and a paragraph Total: 10 calculated from those values.",
      expected: "A Coffee heading and Total: 10 paragraph.",
      constraints:
        "Use braces to display stored data. Use one parent element or a fragment.",
      checks: [
        check(
          "Heading and calculation",
          { action: "element", role: "heading", name: "Coffee" },
          text("Total: 10"),
        ),
      ],
      solution:
        'function App() {\n  const name = "Coffee";\n  const price = 5;\n  const quantity = 2;\n  return <div><h1>{name}</h1><p>Total: {price * quantity}</p></div>;\n}',
      hints: [
        "Calculate with JavaScript, then place those expressions in JSX.",
        "Use a div around an h1 with {name} and a p with {price * quantity}.",
      ],
      explanation:
        "The check verifies visible values. Your own explanation should distinguish the calculation from its display.",
    },
    project: "shop-ui",
    connection:
      "Your shop card can display a name and a price-based calculation from the same data model.",
    recap: [
      "JSX braces evaluate expressions; text outside braces stays literal.",
      "Use a shared parent, close tags, and keep JavaScript statements outside the markup expression.",
    ],
  },
  {
    id: "react-props",
    title: "Reuse a product card with props",
    minutes: 30,
    goal: "Give different data to repeated instances of one component.",
    prerequisites: ["react-jsx", "js-destructuring"],
    why: "A shop should reuse one product card rather than duplicate its markup for every product.",
    explanation: [
      "Props are a component’s inputs. A parent component passes them through JSX attributes. The child receives a props object. ProductCard({ name }) uses object destructuring to read its name input.",
      "Use quotes for a text prop and braces for a JavaScript value: price={4} passes a number. A capitalized component tag tells React to use your function rather than a built-in HTML element.",
      "Treat props as read-only. A child describes what it was given. When it needs to request a change, the parent can pass a callback; the events and shared-state lessons will connect that pattern.",
    ],
    code: 'function ProductCard({ name }) {\n  return <h2>{name}</h2>;\n}\nfunction App() {\n  return <div><ProductCard name="Tea" /><ProductCard name="Coffee" /></div>;\n}',
    walkthrough: [
      [1, 1, "Destructure name from the props object received by ProductCard."],
      [2, 3, "Return a heading containing that input."],
      [
        4,
        5,
        "App renders two instances with different name props. Self-closing component tags have a slash before >.",
      ],
      [6, 6, "Close App. Each card receives its own input."],
    ],
    visible: "The preview shows two headings: Tea and Coffee.",
    exampleChecks: [
      check(
        "Two reusable cards",
        { action: "element", role: "heading", name: "Tea" },
        { action: "element", role: "heading", name: "Coffee" },
      ),
    ],
    prediction: {
      code: 'function ProductCard({ name }) { return <h2>{name}</h2>; }\nfunction App() { return <ProductCard name="Milk" />; }',
      question: "What does this card’s heading display?",
      answer: ["Milk"],
      explanation:
        "The parent supplies Milk as the name prop; the child reads and displays it.",
    },
    guided: {
      goal: "Reuse ProductCard for Milk.",
      starting: "The card currently receives Tea.",
      starter:
        'function ProductCard({ name }) { return <h2>{name}</h2>; }\nfunction App() { return <ProductCard name="Tea" />; }',
      solution:
        'function ProductCard({ name }) { return <h2>{name}</h2>; }\nfunction App() { return <ProductCard name="Milk" />; }',
      expected: "A heading Milk.",
      change: "Change the parent’s name prop to Milk.",
      checks: [
        check("Milk card", {
          action: "element",
          role: "heading",
          name: "Milk",
        }),
      ],
      gap: {
        find: "{name}</h2>",
        with: "</h2>",
        instructions:
          "Display the received name prop inside the child heading.",
      },
      bug: {
        find: 'name="Milk"',
        with: 'title="Milk"',
        instructions:
          "The parent passes title but the child reads name. Make the input names agree.",
        why: "The props object has a title field while the destructuring asks for name. That missing name becomes undefined.",
        fix: 'Pass name="Milk", or consistently change the child’s input contract.',
      },
      hints: [
        "The parent’s attribute name must match the property the child reads.",
        "Pass name and display {name}.",
      ],
      explanation: "A reusable component has a clear input contract.",
    },
    independent: {
      goal: "Create two cards that also show a price.",
      starting: "Tea costs 4. Coffee costs 5.",
      starter: "",
      instructions:
        "Define ProductCard with name and price props. Render Tea and Coffee from App, with paragraphs Price: 4 and Price: 5.",
      expected:
        "Both product names and their corresponding price labels appear.",
      constraints:
        "Use numeric price props and treat props as read-only. The checks inspect rendered content, not component names in source.",
      checks: [
        check(
          "Both product inputs are displayed",
          text("Tea"),
          text("Price: 4"),
          text("Coffee"),
          text("Price: 5"),
        ),
      ],
      solution:
        'function ProductCard({ name, price }) {\n  return <section><h2>{name}</h2><p>Price: {price}</p></section>;\n}\nfunction App() {\n  return <div><ProductCard name="Tea" price={4} /><ProductCard name="Coffee" price={5} /></div>;\n}',
      hints: [
        "Give the child two inputs, then use it twice with different values.",
        "Destructure name and price. Pass price={4} and price={5} from the parent.",
      ],
      explanation:
        "The same markup can describe different products. The checks confirm the output, while reuse is a design choice to explain in your recap.",
    },
    project: "shop-ui",
    connection:
      "Each product in your shop can now use one reusable card component.",
    recap: [
      "Props are parent-supplied inputs.",
      "The child reads them without mutating them; different instances can receive different values.",
    ],
  },
  {
    id: "react-events",
    title: "Run a function when a button is clicked",
    minutes: 25,
    goal: "Pass an event handler without calling it during rendering.",
    prerequisites: ["react-props", "js-arrow-functions"],
    why: "A product card needs a way for a person to request an action such as adding an item.",
    explanation: [
      "An event is something that happens, such as a click. An event handler is a function React calls in response. Pass the function to the onClick prop of a real button.",
      "onClick={addTea} passes a function value. onClick={addTea()} calls it immediately while rendering, which is too early. An arrow function such as onClick={() => addTea()} also passes a function; its body runs later.",
      "This lesson logs an action but does not yet update the visible page. In the React preview, open Preview console beneath the screen to see the message after clicking. State, taught next, is what lets the component remember a change and display it.",
    ],
    code: 'function App() {\n  function addTea() {\n    console.log("Added Tea");\n  }\n  return <button onClick={addTea}>Add Tea</button>;\n}',
    walkthrough: [
      [1, 4, "Define a handler inside App. Defining it does not run the log."],
      [
        5,
        5,
        "Pass addTea without parentheses. A real button supports keyboard activation as well as clicks.",
      ],
      [
        6,
        6,
        "The preview renders the button. React calls the handler only after an interaction.",
      ],
    ],
    visible:
      "A button Add Tea appears. Clicking it prints Added Tea in Preview console; the button’s text does not change.",
    exampleChecks: [
      check(
        "The event happens after interaction",
        { action: "noLog", value: "Added Tea" },
        click("Add Tea"),
        { action: "log", value: "Added Tea" },
      ),
    ],
    prediction: {
      code: 'function App() {\n  function report() { console.log("Added Coffee"); }\n  return <button onClick={report}>Add Coffee</button>;\n}',
      question: "What message will Preview console receive after one click?",
      answer: ["Added Coffee"],
      explanation:
        "The handler runs on the click and prints its message. It is not called during the render.",
    },
    guided: {
      goal: "Log Added Coffee only after clicking Add Coffee.",
      starting: "Both the button and handler message currently use Tea.",
      starter:
        'function App() {\n  function add() { console.log("Added Tea"); }\n  return <button onClick={add}>Add Tea</button>;\n}',
      solution:
        'function App() {\n  function add() { console.log("Added Coffee"); }\n  return <button onClick={add}>Add Coffee</button>;\n}',
      expected: "No initial Added Coffee log; one click adds that message.",
      change: "Change both displayed product references from Tea to Coffee.",
      checks: [
        check(
          "Handler timing",
          { action: "noLog", value: "Added Coffee" },
          click("Add Coffee"),
          { action: "log", value: "Added Coffee" },
        ),
      ],
      gap: {
        find: "onClick={add}",
        with: "onClick={undefined}",
        instructions: "Connect the defined add handler to onClick.",
      },
      bug: {
        find: "onClick={add}",
        with: "onClick={add()}",
        instructions:
          "The handler runs while rendering. Pass the function itself instead.",
        why: "Parentheses call add now and pass its returned undefined as the handler.",
        fix: "Write onClick={add}, without calling it.",
      },
      hints: [
        "The event prop needs a callable value.",
        "Use onClick={add}; leave the call to React.",
      ],
      explanation:
        "The checks confirm no initial log and then a log after a real button click.",
    },
    independent: {
      goal: "Log an order request after interaction.",
      starting: "The preview should initially show one button.",
      starter: "",
      instructions:
        "Define App with a button Place order. Clicking it must log Order requested. Do not log during rendering.",
      expected:
        "No Order requested log initially. Each click logs Order requested.",
      constraints:
        "Use a real button and an event handler. This task does not need state.",
      checks: [
        check(
          "A request is event-driven",
          { action: "noLog", value: "Order requested" },
          click("Place order"),
          { action: "logCount", value: "Order requested", count: 1 },
          click("Place order"),
          { action: "logCount", value: "Order requested", count: 2 },
        ),
      ],
      solution:
        'function App() {\n  function placeOrder() { console.log("Order requested"); }\n  return <button onClick={placeOrder}>Place order</button>;\n}',
      hints: [
        "Keep the log inside a function that waits for the click.",
        "Define placeOrder, then pass onClick={placeOrder}.",
      ],
      explanation:
        "The test performs two clicks and counts logs, so a message printed only during rendering does not pass.",
    },
    project: "shop-ui",
    connection:
      "The Add button can now request an action. The next lesson will make a quantity visibly change.",
    recap: [
      "A handler runs after an event; defining or passing it does not call it.",
      "Logging an action is different from storing state and updating the screen.",
    ],
  },
  {
    id: "react-state",
    title: "Remember and display a changing quantity",
    minutes: 35,
    goal: "Use state to display a quantity that changes after a button click.",
    prerequisites: ["react-events", "js-destructuring"],
    why: "A shop’s quantity must stay remembered between renders, and changes must appear on screen.",
    explanation: [
      "A render is React asking a component what the interface should look like now. An ordinary variable inside a function is not persistent component memory. State is React-managed information that can survive between renders.",
      "React.useState(0) returns an array containing the current value and a setter function. Array destructuring gives them names: [quantity, setQuantity]. The initial value 0 is used for the first render.",
      "Calling the setter requests a new render. Use setQuantity((previous) => previous + 1) when the next value depends on the previous one. The updater receives the pending state and returns the next state. It does not change the quantity snapshot in the handler that is currently running. Call hooks such as useState at the top level of a component, not inside conditions or loops.",
    ],
    code: "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  function addOne() {\n    setQuantity((previous) => previous + 1);\n  }\n  return <div><p>Quantity: {quantity}</p><button onClick={addOne}>Add one</button></div>;\n}",
    walkthrough: [
      [
        1,
        2,
        "Ask React for state initialized to zero. Destructure its current value and setter from the returned array.",
      ],
      [
        3,
        5,
        "The event handler passes an updater function. It calculates the next number from the previous number.",
      ],
      [
        6,
        6,
        "Display current state in JSX and connect the button to the handler.",
      ],
      [
        7,
        7,
        "After each click, React calls App again with the updated quantity.",
      ],
    ],
    visible:
      "The page starts at Quantity: 0. Each Add one click increases the displayed quantity by one.",
    exampleChecks: [
      check(
        "A stateful quantity",
        text("Quantity: 0"),
        click("Add one"),
        text("Quantity: 1"),
        click("Add one"),
        text("Quantity: 2"),
      ),
    ],
    prediction: {
      code: "function App() {\n  const [quantity, setQuantity] = React.useState(2);\n  return <button onClick={() => setQuantity((q) => q + 1)}>Quantity: {quantity}</button>;\n}",
      question: "What complete button text appears after one click?",
      answer: ["Quantity: 3"],
      explanation:
        "The initial state is 2. One updater adds 1, so the next render displays 3.",
    },
    guided: {
      goal: "Start at Quantity: 2, then increase to 3 with Add one.",
      starting: "The state currently starts at zero.",
      starter:
        "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><button onClick={() => setQuantity((q) => q + 1)}>Add one</button></div>;\n}",
      solution:
        "function App() {\n  const [quantity, setQuantity] = React.useState(2);\n  return <div><p>Quantity: {quantity}</p><button onClick={() => setQuantity((q) => q + 1)}>Add one</button></div>;\n}",
      expected: "Quantity: 2 initially; Quantity: 3 after one click.",
      change: "Change the initial state from 0 to 2.",
      checks: [
        check(
          "Initial value and update",
          text("Quantity: 2"),
          click("Add one"),
          text("Quantity: 3"),
        ),
      ],
      gap: {
        find: "q + 1",
        with: "q",
        instructions:
          "Return the next quantity from the updater instead of keeping it unchanged.",
      },
      bug: {
        find: "onClick={() => setQuantity((q) => q + 1)}",
        with: "onClick={() => { quantity = quantity + 1; }}",
        instructions:
          "Direct assignment does not request a render and cannot reassign this const binding. Use the state setter.",
        why: "React state must be updated through its setter. Changing a local binding is not a state update.",
        fix: "Call setQuantity with an updater function.",
      },
      hints: [
        "A setter tells React to render with the next state.",
        "Use `setQuantity((q) => q + 1)` in the handler.",
      ],
      explanation:
        "Both the initial and post-click states are checked in the actual preview.",
    },
    independent: {
      goal: "Build a quantity control with reset.",
      starting: "The quantity starts at zero.",
      starter: "",
      instructions:
        "Display Quantity: 0. Add a button Add one that increments on each click and a Reset button that sets it back to zero.",
      expected:
        "Two Add one clicks show Quantity: 2. Reset shows Quantity: 0. Another Add one shows Quantity: 1.",
      constraints:
        "Use component state and real buttons. Keep the controls usable repeatedly.",
      checks: [
        check(
          "Increment, reset, and reuse",
          text("Quantity: 0"),
          click("Add one"),
          click("Add one"),
          text("Quantity: 2"),
          click("Reset"),
          text("Quantity: 0"),
          click("Add one"),
          text("Quantity: 1"),
        ),
      ],
      solution:
        "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div>\n    <p>Quantity: {quantity}</p>\n    <button onClick={() => setQuantity((q) => q + 1)}>Add one</button>\n    <button onClick={() => setQuantity(0)}>Reset</button>\n  </div>;\n}",
      hints: [
        "One setter can receive an updater for incrementing or a direct zero for reset.",
        "Use setQuantity(q => q + 1) for Add one and setQuantity(0) for Reset.",
      ],
      explanation:
        "The check follows a sequence of real interactions instead of accepting a static Quantity: 2 paragraph.",
    },
    project: "shop-ui",
    connection:
      "Your shop can now remember how many items the user wants and recalculate a displayed total from that state.",
    recap: [
      "State survives renders; the setter requests a new one.",
      "Derive the next state from the previous value with an updater when needed.",
    ],
  },
  {
    id: "react-conditions",
    title: "Show available, empty, or sold-out content",
    minutes: 25,
    goal: "Choose visible content from an application value.",
    prerequisites: ["react-state", "js-conditions"],
    why: "A shop should explain an empty cart or an unavailable product instead of displaying a broken screen.",
    explanation: [
      "React does not need a special condition language. An if statement before return can return different JSX. This uses the same JavaScript decisions you already know.",
      "Inside JSX, the conditional expression condition ? valueIfTrue : valueIfFalse chooses one value. The question mark separates the condition from the true result; the colon introduces the false result. Unlike an if statement, it is an expression, so it can appear inside braces.",
      "For a single optional element you may see condition && <p>...</p>. Prefer an explicit boolean condition such as quantity > 0. Writing quantity && ... can display 0 when quantity is zero.",
    ],
    code: 'function App() {\n  const stock = 0;\n  return <p>{stock > 0 ? "Available" : "Sold out"}</p>;\n}',
    walkthrough: [
      [1, 2, "Define the component and numeric stock."],
      [
        3,
        3,
        "Evaluate the comparison. The ? branch is used for true; the : branch for false. With zero stock, the paragraph says Sold out.",
      ],
      [
        4,
        4,
        "Close App. This content is calculated from stock, not stored as a second state value.",
      ],
    ],
    visible: "The preview shows Sold out, because stock is zero.",
    exampleChecks: [check("A useful unavailable state", text("Sold out"))],
    prediction: {
      code: 'function App() {\n  const quantity = 2;\n  return <p>{quantity === 0 ? "Cart is empty" : "Ready to order"}</p>;\n}',
      question: "Which message appears?",
      answer: ["Ready to order"],
      explanation:
        "quantity === 0 is false when quantity is 2, so the second expression is displayed.",
    },
    guided: {
      goal: "Show Available for stock 3.",
      starting: "Stock is currently zero.",
      starter:
        'function App() {\n  const stock = 0;\n  return <p>{stock > 0 ? "Available" : "Sold out"}</p>;\n}',
      solution:
        'function App() {\n  const stock = 3;\n  return <p>{stock > 0 ? "Available" : "Sold out"}</p>;\n}',
      expected: "The page says Available.",
      change: "Change stock from 0 to 3.",
      checks: [
        check("An available product", text("Available"), {
          action: "noText",
          value: "Sold out",
        }),
      ],
      gap: {
        find: "stock > 0",
        with: "false",
        instructions: "Replace false with the stock comparison.",
      },
      bug: {
        find: '"Available" : "Sold out"',
        with: '"Sold out" : "Available"',
        instructions:
          "The two messages are reversed. Put the available message in the true branch.",
        why: "The first value after ? is chosen for a true comparison. The second is the fallback.",
        fix: "Use stock > 0 ? Available : Sold out, with quoted text values.",
      },
      hints: [
        "Read the expression as ‘if this is true, choose the first result’.",
        "The true result after ? should be Available.",
      ],
      explanation:
        "The same data rule can produce a different visible state without duplicating state.",
    },
    independent: {
      goal: "Show a useful empty cart, then recover from it.",
      starting: "The cart quantity starts at zero.",
      starter: "",
      instructions:
        "Display Cart is empty at zero. Add an Add one button. After an addition, display Ready to order instead. Add a Reset button to return to the empty state.",
      expected: "Empty initially; ready after Add one; empty after Reset.",
      constraints:
        "Derive the message from the quantity. Do not store a separate message state.",
      checks: [
        check(
          "Empty and non-empty transitions",
          text("Cart is empty"),
          click("Add one"),
          text("Ready to order"),
          { action: "noText", value: "Cart is empty" },
          click("Reset"),
          text("Cart is empty"),
        ),
      ],
      solution:
        'function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div>\n    <p>{quantity === 0 ? "Cart is empty" : "Ready to order"}</p>\n    <button onClick={() => setQuantity((q) => q + 1)}>Add one</button>\n    <button onClick={() => setQuantity(0)}>Reset</button>\n  </div>;\n}',
      hints: [
        "Keep quantity in state and calculate the message while rendering.",
        "Use a conditional expression based on quantity === 0.",
      ],
      explanation:
        "The checks verify both directions of the transition so the empty state cannot remain stuck.",
    },
    project: "shop-ui",
    connection:
      "Your cart can now explain why there is no order to place and update that explanation after an action.",
    recap: [
      "Use ordinary JavaScript to choose JSX or text.",
      "Derive a message from state instead of keeping two values that can disagree.",
    ],
    knowledge: {
      question:
        'In condition ? "Yes" : "No", which text is chosen when condition is false?',
      options: ["Yes", "No", "Both"],
      answer: 1,
      explanation: "The expression after the colon is the false branch.",
    },
  },
  {
    id: "react-updates",
    title: "Update object and array state without mutation",
    minutes: 30,
    goal: "Create a new state value instead of changing the object already stored in state.",
    prerequisites: ["react-conditions", "js-destructuring", "js-array-methods"],
    why: "A cart contains structured data. Predictable updates need to preserve earlier state snapshots.",
    explanation: [
      "Treat objects and arrays in state as read-only snapshots. Create a new object or array and give it to the setter. Mutating the existing object can leave the screen unchanged and damage the meaning of previous renders.",
      "Spread makes an object copy. For a change based on current state, pass an updater: setProduct(previous => ({ ...previous, quantity: previous.quantity + 1 })). The parentheses around the object expression let the arrow return an object rather than start a block.",
      "For arrays, [...previous, newItem] creates a new array with an added item. map can replace one item, and filter can remove one. Copy every nested level that changes; a shallow spread does not copy nested objects automatically.",
    ],
    code: 'function App() {\n  const [product, setProduct] = React.useState({ name: "Tea", quantity: 0 });\n  function add() {\n    setProduct((previous) => ({ ...previous, quantity: previous.quantity + 1 }));\n  }\n  return <div><p>{product.name}: {product.quantity}</p><button onClick={add}>Add Tea</button></div>;\n}',
    walkthrough: [
      [1, 2, "Store one object in state, containing a name and quantity."],
      [
        3,
        5,
        "The updater returns a new object. Spread copies the old fields, then quantity is replaced. Parentheses make the object the arrow’s returned expression.",
      ],
      [
        6,
        6,
        "Read both fields for the visible paragraph and connect the button.",
      ],
      [7, 7, "React renders the new object after the setter runs."],
    ],
    visible:
      "Tea: 0 initially. Each Add Tea click increases the quantity while preserving the product name.",
    exampleChecks: [
      check(
        "An immutable object update",
        text("Tea: 0"),
        click("Add Tea"),
        text("Tea: 1"),
      ),
    ],
    prediction: {
      code: 'const oldProduct = { name: "Tea", quantity: 1 };\nconst next = { ...oldProduct, quantity: 2 };\nconsole.log(oldProduct.quantity);\nconsole.log(next.quantity);',
      question:
        "Predict the two JavaScript console results. This snippet demonstrates the update outside React.",
      answer: [1, 2],
      explanation:
        "The copy has quantity 2. The original object’s top-level quantity remains 1.",
    },
    guided: {
      goal: "Start Coffee at zero, then increase its quantity while keeping its name.",
      starting: "The state object currently describes Tea.",
      starter:
        'function App() {\n  const [product, setProduct] = React.useState({ name: "Tea", quantity: 0 });\n  return <div><p>{product.name}: {product.quantity}</p><button onClick={() => setProduct((p) => ({ ...p, quantity: p.quantity + 1 }))}>Add one</button></div>;\n}',
      solution:
        'function App() {\n  const [product, setProduct] = React.useState({ name: "Coffee", quantity: 0 });\n  return <div><p>{product.name}: {product.quantity}</p><button onClick={() => setProduct((p) => ({ ...p, quantity: p.quantity + 1 }))}>Add one</button></div>;\n}',
      expected: "Coffee: 0 initially and Coffee: 1 after Add one.",
      change:
        "Change the initial name to Coffee without changing the update rule.",
      checks: [
        check(
          "Name survives quantity updates",
          text("Coffee: 0"),
          click("Add one"),
          text("Coffee: 1"),
        ),
      ],
      gap: {
        find: "p.quantity + 1",
        with: "p.quantity",
        instructions: "Calculate the next quantity inside the returned object.",
      },
      bug: {
        find: "{ ...p, quantity: p.quantity + 1 }",
        with: "{ quantity: p.quantity + 1 }",
        instructions:
          "The update discards the name. Copy the unchanged fields before replacing quantity.",
        why: "The setter replaces the entire object. It does not automatically merge missing properties.",
        fix: "Spread p into the returned object before its updated quantity field.",
      },
      hints: [
        "A state setter for an object receives the whole next object.",
        "Return `{ ...p, quantity: p.quantity + 1 }`.",
      ],
      explanation:
        "The test checks that the name still appears after a state update.",
    },
    independent: {
      goal: "Add and remove items using new arrays.",
      starting: "The cart starts as an empty array.",
      starter: "",
      instructions:
        "Show Items: followed by the array length. Add an Add Tea button that appends Tea each time. Add Clear cart that replaces the array with an empty array.",
      expected:
        "Items: 0 initially; two additions show Items: 2; Clear cart returns to Items: 0.",
      constraints:
        "Use array state, a new array for addition, and an empty array for clearing. The check verifies the visible behaviour, not the implementation mechanism.",
      checks: [
        check(
          "Collection updates",
          text("Items: 0"),
          click("Add Tea"),
          click("Add Tea"),
          text("Items: 2"),
          click("Clear cart"),
          text("Items: 0"),
          click("Add Tea"),
          text("Items: 1"),
        ),
      ],
      solution:
        'function App() {\n  const [items, setItems] = React.useState([]);\n  return <div>\n    <p>Items: {items.length}</p>\n    <button onClick={() => setItems((old) => [...old, "Tea"])}>Add Tea</button>\n    <button onClick={() => setItems([])}>Clear cart</button>\n  </div>;\n}',
      hints: [
        "Array spread expands the old items into a new array.",
        'Use `setItems((old) => [...old, "Tea"])` and `setItems([])`.',
      ],
      explanation:
        "The sequence checks additions, clearing, and another addition. Review the suggested immutable update pattern separately.",
    },
    project: "shop-ui",
    connection:
      "Cart data can now grow and reset without changing a previous state object in place.",
    recap: [
      "State setters replace object and array values; they do not merge them.",
      "Copy unchanged fields, then update the part that changed.",
    ],
    knowledge: {
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
  },
  {
    id: "react-lists",
    title: "Render a product collection with stable keys",
    minutes: 30,
    goal: "Turn product data into a visible list and preserve item identity.",
    prerequisites: ["react-updates", "react-props", "js-array-methods"],
    why: "The shop needs one visible entry for each product in its data array.",
    explanation: [
      "map returns a new array. In React, its callback can return JSX for each data item. ul describes an unordered list, and li describes an item inside that list.",
      "Each item returned by the map needs a key that is stable and unique among its siblings. Use an ID from the data. A key helps React match items when their order or membership changes. It is not a visible label and is not passed to a child as an ordinary prop.",
      "Do not create random keys during rendering. An array index is risky when items are added, removed, or reordered because the same position can refer to a different item. For an empty collection, render a helpful empty state.",
    ],
    code: 'function App() {\n  const products = [{ id: "tea", name: "Tea" }, { id: "coffee", name: "Coffee" }];\n  return <ul>\n    {products.map((product) => <li key={product.id}>{product.name}</li>)}\n  </ul>;\n}',
    walkthrough: [
      [1, 2, "The array holds product objects with stable IDs and names."],
      [3, 3, "Return a list container."],
      [
        4,
        4,
        "Evaluate map inside JSX braces. Each callback returns one li with a stable key and visible name.",
      ],
      [
        5,
        6,
        "Close the list and component. React renders the returned array of items.",
      ],
    ],
    visible: "A list contains Tea and Coffee in the order of the data array.",
    exampleChecks: [
      check(
        "Two visible products",
        { action: "count", selector: "li", value: 2 },
        text("Tea"),
        text("Coffee"),
      ),
    ],
    prediction: {
      code: 'function App() {\n  const names = ["Milk", "Tea"];\n  return <ul>{names.map((name) => <li key={name}>{name}</li>)}</ul>;\n}',
      question: "What two item names appear, in order?",
      answer: ["Milk", "Tea"],
      explanation:
        "map preserves the source array’s order. The names happen to be unique in this fixed example.",
    },
    guided: {
      goal: "Show Milk and Tea as two list items.",
      starting: "The first product name currently says Coffee.",
      starter:
        'function App() {\n  const products = [{ id: "milk", name: "Coffee" }, { id: "tea", name: "Tea" }];\n  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}',
      solution:
        'function App() {\n  const products = [{ id: "milk", name: "Milk" }, { id: "tea", name: "Tea" }];\n  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}',
      expected: "Exactly two li items, with Milk followed by Tea.",
      change: "Change the first product’s name to Milk. Keep its stable ID.",
      checks: [
        check("Mapped items", {
          action: "texts",
          selector: "li",
          value: ["Milk", "Tea"],
        }),
      ],
      gap: {
        find: "{p.name}</li>",
        with: "</li>",
        instructions:
          "Display the current mapped product’s name inside its li.",
      },
      bug: {
        find: "{p.name}</li>",
        with: "{products[0].name}</li>",
        instructions:
          "Every row reads the first product. Read the current callback item instead.",
        why: "The map callback receives a different product on each call. A fixed [0] ignores that input.",
        fix: "Display p.name, the current item.",
      },
      hints: [
        "Use the callback parameter, not a fixed array position.",
        "Each li should contain {p.name}.",
      ],
      explanation:
        "The check compares rendered item text and order, allowing different correct render implementations.",
    },
    independent: {
      goal: "Render a list that can become empty.",
      starting: "The initial products are Tea and Coffee with stable IDs.",
      starter: "",
      instructions:
        "Show both products as li items. Add Clear products. After it is clicked, display No products and remove all list items.",
      expected:
        "Two items initially; No products and zero li elements after clearing.",
      constraints:
        "Use array state and stable data IDs as keys. Keep an explicit empty state.",
      checks: [
        check(
          "List and empty state",
          { action: "texts", selector: "li", value: ["Tea", "Coffee"] },
          click("Clear products"),
          text("No products"),
          { action: "count", selector: "li", value: 0 },
        ),
      ],
      solution:
        'function App() {\n  const [products, setProducts] = React.useState([{ id: "tea", name: "Tea" }, { id: "coffee", name: "Coffee" }]);\n  return <div>\n    {products.length === 0 ? <p>No products</p> : <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>}\n    <button onClick={() => setProducts([])}>Clear products</button>\n  </div>;\n}',
      hints: [
        "Keep the products in state so the clear button can request a new render.",
        "Render a fallback when products.length === 0, otherwise map to li items.",
      ],
      explanation:
        "The automated check covers rendered content and the empty transition. A stable-key review remains part of your own code review.",
    },
    project: "shop-ui",
    connection:
      "The shop can display all products and explain an empty catalog.",
    recap: [
      "map can produce JSX for each data item.",
      "Keys represent stable identity; empty collections need useful content too.",
    ],
  },
  {
    id: "react-forms",
    title: "Read and submit a controlled input",
    minutes: 35,
    goal: "Keep an input synchronized with state and submit a useful message.",
    prerequisites: ["react-lists", "js-types"],
    why: "People need to type product searches, names, quantities, and other order details.",
    explanation: [
      "A controlled input displays its value from React state. Its onChange handler receives an event object. event.target is the element that changed, and event.target.value is its current text. The handler stores that text in state so the next render keeps the input synchronized.",
      "A visible label names the field. htmlFor on the label matches the input’s id. A placeholder is not a substitute for a label. Input text remains text, even for many number-entry flows; convert and validate it before a calculation.",
      'A form can submit through its onSubmit handler. event.preventDefault() stops the browser’s default page navigation. A button with type="submit" submits; type="button" avoids accidental submission for other actions.',
    ],
    code: 'function App() {\n  const [name, setName] = React.useState("");\n  return <div>\n    <label htmlFor="name">Your name</label>\n    <input id="name" value={name} onChange={(event) => setName(event.target.value)} />\n    <p>Hello {name}</p>\n  </div>;\n}',
    walkthrough: [
      [
        1,
        2,
        "Start text state as an empty string so the input stays controlled.",
      ],
      [3, 4, "Create a visible label and connect it to the input ID."],
      [
        5,
        5,
        "value reads state. onChange reads the input’s new text from the event and updates that same state.",
      ],
      [6, 8, "Display the state below the input. It updates as you type."],
    ],
    visible:
      "A field labeled Your name appears. Typing Sam changes the paragraph to Hello Sam.",
    exampleChecks: [
      check(
        "Typing drives the displayed value",
        fill("Your name", "Sam"),
        text("Hello Sam"),
        fill("Your name", "Alex"),
        text("Hello Alex"),
      ),
    ],
    prediction: {
      code: 'function App() {\n  const [name, setName] = React.useState("Sam");\n  return <p>Hello {name}</p>;\n}',
      question: "What paragraph appears before any interaction?",
      answer: ["Hello Sam"],
      explanation:
        "The initial state is Sam, and JSX reads that state immediately.",
    },
    guided: {
      goal: "Edit a product name and see its live preview.",
      starting: "The initial product is Tea.",
      starter:
        'function App() {\n  const [name, setName] = React.useState("Tea");\n  return <div><label htmlFor="product">Product name</label><input id="product" value={name} onChange={(e) => setName(e.target.value)} /><p>Product: {name}</p></div>;\n}',
      solution:
        'function App() {\n  const [name, setName] = React.useState("Coffee");\n  return <div><label htmlFor="product">Product name</label><input id="product" value={name} onChange={(e) => setName(e.target.value)} /><p>Product: {name}</p></div>;\n}',
      expected:
        "Coffee initially; typing Milk changes the product preview to Milk.",
      change: "Change the initial state to Coffee.",
      checks: [
        check(
          "A connected input",
          text("Product: Coffee"),
          fill("Product name", "Milk"),
          text("Product: Milk"),
        ),
      ],
      gap: {
        find: "setName(e.target.value)",
        with: "setName(name)",
        instructions:
          "Update state from the event’s new input text, not the old state.",
      },
      bug: {
        find: "value={name}",
        with: 'value="Coffee"',
        instructions:
          "The input is fixed to a literal value. Connect value to state so typing can be reflected.",
        why: "A controlled input always displays its value prop. A constant literal cannot follow the text being typed.",
        fix: "Use value={name} with the corresponding state update.",
      },
      hints: [
        "Both directions need to agree: state to input, input event back to state.",
        "Use value={name} and setName(e.target.value).",
      ],
      explanation:
        "The check changes the input value and confirms that both the input and derived paragraph can update.",
    },
    independent: {
      goal: "Submit an order note without leaving the page.",
      starting: "The note starts empty; no note has been saved yet.",
      starter: "",
      instructions:
        "Create a form with a visible Order note label, a controlled input, and a Save note submit button. On submission, display Saved: followed by the typed note.",
      expected:
        "Typing Leave at door and submitting shows Saved: Leave at door. A second submission with Ring bell updates that message.",
      constraints:
        "Use onSubmit and preventDefault. Keep saved text separate from the currently typed text.",
      checks: [
        check(
          "Submissions use current input",
          fill("Order note", "Leave at door"),
          click("Save note"),
          text("Saved: Leave at door"),
          fill("Order note", "Ring bell"),
          click("Save note"),
          text("Saved: Ring bell"),
        ),
      ],
      solution:
        'function App() {\n  const [note, setNote] = React.useState("");\n  const [saved, setSaved] = React.useState("");\n  return <form onSubmit={(event) => { event.preventDefault(); setSaved(note); }}>\n    <label htmlFor="note">Order note</label>\n    <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />\n    <button type="submit">Save note</button>\n    <p>Saved: {saved}</p>\n  </form>;\n}',
      hints: [
        "One state value holds draft text, another remembers the last submission.",
        "In onSubmit, call preventDefault and setSaved(note). Connect note to the input’s value and onChange.",
      ],
      explanation:
        "The checks submit twice, so a hard-coded saved message does not satisfy the behaviour.",
    },
    project: "shop-ui",
    connection:
      "Your shop can accept a customer note, and the same input pattern can power a product search.",
    recap: [
      "A controlled input reads state and reports changes back to that state.",
      "A label identifies the field. Form submission is a separate event from typing.",
    ],
  },
  {
    id: "react-sharing",
    title: "Give shared quantity one owner",
    minutes: 30,
    goal: "Keep two controls and a total synchronized through their common parent.",
    prerequisites: ["react-forms", "react-props", "react-state"],
    why: "The product card and cart summary must agree about how many items are selected.",
    explanation: [
      "When two components need the same value, put that state in their closest shared parent. This is called lifting state. The parent passes the current value and callbacks to its children.",
      "Data flows down through props. A child calls the supplied callback to request an update. The parent owns the update. Two copies of the same information can drift apart, so prefer one owner.",
      "A total that can be calculated from price and quantity does not need separate state. Calculate it during rendering. This separates JavaScript’s calculation from React’s work of displaying the latest value.",
    ],
    code: "function AddButton({ onAdd }) {\n  return <button onClick={onAdd}>Add one</button>;\n}\nfunction App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><p>Total: {quantity * 4}</p><AddButton onAdd={() => setQuantity((q) => q + 1)} /></div>;\n}",
    walkthrough: [
      [
        1,
        3,
        "The child receives a callback and passes it to a button. It owns no quantity state.",
      ],
      [4, 5, "App owns the one quantity value."],
      [
        6,
        6,
        "Display quantity and a calculated total. Pass a callback that asks the parent to update its state.",
      ],
      [
        7,
        7,
        "After an update, the parent renders consistent values and supplies updated props.",
      ],
    ],
    visible:
      "Quantity: 0 and Total: 0 initially. Add one changes them together to Quantity: 1 and Total: 4.",
    exampleChecks: [
      check(
        "One owner, consistent output",
        text("Quantity: 0"),
        text("Total: 0"),
        click("Add one"),
        text("Quantity: 1"),
        text("Total: 4"),
      ),
    ],
    prediction: {
      code: "function Summary({ quantity }) { return <p>Total: {quantity * 5}</p>; }\nfunction App() { return <Summary quantity={3} />; }",
      question: "What total is displayed?",
      answer: ["Total: 15"],
      explanation:
        "The child reads the parent-supplied quantity and calculates the total from it.",
    },
    guided: {
      goal: "Keep a quantity and five-per-item total in sync.",
      starting: "The total currently uses price 4.",
      starter:
        "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><p>Total: {quantity * 4}</p><button onClick={() => setQuantity((q) => q + 1)}>Add one</button></div>;\n}",
      solution:
        "function App() {\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><p>Total: {quantity * 5}</p><button onClick={() => setQuantity((q) => q + 1)}>Add one</button></div>;\n}",
      expected: "After two clicks, Quantity: 2 and Total: 10.",
      change: "Change the price used for the derived total to 5.",
      checks: [
        check(
          "Derived total follows quantity",
          click("Add one"),
          click("Add one"),
          text("Quantity: 2"),
          text("Total: 10"),
        ),
      ],
      gap: {
        find: "quantity * 5",
        with: "0",
        instructions:
          "Calculate total directly from the current quantity and price 5.",
      },
      bug: {
        find: "quantity * 5",
        with: "1 * 5",
        instructions:
          "The summary ignores changing quantity. Use the same state value as the quantity display.",
        why: "A fixed quantity of one cannot follow the selected quantity.",
        fix: "Read quantity in the total expression.",
      },
      hints: [
        "Both displayed values should read the same owner’s quantity.",
        "The total expression is quantity * 5.",
      ],
      explanation:
        "Derived values stay synchronized because they are calculated from the same render’s state.",
    },
    independent: {
      goal: "Coordinate two Add controls and one cart summary.",
      starting: "One parent owns quantity starting at zero. Each item costs 4.",
      starter: "",
      instructions:
        "Display Quantity: and Total:. Provide Add from card and Add from summary buttons. Both must add one to the same quantity.",
      expected: "Clicking each button once shows Quantity: 2 and Total: 8.",
      constraints:
        "Use one state owner. The buttons may live in separate child components or be composed directly while you practise.",
      checks: [
        check(
          "Two controls share a value",
          text("Quantity: 0"),
          click("Add from card"),
          text("Quantity: 1"),
          text("Total: 4"),
          click("Add from summary"),
          text("Quantity: 2"),
          text("Total: 8"),
          click("Add from card"),
          text("Quantity: 3"),
          text("Total: 12"),
        ),
      ],
      solution:
        'function AddControl({ label, onAdd }) { return <button onClick={onAdd}>{label}</button>; }\nfunction App() {\n  const [quantity, setQuantity] = React.useState(0);\n  function add() { setQuantity((q) => q + 1); }\n  return <div>\n    <p>Quantity: {quantity}</p><p>Total: {quantity * 4}</p>\n    <AddControl label="Add from card" onAdd={add} />\n    <AddControl label="Add from summary" onAdd={add} />\n  </div>;\n}',
      hints: [
        "Give both controls a callback that reaches the same setter.",
        "Define one add function in App and pass it as the onAdd prop to both controls.",
      ],
      explanation:
        "The test interleaves the two controls and checks the shared total after each action.",
    },
    project: "shop-ui",
    connection:
      "The product view and cart summary can now agree about an order without duplicating its state.",
    recap: [
      "Shared state belongs in the closest shared owner.",
      "Pass values down and callbacks for requested changes. Calculate values that do not need their own memory.",
    ],
  },
];
