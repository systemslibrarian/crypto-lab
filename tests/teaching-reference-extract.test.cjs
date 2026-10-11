'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {extractFile,roleFor,GENERATOR_VERSION}=require('../tools/teaching-reference-extract.js');
const root=path.join(__dirname,'../tools/fixtures/teaching-reference');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const pinned={sourceSha:'a'.repeat(40),repository:'https://github.com/example/source'};
function fixture(file){return extractFile({path:file,bytes:fs.readFileSync(path.join(root,file)),...pinned});}
function exact(file,result){const source=fs.readFileSync(path.join(root,file),'utf8'),lines=source.split('\n');for(const section of result.sections){assert.equal(section.file,file);assert.match(section.id,/^[A-Za-z0-9._:-]+$/);assert.ok(lines.slice(section.startLine-1,section.endLine).join('\n').includes(section.sourceText),JSON.stringify(section));assert.equal(section.sha256,hash(section.sourceText));assert.match(section.verification,/unverified/);}}
test('root HTML preserves exact entities, source spans and learner attributes while excluding comments/styles',()=>{
 const r=fixture('root/index.html');assert.equal(r.state,'readable');assert.equal(r.language,'html');exact('root/index.html',r);
 const words=r.sections.map(s=>s.sourceText);assert.ok(words.includes('Exact A&amp;B explanation'));assert.ok(words.includes('title'));assert.ok(words.includes('Learner warning'));assert.ok(words.includes('Enter a message'));assert.ok(words.includes('Try this'));
 assert.ok(words.some(s=>s.includes('What changes when the nonce repeats?')));assert.ok(words.some(s=>s.includes('Incorrect. Compare')));
 assert.ok(!words.some(s=>/Fake question|Fake explanation|commented quiz|CSS-only/.test(s)));assert.ok(r.gaps.some(g=>g.kind==='entity-wording'));assert.ok(r.gaps.some(g=>g.kind==='dynamic-interpolation'));
 assert.ok(r.sections.some(s=>s.surface==='hidden-or-template-candidate'));
});
test('nested docs preserve warnings, quiz wording and code examples without execution claims',()=>{
 const r=fixture('nested/demos/web/README.md');exact('nested/demos/web/README.md',r);assert.equal(r.role,'documentation');assert.ok(r.sections.some(s=>s.sourceText.includes('```rust')));assert.ok(r.citations.some(c=>c.url==='https://www.rfc-editor.org/rfc/rfc5869'&&c.verification==='source-cited-unverified-primary'));
});
test('JSX source includes text and conditional feedback as candidates, not proven rendering',()=>{
 const r=fixture('nested/demos/web/src/view.tsx');exact('nested/demos/web/src/view.tsx',r);assert.ok(r.sections.some(s=>s.sourceText==='Compare the two outputs.'));assert.ok(r.sections.some(s=>s.sourceText==='Next explanation'));assert.ok(r.sections.some(s=>s.sourceText.includes('Correct answer.')));assert.ok(!r.sections.some(s=>s.sourceText.includes('Commented explanation')||s.sourceText.includes('deadbeef')));assert.ok(r.gaps.some(g=>g.kind==='jsx-parser-limit'));assert.ok(r.gaps.some(g=>g.kind==='dynamic-interpolation'));assert.ok(r.symbols.some(s=>s.name==='Lesson'&&s.verification==='not-executed-or-reviewed'));
});
test('native/WASM fixture distinguishes Rust/C candidates, comments, references and opaque bytes',()=>{
 for(const file of ['nested/wasm/src/lib.rs','nested/wasm/wrapper.c']){const r=fixture(file);exact(file,r);assert.ok(r.sections.some(s=>s.surface==='native-string-candidate'));assert.ok(!r.sections.some(s=>/Commented native|Commented C/.test(s.sourceText)));assert.ok(r.gaps.some(g=>g.kind==='native-parser-limit'));}
 const r=fixture('nested/wasm/src/lib.rs');assert.ok(r.citations.some(c=>c.url.endsWith('rfc9106')));assert.ok(r.symbols.some(s=>s.name==='explain_model'));
 const wasm=fixture('nested/wasm/model.wasm');assert.equal(wasm.state,'opaque');assert.equal(wasm.sections.length,0);assert.ok(wasm.gaps.some(g=>g.kind==='opaque'));
});
test('localizations retain raw escapes and require runtime binding review',()=>{
 const r=fixture('locales/fr.json');exact('locales/fr.json',r);assert.ok(r.sections.some(s=>s.sourceText.includes('Quelle hypothèse')));assert.ok(r.sections.some(s=>s.sourceText.includes('\\\\u00e9')));assert.ok(r.gaps.some(g=>g.kind==='data-binding'));assert.ok(!r.sections.some(s=>s.sourceText==='"question"'));
});
test('unsupported, invalid encoding, missing bytes, malformed formats and minified/vendor source remain distinct',()=>{
 assert.equal(fixture('unsupported/solver.py').state,'unsupported');assert.equal(extractFile({path:'a.txt',bytes:Buffer.from([255])}).state,'unreadable');assert.equal(extractFile({path:'a.txt'}).state,'unreadable');
 for(const [file,source,kind] of [['a.json','{"question":"No closing brace"','malformed-json'],['index.html','<script>const question="Unclosed script";','malformed-markup'],['README.md','```js\nconst text="Open fence";','malformed-markdown']]){const r=extractFile({path:file,bytes:Buffer.from(source)});assert.equal(r.state,'readable');assert.ok(r.gaps.some(g=>g.kind===kind));}
 const vendor=extractFile({path:'vendor/runtime.js',bytes:Buffer.from('const warning="Do not dump vendor source";')});assert.equal(vendor.state,'readable');assert.equal(vendor.sections.length,0);assert.ok(vendor.gaps.some(g=>g.kind==='vendor-or-compressed-source'));
});
test('dependency manifests and locks are inventoried without resolved-version/key wording inflation',()=>{
 for(const file of ['package.json','package-lock.json','nested/npm-shrinkwrap.json']){const r=extractFile({path:file,bytes:Buffer.from('{"name":"A package description","packages":{"node_modules/a":{"version":"1.2.3","resolved":"https://registry.npmjs.org/a/-/a-1.2.3.tgz","description":"not learner copy"}}}')});assert.equal(r.role,'dependencies');assert.equal(r.state,'readable');assert.deepEqual(r.sections,[]);assert.deepEqual(r.citations,[],'registry URLs are dependency inventory, not teaching citations');}
 assert.equal(roleFor('Cargo.lock'),'dependencies');
 const agent=extractFile({path:'AGENTS.md',bytes:Buffer.from('Instructions for an agent, not the learner interface.')});assert.equal(agent.role,'config');assert.equal(agent.sections.length,0);assert.ok(agent.gaps.some(g=>g.kind==='maintainer-instructions'));
});
test('deterministic output, structural IDs and exact CRLF spans do not advance review pins',()=>{
 assert.equal(GENERATOR_VERSION,'teaching-extract-v3');const bytes=Buffer.from('<p title="title">Original wording.</p>\r\n<p>Second explanation.</p>\r\n');const input={path:'index.html',bytes,...pinned},first=extractFile(input);assert.deepEqual(first,extractFile(input));
 const second=extractFile({...input,bytes:Buffer.from(bytes.toString().replace('Original wording.','Changed wording.'))});assert.deepEqual(first.sections.map(s=>s.id),second.sections.map(s=>s.id));assert.notEqual(first.sections.find(s=>s.kind==='markup-text').sha256,second.sections.find(s=>s.kind==='markup-text').sha256);assert.equal(first.lastReviewedSha,undefined);assert.equal(first.sourceSha,undefined);
 for(const s of first.sections)assert.ok(bytes.toString().split('\n').slice(s.startLine-1,s.endLine).join('\n').includes(s.sourceText));
});
test('untrusted source is never evaluated and extraction limits remain explicit',()=>{
 delete globalThis.__teachingExtractionExecuted;const r=extractFile({path:'lesson.js',bytes:Buffer.from('const question="Do not execute this"; globalThis.__teachingExtractionExecuted=true;')});assert.equal(globalThis.__teachingExtractionExecuted,undefined);assert.ok(r.sections.length);
 const huge=extractFile({path:'README.md',bytes:Buffer.alloc(1500001,65)});assert.equal(huge.state,'readable');assert.deepEqual(huge.sections,[]);assert.ok(huge.gaps.some(g=>g.kind==='extraction-limit'));
 const generic=extractFile({path:'source.tsx',bytes:Buffer.from('const identity = <T>(value: T) => value;')});assert.ok(!generic.sections.some(s=>s.kind==='markup-text'));
 assert.ok(generic.gaps.some(g=>g.kind==='lexical-extraction'),'zero extracted wording is not complete wording coverage');
});
test('nested template interpolation remains one exact raw source span without evaluating branches',()=>{
 const source='const explanation = `Outer ${choose({ label: `Nested ${result}`, callback: () => "Alternate explanation" })} final wording.`;';
 const r=extractFile({path:'src/ui.ts',bytes:Buffer.from(source)}),section=r.sections.find(s=>s.kind==='dynamic-template');
 assert.ok(section);assert.equal(section.sourceText,source.slice(source.indexOf('`'),source.lastIndexOf('`')+1));assert.ok(section.sourceText.endsWith('final wording.`'));assert.equal(section.sha256,hash(section.sourceText));assert.ok(r.gaps.some(g=>g.kind==='dynamic-interpolation'));
});
test('JSX apostrophes survive while comment markup and typed generics do not become learner copy',()=>{
 const source='// <p>Commented fake wording</p>\nconst identity = <T>(v: T) => v;\nfunction Lesson(){ return <section><p>Don\'t silently correct this sentence.</p>{/* <p>Hidden comment wording</p> */}<p>Real second explanation.</p></section>; }';
 const r=extractFile({path:'src/lesson.tsx',bytes:Buffer.from(source)});assert.ok(r.sections.some(s=>s.sourceText==="Don't silently correct this sentence."));assert.ok(r.sections.some(s=>s.sourceText==='Real second explanation.'));assert.ok(!r.sections.some(s=>s.kind==='markup-text'&&/Commented fake|Hidden comment|v: T/.test(s.sourceText)));
});
test('framework interpolation is source evidence with an explicit runtime gap',()=>{
 const r=extractFile({path:'src/Lesson.svelte',bytes:Buffer.from('<p>{answer ? "Correct answer" : "Try again"}</p>')});
 assert.equal(r.state,'readable');assert.ok(r.sections.some(s=>s.sourceText.includes('answer ?')));assert.ok(r.gaps.some(g=>g.kind==='framework-markup'));assert.ok(r.sections.every(s=>s.verification.includes('unverified')));
});
test('small JS choices and JSON answers retain one-character, numeric and emoji learner candidates',()=>{
 const js=extractFile({path:'src/quiz.ts',bytes:Buffer.from('const options = ["A", "B", "0", "✓"]; const correctAnswer = "0"; const unrelated = ["1", "2"];')});
 for(const value of ['"A"','"B"','"0"','"✓"'])assert.ok(js.sections.some(s=>s.sourceText===value),value);
 assert.ok(!js.sections.some(s=>s.sourceText==='"1"'||s.sourceText==='"2"'),'unrelated numerical data is not forced into teaching wording');
 const json=extractFile({path:'quiz.json',bytes:Buffer.from('{"options":["A","B","0","✓"],"answer":"0","unrelated":["1","2"]}')});
 for(const value of ['"A"','"B"','"0"','"✓"'])assert.ok(json.sections.some(s=>s.sourceText===value),value);
 assert.ok(json.sections.every(s=>s.verification==='unverified-static-candidate'));
 const labels=extractFile({path:'src/ui.ts',bytes:Buffer.from('const labels=["1","2"]; const button = { text: "×", label: "✓" };')});for(const value of ['"1"','"2"','"×"','"✓"'])assert.ok(labels.sections.some(s=>s.sourceText===value),value);
});
test('locale dictionaries and paired HTML locale attributes retain short translations without claiming reachability',()=>{
 const js=extractFile({path:'web-demo/src/i18n.ts',bytes:Buffer.from('const strings = { cancelBtn: { en: "Cancel", ko: "취소" }, boxLabel: { en: "Box", ko: "보관함" }, sealedCheck: { en: "✓", ko: "✓" } }; const eventType = "click";')});
 assert.equal(js.role,'teaching');for(const value of ['"Cancel"','"취소"','"Box"','"보관함"','"✓"'])assert.ok(js.sections.some(s=>s.sourceText===value),value);
 assert.ok(!js.sections.some(s=>s.sourceText==='"click"'));assert.ok(js.gaps.some(g=>g.kind==='localization-binding'));
 const html=extractFile({path:'web-demo/index.html',bytes:Buffer.from('<p data-en="A&amp;B" data-ko="정확한 설명">A&amp;B</p><p data-fr="Bonjour" data-es="Hola">Bonjour</p>')});
 for(const value of ['A&amp;B','정확한 설명','Bonjour','Hola'])assert.ok(html.sections.some(s=>s.sourceText===value&&s.kind==='localization-attribute'),value);
 assert.ok(html.gaps.some(g=>g.kind==='localization-binding'));assert.ok(html.sections.every(s=>s.verification.includes('unverified')));
 const json=extractFile({path:'locales/ko.json',bytes:Buffer.from('{"cancel":"취소","confirmed":"✓"}')});assert.ok(json.sections.some(s=>s.sourceText==='"✓"'));
});
test('attribute boundary parsing rejects quoted fake attributes and false hidden classifications',()=>{
 const source='<p data-note="hidden warning title=\'Fake label\'" title="Real title">Visible explanation.</p><template><p>Conditional explanation.</p></template><style>p::after{content:"Style fake"}</style><!-- <p>Comment fake</p> -->';
 const r=extractFile({path:'index.html',bytes:Buffer.from(source)});
 assert.ok(r.sections.some(s=>s.sourceText==='Real title'&&s.kind==='markup-attribute'));
 assert.ok(r.sections.some(s=>s.sourceText==='Visible explanation.'&&s.surface==='static-markup-candidate'));
 assert.ok(r.sections.some(s=>s.sourceText==='Conditional explanation.'&&s.surface==='hidden-or-template-candidate'));
 assert.ok(!r.sections.some(s=>/Fake label|Style fake|Comment fake/.test(s.sourceText)));
 for(const s of r.sections)assert.ok(source.split('\n').slice(s.startLine-1,s.endLine).join('\n').includes(s.sourceText));
});
test('BOM, CRLF and literal backslashes in tracked path spelling remain exact source identities',()=>{
 const source='\uFEFF<p title="Exact label">Exact wording.</p>\r\n<p>Second line.</p>\r\n';
 const file='src\\lesson.html',r=extractFile({path:file,bytes:Buffer.from(source)});
 assert.ok(r.sections.length);for(const s of r.sections){assert.equal(s.file,file);assert.ok(source.split('\n').slice(s.startLine-1,s.endLine).join('\n').includes(s.sourceText));assert.equal(s.sha256,hash(s.sourceText));}
 const other=extractFile({path:'src/lesson.html',bytes:Buffer.from(source)});assert.notEqual(r.sections[0].id,other.sections[0].id);
});
test('valid UTF-8 source NUL bytes preserve readable declarations and exact spans',()=>{
 const source='const warning = "Exact A\0B warning";\nexport function hashAttribute(label: string) { return cached(`A\0${label}\0`, () => hashToG1(label)); }\n';
 const r=extractFile({path:'src/fame/bls.ts',bytes:Buffer.from(source)});assert.equal(r.state,'readable');assert.ok(r.symbols.some(s=>s.name==='hashAttribute'));assert.ok(r.gaps.some(g=>g.kind==='nul-in-text'));
 const warning=r.sections.find(s=>s.sourceText==='"Exact A\0B warning"');assert.ok(warning);assert.equal(warning.sha256,hash(warning.sourceText));
 for(const s of r.sections)assert.ok(source.split('\n').slice(s.startLine-1,s.endLine).join('\n').includes(s.sourceText));
 const many=extractFile({path:'src/ui.ts',bytes:Buffer.from('const text = "'+('A\0'.repeat(300))+'";')});assert.equal(many.state,'readable','NUL density alone must not misclassify actual source string data');
});
test('binary signatures, explicit non-UTF-8 BOMs and invalid bytes retain distinct coverage states',()=>{
 const wasm=extractFile({path:'misnamed.ts',bytes:Buffer.from([0,97,115,109,1,0,0,0])});assert.equal(wasm.state,'opaque');assert.deepEqual(wasm.sections,[]);
 const known=extractFile({path:'bundle.wasm',bytes:Buffer.from('valid UTF-8 bytes still describe a binary artifact path')});assert.equal(known.state,'opaque');
 for(const bytes of [Buffer.from([0xff,0xfe,65,0,66,0]),Buffer.from([0xfe,0xff,0,65,0,66]),Buffer.from([0,0,0xfe,0xff,0,0,0,65])]){const r=extractFile({path:'source.ts',bytes});assert.equal(r.state,'unsupported');assert.ok(r.gaps.some(g=>g.kind==='unsupported-encoding'));assert.deepEqual(r.sections,[]);}
 const invalid=extractFile({path:'source.ts',bytes:Buffer.from([0xc3,0x28])});assert.equal(invalid.state,'unreadable');assert.ok(invalid.gaps.some(g=>g.kind==='invalid-encoding'));
});
