# An HTML5 lexer for safe template languages

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@alshdavid/html-lexer.svg
[npm-url]: https://npmjs.org/package/@alshdavid/html-lexer

A standard compliant, incremental/ streaming HTML5 lexer.

This is an HTML5 lexer designed to be used a basis for safe and HTML-context
aware template languages, IDEs or syntax highlighters. It is different from the
other available tokenizers in that it preserves all the information of the
input string, e.g. formatting, quotation style and other idiosyncrasies. It
does so by producing annotated chunks of the input string rather than the
slightly more high level tokens that are described in the specification.
However, it does do so in a manner that is compatible with the language defined
in the [HTML5 specification][1].

[1]: https://html.spec.whatwg.org/multipage/syntax.html#tokenization

The main motivation for this project is a jarring absence of safe HTML
template languages. By safe, I mean that the template placeholders are typed
according to their context, and that the template engine ensures that the
strings that come to fill the placeholders are automatically and
correctly escaped to yield valid HTML.

## Usage

The produced tokens are simply tuples (arrays) `[type, chunk]` of a token type
and a chunk of the input string.

### Basic usage

```javascript
import { Lexer } from "@alshdavid/html-lexer"

const result = Lexer.tokenize("<h1>Hello, World</h1>")
```

### Chunked usage

The lexer has a ‘push parser’ API. Writes are listened to using the subscribable method `onWrite`, returning an unsubscribe function.

Example:

```javascript
import { Lexer } from "@alshdavid/html-lexer"

// Create lexer
const lexer = new Lexer()

// Stream tokens synchronously as they are parsed
lexer.onWrite((token) => console.log(token))
lexer.onEnd(() => console.log("Job's done"))

// Write tokens
lexer.write("<h1>Hello, World</h1>")

// Closes lexer, no more writes can occur
lexer.end()
```
### Results

Both of the examples will create an output that looks like this:

```javascript
["startTagStart", "<"]
["tagName", "h1"]
["tagEnd", ">"]
["data", "Hello,"]
["space", " "]
["data", "World"]
["endTagStart", "</"]
["tagName", "h1"]
["tagEnd", ">"]
```

The lexer is incremental: `onWrite` will be called as soon as a token is
available and you can split the input across multiple writes:

```javascript
const lexer = new Lexer()

lexer.onWrite((token) => console.log(token))

lexer.write("<h")
lexer.write("1>Hello, W")
lexer.write("orld</h1>")

lexer.end()
```

## Token types

The tokens emitted are simple tuples `[type, chunk]`.
The type of a token is just a string, and it is one of:

- `attributeAssign`
- `attributeName`
- `attributeValueData`
- `attributeValueEnd`
- `attributeValueStart`
- `bogusCharRef`
- `charRefDecimal`
- `charRefHex`
- `charRefLegacy`
- `charRefNamed`
- `commentData`
- `commentEndBogus`
- `commentEnd`
- `commentStartBogus`
- `commentStart`
- `data`
- `endTagStart`
- `lessThanSign`
- `uncodedAmpersand`
- `newline`
- `nulls`
- `plaintext`
- `rawtext`
- `rcdata`
- `space`
- `startTagStart`
- `tagEndAutoclose`
- `tagEnd`
- `tagName`
- `tagSpace`

The `uncodedAmpersand` is emitted for ampersand `&` characters that _do not_ start a character reference.

The `tagSpace` is emitted for 'space' between attributes in
element tags.

Otherwise the names should be self explanatory.

## Limitations

- Doctype  
  The lexer still interprets doctypes as 'bogus comments'.

- CDATA  
  The lexer interprets CDATA sections as 'bogus comments'.  
  (CDATA is only allowed in foreign content - svg and mathml.)

- Script tags  
  The lexer interprets script tags as rawtext elements.
  This has no dire consequences, other than that html begin and
  end comment tags that may surround it, are not marked as such.

## License

The source code for this project is licensed under the _Mozilla Public License Version 2.0_, copyright Alwin Blok 2016–2018, 2020–2021, 2023.
