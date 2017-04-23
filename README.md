An HTML5 lexer for safe template languages
==========================================

This is an HTML5 lexer designed to be used a basis for safe and HTML-context 
aware template languages, IDEs or syntax highlighters. It is different from the 
other available tokenizers in that it preserves all the information of the 
input string, e.g. formatting, quotation style and other idiosyncrasies. It 
does so by producing annotated chunks of the input string rather than the 
slightly more high level tokens that are described in the specification. 
However, it does so however in a manner that is compatible with the language 
defined in the [HTML5 specification][1]. 

The main motivation for this project is a complete absence of safe HTML 
template languages. By safe, I mean that the template placeholders are typed 
according to their context, and that the template engine ensures that the 
strings that come to fill the placeholders are correctly escaped and will yield 
valid HTML. 

Usage
-----

The produced tokens are simply tuples (arrays) `[type, chunk]` of a token type
and a chunk of the input string.

To tokenize an entire string at once

	var TokenStream = require ('html-lexer')
		, sample = '<span class="hello">Hello, world</span>'
	
	console.log(new TokenStream(sample).toArray())


To incrementally tokenize a string:

	var TokenStream = require ('html-lexer')
		, sample = '<span class="hello">Hello, world</span>'
		, tokens = new TokenStream(sample)
		
	var token = tokens.next()
	while (token != null) {
		console.log (token)
		// do something with token
		token = tokens.next()
	}


To incrementally tokenize a string whilst tracking the token positions:

	var TokenStream = require ('html-lexer')
		, sample = '<span class="hello">Hello, world</span>'
		, tokens = new TokenStream(sample)
		
	var info = tokens.info()
		, token = tokens.next()
		
	while (token != null) {
		console.log (info, token)
		info = tokens.info()
		token = tokens.next()
	}


Token types
-----------

The tokens emitted are simple tuples `[type, chunk]`, or
`["error", message, position]` where position is the position in the input
string at which the error occurs: an object `{ position, line, column }`. 

The type of a token is just a string, and it is one of:

- attributeData
- attributeName
- beginAttributeValue
- beginBogusComment
- beginComment
- beginEndTag
- beginStartTag
- bogusCharRef
- bogusCommentData
- commentData
- data
- decimalCharRef
- endTagPrefix
- equals
- finishAttributeValue
- finishBogusComment
- finishComment
- finishSelfClosingTag
- finishTag
- hexadecimalCharRef
- lessThanSign
- namedCharRef
- unresolvedNamedCharRef
- plaintext
- rawtext
- rcdata
- space
- spaceMissing
- tagName

The `"bogusCharRef"` is emitted for sequences that start with an ampersand,
but that *do not* start a character reference, specifically, one of `"&"`,
`"&#"`, `"&#X"` or `"&#x"`. 

The `"unresolvedNamedCharRef"` is emitted for named character references that are not known to
the lexer. They may be valid and resolve to a character, or they may be unknown in which case they
would be interpreted as data. See notes/charrefs.txt for details. 

The `"space"` and `"spaceMissing"` are emitted for space between attributes in
element tags. 

Otherwise the names should be self explanatory.


Limitations
-----------

A fair subset, but not all of the states in the specification is
implemented. See notes/checklist.txt for more details. 

* Doctype  
	The doctype states are not implemented.  
	The lexer interprets doctypes as 'bogus comments'. 

* CDATA  
	The lexer interprets CDATA sections as 'bogus comments'.  
	(CDATA is only allowed in foreign content - svg and mathml.)

* Script tags  
	The lexer interprets script tags as rawtext elements.  
	(And I think this is correct.)


[1]: https://html.spec.whatwg.org/multipage/syntax.html#tokenization
[2]: https://github.com/tildeio/simple-html-tokenizer
