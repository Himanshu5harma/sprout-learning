import { valueCheck as check, outputCheck } from "../learning/lesson-model.js";

export const appliedJavaScript = [
  {
    id: "js-pipelines",
    title: "Summarize a collection with reduce",
    minutes: 30,
    goal: "Add up a collection and deliberately handle an empty collection.",
    prerequisites: ["js-array-methods", "js-objects"],
    why: "A cart needs one total calculated from many line items.",
    explanation: [
      "reduce carries one accumulated result through an array. Its callback receives the current accumulator and the current item, then returns the next accumulator. The initial value tells it where to start.",
      "For a sum, start at zero. For each price, return the previous sum plus that price. Passing an initial value also makes an empty array return zero rather than throw for lack of an initial item.",
      "Prefer clear steps over a complicated chain. A regular loop can express the same contract. Choose a readable form; do not use reduce merely to make code shorter.",
    ],
    code: "const prices = [4, 5, 3];\nconst total = prices.reduce((sum, price) => sum + price, 0);\nconsole.log(total);",
    walkthrough: [
      [1, 1, "Create the numeric input collection."],
      [
        2,
        2,
        "Start sum at 0. The callback returns 4, then 9, then 12 as it visits the prices. The 0 after the callback is the initial accumulator.",
      ],
      [3, 3, "Print the final returned total, 12."],
    ],
    output: [12],
    prediction: {
      code: "console.log([].reduce((sum, price) => sum + price, 0));",
      question: "What does the empty collection return and print?",
      answer: [0],
      explanation:
        "No callback runs. reduce returns its provided initial value, zero.",
    },
    guided: {
      goal: "Include a fourth price of 2 in the sum.",
      starting: "Prices are 4, 5, and 3.",
      starter:
        "const prices = [4, 5, 3];\nconsole.log(prices.reduce((sum, price) => sum + price, 0));",
      solution:
        "const prices = [4, 5, 3, 2];\nconsole.log(prices.reduce((sum, price) => sum + price, 0));",
      output: [14],
      change: "Add the price 2 to the input array.",
      gap: {
        find: "sum + price",
        with: "sum",
        instructions: "Return the accumulator plus the current price.",
      },
      bug: {
        find: "sum + price",
        with: "price",
        instructions:
          "The callback discards the previous total. Include the accumulator.",
        why: "Returning only the current price replaces all previous work; the final result is only the last price.",
        fix: "Return sum + price.",
      },
      hints: [
        "Each callback must carry previous work into the next result.",
        "Add the current price to sum and return that new sum.",
      ],
      explanation:
        "The same reducer handles any number of prices because it accumulates rather than replaces the result.",
    },
    independent: {
      goal: "Calculate a cart total from product objects.",
      starting: "Each item has numeric price and quantity fields.",
      starter: "",
      instructions:
        "Define cartTotal(items). Return the sum of each item’s price multiplied by its quantity. Return 0 for an empty cart.",
      expected:
        "A cart with 4×2 and 5×1 returns 13. An empty cart returns 0. Zero-quantity items contribute 0.",
      constraints:
        "Do not mutate the array or its objects. reduce or a loop is accepted.",
      checks: [
        check(
          "Multiple products",
          "cartTotal([{price:4,quantity:2},{price:5,quantity:1}])",
          13,
          "Add each line total, not only each price.",
        ),
        check(
          "Empty cart",
          "cartTotal([])",
          0,
          "Provide a starting total of zero.",
        ),
        check(
          "Zero quantity",
          "cartTotal([{price:9,quantity:0}])",
          0,
          "Multiply by quantity before adding.",
        ),
        check(
          "Preserves input",
          "(() => { const items = [{price:2,quantity:3}]; cartTotal(items); return items; })()",
          [{ price: 2, quantity: 3 }],
          "Read the data without changing its fields.",
        ),
      ],
      solution:
        "function cartTotal(items) {\n  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n}",
      hints: [
        "Calculate one line’s contribution, then accumulate those contributions.",
        "The callback can return sum + item.price * item.quantity, starting from 0.",
      ],
      explanation:
        "The checks cover multiple products, an empty cart, zero quantity, and mutation. The implementation can use a loop instead.",
    },
    project: "shop-logic",
    connection:
      "This completes the central calculation used by the connected cart project.",
    recap: [
      "reduce returns an accumulated result.",
      "An explicit initial value defines the empty-array case.",
    ],
  },
  {
    id: "js-collections",
    title: "Choose Set for uniqueness and Map for lookups",
    minutes: 30,
    goal: "Remove duplicates and store values under explicit keys.",
    prerequisites: ["js-pipelines"],
    why: "A shop may need a unique category list and quick product lookups by ID.",
    explanation: [
      "Set is a collection that keeps each value once. new Set(array) collects unique entries from the array. Spreading the Set into brackets converts its entries back to an array in insertion order.",
      "Map stores key-value pairs. new Map() creates one; set(key, value) adds or replaces an entry; get(key) reads it; has(key) checks whether it exists. Map can use keys other than strings.",
      "Uniqueness for objects is by identity, not by comparing all their fields. Two separate objects with the same name are still distinct Set entries. Choose the data structure for the operation you actually need.",
    ],
    code: 'const categories = ["Drink", "Food", "Drink"];\nconst unique = [...new Set(categories)];\nconst prices = new Map();\nprices.set("tea", 4);\nconsole.log(unique);\nconsole.log(prices.get("tea"));',
    walkthrough: [
      [
        1,
        2,
        "Create a Set from the values, then spread its unique entries into a new array.",
      ],
      [3, 4, "Create an empty Map and associate the key tea with price 4."],
      [5, 6, "Print the unique categories and the price read through its key."],
    ],
    output: [["Drink", "Food"], 4],
    prediction: {
      code: 'const prices = new Map();\nprices.set("tea", 4);\nprices.set("tea", 5);\nconsole.log(prices.get("tea"));',
      question:
        "What price is stored under the same key after the replacement?",
      answer: [5],
      explanation:
        "Setting the same Map key replaces that entry’s previous value.",
    },
    guided: {
      goal: "Store a replacement Tea price of 6.",
      starting: "The map currently holds price 4.",
      starter:
        'const prices = new Map();\nprices.set("tea", 4);\nconsole.log(prices.get("tea"));',
      solution:
        'const prices = new Map();\nprices.set("tea", 6);\nconsole.log(prices.get("tea"));',
      output: [6],
      change: "Change the stored price to 6.",
      gap: {
        find: 'prices.get("tea")',
        with: "0",
        instructions: "Read the value associated with the tea key.",
      },
      bug: {
        find: 'prices.get("tea")',
        with: 'prices["tea"]',
        instructions:
          "Bracket notation reads an ordinary object property, not a Map entry. Use the Map reader.",
        why: "Map entries are accessed with get; an unrelated property tea was never assigned on this Map object.",
        fix: 'Use prices.get("tea").',
      },
      hints: [
        "Map’s entry interface is set and get.",
        'Read the exact key with get("tea").',
      ],
      explanation:
        "A keyed collection has its own API rather than borrowing every ordinary object operation.",
    },
    independent: {
      goal: "Return a unique category list.",
      starting:
        "The caller supplies an array of category strings, which can repeat.",
      starter: "",
      instructions:
        "Define uniqueCategories(categories). Return a new array containing each string once, in first-seen order.",
      expected:
        'uniqueCategories(["Drink","Food","Drink"]) returns ["Drink","Food"]. Empty input returns [].',
      constraints:
        "Set or another correct implementation is accepted. Leave the input array unchanged.",
      checks: [
        check(
          "Removes repeated categories",
          'uniqueCategories(["Drink","Food","Drink"])',
          ["Drink", "Food"],
          "Use a Set or track values already included.",
        ),
        check(
          "Empty input",
          "uniqueCategories([])",
          [],
          "A unique collection of no values is still empty.",
        ),
        check(
          "First-seen order",
          'uniqueCategories(["B","A","B","C","A"])',
          ["B", "A", "C"],
          "Do not sort unless the contract asks for sorting.",
        ),
      ],
      solution:
        "function uniqueCategories(categories) {\n  return [...new Set(categories)];\n}",
      hints: [
        "A Set records uniqueness while preserving insertion order.",
        "Construct a Set from categories, then spread it into an array.",
      ],
      explanation: "The test verifies values and order, not the source syntax.",
    },
    project: "shop-data",
    connection:
      "Unique categories can populate a shop filter, and Maps can index products by ID.",
    recap: [
      "Set is for uniqueness; Map associates keys with values.",
      "Object identity matters for collections of objects.",
    ],
    knowledge: {
      question:
        "Which built-in collection naturally removes duplicate string values?",
      options: ["Set", "Promise", "Error"],
      answer: 0,
      explanation: "A Set keeps each distinct value once.",
    },
  },
  {
    id: "js-modules",
    title: "Give files a clear input and output contract",
    minutes: 35,
    goal: "Recognise named imports and exports, and keep a calculation independent of the interface.",
    prerequisites: ["js-pipelines", "js-functions"],
    why: "A growing shop needs calculations that can be reused and tested without rendering its page.",
    explanation: [
      'A module is a file with explicit imports and exports. An export makes a value available to another file. A named import selects an exported name: import { lineTotal } from "./totals.js". The quoted path identifies the file; ./ means the current folder.',
      "A named export can be written export function lineTotal(...) { ... }. A default export marks one main value and is imported without braces. Local project files require a module-aware environment.",
      "The worker playground runs one file and cannot resolve local imports. The runnable model below checks the calculation only. The separate two-file step shows actual module syntax and must be done in a local project. Passing the model is not verification of real file imports.",
    ],
    code: "function lineTotal(price, quantity) {\n  return price * quantity;\n}\nconsole.log(lineTotal(4, 2));",
    walkthrough: [
      [
        1,
        3,
        "This is the pure calculation that would be exported from a module. It has no UI or network dependency.",
      ],
      [
        4,
        4,
        "This call models how a separate caller would use the exported function. No real import is occurring in this worker.",
      ],
    ],
    output: [8],
    localProject: {
      title: "Real modules: two files outside this playground",
      steps: [
        "Install a supported Node.js LTS release if node --version is unavailable. A terminal is a program where you type commands; a folder is where these files live.",
        "Create a folder and save the two JavaScript files below in it. The .mjs extension tells Node to treat them as ES modules.",
        "Open a terminal in that folder and run node main.mjs. Expect 8. Change the price and run the command again.",
      ],
      files: [
        {
          name: "totals.mjs",
          code: "export function lineTotal(price, quantity) {\n  return price * quantity;\n}",
        },
        {
          name: "main.mjs",
          code: 'import { lineTotal } from "./totals.mjs";\nconsole.log(lineTotal(4, 2));',
        },
      ],
      expected:
        "The local terminal prints 8. The practice runner does not verify your filesystem or terminal.",
    },
    prediction: {
      code: '// totals.mjs exports a function named lineTotal.\n// main.mjs: import { lineTotal } from "./totals.mjs";',
      question: "What is the name imported by the caller?",
      answer: ["lineTotal"],
      explanation: "A named import selects the exported name inside braces.",
    },
    guided: {
      goal: "Check the module’s calculation contract with quantity 3.",
      starting: "The one-file model calls lineTotal with 4 and 2.",
      starter:
        "function lineTotal(price, quantity) { return price * quantity; }\nconsole.log(lineTotal(4, 2));",
      solution:
        "function lineTotal(price, quantity) { return price * quantity; }\nconsole.log(lineTotal(4, 3));",
      output: [12],
      change: "Change the caller’s quantity to 3.",
      gap: {
        find: "price * quantity",
        with: "0",
        instructions: "Complete the calculation that the module will expose.",
      },
      bug: {
        find: "lineTotal(4, 3)",
        with: "lineTotals(4, 3)",
        instructions:
          "The caller’s name does not match the provided function name. Fix the name.",
        why: "Module contracts and ordinary function calls both depend on matching names exactly.",
        fix: "Call lineTotal, singular.",
      },
      hints: [
        "A reusable module exposes a clear callable contract.",
        "Keep the function name lineTotal and pass the intended price and quantity.",
      ],
      explanation:
        "This tests the function’s contract. Perform the separate local step to test an actual import.",
    },
    independent: {
      goal: "Prepare a pure calculation for use from another file.",
      starting:
        "A caller needs orderTotal(items, delivery), where items is an array of numeric line totals.",
      starter: "",
      instructions:
        "Define orderTotal(items, delivery) in the one-file lab. Return the sum of items plus one delivery charge. Then, optionally move it to a named export using the local instructions.",
      expected: "orderTotal([8,5],3) returns 16; orderTotal([],0) returns 0.",
      constraints:
        "No imports are supported by this worker. The automated checks cover only the callable calculation.",
      checks: [
        check(
          "Reusable module contract",
          "orderTotal([8,5],3)",
          16,
          "Sum the line totals and add delivery once.",
        ),
        check(
          "Empty order",
          "orderTotal([],0)",
          0,
          "An empty sum starts at zero.",
        ),
      ],
      solution:
        "function orderTotal(items, delivery) {\n  return items.reduce((sum, total) => sum + total, 0) + delivery;\n}",
      hints: [
        "Keep the function independent of rendering or global data.",
        "Reduce the numeric items starting at zero, then add delivery.",
      ],
      explanation:
        "A pure function is easy to test in isolation. Real module resolution is a separate environment check.",
    },
    project: "shop-logic",
    connection:
      "Move shop calculations to a module when you start a full project, and keep the same tested input/output contract.",
    recap: [
      "Exports and imports connect module files through explicit names.",
      "The one-file lab can test logic, while real file loading needs a local module environment.",
    ],
  },
  {
    id: "js-fetch",
    title: "Read a response and handle unsuccessful HTTP status",
    minutes: 35,
    goal: "Wait for response data without mistaking HTTP failure for success.",
    prerequisites: ["js-async", "js-errors", "js-objects"],
    why: "The shop needs to distinguish a successful product response from an unavailable server result.",
    explanation: [
      "fetch starts a request and returns a promise for a Response object. A response is not yet the parsed data. Check response.ok, then await response.json() to read JSON. JSON is a text representation of data; parsing converts that text into JavaScript values.",
      "fetch usually fulfills even for HTTP status 404 or 500. response.ok is true for a successful status range. Network failures can reject the fetch promise. A bad body can also fail during JSON parsing.",
      "This example fetches a local data URL, a URL that contains its own tiny response body. It does not depend on a remote server. In a real project, validate the received data shape before using it. Do not put private server secrets in browser code.",
    ],
    code: 'const url = \'data:application/json,{"products":["Tea","Coffee"]}\';\nconst response = await fetch(url);\nif (!response.ok) throw new Error("HTTP " + response.status);\nconst data = await response.json();\nconsole.log(data.products);',
    walkthrough: [
      [
        1,
        1,
        "The quoted data URL contains JSON. JSON strings and object keys use double quotes inside this single-quoted JavaScript string.",
      ],
      [2, 2, "Wait for a Response, not yet the products array."],
      [3, 3, "Treat an unsuccessful status as an explicit error."],
      [
        4,
        5,
        "Parse the JSON asynchronously, then read and print its products property.",
      ],
    ],
    output: [["Tea", "Coffee"]],
    prediction: {
      code: '// A response arrives with status 404 and ok === false.\n// if (!response.ok) throw new Error("HTTP " + response.status);',
      question: "What error message does this explicit check create?",
      answer: ["HTTP 404"],
      explanation:
        "The code turns the unsuccessful HTTP status into a thrown error instead of silently parsing it as success.",
    },
    guided: {
      goal: "Read Milk from a local JSON response.",
      starting: "The data URL contains Tea.",
      starter:
        'const response = await fetch(\'data:application/json,{"product":"Tea"}\');\nconst data = await response.json();\nconsole.log(data.product);',
      solution:
        'const response = await fetch(\'data:application/json,{"product":"Milk"}\');\nconst data = await response.json();\nconsole.log(data.product);',
      output: ["Milk"],
      change: "Change the JSON product value to Milk.",
      gap: {
        find: "await response.json()",
        with: "{}",
        instructions:
          "Parse the response body before reading its product property.",
      },
      bug: {
        find: "await response.json()",
        with: "response.json()",
        instructions:
          "The data variable receives a promise instead of the parsed object. Wait for parsing.",
        why: "json() is asynchronous. Reading a product property on the promise does not read the future parsed object.",
        fix: "Use await response.json().",
      },
      hints: [
        "There are two waits: receiving the Response and parsing its body.",
        "Await both fetch and response.json().",
      ],
      explanation:
        "The source of the response is local, but the asynchronous reading API is the same.",
    },
    independent: {
      goal: "Give a response reader an explicit success and failure contract.",
      starting:
        "The caller supplies response with ok, status, and a json() method that returns a promise.",
      starter: "",
      instructions:
        "Define async readProducts(response). If ok is false, throw Error with message HTTP followed by a space and status. Otherwise parse JSON and return its products array.",
      expected:
        "A successful response returns its array, including an empty array. An unsuccessful 404 response rejects with HTTP 404.",
      constraints:
        "The tests supply response objects; you do not need a real network. Do not parse before checking ok.",
      checks: [
        check(
          "Parses successful data",
          'readProducts({ok:true,status:200,json:async()=>({products:["Tea"]})})',
          ["Tea"],
          "Await json(), then return data.products.",
        ),
        check(
          "Empty success remains empty",
          "readProducts({ok:true,status:200,json:async()=>({products:[]})})",
          [],
          "Empty data is distinct from a failure.",
        ),
        check(
          "HTTP failure is explicit",
          '(async()=>{try{await readProducts({ok:false,status:404,json:async()=>{throw new Error("Parsed too early");}});return "no error";}catch(error){return error.message;}})()',
          "HTTP 404",
          "Check ok first and throw the status message before reading the body.",
        ),
      ],
      solution:
        'async function readProducts(response) {\n  if (!response.ok) throw new Error("HTTP " + response.status);\n  const data = await response.json();\n  return data.products;\n}',
      hints: [
        "Validate status before parsing; return the requested field after parsing.",
        "Use an ok guard, await response.json(), and return data.products.",
      ],
      explanation:
        "The checks cover successful data, empty data, and a failure whose body must not be parsed.",
    },
    project: "shop-data",
    connection:
      "The shop’s data layer now has a response contract that the React loading interface can consume.",
    recap: [
      "A Response and its parsed body are different values.",
      "Handle network failure, HTTP status, parsing, and data validation as separate possible failures.",
    ],
  },
  {
    id: "js-concurrency",
    title: "Coordinate independent promised results",
    minutes: 30,
    goal: "Collect independent results in a predictable order and choose how failures are handled.",
    prerequisites: ["js-fetch", "js-async", "js-arrays"],
    why: "A shop may load product information and delivery options independently instead of waiting to start the second job.",
    explanation: [
      "Independent work can be started before waiting for all its results. Promise.all receives an array of values or promises and fulfills with an array of results in input order. It rejects when an input rejects; that does not automatically cancel the other work.",
      "Promise.allSettled waits for every outcome. Each result object has status fulfilled and value, or status rejected and reason. Use it when individual failures should still be reported alongside successes.",
      "These tools coordinate promises, not synchronous CPU work. Thousands of simultaneous requests can overload a service. A real bulk loader may need a concurrency limit and explicit cancellation.",
    ],
    code: 'const name = Promise.resolve("Tea");\nconst price = Promise.resolve(4);\nconst results = await Promise.all([name, price]);\nconsole.log(results);',
    walkthrough: [
      [1, 2, "Create the two independent promised results before waiting."],
      [
        3,
        3,
        "Wait for both and receive an array in the same order as the input promises.",
      ],
      [4, 4, "Print the collected name and price."],
    ],
    output: [["Tea", 4]],
    prediction: {
      code: 'console.log(await Promise.all([Promise.resolve(5), Promise.resolve("Coffee")]));',
      question: "Write the result array as JSON.",
      answer: [[5, "Coffee"]],
      explanation:
        "Promise.all preserves input order, not a different order based on which result finishes first.",
    },
    guided: {
      goal: "Collect Coffee and price 5 in that order.",
      starting: "The first promise currently contains Tea.",
      starter:
        'const results = await Promise.all([Promise.resolve("Tea"), Promise.resolve(5)]);\nconsole.log(results);',
      solution:
        'const results = await Promise.all([Promise.resolve("Coffee"), Promise.resolve(5)]);\nconsole.log(results);',
      output: [["Coffee", 5]],
      change: "Change only the promised name to Coffee.",
      gap: {
        find: "await Promise.all",
        with: "Promise.all",
        instructions:
          "Wait for the collection before printing its fulfilled values.",
      },
      bug: {
        find: '[Promise.resolve("Coffee"), Promise.resolve(5)]',
        with: '[Promise.resolve(5), Promise.resolve("Coffee")]',
        instructions:
          "The consumer expects name first and price second. Restore that result contract.",
        why: "Promise.all preserves the input positions, so reversing the promises reverses the result fields.",
        fix: "Place the name promise before the price promise.",
      },
      hints: [
        "The result array follows the input array’s positions.",
        "Await Promise.all with the name first and price second.",
      ],
      explanation:
        "The output check verifies the returned values and order, not an exact source string.",
    },
    independent: {
      goal: "Expose a paired-result function.",
      starting:
        "The caller supplies first and second as already-started promises.",
      starter: "",
      instructions:
        "Define async loadPair(first, second). Return an array of their fulfilled results in input order. Let a rejection remain a rejection for the caller.",
      expected:
        "A name promise and price promise return [name, price]. If either rejects, the function rejects.",
      constraints:
        "Promise.all is appropriate. The checks cover the result and rejection contract; they do not measure network concurrency.",
      checks: [
        check(
          "Ordered results",
          'loadPair(Promise.resolve("Tea"), Promise.resolve(4))',
          ["Tea", 4],
          "Collect the first result before the second in the returned array.",
        ),
        check(
          "Different values",
          'loadPair(Promise.resolve(0), Promise.resolve(""))',
          [0, ""],
          "Preserve valid zero and empty text results.",
        ),
        check(
          "Rejection reaches caller",
          '(async()=>{try{await loadPair(Promise.reject(new Error("Offline")),Promise.resolve(4));return "did not reject";}catch(error){return error.message;}})()',
          "Offline",
          "Do not swallow the rejection or replace it with a success array.",
        ),
      ],
      solution:
        "async function loadPair(first, second) {\n  return Promise.all([first, second]);\n}",
      hints: [
        "The supplied work has already started. Coordinate its outcomes.",
        "Return Promise.all([first, second]) from the async function.",
      ],
      explanation:
        "The caller can distinguish successful collected data from a rejected load.",
    },
    project: "shop-data",
    connection:
      "Load independent shop data together while keeping the order and failure policy explicit.",
    recap: [
      "Promise.all collects required results; allSettled collects every outcome.",
      "Rejection is not automatic cancellation, and these tools do not parallelize CPU calculations.",
    ],
  },
  {
    id: "js-debounce",
    title: "Wait for typing to pause before doing work",
    minutes: 40,
    goal: "Wrap a callback so only the latest pending call runs, and expose cancellation.",
    prerequisites: ["js-closures", "js-timers", "js-destructuring"],
    why: "A product search may otherwise start work for every keystroke, including text the person immediately changes.",
    explanation: [
      "Debouncing waits for a quiet period. Every call cancels the previous pending timer and schedules a new one. The wrapper remembers the timer ID through a closure.",
      "The rest parameter ...args collects the call’s arguments in an array. Spread ...args passes them back to the callback. Adding a cancel property to the function gives its owner an explicit cleanup operation; functions can have properties too.",
      "Debouncing does not cancel a request already in flight. Handle outdated responses separately. Clear the pending timer when the owner no longer needs the work, such as when a React component is removed.",
    ],
    code: 'function debounce(callback, delay) {\n  let timer;\n  function run(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => callback(...args), delay);\n  }\n  run.cancel = () => clearTimeout(timer);\n  return run;\n}\nconst search = debounce((query) => console.log(query), 50);\nsearch("T");\nsearch("Tea");',
    walkthrough: [
      [
        1,
        2,
        "The factory receives work and a delay, and stores a private timer ID.",
      ],
      [
        3,
        6,
        "Collect the latest arguments, cancel old pending work, then schedule the callback with the new arguments.",
      ],
      [7, 9, "Attach a cleanup operation and return the wrapper function."],
      [
        10,
        12,
        "Create one wrapper and call it twice quickly. Only the latest pending text is printed.",
      ],
    ],
    output: ["Tea"],
    prediction: {
      code: "// A debounced search waits 50 ms.\n// Calls for T, Te, and Tea arrive before the delay ends.",
      question: "Which query should the eventual callback receive?",
      answer: ["Tea"],
      explanation:
        "Each later call cancels the earlier pending timer. Only the latest arguments survive the quiet period.",
    },
    guided: {
      goal: "Make a debounced message retain the latest query.",
      starting: "The second quick call uses Coffee.",
      starter:
        'function debounce(callback, delay) {\n  let timer;\n  function run(...args) { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); }\n  run.cancel = () => clearTimeout(timer);\n  return run;\n}\nconst search = debounce((query) => console.log(query), 50);\nsearch("T");\nsearch("Coffee");',
      solution:
        'function debounce(callback, delay) {\n  let timer;\n  function run(...args) { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); }\n  run.cancel = () => clearTimeout(timer);\n  return run;\n}\nconst search = debounce((query) => console.log(query), 50);\nsearch("T");\nsearch("Tea");',
      output: ["Tea"],
      change: "Change the latest query to Tea.",
      gap: {
        find: "callback(...args)",
        with: "callback()",
        instructions:
          "Forward the remembered latest arguments to the callback.",
      },
      bug: {
        find: "clearTimeout(timer); timer =",
        with: "timer =",
        instructions:
          "Old pending work is not cancelled, so both queries print. Cancel the old timer before replacing its ID.",
        why: "Reassigning the timer variable does not cancel the scheduled callback identified by its old value.",
        fix: "Call clearTimeout(timer) before scheduling and storing the next timeout.",
      },
      hints: [
        "Remembering the new timer is not the same as cancelling the old one.",
        "Clear the previous ID, then assign the newly returned timeout ID.",
      ],
      explanation:
        "The output checker rejects both an early query and a duplicate latest query.",
    },
    independent: {
      goal: "Make a cancellable debouncer.",
      starting: "The caller supplies a callback and delay in milliseconds.",
      starter: "",
      instructions:
        "Define debounce(callback, delay). Return a callable that keeps only its latest pending call and has a cancel() method that stops pending work.",
      expected:
        "Two quick calls invoke the callback once with the last arguments. Cancelling before the delay invokes it zero times.",
      constraints:
        "Use a closure and timer ID. Delays in the checks are short; no external requests are involved.",
      checks: [
        check(
          "Latest call wins",
          '(async()=>{const values=[];const run=debounce((v)=>values.push(v),30);run("T");run("Tea");await new Promise(r=>setTimeout(r,80));return values;})()',
          ["Tea"],
          "Clear the previous timer before scheduling the latest arguments.",
        ),
        check(
          "Cancellation",
          '(async()=>{const values=[];const run=debounce((v)=>values.push(v),30);run("Old");run.cancel();await new Promise(r=>setTimeout(r,80));return values;})()',
          [],
          "Attach cancel to the returned function and clear its pending timer.",
        ),
        check(
          "Forwards multiple arguments",
          "(async()=>{const values=[];const run=debounce((a,b)=>values.push(a+b),20);run(2,3);await new Promise(r=>setTimeout(r,60));return values;})()",
          [5],
          "Use rest to collect arguments and spread to forward all of them.",
        ),
      ],
      solution:
        "function debounce(callback, delay) {\n  let timer;\n  function run(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => callback(...args), delay);\n  }\n  run.cancel = () => clearTimeout(timer);\n  return run;\n}",
      hints: [
        "The returned function and its cancel method need access to the same timer variable.",
        "Declare timer in the factory; clear it before each scheduled call and inside run.cancel.",
      ],
      explanation:
        "The checks observe callback count, latest arguments, cancellation, and multiple-argument forwarding.",
    },
    project: "shop-data",
    connection:
      "A debounced product search can reduce obsolete work, with separate cleanup and request-race handling.",
    recap: [
      "Debouncing cancels pending scheduling, not work that already started.",
      "Expose cancellation so the owner can clean up the wrapper’s timer.",
    ],
  },
  {
    id: "js-testing",
    title: "Turn examples and edge cases into repeatable tests",
    minutes: 35,
    goal: "State a function’s contract and check normal, boundary, and invalid inputs.",
    prerequisites: ["js-pipelines", "js-errors"],
    why: "A cart calculation must keep working when it receives no items or an invalid input, not only the first sample.",
    explanation: [
      "A test is a repeatable example with an expected result. An assertion compares actual and expected values and fails when they differ. A test runner organizes these assertions and reports results, but a small assertion function makes the idea visible without installing one.",
      "Start with the contract: inputs, returned value, and failures. Add a normal example, an empty or boundary case, and invalid input when the contract defines it. Array.isArray(value) checks whether a value is an array.",
      "A passing test is evidence for the cases checked, not proof of every possible input. Source-text checks such as requiring the word reduce would reject valid loop solutions while missing real bugs.",
    ],
    code: 'function total(prices) {\n  return prices.reduce((sum, price) => sum + price, 0);\n}\nfunction equal(actual, expected, name) {\n  if (actual !== expected) throw new Error(name + " failed");\n  console.log("PASS: " + name);\n}\nequal(total([2, 3]), 5, "adds prices");\nequal(total([]), 0, "empty collection");',
    walkthrough: [
      [1, 3, "Define the behaviour under test."],
      [
        4,
        7,
        "The assertion throws when results differ and prints a named pass only when equal.",
      ],
      [
        8,
        9,
        "Run a normal case and an empty case. Each compares returned numbers, not a source-code pattern.",
      ],
    ],
    output: ["PASS: adds prices", "PASS: empty collection"],
    prediction: {
      code: 'function equal(actual, expected) {\n  if (actual !== expected) throw new Error("Mismatch");\n  console.log("PASS");\n}\nequal(4, 5);',
      question:
        "Does the final call print PASS or throw Mismatch? Write throw Mismatch or PASS.",
      answer: ["throw Mismatch"],
      explanation:
        "The assertion throws before reaching the log because 4 and 5 differ.",
    },
    guided: {
      goal: "Test the result for three prices.",
      starting: "The expected value is still the old two-price total.",
      starter:
        'function total(prices) { return prices.reduce((sum, price) => sum + price, 0); }\nif (total([2, 3, 4]) !== 5) throw new Error("Total mismatch");\nconsole.log("PASS: three prices");',
      solution:
        'function total(prices) { return prices.reduce((sum, price) => sum + price, 0); }\nif (total([2, 3, 4]) !== 9) throw new Error("Total mismatch");\nconsole.log("PASS: three prices");',
      output: ["PASS: three prices"],
      change: "Change the expected total to the correct value 9.",
      gap: {
        find: "sum + price",
        with: "sum",
        instructions: "Include each current price in the accumulated result.",
      },
      bug: {
        find: "sum + price",
        with: "price",
        instructions:
          "The implementation returns only the last item. Restore accumulation and use the test to confirm the fix.",
        why: "A callback that ignores the accumulator forgets earlier items. This is a behaviour bug, even though reduce is present.",
        fix: "Return sum + price, or use an equivalent correct loop.",
      },
      hints: [
        "Work out the expected result independently from the implementation.",
        "2 + 3 + 4 is 9; the reducer should accumulate all three.",
      ],
      explanation:
        "Changing the implementation while keeping a clear expected result lets the assertion detect the mistake.",
    },
    independent: {
      goal: "Implement a total with a defined invalid-input contract.",
      starting:
        "The caller supplies an array of numbers, or an invalid non-array value.",
      starter: "",
      instructions:
        "Define sumPrices(prices). Return their sum; return 0 for an empty array. Throw TypeError with message Expected an array if the input is not an array. Add your own log-based checks if useful.",
      expected:
        "sumPrices([2,3]) returns 5; sumPrices([]) returns 0; sumPrices(null) throws the specified TypeError.",
      constraints:
        "Use Array.isArray for the input boundary. Any correct summation implementation is accepted.",
      checks: [
        check("Normal case", "sumPrices([2,3])", 5, "Accumulate all prices."),
        check("Empty case", "sumPrices([])", 0, "Define an initial zero."),
        check(
          "Negative values",
          "sumPrices([-2,2])",
          0,
          "Do not assume all values are positive.",
        ),
        check(
          "Invalid input contract",
          '(()=>{try{sumPrices(null);return "did not throw";}catch(e){return [e instanceof TypeError,e.message];}})()',
          [true, "Expected an array"],
          "Use Array.isArray before iterating and throw the requested error type and message.",
        ),
      ],
      solution:
        'function sumPrices(prices) {\n  if (!Array.isArray(prices)) throw new TypeError("Expected an array");\n  return prices.reduce((sum, price) => sum + price, 0);\n}',
      hints: [
        "Guard the input before calling an array method.",
        "Reject non-arrays with TypeError, then accumulate numeric values starting at zero.",
      ],
      explanation:
        "These are behavioural checks of four explicit cases. A full project should also run such tests automatically through a test runner.",
    },
    project: "shop-logic",
    connection:
      "Use a repeatable test set for the shop’s core calculation before changing its UI.",
    recap: [
      "Tests check contracts with concrete cases.",
      "Cover important boundaries and failures; passing samples do not prove universal correctness.",
    ],
  },
];
