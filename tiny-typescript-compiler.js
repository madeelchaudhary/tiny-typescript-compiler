// Description: A tiny compiler that compiles Typescript-like syntax to JavaScript-like syntax.
// Goal: Convert simple Typescript function to JavaScript function.

// Example input:
// function add(a: number, b: number): number {
//   return a + b;
// }

// Example output:
// function add(a, b) {
//   return a + b;
// }

// Tokenizer: Breaks down the input string into tokens
export function tokenizer(input) {
  let current = 0;
  const tokens = [];

  while (current < input.length) {
    let char = input[current];

    // Check for parentheses
    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      current++;
      continue;
    }

    // Check for braces
    if (char === "{" || char === "}") {
      tokens.push({ type: "brace", value: char });
      current++;
      continue;
    }

    // Check for colon
    if (char === ":") {
      tokens.push({ type: "colon", value: ":" });
      current++;
      continue;
    }

    // Check for comma
    if (char === ",") {
      tokens.push({ type: "comma", value: "," });
      current++;
      continue;
    }

    // Check for semicolon
    if (char === ";") {
      tokens.push({ type: "semicolon", value: ";" });
      current++;
      continue;
    }

    // Check for 'return' keyword
    if (input.slice(current, current + 6) === "return") {
      tokens.push({ type: "return", value: "return" });
      current += 6;
      continue;
    }

    // Check for 'function' keyword
    if (input.slice(current, current + 8) === "function") {
      tokens.push({ type: "function", value: "function" });
      current += 8;
      continue;
    }

    // Skip whitespace
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // Check for numbers
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "number", value });
      continue;
    }

    // Check for letters (identifiers)
    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "name", value });
      continue;
    }

    // Check for strings
    if (char === '"') {
      let value = "";
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      current++;
      tokens.push({ type: "string", value });
      continue;
    }

    // Check for operators
    const OPERATORS = /[+\-*\/]/;
    if (OPERATORS.test(char)) {
      tokens.push({ type: "operator", value: char });
      current++;
      continue;
    }

    throw new Error("Unknown token: " + char);
  }

  return tokens;
}

// Parser: Converts tokens into an Abstract Syntax Tree (AST)
export function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;
      return { type: "number", value: token.value };
    }

    if (token.type === "operator") {
      current++;
      return { type: "operator", value: token.value };
    }

    if (token.type === "string") {
      current++;
      return { type: "string", value: token.value };
    }

    if (token.type === "name") {
      current++;
      return { type: "name", value: token.value };
    }

    if (token.type === "return") {
      token = tokens[++current];
      let node = { type: "return", value: [] };
      while (token.type !== "semicolon") {
        node.value.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }

    if (token.type === "function") {
      token = tokens[++current];
      let node = {
        type: "function",
        name: token.value,
        params: [],
        returnType: null,
        body: [],
      };

      token = tokens[++current];
      if (token.type !== "paren" || token.value !== "(") {
        throw new TypeError(
          "Opening parenthesis expected after function keyword."
        );
      }

      token = tokens[++current];
      while (token.type !== "paren" || token.value !== ")") {
        if (token.type === "name") {
          const param = { type: "name", value: token.value };
          token = tokens[++current];
          if (token.type === "colon") {
            token = tokens[++current];
            if (token.type === "name") {
              param.paramType = token.value;
              token = tokens[++current];
            }
          }
          if (token.type === "comma") {
            token = tokens[++current];
          }
          node.params.push(param);
        }
        token = tokens[current];
      }

      token = tokens[++current];
      if (token.type !== "colon" || token.value !== ":") {
        throw new TypeError("Colon expected after function parameters.");
      }

      token = tokens[++current];
      if (token.type !== "name") {
        throw new TypeError("Return type expected after colon.");
      }
      node.returnType = token.value;

      token = tokens[++current];
      if (token.type !== "brace" || token.value !== "{") {
        throw new TypeError(
          "Opening brace expected after function return type."
        );
      }

      token = tokens[++current];
      while (token.type !== "brace" || token.value !== "}") {
        node.body.push(walk());
        token = tokens[current];
      }

      current++;
      return node;
    }

    if (
      token.type === "colon" ||
      token.type === "comma" ||
      token.type === "semicolon"
    ) {
      current++;
      return { type: token.type, value: token.value };
    }

    throw new Error("Unknown token: " + token.type);
  }

  let ast = { type: "Program", body: [] };
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}

// Code Generator: Converts AST back into code (JavaScript in this case)
export function codeGenerator(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGenerator).join("\n");
    case "function":
      return `function ${node.name}(${node.params
        .map((param) => param.value)
        .join(", ")}) {
          ${node.body.map(codeGenerator).join("\n")}
        }`;
    case "return":
      return `return ${node.value.map(codeGenerator).join("")};`;
    case "number":
    case "string":
    case "name":
    case "operator":
      return node.value;
    case "colon":
    case "comma":
    case "semicolon":
      return node.value;
    default:
      throw new TypeError("Unknown node type: " + node.type);
  }
}

// Main compiler function that ties everything together
export function compiler(input) {
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const output = codeGenerator(ast);
  return { tokens, ast, output };
}
