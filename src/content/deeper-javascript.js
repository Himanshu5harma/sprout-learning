import { valueCheck as check, outputCheck } from "../learning/lesson-model.js";

export const deeperJavaScript = [
  {
    id: "js-destructuring",
    title: "Unpack values and make shallow copies",
    minutes: 30,
    goal: "Read named inputs and create an updated object without changing the original.",
    prerequisites: ["js-objects"],
    why: "React components receive objects as inputs, and state updates often need a new object or array.",
    explanation: [
      "Destructuring takes values out of a collection and gives them local names. const { name } = product reads product.name into a variable named name. Array destructuring uses positions instead: const [first, second] = prices.",
      "Spread uses three dots to copy an object’s properties or an array’s items into a new collection. In { ...product, price: 5 }, later properties replace earlier ones with the same name. The original object stays unchanged by this operation.",
      "Spread copies only one level; nested objects remain shared. In a destructuring pattern, a default such as { stock = 0 } is used when the property is missing or undefined, not when it is null. Rest gathers remaining values: const [first, ...rest] = prices. Spread expands; rest collects.",
    ],
    code: 'const product = { name: "Tea", price: 4 };\nconst { name } = product;\nconst updated = { ...product, price: 5 };\nconsole.log(name);\nconsole.log(product.price);\nconsole.log(updated.price);',
    walkthrough: [
      [1, 1, "Create the original product object."],
      [
        2,
        2,
        "The braces on the left of = are a destructuring pattern. Read name from the object.",
      ],
      [
        3,
        3,
        "Spread the old properties into a new object, then override price.",
      ],
      [
        4,
        6,
        "Print the unpacked name, unchanged old price, and new price. The two prices differ.",
      ],
    ],
    output: ["Tea", 4, 5],
    prediction: {
      code: "const [first, second] = [4, 8];\nconsole.log(second);",
      question: "What does the second position print?",
      answer: [8],
      explanation:
        "Array destructuring assigns by position: first gets 4 and second gets 8.",
    },
    guided: {
      goal: "Copy the product with price 6, keeping the original at 4.",
      starting: "The updated price is currently 5.",
      starter:
        'const product = { name: "Tea", price: 4 };\nconst updated = { ...product, price: 5 };\nconsole.log(product.price);\nconsole.log(updated.price);',
      solution:
        'const product = { name: "Tea", price: 4 };\nconst updated = { ...product, price: 6 };\nconsole.log(product.price);\nconsole.log(updated.price);',
      output: [4, 6],
      checks: [
        ...outputCheck([4, 6]),
        check(
          "Preserves product name",
          "updated.name",
          "Tea",
          "Copy unchanged properties from the original object.",
        ),
      ],
      change: "Change the overriding price to 6.",
      gap: {
        find: "...product",
        with: 'name: ""',
        instructions:
          "Use object spread to copy all original properties before overriding price.",
      },
      bug: {
        find: "{ ...product, price: 6 }",
        with: "{ price: 6, ...product }",
        instructions:
          "The spread is overwriting the new price. Change the property order.",
        why: "Later properties win. Spreading the old product last restores its price of 4.",
        fix: "Put ...product first and price: 6 after it.",
      },
      hints: [
        "Copy first, override second.",
        "Use `{ ...product, price: 6 }`.",
      ],
      explanation: "Each object keeps its own top-level price property.",
    },
    independent: {
      goal: "Make a reusable price update.",
      starting: "The caller supplies a product object and a new price.",
      starter: "",
      instructions:
        "Define withPrice(product, price). Return a new object with all old properties and the supplied price. Leave the original object unchanged.",
      expected:
        'withPrice({ name: "Tea", price: 4 }, 7) returns { name: "Tea", price: 7 }; the original stays at 4.',
      constraints:
        "Make a shallow copy. Preserve fields you were not asked to change.",
      checks: [
        check(
          "Updated copy",
          'withPrice({ name: "Tea", price: 4 }, 7)',
          { name: "Tea", price: 7 },
          "Spread the original first, then override price.",
        ),
        check(
          "Preserves other fields",
          'withPrice({ name: "Milk", price: 3, stock: 8 }, 2)',
          { name: "Milk", price: 2, stock: 8 },
          "Do not rebuild only the fields from the first sample.",
        ),
        check(
          "Does not mutate input",
          "(() => { const p = { price: 4 }; const next = withPrice(p, 9); return [p.price, next !== p]; })()",
          [4, true],
          "Return a new object instead of assigning product.price.",
        ),
      ],
      solution:
        "function withPrice(product, price) {\n  return { ...product, price: price };\n}",
      hints: [
        "The function needs a new object, not a mutation of its input.",
        "Return `{ ...product, price: price }`. The shorthand `{ ...product, price }` also works.",
      ],
      explanation:
        "The tests check fields, identity, and the original object, rather than the source you typed.",
    },
    project: "shop-ui",
    connection:
      "This copy-and-update pattern will keep React cart changes predictable.",
    recap: [
      "Destructuring reads values into names. Spread copies properties or items.",
      "Spread is shallow, and later properties override earlier ones.",
    ],
  },
  {
    id: "js-scope",
    title: "Find where a name is available",
    minutes: 22,
    goal: "Explain which part of a program can read a variable.",
    prerequisites: ["js-destructuring"],
    why: "A missing-name error often means a value was declared somewhere the current code cannot reach.",
    explanation: [
      "Scope is the part of a program where a name is available. A function creates a scope. A block in curly braces also creates a scope for let and const.",
      "Inner code can read names in surrounding scopes. Code outside a block cannot read names declared only inside it. The program searches locally first, then outward. A local name can hide an outer name; choose clear names to avoid confusion.",
      "Declare a value before reading it. A let or const name cannot be safely read before its declaration in the same scope. The fact that the declaration exists later does not make the earlier read work.",
    ],
    code: 'const shop = "Sprout Store";\nfunction describe() {\n  const product = "Tea";\n  return shop + ": " + product;\n}\nconsole.log(describe());',
    walkthrough: [
      [1, 1, "shop belongs to the surrounding scope."],
      [2, 3, "The function creates a scope. product is local to this call."],
      [
        4,
        5,
        "Inside the function, both the local product and outer shop can be read. + joins their text.",
      ],
      [
        6,
        6,
        "Call describe and print its returned message. product itself is unavailable here.",
      ],
    ],
    output: ["Sprout Store: Tea"],
    prediction: {
      code: "const price = 4;\nfunction localPrice() {\n  const price = 7;\n  return price;\n}\nconsole.log(localPrice());\nconsole.log(price);",
      question: "Predict the local result followed by the outer value.",
      answer: [7, 4],
      explanation:
        "The local price hides the outer price only inside the function. It does not change the outer variable.",
    },
    guided: {
      goal: "Return and print the shop’s product description for Coffee.",
      starting: "The local product is Tea.",
      starter:
        'const shop = "Sprout Store";\nfunction describe() {\n  const product = "Tea";\n  return shop + ": " + product;\n}\nconsole.log(describe());',
      solution:
        'const shop = "Sprout Store";\nfunction describe() {\n  const product = "Coffee";\n  return shop + ": " + product;\n}\nconsole.log(describe());',
      output: ["Sprout Store: Coffee"],
      change: "Change the local product value to Coffee.",
      gap: {
        find: "return shop",
        with: 'return ""',
        instructions:
          "Read the outer shop name at the start of the returned message.",
      },
      bug: {
        find: "console.log(describe())",
        with: "console.log(product)",
        instructions:
          "The outer code cannot read the function’s local product. Print the function’s returned message instead.",
        why: "product exists only inside describe. A call to describe can return a value that the outer scope can use.",
        fix: "Use console.log(describe()).",
      },
      hints: [
        "Keep local names inside the function that owns them.",
        "Call describe to receive its message.",
      ],
      explanation:
        "Returning a value communicates across the function boundary without exposing its local variable.",
    },
    independent: {
      goal: "Keep a calculation’s temporary result local.",
      starting: "The caller supplies price and quantity.",
      starter: "",
      instructions:
        "Define totalFor(price, quantity). Inside it, declare a local total, assign the product, and return it.",
      expected: "totalFor(3, 4) returns 12; totalFor(7, 2) returns 14.",
      constraints:
        "Do not use or change an outer total variable. The function must depend on its parameters.",
      checks: [
        check(
          "First call",
          "totalFor(3, 4)",
          12,
          "Calculate using this call’s parameters.",
        ),
        check(
          "Different inputs",
          "totalFor(7, 2)",
          14,
          "A local total must be recalculated for each call.",
        ),
      ],
      solution:
        "function totalFor(price, quantity) {\n  const total = price * quantity;\n  return total;\n}",
      hints: [
        "Declare the result between the function’s braces.",
        "Use a local `const total = price * quantity;`, then return total.",
      ],
      explanation:
        "Each call creates its own local bindings. The checks verify the returned values; local naming is a suggested design, not a source-code rule.",
    },
    project: "shop-logic",
    connection:
      "Each reusable shop calculation should keep its temporary work local.",
    recap: [
      "An inner scope can read outer names; the reverse is not true.",
      "Returning a value is a clear way to give a caller a result.",
    ],
  },
  {
    id: "js-closures",
    title: "Let a function remember a surrounding value",
    minutes: 30,
    goal: "Create a counter that remembers its own count between calls.",
    prerequisites: ["js-scope"],
    why: "A shop may need a private sequence of order numbers without one shared global variable.",
    explanation: [
      "A closure is a function together with access to the surrounding names where it was created. The access remains when that function is called later, even after the outer call has finished.",
      "The outer function below creates count once and returns another function. The caller stores that returned function in next. Each next() call changes the same remembered count.",
      "Calling the outer function a second time creates a separate count. The remembered state is not shared between those independent instances. A backpack is a useful analogy for carried access, but the closure does not necessarily copy every surrounding value.",
    ],
    code: "function makeCounter() {\n  let count = 0;\n  return function () {\n    count = count + 1;\n    return count;\n  };\n}\nconst next = makeCounter();\nconsole.log(next());\nconsole.log(next());",
    walkthrough: [
      [1, 2, "Each outer call creates its own count starting at zero."],
      [
        3,
        6,
        "Return a function value. It can still read and reassign the outer count when called later.",
      ],
      [
        7,
        8,
        "Close the outer function, call it once, and store the returned callable as next.",
      ],
      [
        9,
        10,
        "Call the same returned function twice. It returns 1 and then 2.",
      ],
    ],
    output: [1, 2],
    prediction: {
      code: 'function makeLabel(name) {\n  return () => name;\n}\nconst tea = makeLabel("Tea");\nconsole.log(tea());',
      question: "What name can the returned function still read?",
      answer: ["Tea"],
      explanation:
        "The arrow function retains access to name from the call that created it.",
    },
    guided: {
      goal: "Start the private counter at 5, then read 6 and 7.",
      starting: "The counter starts at zero.",
      starter:
        "function makeCounter() {\n  let count = 0;\n  return function () {\n    count = count + 1;\n    return count;\n  };\n}\nconst next = makeCounter();\nconsole.log(next());\nconsole.log(next());",
      solution:
        "function makeCounter() {\n  let count = 5;\n  return function () {\n    count = count + 1;\n    return count;\n  };\n}\nconst next = makeCounter();\nconsole.log(next());\nconsole.log(next());",
      output: [6, 7],
      change: "Change only the initial count to 5.",
      gap: {
        find: "return count;",
        with: "return 0;",
        instructions: "Return the remembered count after incrementing it.",
      },
      bug: {
        find: "let count = 5;\n  return function () {",
        with: "return function () {\n    let count = 5;",
        instructions:
          "count is being recreated on every inner call. Move its declaration back into the outer function.",
        why: "A local count inside the inner body starts at 5 each time, so both calls return 6.",
        fix: "Declare count once per outer call, before returning the inner function.",
      },
      hints: [
        "The remembered value belongs outside the function that runs repeatedly.",
        "Place `let count = 5;` before `return function`.",
      ],
      explanation:
        "The placement of the declaration decides whether a value is recreated or remembered.",
    },
    independent: {
      goal: "Give each order counter its own starting number.",
      starting:
        "The caller supplies a numeric start. A returned function should increment before returning.",
      starter: "",
      instructions:
        "Define makeOrderCounter(start). Return a function that returns start + 1 on its first call, then increases by one on each later call.",
      expected:
        "A counter created from 10 returns 11, then 12. A separate counter from 0 returns 1.",
      constraints:
        "Keep each counter independent. Do not store one shared count outside the factory.",
      checks: [
        check(
          "Remembers successive calls",
          "(() => { const next = makeOrderCounter(10); return [next(), next()]; })()",
          [11, 12],
          "Initialize count in the outer function and update it in the returned function.",
        ),
        check(
          "Independent counters",
          "(() => { const a = makeOrderCounter(0); const b = makeOrderCounter(5); return [a(), b(), a()]; })()",
          [1, 6, 2],
          "Each outer call must create a separate count.",
        ),
      ],
      solution:
        "function makeOrderCounter(start) {\n  let count = start;\n  return function () {\n    count = count + 1;\n    return count;\n  };\n}",
      hints: [
        "Create a changing variable once for each factory call.",
        "Initialize count from start outside the returned function, then increment and return it inside.",
      ],
      explanation:
        "The tests interleave two counters. A shared global count would produce different results.",
    },
    project: "shop-logic",
    connection:
      "A private counter can produce order numbers or track calls without leaking a global variable.",
    recap: [
      "A closure retains access to its creation environment.",
      "Separate factory calls can have independent remembered state.",
    ],
  },
  {
    id: "js-errors",
    title: "Recognise, explain, and handle a failure",
    minutes: 25,
    goal: "Reject an invalid input with a useful error and handle it at a caller.",
    prerequisites: ["js-scope"],
    why: "A useful calculation should make its invalid inputs clear instead of returning a misleading total.",
    explanation: [
      'An error explains why an operation could not continue normally. throw stops the normal path and passes an error to the caller. new Error("message") creates an error object with a message. This is a built-in tool; the classes lesson explains the new syntax more generally.',
      "Put work that may fail inside try. A catch block runs if that work throws. Its parameter receives the error, and error.message reads the human-readable message. Catch where you can explain or recover, rather than silently hiding the failure.",
      "TypeError is a built-in error type for a value with an unsuitable kind. Errors in asynchronous work need care: a try around starting a timer does not catch a later callback’s exception. We will handle rejected promises with await after learning promises.",
    ],
    code: 'function requireQuantity(quantity) {\n  if (quantity < 0) {\n    throw new Error("Quantity must not be negative");\n  }\n  return quantity;\n}\ntry {\n  console.log(requireQuantity(-1));\n} catch (error) {\n  console.log(error.message);\n}',
    walkthrough: [
      [
        1,
        4,
        "Validate the input before using it. throw creates a failure for a negative quantity.",
      ],
      [5, 6, "Return valid quantities unchanged."],
      [
        7,
        8,
        "try calls the function with an invalid value. The inner call throws before console.log receives a result.",
      ],
      [9, 11, "catch receives the error. Read and print its message instead."],
    ],
    output: ["Quantity must not be negative"],
    prediction: {
      code: 'try {\n  throw new Error("Sold out");\n} catch (error) {\n  console.log(error.message);\n}',
      question: "What message is printed by the catch block?",
      answer: ["Sold out"],
      explanation:
        "The thrown error reaches catch, which prints its message property.",
    },
    guided: {
      goal: "Catch and print a clear stock error.",
      starting: "The error message is currently Unknown.",
      starter:
        'try {\n  throw new Error("Unknown");\n} catch (error) {\n  console.log(error.message);\n}',
      solution:
        'try {\n  throw new Error("Sold out");\n} catch (error) {\n  console.log(error.message);\n}',
      output: ["Sold out"],
      change: "Change the error message to Sold out.",
      gap: {
        find: "error.message",
        with: '""',
        instructions: "Read the message property from the caught error.",
      },
      bug: {
        find: "throw new Error",
        with: "new Error",
        instructions:
          "Creating an error object alone does not throw it. Make the failure reach catch.",
        why: "new Error creates a value, but without throw the normal path continues and catch does not run.",
        fix: "Use throw before new Error.",
      },
      hints: [
        "Creation and throwing are separate operations.",
        'Use `throw new Error("Sold out");`.',
      ],
      explanation:
        "The catch block runs because an error was thrown, not merely created.",
    },
    independent: {
      goal: "Guard a price calculation against a negative quantity.",
      starting: "The caller supplies numeric price and quantity.",
      starter: "",
      instructions:
        "Define safeTotal(price, quantity). Throw Error with message Quantity must not be negative for a negative quantity. Otherwise return price times quantity.",
      expected:
        "safeTotal(4, 2) returns 8; quantity 0 returns 0; quantity -1 throws the specified message.",
      constraints:
        "Do not catch the error inside safeTotal. Its caller must be able to receive it.",
      checks: [
        check(
          "Valid input",
          "safeTotal(4, 2)",
          8,
          "Return the calculation for a valid quantity.",
        ),
        check(
          "Zero is valid",
          "safeTotal(4, 0)",
          0,
          "Reject only quantities below zero.",
        ),
        check(
          "Invalid input is explained",
          '(() => { try { safeTotal(4, -1); return "did not throw"; } catch (error) { return error.message; } })()',
          "Quantity must not be negative",
          "Throw an Error with the requested message instead of logging or returning it.",
        ),
      ],
      solution:
        'function safeTotal(price, quantity) {\n  if (quantity < 0) {\n    throw new Error("Quantity must not be negative");\n  }\n  return price * quantity;\n}',
      hints: [
        "Validate before returning the multiplication result.",
        "Use an if for quantity < 0 and throw; leave the normal return after that guard.",
      ],
      explanation:
        "The invalid-input check catches the exception from outside your function. This verifies its public contract.",
    },
    project: "shop-logic",
    connection:
      "The shop can now communicate invalid data instead of quietly calculating a bad total.",
    recap: [
      "throw interrupts a normal path; catch can explain or recover.",
      "Creating, returning, logging, and throwing a value are different actions.",
    ],
  },
  {
    id: "js-timers",
    title: "Schedule work for later",
    minutes: 25,
    goal: "Schedule a callback and predict the order of immediate and delayed messages.",
    prerequisites: ["js-closures", "js-errors"],
    why: "An interface may delay a message or repeat a small update. You need to understand what runs now and what runs later.",
    explanation: [
      "setTimeout(callback, delay) schedules a function to run after a delay measured in milliseconds. There are 1000 milliseconds in one second. Scheduling does not pause the current code. The callback runs later, after the current work finishes and the timer can be serviced.",
      "The returned timer ID identifies the scheduled work. clearTimeout(id) cancels a pending timeout. setInterval repeats a callback; stop it with clearInterval(id) when no longer needed. A delay is a minimum wait, not an exact appointment.",
      "Sprout’s JavaScript runner waits for short timers so their console output is captured. It stops a program that never finishes within three seconds. Long-lived browser subscriptions belong in a full application or the React preview, with explicit cleanup.",
    ],
    code: 'console.log("Order received");\nsetTimeout(() => {\n  console.log("Order ready");\n}, 50);\nconsole.log("Still available for other work");',
    walkthrough: [
      [1, 1, "Print immediately."],
      [
        2,
        4,
        "Pass a callback and a 50-millisecond delay. These lines schedule work; they do not run the callback now.",
      ],
      [
        5,
        5,
        "Print immediately after scheduling. The delayed Order ready message appears after this one.",
      ],
    ],
    output: ["Order received", "Still available for other work", "Order ready"],
    prediction: {
      code: 'setTimeout(() => console.log("Later"), 0);\nconsole.log("Now");',
      question: "Write the two messages in the order they print.",
      answer: ["Now", "Later"],
      explanation:
        "Even a zero-delay timer waits until the current synchronous work has finished.",
    },
    guided: {
      goal: "Print Started immediately, then Ready after a short delay.",
      starting: "The delayed message is currently Waiting.",
      starter:
        'console.log("Started");\nsetTimeout(() => console.log("Waiting"), 50);',
      solution:
        'console.log("Started");\nsetTimeout(() => console.log("Ready"), 50);',
      output: ["Started", "Ready"],
      change: "Change the delayed message to Ready.",
      gap: {
        find: '() => console.log("Ready")',
        with: "() => {}",
        instructions:
          "Put the delayed printing instruction in the callback’s body.",
      },
      bug: {
        find: 'setTimeout(() => console.log("Ready"), 50);',
        with: 'setTimeout(console.log("Ready"), 50);',
        instructions:
          "The callback is called while scheduling instead of being passed. Restore a function as the first argument.",
        why: 'console.log("Ready") runs immediately and returns undefined. A timer needs a callable it can run later.',
        fix: "Wrap the call in an arrow function.",
      },
      hints: [
        "Pass the work, rather than the result of doing the work.",
        'Use `() => console.log("Ready")` as the first argument.',
      ],
      explanation: "The timer receives a function value and calls it later.",
    },
    independent: {
      goal: "Cancel an obsolete message.",
      starting: "Schedule a message Old offer with a 50-millisecond timeout.",
      starter: "",
      instructions:
        "Store the returned timeout ID, cancel it before it runs, and print Offer cancelled immediately.",
      expected: "Only Offer cancelled appears. Old offer must never appear.",
      constraints:
        "Use setTimeout and clearTimeout. Keep the delay below 100 milliseconds.",
      checks: outputCheck(
        ["Offer cancelled"],
        "Store the timeout ID and pass that same ID to clearTimeout before it fires.",
      ),
      solution:
        'const timer = setTimeout(() => console.log("Old offer"), 50);\nclearTimeout(timer);\nconsole.log("Offer cancelled");',
      hints: [
        "The timer’s return value is how you identify pending work.",
        "Store setTimeout in timer, then call clearTimeout(timer).",
      ],
      explanation:
        "Cleanup prevents work that is no longer relevant from happening later.",
    },
    project: "shop-ui",
    connection:
      "A timed shop message must be cancelled when it becomes obsolete. React effects will use the same cleanup idea.",
    recap: [
      "Scheduling a callback does not pause the current work.",
      "Keep a timer ID when you need to cancel or clean up its work.",
    ],
    knowledge: {
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
  },
  {
    id: "js-promises",
    title: "Represent a result that will arrive later",
    minutes: 30,
    goal: "Read a promise’s successful result and handle its failure.",
    prerequisites: ["js-timers"],
    why: "Fetching a product or saving an order takes time. A promise lets the caller work with an eventual result.",
    explanation: [
      "A promise is an object representing a result that may arrive later. It is pending while waiting, fulfilled when it has a value, or rejected when it has a failure reason. It settles only once.",
      "Promise.resolve(value) creates a fulfilled promise for practice. .then(callback) registers what to do with a fulfilled value; .catch(callback) handles a rejection. The callbacks run later, after the current synchronous work. Returning a value from a then callback supplies the next promise in the chain.",
      "A real API often gives you the promise. If you need to adapt a callback, new Promise((resolve, reject) => { ... }) provides functions to fulfill or reject it. Promises coordinate outcomes; they do not move expensive calculations to another CPU thread.",
    ],
    code: 'const ready = Promise.resolve("Tea ready");\nready.then((message) => console.log(message));\nconsole.log("Order placed");',
    walkthrough: [
      [
        1,
        1,
        "Create a promise whose fulfilled value is the text Tea ready. It is still a promise object, not that text directly.",
      ],
      [
        2,
        2,
        "Register a callback. Its message parameter will receive the fulfilled value.",
      ],
      [
        3,
        3,
        "Print during the current work. The registered promise callback prints Tea ready afterward.",
      ],
    ],
    output: ["Order placed", "Tea ready"],
    prediction: {
      code: 'Promise.reject(new Error("Sold out"))\n  .catch((error) => console.log(error.message));',
      question: "What does the rejection handler print?",
      answer: ["Sold out"],
      explanation:
        "catch receives the rejection reason, which is an Error object with that message.",
    },
    guided: {
      goal: "Handle a fulfilled Coffee ready result.",
      starting: "The fulfilled text currently says Tea ready.",
      starter:
        'Promise.resolve("Tea ready")\n  .then((message) => console.log(message));',
      solution:
        'Promise.resolve("Coffee ready")\n  .then((message) => console.log(message));',
      output: ["Coffee ready"],
      change: "Change the fulfilled value to Coffee ready.",
      gap: {
        find: "console.log(message)",
        with: "console.log()",
        instructions:
          "Pass the fulfilled value to the log call inside the handler.",
      },
      bug: {
        find: ".then(",
        with: ".catch(",
        instructions:
          "A success value is being handled as a rejection. Use the fulfillment handler.",
        why: "catch runs only for a rejection. This fulfilled promise will not call it.",
        fix: "Use then for the successful value.",
      },
      hints: [
        "The result is inside the promise; a then callback receives it.",
        "Read message inside `.then((message) => ...)`.",
      ],
      explanation:
        "The handler runs when its corresponding promise outcome is available.",
    },
    independent: {
      goal: "Return a promised product name.",
      starting:
        "The caller provides a text name, including possibly an empty string.",
      starter: "",
      instructions:
        "Define promisedName(name). Return a promise fulfilled with the supplied name.",
      expected:
        'Awaiting promisedName("Milk") produces "Milk"; awaiting promisedName("") produces an empty string.',
      constraints:
        "Use Promise.resolve or an equivalent promise. Do not just print the name.",
      checks: [
        check(
          "Returns a promise-like value",
          'typeof promisedName("Milk").then',
          "function",
          "Return the promise itself, not a log result or a plain string.",
        ),
        check(
          "Fulfilled name",
          'promisedName("Milk")',
          "Milk",
          "The fulfilled value should be the caller’s name.",
        ),
        check(
          "Empty text remains text",
          'promisedName("")',
          "",
          "Do not replace an empty string with a hard-coded default.",
        ),
      ],
      solution:
        "function promisedName(name) {\n  return Promise.resolve(name);\n}",
      hints: [
        "Create the promise, then give that promise back to the caller.",
        "Return `Promise.resolve(name)`.",
      ],
      explanation:
        "The checker waits for returned promises. It distinguishes the returned promise from console output.",
    },
    project: "shop-data",
    connection:
      "A future product loader will return a promise so the interface can represent waiting, success, and failure.",
    recap: [
      "Promises represent eventual outcomes, not background CPU work.",
      "then receives fulfillment; catch handles rejection. Return a promise when the caller needs to wait.",
    ],
  },
  {
    id: "js-async",
    title: "Wait inside an async function",
    minutes: 30,
    goal: "Use await to work with a promised value and catch a rejection.",
    prerequisites: ["js-promises", "js-errors"],
    why: "A product loader reads more clearly when each dependent operation follows the previous one.",
    explanation: [
      "An async function always returns a promise. Inside it, await waits for a promise to settle and gives you its fulfilled value. It pauses that function’s continuation, not all JavaScript work.",
      "If the promise rejects, await throws its reason in the async function. Put the await in try and catch when this function can handle the problem. Calling an async function without waiting still gives you a promise object.",
      "This lab also supports await at the top level by running your code inside an async wrapper. In a normal project, top-level await requires a module; otherwise put it inside an async function. No network request is needed for this small example.",
    ],
    code: "async function loadPrice() {\n  return 4;\n}\nconst price = await loadPrice();\nconsole.log(price * 2);",
    walkthrough: [
      [
        1,
        3,
        "async makes loadPrice return a promise fulfilled with 4, even though its body returns an ordinary number.",
      ],
      [
        4,
        4,
        "await receives the fulfilled number. The lab permits top-level await.",
      ],
      [5, 5, "Calculate with that number and print 8."],
    ],
    output: [8],
    prediction: {
      code: 'async function loadName() {\n  return "Coffee";\n}\nconsole.log(await loadName());',
      question: "What fulfilled name is printed?",
      answer: ["Coffee"],
      explanation:
        "await unwraps the fulfilled value before console.log is called.",
    },
    guided: {
      goal: "Load the price 5 and print the total for two items.",
      starting: "The loader currently returns 4.",
      starter:
        "async function loadPrice() {\n  return 4;\n}\nconst price = await loadPrice();\nconsole.log(price * 2);",
      solution:
        "async function loadPrice() {\n  return 5;\n}\nconst price = await loadPrice();\nconsole.log(price * 2);",
      output: [10],
      change: "Change the loader’s fulfilled price to 5.",
      gap: {
        find: "await loadPrice()",
        with: "0",
        instructions:
          "Replace 0 with a call that waits for the promised price.",
      },
      bug: {
        find: "await loadPrice()",
        with: "loadPrice()",
        instructions:
          "The calculation receives a promise object instead of its price. Wait for the value.",
        why: "An async call returns a promise. Multiplying the promise object does not multiply its future value.",
        fix: "Use await before loadPrice().",
      },
      hints: [
        "The loader’s return is a promise at the call site.",
        "Write `const price = await loadPrice();`.",
      ],
      explanation:
        "await makes the later calculation use the fulfilled number, not the promise object.",
    },
    independent: {
      goal: "Read a promised price with a useful fallback.",
      starting:
        "The caller supplies a promise for a numeric price. It might reject.",
      starter: "",
      instructions:
        "Define async readPrice(pricePromise). Return its fulfilled value. If it rejects, return the text Price unavailable.",
      expected:
        'readPrice(Promise.resolve(7)) fulfills with 7. A rejection fulfills with "Price unavailable".',
      constraints:
        "Place await inside try so catch can handle the rejection. Do not turn a valid zero into a failure.",
      checks: [
        check(
          "Fulfilled price",
          "readPrice(Promise.resolve(7))",
          7,
          "Return the fulfilled value from await.",
        ),
        check(
          "Zero price",
          "readPrice(Promise.resolve(0))",
          0,
          "Zero is a legitimate price.",
        ),
        check(
          "Rejected load",
          'readPrice(Promise.reject(new Error("Offline")))',
          "Price unavailable",
          "A catch around await should return the fallback text.",
        ),
      ],
      solution:
        'async function readPrice(pricePromise) {\n  try {\n    return await pricePromise;\n  } catch (error) {\n    return "Price unavailable";\n  }\n}',
      hints: [
        "The operation that may fail is the await itself.",
        "Put `return await pricePromise` inside try and return the fallback in catch.",
      ],
      explanation:
        "The checker waits for each returned promise and checks success, zero, and rejection.",
    },
    project: "shop-data",
    connection:
      "The shop’s data layer can return results or a deliberate fallback, while the interface displays the appropriate state.",
    recap: [
      "async always returns a promise. await reads its fulfilled value.",
      "Catch an awaited rejection where you can provide a useful response.",
    ],
  },
  {
    id: "js-event-loop",
    title: "Predict immediate, promise, and timer work",
    minutes: 30,
    goal: "Explain why synchronous code, a promise callback, and a timer run in this order.",
    prerequisites: ["js-async"],
    why: "Knowing the order helps you explain logs and debug an interface that updates later than expected.",
    explanation: [
      "Synchronous code runs as part of the current work. The call stack tracks the functions that are currently running. JavaScript finishes that current work before running queued callbacks.",
      "A fulfilled promise’s then callback is queued as a microtask. A timer callback is scheduled as a task. After the current work ends, the event loop processes queued microtasks before starting the next task.",
      "The exact timing of a timer can vary, but the ordering shown here does not depend on a precise millisecond. A timer with delay zero still cannot interrupt the current synchronous code. Avoid blocking loops: queued work cannot run while the current task never finishes.",
    ],
    code: 'console.log("Start");\nsetTimeout(() => console.log("Timer"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("End");',
    walkthrough: [
      [1, 1, "Print synchronously."],
      [2, 2, "Schedule a timer task. Its callback does not run on this line."],
      [3, 3, "Queue a promise microtask, also for later."],
      [
        4,
        4,
        "Print synchronously. After this work ends, Promise prints, then Timer.",
      ],
    ],
    output: ["Start", "End", "Promise", "Timer"],
    prediction: {
      code: 'Promise.resolve().then(() => console.log("B"));\nconsole.log("A");',
      question: "Which letter prints first? Write both lines.",
      answer: ["A", "B"],
      explanation:
        "The synchronous A runs before the queued promise callback B.",
    },
    guided: {
      goal: "Label the work as Now, Promise, and Timer in its actual order.",
      starting: "The synchronous message currently says Start.",
      starter:
        'setTimeout(() => console.log("Timer"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("Start");',
      solution:
        'setTimeout(() => console.log("Timer"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("Now");',
      output: ["Now", "Promise", "Timer"],
      change: "Change the final synchronous message to Now.",
      gap: {
        find: '.then(() => console.log("Promise"))',
        with: ".then(() => {})",
        instructions: "Make the promise callback print Promise.",
      },
      bug: {
        find: '() => console.log("Timer")',
        with: 'console.log("Timer")',
        instructions:
          "The timer message is being printed during scheduling. Pass a callback instead.",
        why: "Calling log immediately places Timer in the synchronous output. A timer needs the function, not its returned undefined.",
        fix: "Wrap the log call in an arrow function.",
      },
      hints: [
        "Scheduling order does not mean callback execution order.",
        "Keep functions inside setTimeout and then; print Now directly.",
      ],
      explanation:
        "The queue used by each callback explains the observed order.",
    },
    independent: {
      goal: "Build an observable ordering example.",
      starting:
        "Use one immediate log, one promise callback, and one zero-delay timer.",
      starter: "",
      instructions:
        "Print Immediate synchronously, Microtask from a Promise.resolve().then handler, and Timer from a setTimeout callback.",
      expected: "Immediate\nMicrotask\nTimer",
      constraints:
        "Use the three scheduling mechanisms described. The output checker verifies order, not whether your source uses a particular API.",
      checks: outputCheck(["Immediate", "Microtask", "Timer"]),
      solution:
        'setTimeout(() => console.log("Timer"), 0);\nPromise.resolve().then(() => console.log("Microtask"));\nconsole.log("Immediate");',
      hints: [
        "Place the messages in different kinds of work, not three direct logs.",
        "Use a direct log for Immediate, then for Microtask, and setTimeout for Timer.",
      ],
      explanation:
        "The observed sequence matches the scheduling model. The checker confirms output; explain the scheduling choices in your own words below.",
    },
    project: "shop-data",
    connection:
      "This model helps explain why a loading indicator and an eventual product response appear in separate updates.",
    recap: [
      "Finish current work, then queued microtasks, then the next task.",
      "Execution order and an exact timer duration are different claims.",
    ],
  },
  {
    id: "js-prototypes",
    knowledge: {
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
    title: "Share behaviour through a prototype",
    minutes: 30,
    goal: "Read a property through a prototype and explain this in a method call.",
    prerequisites: ["js-scope", "js-objects"],
    why: "Understanding property lookup helps you read object-oriented JavaScript and the class syntax used later.",
    explanation: [
      "A prototype is another object used for property lookup. If a property is not found directly on an object, JavaScript can look on its prototype, then continue along the prototype chain. Object.create(prototype) creates an object linked to that prototype.",
      "A method is a function stored as an object property. The short syntax label() { ... } defines such a function. In a regular call product.label(), this refers to the object before the dot: product. An arrow function does not create its own this.",
      "Object.hasOwn(object, name) checks only properties stored directly on that object. It does not count inherited properties. A shared prototype is like a shared handbook: instances can consult it without owning a separate copy of each method.",
    ],
    code: 'const methods = {\n  label() { return "Product: " + this.name; }\n};\nconst product = Object.create(methods);\nproduct.name = "Tea";\nconsole.log(product.label());\nconsole.log(Object.hasOwn(product, "label"));',
    walkthrough: [
      [
        1,
        3,
        "Create a shared object with a method. The method uses this.name when called; it does not run yet.",
      ],
      [
        4,
        5,
        "Link a new object to methods, then give it its own name property.",
      ],
      [
        6,
        6,
        "Lookup finds label on the prototype. Calling through product makes this refer to product.",
      ],
      [7, 7, "label is inherited, so the own-property check prints false."],
    ],
    output: ["Product: Tea", false],
    prediction: {
      code: 'const shared = { category: "Drink" };\nconst product = Object.create(shared);\nconsole.log(product.category);\nconsole.log(Object.hasOwn(product, "category"));',
      question: "Predict the inherited value and own-property result.",
      answer: ["Drink", false],
      explanation:
        "The value is found through the prototype, but product does not own the category property.",
    },
    guided: {
      goal: "Use the shared label method for Coffee.",
      starting: "The instance name is Tea.",
      starter:
        'const methods = { label() { return "Product: " + this.name; } };\nconst product = Object.create(methods);\nproduct.name = "Tea";\nconsole.log(product.label());',
      solution:
        'const methods = { label() { return "Product: " + this.name; } };\nconst product = Object.create(methods);\nproduct.name = "Coffee";\nconsole.log(product.label());',
      output: ["Product: Coffee"],
      change: "Change the instance’s name to Coffee.",
      gap: {
        find: "this.name",
        with: '""',
        instructions: "Read the receiver’s name inside the regular method.",
      },
      bug: {
        find: "product.label()",
        with: "methods.label()",
        instructions:
          "The method is called on the shared object, which has no product name. Call it through product.",
        why: "this depends on the receiver of a regular method call. methods has no name field.",
        fix: "Use product.label() so this refers to product.",
      },
      hints: [
        "The value before the dot is the receiver for this call.",
        "Call label through product, not methods.",
      ],
      explanation:
        "Sharing the method does not change which receiver supplies this.name.",
    },
    independent: {
      goal: "Construct products that share a label method.",
      starting: "The caller supplies a text name.",
      starter: "",
      instructions:
        "Define makeProduct(name). Return an object whose name is an own property and whose inherited label() method returns Product: followed by a space and the name.",
      expected:
        'makeProduct("Milk").label() returns "Product: Milk". label is inherited; name is owned.',
      constraints:
        "Use Object.create with a shared method object. Do not change the shared prototype’s name for each product.",
      checks: [
        check(
          "Label for Milk",
          'makeProduct("Milk").label()',
          "Product: Milk",
          "Call through the new instance so this reads its own name.",
        ),
        check(
          "Shared method, own data",
          '(() => { const p = makeProduct("Tea"); return [Object.hasOwn(p, "name"), Object.hasOwn(p, "label")]; })()',
          [true, false],
          "Put label on the prototype and name on the returned object.",
        ),
        check(
          "Instances remain independent",
          '(() => { const a = makeProduct("Tea"); const b = makeProduct("Coffee"); return [a.label(), b.label()]; })()',
          ["Product: Tea", "Product: Coffee"],
          "Do not store each instance’s name on the shared method object.",
        ),
      ],
      solution:
        'const productMethods = {\n  label() { return "Product: " + this.name; }\n};\nfunction makeProduct(name) {\n  const product = Object.create(productMethods);\n  product.name = name;\n  return product;\n}',
      hints: [
        "Share behaviour, but store each name on its own object.",
        "Create with Object.create(productMethods), set product.name, and return product.",
      ],
      explanation:
        "The checks inspect property ownership and two separate instances as well as the visible result.",
    },
    project: "shop-logic",
    connection:
      "This optional object model helps you understand how classes share methods. Plain objects and functions are still sufficient for most shop data.",
    recap: [
      "Property lookup can continue through a prototype.",
      "In a regular object.method() call, this is the receiver. Own and inherited properties are distinct.",
    ],
  },
  {
    id: "js-classes",
    title: "Read classes, instances, and inherited methods",
    minutes: 35,
    goal: "Create an instance and recognise the class syntax used by React error boundaries.",
    prerequisites: ["js-prototypes"],
    why: "Most React components in Sprout are functions. Error boundaries currently use class syntax, so you need this bridge first.",
    explanation: [
      'A class defines how to create objects with shared methods. new Product("Tea") creates an instance and runs its constructor. The constructor receives the arguments and can assign properties through this.',
      "Methods written in the class body are shared through its prototype. A field such as stock = 0 creates a property on each instance. The new syntax expresses an object model; it does not make ordinary data more powerful than a plain object.",
      "extends creates a subclass whose prototype inherits from a parent class. A subclass with no constructor forwards its constructor arguments to the parent. If you write a subclass constructor, call super(...) before using this. React error boundaries extend React.Component; ordinary function components do not need a class.",
    ],
    code: 'class Product {\n  stock = 0;\n  constructor(name) {\n    this.name = name;\n  }\n  label() { return "Product: " + this.name; }\n}\nclass ShopProduct extends Product {}\nconst product = new ShopProduct("Tea");\nconsole.log(product.label());\nconsole.log(product.stock);',
    walkthrough: [
      [
        1,
        2,
        "Declare a class and an instance field. Each created object starts with its own stock of zero.",
      ],
      [
        3,
        5,
        "constructor receives the name and stores it on the new instance through this.",
      ],
      [6, 7, "Define the shared label method and close the class."],
      [
        8,
        9,
        "extends inherits the class behaviour. new constructs an instance, forwarding Tea to the inherited constructor.",
      ],
      [10, 11, "Read the inherited method and the instance field."],
    ],
    output: ["Product: Tea", 0],
    prediction: {
      code: "class Product {\n  constructor(price) { this.price = price; }\n  total(quantity) { return this.price * quantity; }\n}\nconsole.log(new Product(4).total(2));",
      question: "What total does the instance method return and print?",
      answer: [8],
      explanation:
        "The instance stores price 4. Calling total with quantity 2 returns 8.",
    },
    guided: {
      goal: "Construct a Coffee product with the same shared label method.",
      starting: "The instance is constructed with Tea.",
      starter:
        'class Product {\n  constructor(name) { this.name = name; }\n  label() { return "Product: " + this.name; }\n}\nconsole.log(new Product("Tea").label());',
      solution:
        'class Product {\n  constructor(name) { this.name = name; }\n  label() { return "Product: " + this.name; }\n}\nconsole.log(new Product("Coffee").label());',
      output: ["Product: Coffee"],
      change: "Change the constructor argument to Coffee.",
      gap: {
        find: "this.name = name",
        with: 'this.name = ""',
        instructions: "Store the constructor’s name argument on the instance.",
      },
      bug: {
        find: 'new Product("Coffee")',
        with: 'Product("Coffee")',
        instructions:
          "A class cannot be called like an ordinary function. Construct an instance with new.",
        why: "Class constructors require new. The new operation creates the receiver used as this.",
        fix: 'Use new Product("Coffee").',
      },
      hints: [
        "The class describes the shape; new creates an instance.",
        'Call `new Product("Coffee")`, then its label method.',
      ],
      explanation:
        "Different constructor arguments produce different instance data while methods remain shared.",
    },
    independent: {
      goal: "Create a reusable price-holding class.",
      starting:
        "The constructor receives price; the total method receives quantity.",
      starter: "",
      instructions:
        "Define class PricedProduct. Store price on this in the constructor. Add total(quantity) that returns price times quantity.",
      expected:
        "new PricedProduct(5).total(2) returns 10; quantity 0 returns 0.",
      constraints:
        "Use a class, an instance property, and a method. There is no need for inheritance in this task.",
      checks: [
        check(
          "Uses stored price",
          "new PricedProduct(5).total(2)",
          10,
          "Assign this.price in the constructor, then read it in total.",
        ),
        check(
          "Independent instance",
          "new PricedProduct(3).total(4)",
          12,
          "Each instance must keep its own price.",
        ),
        check(
          "Zero quantity",
          "new PricedProduct(5).total(0)",
          0,
          "Calculate with the supplied quantity.",
        ),
      ],
      solution:
        "class PricedProduct {\n  constructor(price) {\n    this.price = price;\n  }\n  total(quantity) {\n    return this.price * quantity;\n  }\n}",
      hints: [
        "The two inputs arrive at different times. Store price for later method calls.",
        "Use this.price in both the constructor assignment and total’s calculation.",
      ],
      explanation:
        "The method reads state from its instance and combines it with its own argument.",
    },
    project: "shop-ui",
    connection:
      "You can now read the class fields, extends, and methods in a React error boundary without treating them as unexplained magic.",
    recap: [
      "new creates an instance and runs its constructor.",
      "Fields belong to instances; methods are shared. extends inherits behaviour.",
    ],
    knowledge: {
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
  },
];
