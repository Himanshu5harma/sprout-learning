import { valueCheck as check, outputCheck } from "../learning/lesson-model.js";

export const foundations = [
  {
    id: "js-welcome",
    title: "Your browser, your console, your first result",
    minutes: 15,
    goal: "Run one instruction and find its printed result.",
    prerequisites: [],
    why: "Before building a shop, you need a reliable way to try code and see what happened.",
    explanation: [
      "A browser is the program you use to visit websites, such as Firefox or Chrome. You are using one to open Sprout. A program is a set of instructions for a computer. JavaScript is the language we will use to write those instructions.",
      "The dark area in Practice is the code editor: the place to type instructions. Run code asks JavaScript to carry them out. Console output is a separate area that shows messages your instructions print. This is Sprout’s practice console, not the browser’s developer-tools console.",
      'In console.log("Tea"), console is the tool, the dot selects its log action, and the parentheses hold what to print. The quotation marks say that Tea is text. The marks are not printed. A semicolon ends this instruction. Instructions normally run from top to bottom. A line beginning with // is a comment: a note for the person reading the code. JavaScript ignores the comment.',
    ],
    code: 'console.log("Tea");',
    walkthrough: [
      [
        1,
        1,
        '`console.log` prints a message. `(` and `)` surround the message. `"Tea"` is text, including its quotes in the code but not in the result. `;` ends the instruction.',
      ],
    ],
    output: ["Tea"],
    prediction: {
      code: 'console.log("Coffee");\nconsole.log("Ready");',
      question:
        "What two lines will the console show? Write one result per line, without quotation marks.",
      answer: ["Coffee", "Ready"],
      explanation:
        "The first instruction prints Coffee. Then the second instruction prints Ready. Each log call starts a new output entry.",
    },
    guided: {
      goal: "Print Coffee instead of Tea.",
      starting: "The working instruction prints Tea.",
      starter: 'console.log("Tea");',
      solution: 'console.log("Coffee");',
      output: ["Coffee"],
      change:
        "Change only the text between the quotation marks to Coffee. Run the code, then check the result.",
      gap: {
        find: '"Coffee"',
        with: '""',
        instructions: "The quotation marks are ready. Put Coffee between them.",
      },
      bug: {
        find: '"Coffee"',
        with: "Coffee",
        instructions:
          "This code has lost the quotation marks around its text. Add them back.",
        why: "An unquoted word is treated as a name to look up. No value named Coffee has been stored here.",
        fix: 'Write `"Coffee"`, including both quotation marks.',
      },
      hints: [
        "The printing instruction already works. Change its message.",
        'Keep `console.log(...)` and put `"Coffee"` inside the parentheses.',
      ],
      explanation:
        "Only the text changed. The same log action now prints Coffee.",
    },
    independent: {
      goal: "Print a two-line shop greeting.",
      starting: "Start with the empty editor. You know how to print text.",
      starter: "",
      instructions:
        "Write two instructions. Print Welcome first and Shop is open second.",
      expected: "Welcome\nShop is open",
      constraints:
        "Use two console.log calls. You may use single or double quotation marks.",
      checks: outputCheck(["Welcome", "Shop is open"]),
      solution: 'console.log("Welcome");\nconsole.log("Shop is open");',
      hints: [
        "Write the instruction from the example twice, with a different message each time.",
        'The first instruction is `console.log("Welcome");`. Add the second underneath.',
      ],
      explanation:
        "Two calls print two messages in order. This changes the console, not the visible shop page.",
    },
    project: "shop-logic",
    connection:
      "These messages are your first way to inspect the shop’s data. Later, React will display that data on the page.",
    recap: [
      "Code is a set of instructions. Run code executes it.",
      "console.log prints to the console. It does not create page content.",
    ],
    knowledge: {
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
  },
  {
    id: "js-types",
    title: "Values: text, numbers, and yes-or-no answers",
    minutes: 18,
    goal: "Tell text, numbers, and booleans apart, and inspect a value’s type.",
    prerequisites: ["js-welcome"],
    why: "A shop needs a product name, a price, and an answer to whether the product is available. Those are different kinds of information.",
    explanation: [
      "A value is one piece of information. A string is the programming name for text. Put text inside matching quotation marks. A number is written without quotes. A boolean is one of two values: true or false. Booleans represent answers, not the words ‘true’ and ‘false’.",
      'A type describes the kind of a value. The typeof operator reports a type as text. An operator is a symbol or word that performs an operation. The value 4 is a number; "4" is a string. They can behave differently in calculations.',
      'Two other values describe absence. undefined often means a result or property is not available. null is a value you can deliberately use for ‘nothing here’. A historical quirk makes typeof null report object; test for null directly when needed. Number("4") converts numeric text to 4, and String(4) converts 4 to text. We will need conversion when reading a form.',
    ],
    code: 'console.log(typeof "Tea");\nconsole.log(typeof 4);\nconsole.log(typeof true);',
    walkthrough: [
      [
        1,
        1,
        '`typeof "Tea"` produces the string `"string"`. The outer `console.log` prints it.',
      ],
      [2, 2, "`4` has no quotes, so its type is number."],
      [
        3,
        3,
        "`true` has no quotes. It is a boolean, so typeof reports boolean.",
      ],
    ],
    output: ["string", "number", "boolean"],
    prediction: {
      code: 'console.log(typeof "4");\nconsole.log(typeof false);',
      question: "Predict the two printed type names.",
      answer: ["string", "boolean"],
      explanation:
        'Quotes make "4" text. false is a boolean because it is written without quotes.',
    },
    guided: {
      goal: "Inspect the type of the number 12.",
      starting: 'The code currently inspects the text "12".',
      starter: 'console.log(typeof "12");',
      solution: "console.log(typeof 12);",
      output: ["number"],
      change: "Remove the quotes around 12. Do not remove the parentheses.",
      gap: {
        find: "typeof",
        with: "",
        instructions: "Add the operator that reports a type before 12.",
      },
      bug: {
        find: "12",
        with: '"12"',
        instructions: "The price is accidentally text. Make it a number.",
        why: "Quotation marks turn the digits into a string.",
        fix: "Remove only the quotation marks around the number.",
      },
      hints: [
        "Numbers and numeric text are different values.",
        "Use `typeof 12`, with no quotes around 12.",
      ],
      explanation:
        "typeof checks the value. Removing the quotes changes that value’s type.",
    },
    independent: {
      goal: "Identify three pieces of shop data.",
      starting: "The values are text Tea, number 5, and boolean false.",
      starter: "",
      instructions:
        "Print the type of Tea as text, then 5 as a number, then false as a boolean.",
      expected: "string\nnumber\nboolean",
      constraints: "Use typeof and console.log. You do not need variables yet.",
      checks: outputCheck(["string", "number", "boolean"]),
      solution:
        'console.log(typeof "Tea");\nconsole.log(typeof 5);\nconsole.log(typeof false);',
      hints: [
        "Ask for the type of each value, rather than printing the value itself.",
        'Start with `console.log(typeof "Tea");` and write the other two calls without quoting 5 or false.',
      ],
      explanation:
        "The three type names distinguish a product label, a price, and an availability flag.",
    },
    project: "shop-logic",
    connection:
      "Store a product name as text, its price as a number, and its availability as a boolean.",
    recap: [
      "Quotes create strings. Numbers and booleans do not need quotes.",
      "typeof reports a type; console.log prints the reported value.",
    ],
  },
  {
    id: "js-variables",
    title: "Variables: remember a product name",
    minutes: 20,
    goal: "Store a value under a useful name and read it again.",
    prerequisites: ["js-types"],
    why: "You should be able to change a product name in one place and use it in several calculations or messages.",
    explanation: [
      'A variable associates a name with a value. const product = "Tea" creates the name product and gives it the value "Tea". The equals sign here means assignment: give this name a value. It does not ask whether two values are equal.',
      'Use the unquoted name product to read its stored value. "product" is literal text instead. Names are case-sensitive: product and Product are different names.',
      "Use let for a name that will be assigned a different value later. Use const when reassignment is not needed. const prevents reassignment of the name; it does not freeze everything inside an object or array. We will meet those collections later.",
    ],
    code: 'const product = "Tea";\nconsole.log(product);',
    walkthrough: [
      [
        1,
        1,
        '`const` declares a name. `product` is the chosen name. `=` assigns the text `"Tea"` to it.',
      ],
      [
        2,
        2,
        "Read product without quotes. Its current value is passed to console.log.",
      ],
    ],
    output: ["Tea"],
    prediction: {
      code: "let quantity = 1;\nquantity = 2;\nconsole.log(quantity);",
      question: "What single value is printed after the reassignment?",
      answer: [2],
      explanation:
        "let allows reassignment. The second line changes quantity from 1 to 2 before it is read.",
    },
    guided: {
      goal: "Store Coffee in product and print the stored value.",
      starting: "product currently contains Tea.",
      starter: 'const product = "Tea";\nconsole.log(product);',
      solution: 'const product = "Coffee";\nconsole.log(product);',
      output: ["Coffee"],
      change:
        "Change the stored text to Coffee. Keep the log call reading product.",
      gap: {
        find: '"Coffee"',
        with: '""',
        instructions: "Fill in the value assigned to product.",
      },
      bug: {
        find: "console.log(product)",
        with: 'console.log("product")',
        instructions:
          "The code prints the name as text. Change it to read the stored value.",
        why: '"product" is a string containing seven letters. product without quotes reads the variable.',
        fix: "Remove the quotes around product in the log call.",
      },
      hints: [
        "Change what is stored, then read the name.",
        'Keep `console.log(product)` and assign `"Coffee"` on the first line.',
      ],
      explanation:
        "The log reads product, so changing the assigned value changes its result.",
    },
    independent: {
      goal: "Track a changing quantity.",
      starting: "Your shop starts with quantity 1 and changes it to 3.",
      starter: "",
      instructions:
        "Declare quantity with let, assign 1, then reassign 3. Print quantity after the change.",
      expected: "3",
      constraints:
        "Use the name quantity. Declare it once; do not write let again when reassigning.",
      checks: [
        check(
          "Stored quantity",
          "quantity",
          3,
          "The final value of quantity must be the number 3, not text.",
        ),
        ...outputCheck([3]),
      ],
      solution: "let quantity = 1;\nquantity = 3;\nconsole.log(quantity);",
      hints: [
        "A changing value needs let. Assignment does not repeat the declaration keyword.",
        "Write `let quantity = 1;`, then `quantity = 3;`, then log quantity.",
      ],
      explanation:
        "let declares the name once. The next assignment updates the value that a later read receives.",
    },
    project: "shop-logic",
    connection:
      "The product name and quantity become the first two remembered values in your shop.",
    recap: [
      "A variable is a name associated with a value.",
      "const prevents reassignment; let allows it. Reading a name is different from printing its name as text.",
    ],
  },
  {
    id: "js-operators",
    title: "Calculate a price and quantity total",
    minutes: 20,
    goal: "Multiply a price by a quantity and print the result.",
    prerequisites: ["js-variables"],
    why: "A shop must calculate the cost of several copies of one product.",
    explanation: [
      "An expression is a piece of code that produces a value. price * quantity is an expression that multiplies two numbers. The star is the multiplication operator. You can store the result in another variable.",
      'Use + to add, - to subtract, * to multiply, / to divide, and % for the remainder after division. Parentheses group calculations, just as they do in arithmetic. The + operator also joins text: "4" + 2 is "42", while 4 + 2 is 6. Convert numeric text with Number before doing arithmetic.',
      "Calculating a value does not automatically print it. The variable total contains a value; console.log(total) makes that value visible in the console.",
    ],
    code: "const price = 4;\nconst quantity = 3;\nconst total = price * quantity;\nconsole.log(total);",
    walkthrough: [
      [
        1,
        2,
        "Store the number 4 as price and 3 as quantity. Neither value is quoted.",
      ],
      [
        3,
        3,
        "`*` multiplies the two stored numbers. Assign the resulting number 12 to total.",
      ],
      [
        4,
        4,
        "Read total and print 12. The multiplication itself did not print anything.",
      ],
    ],
    output: [12],
    prediction: {
      code: "const price = 5;\nconst quantity = 2;\nconsole.log(price * quantity);",
      question: "What total is printed?",
      answer: [10],
      explanation: "Five units of money per item times two items gives 10.",
    },
    guided: {
      goal: "Calculate the cost of 4 items priced at 3 each.",
      starting: "The quantity is currently 2.",
      starter:
        "const price = 3;\nconst quantity = 2;\nconsole.log(price * quantity);",
      solution:
        "const price = 3;\nconst quantity = 4;\nconsole.log(price * quantity);",
      output: [12],
      change: "Change quantity from 2 to 4. Keep price at 3.",
      gap: {
        find: "price * quantity",
        with: "0",
        instructions:
          "Replace 0 with the multiplication of price and quantity.",
      },
      bug: {
        find: "price * quantity",
        with: "price + quantity",
        instructions:
          "The code adds instead of finding the cost of four items. Fix the operator.",
        why: "Adding 3 and 4 produces 7. Repeating a price four times requires multiplication, which produces 12.",
        fix: "Use `price * quantity`.",
      },
      hints: [
        "A total for identical items is price multiplied by quantity.",
        "Use the star: `price * quantity`.",
      ],
      explanation:
        "The expression uses the stored numbers, so it follows changes to either input.",
    },
    independent: {
      goal: "Calculate a small order including delivery.",
      starting:
        "Each notebook costs 6. There are 2 notebooks. Delivery costs 3.",
      starter: "",
      instructions:
        "Store price, quantity, and delivery as numbers. Store price times quantity plus delivery in total. Print total.",
      expected: "15",
      constraints:
        "Use the names price, quantity, delivery, and total. The delivery charge is added once.",
      checks: [
        check(
          "Calculated total",
          "total",
          15,
          "Multiply 6 by 2 first, then add delivery 3 once.",
        ),
        ...outputCheck([15]),
      ],
      solution:
        "const price = 6;\nconst quantity = 2;\nconst delivery = 3;\nconst total = price * quantity + delivery;\nconsole.log(total);",
      hints: [
        "Calculate the items’ cost before adding one delivery charge.",
        "The expression is `price * quantity + delivery`.",
      ],
      explanation:
        "Multiplication happens before addition here. The items cost 12 and delivery adds 3.",
    },
    project: "shop-logic",
    connection:
      "Your shop can now calculate the total for one product and a delivery fee.",
    recap: [
      "Expressions produce values. Operators combine or transform values.",
      "Use numeric values for arithmetic. Log the result separately when you want to see it.",
    ],
    knowledge: {
      question: "What does the * operator do with two numbers?",
      options: [
        "Joins their names as text",
        "Multiplies them",
        "Checks whether they are equal",
      ],
      answer: 1,
      explanation:
        "The star multiplies numbers. For example, 4 * 3 produces 12.",
    },
  },
  {
    id: "js-comparisons",
    title: "Ask a question about a value",
    minutes: 20,
    goal: "Use a comparison to find out whether an order qualifies for free delivery.",
    prerequisites: ["js-operators"],
    why: "Before making a decision, a program needs a true-or-false answer.",
    explanation: [
      "A comparison compares values and produces a boolean. total >= 20 asks whether total is greater than or equal to 20. It produces true or false. Other comparisons include >, <, <=, === for strict equality, and !== for strict inequality.",
      'Assignment and comparison do different jobs: = assigns a value; === compares values without first converting their types. So 4 === "4" is false.',
      "Combine boolean conditions with && for ‘both must be true’, || for ‘at least one must be true’, and ! for ‘not’. Use explicit comparisons first; JavaScript can also treat values as truthy or falsy, which means whether they act like true or false in a condition. Zero, an empty string, null, and undefined are examples of falsy values.",
    ],
    code: "const total = 20;\nconst freeDelivery = total >= 20;\nconsole.log(freeDelivery);",
    walkthrough: [
      [1, 1, "Store the numeric order total."],
      [
        2,
        2,
        "`>=` includes the boundary 20. Store the comparison’s boolean result in freeDelivery.",
      ],
      [
        3,
        3,
        "Print true, the boolean result. The code has not made a delivery decision yet.",
      ],
    ],
    output: [true],
    prediction: {
      code: 'console.log(19 >= 20);\nconsole.log(4 === "4");',
      question: "Predict the two boolean results.",
      answer: [false, false],
      explanation:
        "19 is below the threshold. Strict equality also distinguishes a number from a string.",
    },
    guided: {
      goal: "Check that an order of 25 qualifies at the 20 threshold.",
      starting: "The total is currently 15.",
      starter: "const total = 15;\nconsole.log(total >= 20);",
      solution: "const total = 25;\nconsole.log(total >= 20);",
      output: [true],
      change: "Change the order total to 25.",
      gap: {
        find: ">=",
        with: "<",
        instructions: "Replace the comparison so it asks ‘at least 20’.",
      },
      bug: {
        find: "total >= 20",
        with: "total === 20",
        instructions:
          "The code only accepts exactly 20. Make higher totals qualify too.",
        why: "Equality accepts one value. A threshold needs greater than or equal to.",
        fix: "Replace === with >=.",
      },
      hints: [
        "Qualifying means at least the threshold, not exactly equal to it.",
        "Use `total >= 20`.",
      ],
      explanation: "25 is greater than 20, so the result is true.",
    },
    independent: {
      goal: "Require both enough items and enough money for a promotion.",
      starting:
        "quantity is 3 and total is 24. The promotion needs quantity at least 2 and total at least 20.",
      starter: "",
      instructions:
        "Store quantity and total. Store the combined boolean in eligible, then print it.",
      expected: "true",
      constraints:
        "Use && to combine the two comparisons. Keep eligible as a boolean, not text.",
      checks: [
        check(
          "Promotion eligibility",
          "eligible",
          true,
          "Compare both inputs with >=, then combine the results with &&.",
        ),
        ...outputCheck([true]),
      ],
      solution:
        "const quantity = 3;\nconst total = 24;\nconst eligible = quantity >= 2 && total >= 20;\nconsole.log(eligible);",
      hints: [
        "Write two separate comparisons, then require both.",
        "Use `quantity >= 2 && total >= 20`.",
      ],
      explanation:
        "Both comparisons are true, so && produces true. This result can drive a condition in the next lesson.",
    },
    project: "shop-logic",
    connection:
      "Promotion eligibility is a boolean question that your next decision will use.",
    recap: [
      "Comparisons produce booleans.",
      "Use = to assign and === to compare. >= includes its boundary.",
    ],
    knowledge: {
      question: "Which expression asks whether total is at least 20?",
      options: ["total = 20", "total >= 20", "total === 20"],
      answer: 1,
      explanation:
        ">= accepts 20 and every larger value. = assigns; === only accepts equality.",
    },
  },
  {
    id: "js-conditions",
    title: "Choose a delivery message",
    minutes: 22,
    goal: "Run one of two instructions based on a boolean condition.",
    prerequisites: ["js-comparisons"],
    why: "A shop should explain whether an order has free delivery or still needs a delivery charge.",
    explanation: [
      "An if statement lets the program choose. Put a condition in parentheses after if. Put the instructions for a true result inside a pair of curly braces. A block is the group of instructions inside those braces.",
      "An else block runs when the if condition is false. Only one of these two branches runs. You can check another case with else if; put a more specific or higher threshold first.",
      "Use a comparison that says exactly what you mean. total >= 20 includes an order of exactly 20. total > 20 would exclude it.",
    ],
    code: 'const total = 20;\nif (total >= 20) {\n  console.log("Free delivery");\n} else {\n  console.log("Delivery costs 3");\n}',
    walkthrough: [
      [1, 1, "Store the total before testing it."],
      [
        2,
        2,
        "`if` starts a choice. Parentheses contain the comparison. `{` begins the block for a true result.",
      ],
      [3, 3, "This instruction runs because 20 is at least 20."],
      [
        4,
        6,
        "Close the first block. `else` introduces the other block. Its message does not print in this run.",
      ],
    ],
    output: ["Free delivery"],
    prediction: {
      code: 'const total = 12;\nif (total >= 20) {\n  console.log("Free delivery");\n} else {\n  console.log("Delivery costs 3");\n}',
      question: "What one message is printed?",
      answer: ["Delivery costs 3"],
      explanation:
        "12 does not pass the comparison, so only the else block runs.",
    },
    guided: {
      goal: "Show the free-delivery message for a total of 20.",
      starting: "The current total is 12.",
      starter:
        'const total = 12;\nif (total >= 20) {\n  console.log("Free delivery");\n} else {\n  console.log("Delivery costs 3");\n}',
      solution:
        'const total = 20;\nif (total >= 20) {\n  console.log("Free delivery");\n} else {\n  console.log("Delivery costs 3");\n}',
      output: ["Free delivery"],
      change: "Change total to 20 and leave the two messages intact.",
      gap: {
        find: "total >= 20",
        with: "false",
        instructions:
          "Replace false with the comparison for an order of at least 20.",
      },
      bug: {
        find: ">=",
        with: ">",
        instructions:
          "Exactly 20 should qualify, but this comparison excludes it. Fix the boundary.",
        why: "The > operator excludes equality. At exactly 20 it produces false.",
        fix: "Use >= to include the threshold.",
      },
      hints: [
        "The boundary value matters. Qualifying starts at 20 itself.",
        "The condition is `total >= 20`.",
      ],
      explanation:
        "The comparison is true at 20, so the first block prints its message.",
    },
    independent: {
      goal: "Show whether a product is available.",
      starting: "There are zero items in stock.",
      starter: "",
      instructions:
        "Store stock as 0. If stock is greater than 0, print Available. Otherwise print Sold out.",
      expected: "Sold out",
      constraints: "Use if and else. Do not print both messages.",
      checks: outputCheck(["Sold out"]),
      solution:
        'const stock = 0;\nif (stock > 0) {\n  console.log("Available");\n} else {\n  console.log("Sold out");\n}',
      hints: [
        "Ask whether stock is above zero, then choose one message.",
        "Use `if (stock > 0)` and put Sold out in the else block.",
      ],
      explanation:
        "Zero stock fails the > 0 comparison, so the alternative branch runs.",
    },
    project: "shop-logic",
    connection:
      "Your shop can now communicate a delivery rule or an out-of-stock case.",
    recap: [
      "if runs a block when its condition is true; else handles the other case.",
      "Test the threshold itself as well as values on either side.",
    ],
    knowledge: {
      question:
        "If stock is 0, which block runs for if (stock > 0) ... else ...?",
      options: ["Only the if block", "Only the else block", "Both blocks"],
      answer: 1,
      explanation: "0 > 0 is false, so the else block runs.",
    },
  },
  {
    id: "js-functions",
    title: "Reuse a calculation with a function",
    minutes: 25,
    goal: "Write a calculation once, call it with different inputs, and return a result.",
    prerequisites: ["js-conditions"],
    why: "Every product needs the same price-times-quantity calculation. A function makes that rule reusable.",
    explanation: [
      "A function is a reusable set of instructions. Defining a function does not run it. Call it with parentheses when you want those instructions to run.",
      "A parameter is a name for an input inside the function. An argument is the actual value you pass in a call. In lineTotal(4, 3), 4 and 3 are arguments. They become price and quantity while that call runs.",
      "return gives a value back to the caller and ends that call. Returning 12 does not print it. console.log prints a value but is not a replacement for returning one. Without an explicit return, a normal function returns undefined.",
    ],
    code: "function lineTotal(price, quantity) {\n  return price * quantity;\n}\nconst total = lineTotal(4, 3);\nconsole.log(total);",
    walkthrough: [
      [
        1,
        1,
        "`function` declares reusable instructions. lineTotal is its name. The comma separates its two parameter names. `{` starts its body.",
      ],
      [
        2,
        3,
        "Multiply the inputs and return the number. `}` closes the function. Nothing has run yet.",
      ],
      [
        4,
        4,
        "Call lineTotal with 4 and 3. Store the returned result in total.",
      ],
      [
        5,
        5,
        "Print total. This separate instruction is why 12 appears in the console.",
      ],
    ],
    output: [12],
    prediction: {
      code: "function lineTotal(price, quantity) {\n  return price * quantity;\n}\nconsole.log(lineTotal(5, 2));",
      question: "What value is returned to console.log and then printed?",
      answer: [10],
      explanation:
        "The call receives 5 and 2, returns their product 10, and console.log prints that returned value.",
    },
    guided: {
      goal: "Reuse lineTotal to calculate 3 items priced at 5.",
      starting: "The call currently passes quantity 1.",
      starter:
        "function lineTotal(price, quantity) {\n  return price * quantity;\n}\nconsole.log(lineTotal(5, 1));",
      solution:
        "function lineTotal(price, quantity) {\n  return price * quantity;\n}\nconsole.log(lineTotal(5, 3));",
      output: [15],
      change:
        "Change the second argument from 1 to 3. Do not rewrite the calculation.",
      gap: {
        find: "return price * quantity",
        with: "return 0",
        instructions:
          "Replace 0 with the multiplication of the two parameters.",
      },
      bug: {
        find: "return price * quantity;",
        with: "console.log(price * quantity);",
        instructions:
          "The function prints its result instead of returning it. Restore return so the outer log receives a number.",
        why: "The inner log prints 15, but the function then returns undefined. The outer log prints that undefined value too.",
        fix: "Use return for the function result. Keep console.log at the call site.",
      },
      hints: [
        "Inputs belong to the call; the reusable rule belongs to the function.",
        "Call `lineTotal(5, 3)` and keep `return price * quantity` inside.",
      ],
      explanation:
        "The same body handles different input values. The caller decides what to do with its result.",
    },
    independent: {
      goal: "Write a reusable calculation that adds delivery.",
      starting: "The caller will supply an item total and a delivery charge.",
      starter: "",
      instructions:
        "Define orderTotal(itemsTotal, delivery). Return their sum. Do not print from inside the function.",
      expected:
        "orderTotal(12, 3) returns 15; orderTotal(0, 0) returns 0; orderTotal(8, 0) returns 8.",
      constraints:
        "Use the function name and parameter contract. A regular function or equivalent callable is accepted.",
      checks: [
        check(
          "Items plus delivery",
          "orderTotal(12, 3)",
          15,
          "Add the two inputs and return the sum. Logging it does not return it.",
        ),
        check(
          "An empty free order",
          "orderTotal(0, 0)",
          0,
          "Do not hard-code the sample total.",
        ),
        check(
          "Free delivery",
          "orderTotal(8, 0)",
          8,
          "Use the inputs supplied by each caller.",
        ),
      ],
      solution:
        "function orderTotal(itemsTotal, delivery) {\n  return itemsTotal + delivery;\n}",
      hints: [
        "The function needs two input names and one returned calculation.",
        "Its body can be `return itemsTotal + delivery;`.",
      ],
      explanation:
        "The checks call your function three times. They inspect returned values, not printed messages.",
    },
    project: "shop-logic",
    connection:
      "Reusable calculations let a shop use the same rules for many products and orders.",
    recap: [
      "Define once; call with arguments when needed.",
      "Parameters name inputs. return sends a result to the caller; console.log prints a message.",
    ],
  },
  {
    id: "js-arrow-functions",
    title: "Read a shorter function without losing its meaning",
    minutes: 20,
    goal: "Read and write a small arrow function.",
    prerequisites: ["js-functions"],
    why: "Array tools and React examples often receive short functions. Learn the syntax before meeting it inside another operation.",
    explanation: [
      "An arrow function is another way to write a function. In const double = (price) => price * 2, the parameter is price, the arrow separates inputs from the body, and the expression after the arrow is returned.",
      "For a single expression, the concise form returns that expression automatically. If you use a body with curly braces, write return explicitly. Parentheses around a single parameter are optional, but we keep them here for consistency.",
      "Arrow functions do not have their own this. For ordinary price calculations that does not matter; the prototypes lesson will show why methods sometimes need a regular function.",
    ],
    code: "const double = (price) => price * 2;\nconsole.log(double(4));",
    walkthrough: [
      [
        1,
        1,
        "Assign a function value to double. `(price)` is its input list. `=>` introduces the body. The expression `price * 2` is returned.",
      ],
      [2, 2, "Call the function with 4 and print its returned value, 8."],
    ],
    output: [8],
    prediction: {
      code: "const addOne = (number) => {\n  return number + 1;\n};\nconsole.log(addOne(5));",
      question: "What is printed?",
      answer: [6],
      explanation:
        "This version has a brace body, so it explicitly returns 5 + 1.",
    },
    guided: {
      goal: "Double a price of 6.",
      starting: "The call currently uses 4.",
      starter: "const double = (price) => price * 2;\nconsole.log(double(4));",
      solution: "const double = (price) => price * 2;\nconsole.log(double(6));",
      output: [12],
      change: "Change the call’s input to 6.",
      gap: {
        find: "price * 2",
        with: "0",
        instructions: "Replace 0 with the expression that doubles price.",
      },
      bug: {
        find: "=> price * 2",
        with: "=> { price * 2; }",
        instructions:
          "The new brace body no longer returns a value. Add return, or restore the concise expression.",
        why: "A brace body is a block. Unlike a concise expression body, it needs an explicit return.",
        fix: "Use `=> price * 2`, or `=> { return price * 2; }`.",
      },
      hints: [
        "A concise body returns its expression; a block needs return.",
        "The concise form is `(price) => price * 2`.",
      ],
      explanation:
        "Syntax may change without changing the calculation’s contract.",
    },
    independent: {
      goal: "Make a reusable one-unit discount.",
      starting: "The caller gives a numeric price.",
      starter: "",
      instructions:
        "Create a callable named discountOne that returns price minus 1.",
      expected: "discountOne(5) returns 4; discountOne(1) returns 0.",
      constraints:
        "Practise the arrow form. The behaviour check also accepts a regular function with the same result.",
      checks: [
        check(
          "Price 5",
          "discountOne(5)",
          4,
          "Return the input price minus one.",
        ),
        check(
          "Boundary price 1",
          "discountOne(1)",
          0,
          "Zero is a valid numeric result.",
        ),
      ],
      solution: "const discountOne = (price) => price - 1;",
      hints: [
        "Use one parameter and a subtraction expression.",
        "Assign `(price) => price - 1` to discountOne.",
      ],
      explanation:
        "The function can be passed to an array method in a later lesson because it is a value.",
    },
    project: "shop-logic",
    connection:
      "A small price transformation becomes useful when adjusting a whole collection.",
    recap: [
      "An arrow function is a function value.",
      "An expression body returns implicitly. A brace body needs return.",
    ],
    knowledge: {
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
  },
  {
    id: "js-loops",
    title: "Repeat instructions with a loop",
    minutes: 25,
    goal: "Repeat a message a controlled number of times.",
    prerequisites: ["js-functions"],
    why: "Programs often do the same job for several items. A loop repeats instructions without copying them by hand.",
    explanation: [
      "A loop repeats a block. A for loop states where to start, when to continue, and how to move to the next step. Its condition is checked before each repetition.",
      "In for (let count = 0; count < 3; count = count + 1), count starts at zero. If count is below 3, the body runs. Then count increases by one, and the condition is checked again. The two semicolons separate these three parts.",
      "A while loop repeats while its condition is true: while (count < 3) { ... }. You must update count inside that body. A loop whose condition never becomes false keeps running. Sprout stops long-running code so you can fix it.",
    ],
    code: 'for (let count = 0; count < 3; count = count + 1) {\n  console.log("Tea");\n}',
    walkthrough: [
      [
        1,
        1,
        "Declare a changing counter, test it, then specify its next value. Start at 0; continue for 0, 1, and 2.",
      ],
      [2, 2, "Print Tea once per repetition."],
      [
        3,
        3,
        "Close the repeated block. At count 3, the next condition is false and the loop ends.",
      ],
    ],
    output: ["Tea", "Tea", "Tea"],
    prediction: {
      code: "for (let count = 0; count < 2; count = count + 1) {\n  console.log(count);\n}",
      question: "Write the two counter values that print, in order.",
      answer: [0, 1],
      explanation:
        "The condition is checked before printing. 2 is not less than 2, so it is never printed.",
    },
    guided: {
      goal: "Print Tea exactly twice.",
      starting: "The loop currently repeats three times.",
      starter:
        'for (let count = 0; count < 3; count = count + 1) {\n  console.log("Tea");\n}',
      solution:
        'for (let count = 0; count < 2; count = count + 1) {\n  console.log("Tea");\n}',
      output: ["Tea", "Tea"],
      change: "Change the upper limit from 3 to 2.",
      gap: {
        find: "count = count + 1",
        with: "count = count",
        instructions: "Make the counter increase so the loop can finish.",
      },
      bug: {
        find: "count < 2",
        with: "count <= 2",
        instructions:
          "The loop repeats three times because equality is included. Make it repeat twice.",
        why: "Starting at 0 with <= 2 includes 0, 1, and 2. That is three repetitions.",
        fix: "Use count < 2, or choose a start and boundary that still produce exactly two repetitions.",
      },
      hints: [
        "Count the actual counter values, including zero.",
        "Starting at 0, the test `count < 2` allows 0 and 1.",
      ],
      explanation:
        "The start, condition, and update work together. Changing any one can change the repetition count.",
    },
    independent: {
      goal: "Write a reusable product announcer.",
      starting: "The caller supplies howMany as a non-negative whole number.",
      starter: "",
      instructions:
        "Define announce(howMany). Print Coffee once per repetition. For zero, print nothing.",
      expected: "announce(2) prints Coffee twice. announce(0) prints no lines.",
      constraints:
        "Use a loop and the howMany parameter. You may use for or while.",
      checks: [
        {
          kind: "log-call",
          label: "Two announcements",
          expression: "announce(2)",
          expected: ["Coffee", "Coffee"],
          help: "Start at zero and stop before howMany. Print once inside the loop.",
        },
        {
          kind: "log-call",
          label: "Zero announcements",
          expression: "announce(0)",
          expected: [],
          help: "Check the condition before the first repetition. Zero should enter no block.",
        },
      ],
      solution:
        'function announce(howMany) {\n  for (let count = 0; count < howMany; count = count + 1) {\n    console.log("Coffee");\n  }\n}',
      hints: [
        "Put a loop inside the function, using howMany as its limit.",
        "A counter starting at 0 with `count < howMany` also handles zero correctly.",
      ],
      explanation:
        "The tests capture printed lines from each call. No returned value is required for this printing task.",
    },
    project: "shop-logic",
    connection:
      "Loops will let your shop process multiple products instead of one fixed product.",
    recap: [
      "A loop needs a start, a condition, and a way to make progress.",
      "Check zero repetitions and the exact boundary to avoid extra iterations.",
    ],
    knowledge: {
      question:
        "How many times does a counter starting at 0 run while count < 3, increasing by 1?",
      options: ["Two", "Three", "Four"],
      answer: 1,
      explanation:
        "The body runs for counter values 0, 1, and 2. It stops before 3.",
    },
  },
  {
    id: "js-arrays",
    title: "Keep several products in an array",
    minutes: 25,
    goal: "Store an ordered list and read items by their position.",
    prerequisites: ["js-loops", "js-arrow-functions"],
    why: "A shop needs a collection of products instead of a separate variable for each one.",
    explanation: [
      "An array is an ordered collection of values. Square brackets enclose the collection, and commas separate its items. Each position has an index, starting at 0. products[0] reads the first item; products[1] reads the second.",
      "The .length property tells you how many items are in the array. An empty array, written [], has length 0. Reading an absent index produces undefined, so check the length before using an item when emptiness is possible.",
      "A for...of loop visits each value in an iterable collection such as an array: for (const product of products) { ... }. Unlike a numeric for loop, you do not manage an index yourself. We will use map and filter only after this basic collection model is clear.",
    ],
    code: 'const products = ["Tea", "Coffee"];\nconsole.log(products[0]);\nconsole.log(products.length);',
    walkthrough: [
      [
        1,
        1,
        "`[` and `]` create the array. The comma separates two text values.",
      ],
      [2, 2, "`[0]` reads the first stored value, Tea. Indices start at zero."],
      [
        3,
        3,
        "`.length` reads the number of items, 2. It is a property, so it is not called with parentheses.",
      ],
    ],
    output: ["Tea", 2],
    prediction: {
      code: 'const products = ["Tea", "Coffee", "Milk"];\nconsole.log(products[1]);\nconsole.log(products.length);',
      question: "What two values print?",
      answer: ["Coffee", 3],
      explanation:
        "Index 1 is the second item, while length counts all three items.",
    },
    guided: {
      goal: "Print the second product and the item count.",
      starting: "The code reads index 0 from an array of two products.",
      starter:
        'const products = ["Tea", "Coffee"];\nconsole.log(products[0]);\nconsole.log(products.length);',
      solution:
        'const products = ["Tea", "Coffee"];\nconsole.log(products[1]);\nconsole.log(products.length);',
      output: ["Coffee", 2],
      change: "Change the index so the first printed line is Coffee.",
      gap: {
        find: "products.length",
        with: "0",
        instructions: "Replace 0 with the property that counts all products.",
      },
      bug: {
        find: "products[1]",
        with: "products[2]",
        instructions:
          "The requested position is outside this two-item array. Read its second item instead.",
        why: "The available indices are 0 and 1. Index 2 has no item and produces undefined.",
        fix: "Use products[1] to read the second item.",
      },
      hints: [
        "Position names start at zero, while length is a count.",
        "Read the second item with `[1]` and the count with `.length`.",
      ],
      explanation:
        "An index and a count describe different things, even when both are numbers.",
    },
    independent: {
      goal: "Safely read the first product.",
      starting: "The caller supplies an array. It may contain no items.",
      starter: "",
      instructions:
        "Define firstProduct(products). Return the first item when present. Return the text No products for an empty array.",
      expected:
        'firstProduct(["Milk", "Tea"]) returns "Milk"; firstProduct([]) returns "No products".',
      constraints:
        "Use .length, a condition, and index 0. Do not change the input array.",
      checks: [
        check(
          "First item",
          'firstProduct(["Milk", "Tea"])',
          "Milk",
          "The first index is 0.",
        ),
        check(
          "Empty collection",
          "firstProduct([])",
          "No products",
          "Check length before reading the first item.",
        ),
      ],
      solution:
        'function firstProduct(products) {\n  if (products.length === 0) {\n    return "No products";\n  }\n  return products[0];\n}',
      hints: [
        "Handle the empty case before reading a position.",
        "If `products.length === 0`, return No products. Otherwise return products[0].",
      ],
      explanation:
        "A guard for an empty collection makes the function useful for a real shop’s empty state.",
    },
    project: "shop-logic",
    connection:
      "Your product data is now a collection, with an explicit answer when it is empty.",
    recap: [
      "Arrays preserve order. The first index is 0.",
      "length is an item count. Reading a missing position gives undefined.",
    ],
    knowledge: {
      question: 'What does ["Tea", "Coffee"][0] read?',
      options: ["Tea", "Coffee", "The number of items"],
      answer: 0,
      explanation: "An array’s first position has index 0.",
    },
  },
  {
    id: "js-array-methods",
    title: "Transform and select values with map and filter",
    minutes: 30,
    goal: "Make a new array by changing or selecting existing items.",
    prerequisites: ["js-arrays"],
    why: "A shop may need discounted prices or only products that match a search.",
    explanation: [
      "A callback is a function passed to another operation so that operation can call it. You already know how a function takes an input and returns a result. map calls a callback for each array item and collects its returned values into a new array.",
      "filter also calls a callback for each item. It keeps the original item when the callback’s result is truthy. Use a boolean comparison so the selection rule is explicit.",
      "Neither map nor filter changes the original array by itself. Their callbacks can still mutate objects if you write such code, so keep the callbacks focused on calculating a result. An empty input array produces an empty result.",
    ],
    code: "const prices = [2, 4];\nconst doubled = prices.map((price) => price * 2);\nconsole.log(doubled);",
    walkthrough: [
      [1, 1, "Create an array of numeric prices."],
      [
        2,
        2,
        "`.map(...)` receives the arrow function. For each price, it returns price * 2. map collects 4 and 8 into a new array.",
      ],
      [
        3,
        3,
        "Print the new array. The original prices array still contains 2 and 4.",
      ],
    ],
    output: [[4, 8]],
    prediction: {
      code: "const prices = [2, 8, 4];\nconst small = prices.filter((price) => price < 5);\nconsole.log(small);",
      question:
        "Write the resulting array as JSON, such as [1, 2]. Spaces do not matter.",
      answer: [[2, 4]],
      explanation:
        "filter keeps 2 and 4, because only those values are below 5. Their original order is preserved.",
    },
    guided: {
      goal: "Double every price in a three-price array.",
      starting:
        "The input contains 1, 2, and 3, but the code currently keeps them unchanged.",
      starter:
        "const prices = [1, 2, 3];\nconst doubled = prices.map((price) => price);\nconsole.log(doubled);",
      solution:
        "const prices = [1, 2, 3];\nconst doubled = prices.map((price) => price * 2);\nconsole.log(doubled);",
      output: [[2, 4, 6]],
      change: "Change the callback so it returns twice the input price.",
      gap: {
        find: "price * 2",
        with: "0",
        instructions: "Replace the callback’s 0 with the doubling expression.",
      },
      bug: {
        find: ".map(",
        with: ".filter(",
        instructions:
          "This task transforms values, but filter selects them. Choose the method that returns transformed values.",
        why: "filter keeps original items. A positive number from its callback is truthy, so this code keeps 1, 2, and 3 instead of doubling them.",
        fix: "Use map with a callback that returns price * 2.",
      },
      hints: [
        "A transformation needs a returned replacement value for each item.",
        "Use `.map((price) => price * 2)`.",
      ],
      explanation:
        "The callback describes one transformation. map applies it to the collection.",
    },
    independent: {
      goal: "Return only prices within a budget.",
      starting:
        "The caller supplies prices and a numeric limit. The limit itself is allowed.",
      starter: "",
      instructions:
        "Define affordable(prices, limit). Return a new array containing values less than or equal to limit, in their original order.",
      expected:
        "affordable([2, 8, 4], 4) returns [2, 4]; affordable([], 4) returns [].",
      constraints:
        "Do not mutate the input. A filter or loop solution is accepted.",
      checks: [
        check(
          "Includes the boundary",
          "affordable([2, 8, 4], 4)",
          [2, 4],
          "Use <= if the limit itself is allowed.",
        ),
        check(
          "No items",
          "affordable([], 4)",
          [],
          "An empty collection should stay empty.",
        ),
        check(
          "No affordable prices",
          "affordable([8, 9], 4)",
          [],
          "Keep only items that pass the comparison.",
        ),
      ],
      solution:
        "function affordable(prices, limit) {\n  return prices.filter((price) => price <= limit);\n}",
      hints: [
        "This is selection, not transformation. Keep each original price that passes.",
        "The callback can return `price <= limit`.",
      ],
      explanation:
        "The checks compare arrays and order, so different implementations can pass without matching this source code.",
    },
    project: "shop-logic",
    connection:
      "You can now build a price filter for the shop, while keeping its original data.",
    recap: [
      "A callback is a function given to an operation that will call it.",
      "map transforms each item; filter selects original items. Both return new arrays.",
    ],
    knowledge: {
      question: "Which operation keeps only items that pass a comparison?",
      options: ["map", "filter", "typeof"],
      answer: 1,
      explanation: "filter selects items. map transforms every item instead.",
    },
  },
  {
    id: "js-objects",
    title: "Describe a product with an object",
    minutes: 25,
    goal: "Group a product’s name, price, and availability and read their properties.",
    prerequisites: ["js-array-methods"],
    why: "Separate arrays of names and prices are easy to mix up. An object keeps information about one product together.",
    explanation: [
      'An object groups related values under named properties. A property has a name and a value. In { name: "Tea", price: 4 }, the colon associates each property name with its value, and a comma separates properties.',
      'Read a property with a dot: product.name. Square brackets can also read a property: product["name"]. A missing property produces undefined. Unlike an array index, a property name describes what the value means.',
      "Objects can be stored in arrays. A const variable can still refer to an object whose properties change; const prevents reassigning the name to a different object. Later we will copy objects when a React update needs a new value.",
    ],
    code: 'const product = { name: "Tea", price: 4 };\nconsole.log(product.name);\nconsole.log(product.price);',
    walkthrough: [
      [
        1,
        1,
        "Curly braces create an object here, not an instruction block. `name:` and `price:` label two values. The comma separates the properties.",
      ],
      [2, 2, "The dot reads the name property and passes its text to the log."],
      [3, 3, "Read and print the price property as a number."],
    ],
    output: ["Tea", 4],
    prediction: {
      code: 'const product = { name: "Milk", price: 3 };\nconsole.log(product.price * 2);',
      question: "What total prints for two of this product?",
      answer: [6],
      explanation:
        "product.price reads the number 3, which is multiplied by 2.",
    },
    guided: {
      goal: "Give Coffee a price of 5 and print both properties.",
      starting: "The object’s price is currently 4.",
      starter:
        'const product = { name: "Coffee", price: 4 };\nconsole.log(product.name);\nconsole.log(product.price);',
      solution:
        'const product = { name: "Coffee", price: 5 };\nconsole.log(product.name);\nconsole.log(product.price);',
      output: ["Coffee", 5],
      change: "Change the price property to 5.",
      gap: {
        find: "product.price",
        with: "0",
        instructions:
          "Replace 0 with the property read for the product’s price.",
      },
      bug: {
        find: "console.log(product.name)",
        with: "console.log(product.Name)",
        instructions:
          "The property name uses the wrong capital letter. Read the property actually stored on the object.",
        why: "Property names are case-sensitive. name exists, but Name does not.",
        fix: "Use product.name with a lowercase n.",
      },
      hints: [
        "Read the exact property name from the object declaration.",
        "Use `.name` for text and `.price` for the number.",
      ],
      explanation:
        "A product object keeps each field attached to the same product.",
    },
    independent: {
      goal: "Calculate the cost of one product object.",
      starting:
        "The caller supplies product with a numeric price, and a numeric quantity.",
      starter: "",
      instructions:
        "Define productTotal(product, quantity). Return the product’s price multiplied by quantity.",
      expected:
        'productTotal({ name: "Tea", price: 4 }, 3) returns 12. Quantity 0 returns 0.',
      constraints:
        "Use the supplied object; do not rely on one product name or price.",
      checks: [
        check(
          "Tea order",
          'productTotal({ name: "Tea", price: 4 }, 3)',
          12,
          "Read the price property before multiplying.",
        ),
        check(
          "A different product",
          'productTotal({ name: "Coffee", price: 5 }, 2)',
          10,
          "Use the caller’s product, not a hard-coded price.",
        ),
        check(
          "Zero quantity",
          "productTotal({ price: 4 }, 0)",
          0,
          "Zero quantity should produce zero.",
        ),
      ],
      solution:
        "function productTotal(product, quantity) {\n  return product.price * quantity;\n}",
      hints: [
        "The input object holds the numeric field you need.",
        "Return `product.price * quantity`.",
      ],
      explanation:
        "The same function works for objects with different names and prices because it reads the price field.",
    },
    project: "shop-logic",
    connection:
      "Your shop now has a reusable product shape and calculations that work with it.",
    recap: [
      "Objects group related values under property names.",
      "Use exact property names. Arrays order items; objects describe fields.",
    ],
  },
];
