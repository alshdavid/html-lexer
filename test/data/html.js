
var samples = 
{ namedCharRefInData: 'char ref in &amp; data'
, nonTerminatedNamedCharRefInData: 'char ref in &amp data'
, hexadecimalCharRefInData: 'hexadecimal ref &#xccc; in data'
, nonTerminatedHexadecimalCharRefInData: 'hexadecimal ref &#xccc in data'
, decimalCharRefInData: 'decimal ref &#1092; in data'
, nonTerminatedDecimalCharRefInData: 'decimal ref &#110 in data'
, specialCharRef: '<input value=asda&not*=c></input>'
, specialCharRef2: '<input value=asda&not=c></input>'
, specialCharRef3: '<input value="asda&notit; I tell you"></input>'
, nonSpecialCharRef: '<input value=asda&notin*=c></input>'
, nonSpecialCharRef2: '<input value=asda&notin=c></input>'
, nonSpecialCharRef3: '<input value=asda&notin;=c></input>'
, specialCharRefInData: 'special charRef &not*=c'
, specialCharRef2InData: 'special charRef &not=c'
, specialCharRef3InData: 'special charRef &notit; I tell you'
, nonSpecialCharRefInData: 'nonspecial charRef &notin*=c'
, nonSpecialCharRef2InData: 'nonspecial charRef &notin=c'
, nonSpecialCharRef3InData: 'nonspecial charRef &notin;=c'
, namedCharRefInAttribute: 'hello <input value="you &amp; me"/> and more'
, namedCharRefInAttribute2: 'hello <input value=\'you &amp; me\'/> and more'
, namedCharRefInAttribute3: 'hello <input value=you&#12me /> and more'
, namedCharRefInAttribute4: 'hello <input value=&amp;me /> and more'
, namedCharRefInAttribute5: 'hello <input value=&amp attr=val /> and more'
, namedCharRefInAttribute6: 'hello <input value=&ampo attr=val /> and more'
, bogusCharRefInAttribute: 'hello <input value="you &# am me"/> and more'
, bogusCharRefInAttribute2: 'hello <input value=\'you &# amp me\'/> and more'
, bogusCharRefInAttribute3: 'hello <input value=you&x ampme /> and more'
, rcdata: '<textarea> asdf & &amp; <textareaNot </textarea> and more'
, rcdata2: '<textarea> asdf & &amp; </textarea( and not ending> it'
, rcdata3: '<textarea> asdf & &amp; </textarea/ and not ending> it'
, rcdata4: '<textarea> asdf & &amp; </textarea and not ending> it'
, rawtext: '<script> asdf &amp; <span> </scriptNot </script> and more'
, rawtext2: '<script> asdf &amp; <span> </script( and not ending> it'
, rawtext3: '<script> asdf &amp; <span> </script/ and not ending> it'
, rawtext4: '<script> asdf &amp; <span> </script and not ending> it'
, script: '<!doctype html>hello <script><!-- asdf</script> thus'
}


var EOFSamples =
{ data: 'eof in da'
, tagOpen: 'eof in <'
, tagName: 'eof in <d'
, selfClosingStartTag: 'in <div /'
, endTagOpen: 'in </a'
, beforeAttributeName: '<div '
, attributeName: '<div at'
, afterAttributeName: '<div attr '
, beforeAttributeValue: '<div attr ='
, attributeValueDoubleQuoted: '<div attr="te'
, attributeValueSingleQuoted: '<div attr=\'te'
, attributeValueUnquoted: '<div attr=te'
, afterAttributeValueQuoted: '<div attr="test"'
, markupDeclarationOpen: 'An eof in a markup decl <!'
, selfClosingTag: 'An eof after a / <span /'
, commentStart: 'An eof in a comment start <!--'
, commentStartDash: 'An eof in a comment start dash <!---'
, comment: 'An eof in a comment <!-- hello th'
, commentEndDash: 'An eof in a comment end dash <!-- hello th -'
, commentEnd: 'An eof in a comment end <!-- hello th --'
, commentEndBang: 'An eof in a comment end bang <!-- hello th --!'
, bogusComment: '<! bogus comment'
, charRefIn_: 'data &'
, numericCharRef: 'data &#'
, hexadecimalCharRef: 'data &#x'
, hexDigits: 'data &#x1a'
, decimalCharRef: 'data &#1'
, namedCharRef: 'data &name'
, namedCharRefInAttr: '<span attr="asd&amp;a&b c">text</span>'
, namedCharRefInData: 'named charref in data asd&amp;a&b cde'
, rawtext: 'eof in raw text <script> funct'
, plaintext: 'eof in raw text <plaintext> asdf'
, rawtextLessThanSign: 'eof in raw text less than sign <script> if (i<'
, rawtextEndTagOpen: 'eof in raw text end tag open <script> asdf </'
}


var weirdSamples = 
{ nonAlphaTag: 'This is not a <ém attr>tag</ém>'
, doubleOpenTag: 'A double less than sign <<div attr>content</div>'
, badEndTag: '<div style=color:blue> This is blue </ div> And this too!'
, comment1: 'comment <!-- with -> within --> and subsequent data'
, comment2: 'comment <!-- with bogus end -> and subsequent data'
, comment3: '<!-- Comment with -- double dash within --> and subsequent data'
, comment4: '<!-- Comment with --!- weird stuff within --> and subsequent data'
, comment5: '<!-- Comment with strange end --!> and subsequent data'
, comment6: '<!--!> and such'
, comment7: '<!--> and such'
, comment8: '<!-> and such'
, comment9: '<!---!> and such'
, comment10: '<!----!> and such'
, missingSpace: 'attribues connected <div name="a"name="b" >'
, nonAlphaAttr: 'weird template tag <div {name="a" name="b" >'
, bogus1: 'bogus comment <! with end !@> and subsequent data'
, bogus2: 'bogus comment </ with end !@> and subsequent data'
, bogus3: 'bogus comment <? with end !@> and subsequent data'
, bogus4: 'bogus comment <!- with end -> and subsequent data'
, bogus5: 'An empty bogus comment <!>'
, invalidMD: '<!weird markup declaration>'
, normalHtml: 'This is <span class = "s1">html</span> Yeah!'
, autocloseAttempt: 'This is <span / attr >html</span> Yeah!'
, closePlaintext: 'hi <plaintext>asd<as &ap, </plaintext> cannot be ended'
, unescapedAmp: 'data & such'
, unescapedAmpHash: 'data &# such'
, unescapedAmpHashEx: 'data &#x such'
, unescapedAmpHashExZed: 'data &#xz such'
, hexDigits: 'data &#xa such'
, decimalCharRef: 'data &#1 such'
, namedCharRef: 'data &name such'
, ampHash: 'data &amp;# such'
, slashes: '<span/////name////=/blabla>'
, weirdEquals: '<span attr = / asd >content</span>'
, weirdEquals2: '<span attr = @ asd >content</span>'
, weirdEquals3: '<span attr /= asd >content</span>'
, weirdEquals4: '<span attr @= asd >content</span>'
, dangerousSlash1: '<span name=/ >asdf'
, dangerousSlash2: '<span name=/>asdf'
, dangerousSlash3: '<span name= / />asdf'
, missingValue: '<span name=>asdf'
, invalidAttributeValue1: '<div class= =at >'
, invalidAttributeValue2: '<div class= <at >'
, invalidAttributeValue3: '<div class= `at >'
}


module.exports = 
{ samples: samples
, EOFSamples: EOFSamples
, weirdSamples: weirdSamples }