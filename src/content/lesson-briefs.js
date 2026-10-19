// The default lesson is deliberately short. Full explanations remain available
// on demand; these summaries introduce the idea before the practical task.
export const lessonBriefs = {
  "js-welcome":
    'Your browser runs JavaScript instructions. Type code in the editor and press Run code. `console.log("Tea")` prints Tea in Output. Quotes mark text; parentheses hold what to print. The semicolon ends the instruction.',
  "js-types":
    'A value is a piece of information. `"Tea"` is text, `4` is a number, and `true` is a yes-or-no value called a boolean. `typeof` tells you which type a value has.',
  "js-variables":
    'A variable gives a value a name. `const product = "Tea"` stores text under product. Read it using that name. `const` prevents reassignment; use `let` when the name needs a different value later.',
  "js-operators":
    "Use `*` to multiply price by quantity. `+` adds numbers, but joins text when a string is involved. Store the calculation, then use `console.log` to see its result.",
  "js-comparisons":
    "A comparison asks a question and produces `true` or `false`. `>=` means greater than or equal to. `===` compares values without converting their types. Use the answer to decide what an order qualifies for.",
  "js-conditions":
    "Use `if` to run code when a condition is true. Use `else` for the other case. Parentheses hold the condition; braces group the instructions for each branch.",
  "js-functions":
    "A function is a reusable set of instructions. Parameters name its inputs. Calling the function supplies those inputs. `return` gives a result back to the caller; it does not print it.",
  "js-arrow-functions":
    "An arrow function is another way to write a function. Inputs go before `=>`. A single expression after the arrow is returned automatically. With a block in braces, write `return` explicitly.",
  "js-loops":
    "A loop repeats instructions. A `for` loop has a starting value, a condition for continuing, and an update after each repetition. Make sure the update eventually makes the condition false.",
  "js-arrays":
    "An array stores an ordered list inside square brackets. Positions start at zero: `products[0]` reads the first product. `.length` gives the number of items. A `for...of` loop visits their values.",
  "js-array-methods":
    "`map` creates a new array by transforming each item. `filter` creates a new array containing only items whose test returns true. Each receives a callback: the function to run for an item.",
  "js-objects":
    "An object groups named pieces of information, called properties. Braces contain `name: value` pairs. Read a property with a dot, such as `product.price`. An object stored in a `const` can still have its properties changed.",
  "js-destructuring":
    "Destructuring reads several values into names at once. Spread, written `...`, copies top-level entries into a new array or object. Override a copied property to make an updated version. Nested objects are still shared.",
  "js-scope":
    "Scope means where a name is available. A variable declared inside a function or a brace block with `let` or `const` stays inside it. Inner code can read names from surrounding code.",
  "js-closures":
    "A function can keep access to variables from where it was created. This is a closure. Return an inner function to give each counter its own remembered count.",
  "js-errors":
    "`throw` reports a failure and stops the current path. `try` runs code that may fail; `catch` handles the error. Use a message that explains the invalid input and what needs fixing.",
  "js-timers":
    "`setTimeout` schedules a function for later. The current code continues first. Its delay is a minimum wait, not an exact appointment. Keep the returned timer ID if you need to cancel it with `clearTimeout`.",
  "js-promises":
    "A promise represents a result that may arrive later. `.then` handles success; `.catch` handles rejection. A promise is not the result itself. Return values from callbacks when the next step needs them.",
  "js-async":
    "An `async` function returns a promise. Inside it, `await` pauses that function until a promise settles. Other code can keep running. Use `try` and `catch` to handle rejection.",
  "js-event-loop":
    "Immediate code runs first. Promise callbacks wait until the current work finishes, then run before ready timer callbacks. A zero-delay timer still waits; it does not interrupt the current instructions.",
  "js-prototypes":
    "An object can find a missing property on its prototype: another object it delegates to. Calling `product.describe()` makes `this` refer to product for that call. Shared methods avoid repeating the same function on every object.",
  "js-classes":
    "A class describes how to create related objects. `new` creates an instance; `constructor` sets it up. `extends` adds behaviour from a parent class, and `super` calls into that parent.",
  "react-components":
    "A React component is a function that describes part of a page. Return JSX: markup written inside JavaScript. Start component names with a capital letter. This playground displays the component named `App`.",
  "react-jsx":
    "JSX describes the screen. Put JavaScript values or calculations inside `{}` to display their results. Close tags, use `className` for CSS classes, and group sibling elements under one parent.",
  "react-props":
    "Props are inputs passed from a parent component to a child. Write them as JSX attributes and read them in the child’s parameter. Reuse one component with different product data; do not modify its props.",
  "react-events":
    "Pass a function to `onClick` to run it after a button click. `onClick={handleClick}` passes the function. `onClick={handleClick()}` calls it while rendering instead.",
  "react-state":
    "State is information React remembers between renders. `useState` gives the current value and a setter. Call the setter to update the screen. Use `setQuantity(q => q + 1)` when the next quantity depends on the previous one.",
  "react-conditions":
    "Use a JavaScript condition to choose JSX. A ternary chooses between two results; `&&` can show something only when a condition is true. Give empty and unavailable products a useful message.",
  "react-updates":
    "Treat existing state objects and arrays as read-only. Create a new value with spread, `map`, or `filter`, then pass it to the setter. Copy each nested level that needs changing.",
  "react-lists":
    "Use `map` to turn data into JSX items. Give each item a stable `key` from its data so React can track it. Show an empty message when no products remain.",
  "react-forms":
    "A controlled input reads `value` from state and updates it in `onChange`. Connect a visible label using `htmlFor` and `id`. Handle submission in `onSubmit`; call `event.preventDefault()` to stay on the page.",
  "react-sharing":
    "When two components need the same value, put that state in their common parent. Pass the value down and callbacks for updates. Calculate totals from that value instead of storing a second copy.",
  "react-effects":
    "An effect connects a component to external work, such as a timer. `useEffect` runs setup after rendering. Return a cleanup function to undo it when dependencies change or the component is removed.",
  "react-refs":
    "A ref holds a value without requesting a render when it changes. Attach it to an input to access that rendered element, then call `.focus()` from a handler. Use state for information displayed on screen.",
  "react-reducers":
    "A reducer calculates the next state from the current state and an action. `dispatch` sends that action. Keep the reducer free of side effects and return a new state value.",
  "react-context":
    "Context passes a shared value to descendants without threading a prop through every component. Create the context, provide its value above the readers, and read it with `useContext`.",
  "react-custom-hooks":
    "A custom hook packages reusable stateful behaviour. Its name starts with `use`, and it follows the hook rules. Each call gets its own state; sharing the hook does not share its stored values.",
  "react-performance":
    "`useMemo` can reuse a calculation when its dependencies have not changed. It is a performance tool, not a correctness requirement. Measure real slow interactions before adding it; it does not make a slow algorithm cheap.",
  "react-async-ui":
    "An async interface needs explicit loading, success, empty, and error states. Update the state as work progresses. Offer retry after failure, and prevent an outdated response from replacing newer results.",
  "react-quality":
    "Test what a person can do: find a labeled field, submit valid input, understand invalid input, and recover. A page that looks right initially can still fail during those interactions.",
  "js-pipelines":
    "`reduce` combines array items into one result. Its callback receives the accumulated result and the next item. Supply an initial value so an empty array has a defined result too.",
  "js-collections":
    "A `Set` stores unique values. A `Map` stores values under explicit keys. Use them when uniqueness or keyed lookup is the goal, rather than forcing every collection into an array or plain object.",
  "js-modules":
    "Modules let files share named values using `export` and `import`. Keep calculations independent of the interface. The runnable example checks that calculation; the expandable local step shows actual separate files.",
  "js-fetch":
    "`fetch` returns a promise for a response. Check `response.ok` before reading JSON: an HTTP error status does not automatically reject it. The runnable example uses a local response model; real requests need a reachable server.",
  "js-concurrency":
    "`Promise.all` collects independent results in input order and rejects when one fails. `Promise.allSettled` reports every outcome. Choose whether partial success is useful before choosing the method.",
  "js-debounce":
    "Debouncing waits for calls to pause before doing work. Cancel the previous timer whenever a new call arrives. Keep only the latest arguments, and expose cancellation for cleanup.",
  "js-testing":
    "A test calls code with known inputs and compares the result with its contract. Cover a normal case, a boundary, and invalid input. Passing examples support confidence; they do not prove every possible case.",
  "react-composition":
    "Composition builds an interface by putting components together. A container can receive content through `children` and actions through props. This often stays clearer than adding a switch for every variation.",
  "react-boundaries":
    "An error boundary replaces a failed descendant’s rendering with fallback UI. Keep healthy sections outside it. Boundaries do not catch every error, including ordinary event-handler and asynchronous failures.",
  "react-transitions":
    "`useDeferredValue` lets a result view lag behind an urgent input update. It does not debounce requests or remove computation. This small preview shows the value flow; measure responsiveness in a full project.",
  "react-navigation":
    "Local state can switch a visible view. Real navigation also needs URLs, refresh behaviour, history, and direct links. Practise the view model here, then use the local-project checklist to connect it to routing.",
  "react-suspense":
    "`lazy` loads a component from a promise. `Suspense` displays a fallback while supported work waits. It does not detect ordinary fetching in an effect. This preview models loading locally; real imports need separate files.",
  "react-production-review":
    "Review a complete user journey, including empty data, invalid input, errors, and recovery. Keep accessibility, tests, performance, and deployment on the full-project checklist. Passing this small preview is practice evidence, not production certification.",
};
