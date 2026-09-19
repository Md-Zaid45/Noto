export function doc(...c) { return { type: "doc", content: c }; }
export function h(t, l = 1) { return { type: "heading", attrs: { level: l }, content: [{ type: "text", text: t }] }; }
export function p(...s) { return { type: "paragraph", content: s.map(x => typeof x === "string" ? { type: "text", text: x } : x) }; }
export function b(t) { return { type: "text", text: t, marks: [{ type: "bold" }] }; }
export function it(t) { return { type: "text", text: t, marks: [{ type: "italic" }] }; }
export function st(t) { return { type: "text", text: t, marks: [{ type: "strike" }] }; }
export function cd(t) { return { type: "text", text: t, marks: [{ type: "code" }] }; }
export function bq(...paras) { return { type: "blockquote", content: paras.map(x => typeof x === "string" ? p(x) : x) }; }
export function cb(code, lang = "") { return { type: "codeBlock", attrs: lang ? { language: lang } : {}, content: [{ type: "text", text: code }] }; }
export function ul(...items) { return { type: "bulletList", content: items.map(x => ({ type: "listItem", content: [typeof x === "string" ? p(x) : x] })) }; }
export function ol(...items) { return { type: "orderedList", content: items.map(x => ({ type: "listItem", content: [typeof x === "string" ? p(x) : x] })) }; }
export function hr() { return { type: "horizontalRule" }; }
