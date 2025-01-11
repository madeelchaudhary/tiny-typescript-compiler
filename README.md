# Tiny TypeScript Compiler

A simple TypeScript-to-JavaScript compiler that converts TypeScript-like functions into JavaScript functions. This project demonstrates the core concepts of building a compiler, including tokenization, parsing, and code generation.

## Features

- **Tokenization**: Breaks the input TypeScript code into manageable tokens.
- **Parsing**: Converts the tokens into an Abstract Syntax Tree (AST).
- **Code Generation**: Generates JavaScript code from the AST.

## Example Input and Output

### Input

```typescript
function greet(name: string): string {
  return "Hello, " + name;
}
```

### Output

```javascript
function greet(name) {
  return "Hello, " + name;
}
```

## How It Works

The compiler consists of three main components:

1. **Tokenizer**: Reads the input code character by character and identifies tokens such as keywords, parentheses, braces, colons, and variable names.
2. **Parser**: Converts the tokens into an Abstract Syntax Tree (AST) for structured representation.
3. **Code Generator**: Traverses the AST to produce valid JavaScript code.

## Limitations

- Handles only basic TypeScript function syntax.
- Does not support advanced TypeScript features such as interfaces, generics, or type aliases.
