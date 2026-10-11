/*
 * teaching-reference-extract.js — bounded, source-preserving teaching extraction.
 * Not runnable. Required by the teaching-reference generator.
 * Reads: caller-supplied immutable tracked file bytes; catalog-evidence.js lexer.
 * Prevents: paraphrased copy, comments, dynamic strings or opaque bytes being
 * presented as verified learner wording or implementation execution evidence.
 */
'use strict';
const crypto = require('node:crypto');
const { TextDecoder } = require('node:util');
const { lex } = require('./catalog-evidence.js');

const GENERATOR_VERSION = 'teaching-extract-v1';
const MAX_BYTES = 1500000, MAX_SECTIONS = 3000, MAX_LITERAL = 24000;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const EXTENSIONS = {html:'html',htm:'html',svg:'html',vue:'html',svelte:'html',astro:'html',md:'markdown',markdown:'markdown',txt:'text',js:'javascript',mjs:'javascript',cjs:'javascript',jsx:'jsx',ts:'typescript',tsx:'tsx',json:'json',rs:'rust',c:'c',h:'c',cpp:'cpp',hpp:'cpp',cc:'cpp',css:'css'};
const BINARY = /\.(?:wasm|png|jpe?g|gif|webp|ico|pdf|woff2?|ttf|otf|zip|gz|br|a|o|so|dylib|exe|bin)$/i;

function roleFor(file) {
  if (BINARY.test(file)) return 'opaque';
  if (/(?:^|\/)(?:AGENTS|CLAUDE|SKILL)\.md$/i.test(file)) return 'config';
  if (/(?:^|\/)(?:package(?:-lock)?\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|Cargo\.(?:toml|lock)|requirements[^/]*\.txt)$/.test(file)) return 'dependencies';
  if (/(?:^|\/)(?:tests?|e2e|verification)(?:\/|$)|\.(?:test|spec)\.[^.]+$/i.test(file)) return 'test';
  if (/(?:^|\/)(?:readme[^/]*|docs?)(?:\/|\.|$)|\.(?:md|markdown)$/i.test(file)) return 'documentation';
  if (/\.(?:html?|vue|svelte|astro)$/i.test(file) || /(?:^|\/)(?:ui|views?|components?|locales?|i18n|quizzes?)(?:\/|$)/i.test(file)) return 'teaching';
  if (/\.(?:json|csv|svg)$/i.test(file)) return 'data';
  if (/\.(?:js|[cm]js|jsx|tsx?|rs|c|h|cpp|hpp|cc)$/i.test(file)) return 'implementation';
  if (/\.(?:css|ya?ml|toml|ini|conf)$/i.test(file)) return 'config';
  return 'unknown';
}

function extractFile({ path: file, bytes, sourceSha, repository } = {}) {
  file = typeof file === 'string' ? file.replaceAll('\\','/') : '(unknown-path)';
  const extension = file.split('.').at(-1).toLowerCase();
  const language = EXTENSIONS[extension] || 'unsupported';
  const result = {state:'readable',language,role:roleFor(file),sections:[],symbols:[],citations:[],gaps:[]};
  const gap = (kind, reason) => { if(!result.gaps.some(g=>g.kind===kind&&g.reason===reason)) result.gaps.push({kind,file,reason}); };
  if (!Buffer.isBuffer(bytes)) { result.state='unreadable';gap('unreadable','No readable captured Buffer was supplied; no filesystem fallback is attempted.');return result; }
  if (BINARY.test(file) || bytes.includes(0)) { result.state='opaque';gap('opaque','Opaque binary or unsupported NUL-bearing encoding; byte identity is not readable source or source-to-binary provenance.');return result; }
  let text;
  try { text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes); }
  catch { result.state='unreadable';gap('invalid-encoding','Captured bytes are not valid UTF-8; replacement decoding is refused.');return result; }
  if (language==='unsupported') {result.state='unsupported';gap('unsupported-language','This file format is inventoried but its teaching text is not extracted.');return result;}
  if (bytes.length>MAX_BYTES) {gap('extraction-limit',`Readable source exceeds the explicit ${MAX_BYTES}-byte extraction bound; no partial wording is emitted.`);return result;}
  if (/\.(?:min|bundle|bundled)\.[cm]?js$/i.test(file)||/(?:^|\/)(?:vendor|vendored|third_party|third-party)(?:\/|$)/i.test(file)) {
    gap('vendor-or-compressed-source','Vendored or compressed source is inventoried, not dumped as learner copy; ownership and executable correspondence remain unverified.');return result;
  }
  const starts=[0];for(let i=0;i<text.length;i++)if(text[i]==='\n')starts.push(i+1);
  const lineAt=index=>{let lo=0,hi=starts.length;while(lo+1<hi){const mid=(lo+hi)>>1;if(starts[mid]<=index)lo=mid;else hi=mid;}return lo+1;};
  const ordinals=new Map(),pathId=sha256(file).slice(0,14);
  const add=(start,end,kind,surface,verification='source-extracted-unverified-rendering')=>{
    if(end<=start||!text.slice(start,end).trim())return;
    if(result.sections.length>=MAX_SECTIONS){gap('extraction-limit',`At most ${MAX_SECTIONS} sections are extracted; remaining wording requires review.`);return;}
    if(end-start>MAX_LITERAL){gap('extraction-limit',`A ${kind} span exceeds ${MAX_LITERAL} characters and is retained only by the full file hash.`);return;}
    const ordinal=(ordinals.get(kind)||0)+1;ordinals.set(kind,ordinal);
    const sourceText=text.slice(start,end);
    result.sections.push({id:`tr-${pathId}-${kind}-${ordinal}`,file,startLine:lineAt(start),endLine:lineAt(end-1),kind,sourceText,sha256:sha256(sourceText),surface,verification});
  };
  const trimmed=(start,end,kind,surface,verification)=>{
    while(start<end&&/\s/.test(text[start]))start++;while(end>start&&/\s/.test(text[end-1]))end--;add(start,end,kind,surface,verification);
  };
  function citations(view=text, offset=0) {
    const re=/https?:\/\/[^\s<>"'`\]\){}]+/g;let m;
    while((m=re.exec(view))) {const url=m[0].replace(/[.,;:]$/,'');const line=lineAt(offset+m.index);if(!result.citations.some(c=>c.url===url&&c.line===line))result.citations.push({url,file,line,verification:'source-cited-unverified-primary'});}
  }
  function candidate(raw, context) {
    const body=raw.slice(1,-1);
    if(!/\p{L}/u.test(body)||/^[a-f\d]{6,}$/i.test(body)||/^(?:[.#/]\S*|https?:\/\/\S*|[\w@.-]+(?:\/[\w.-]+)+)$/.test(body))return false;
    if(/\b(?:import|from|require|include)\s*$/.test(context))return false;
    return /\s|[?!.,:<>]/.test(body)||/\b(?:text|html|label|title|question|quiz|choice|answer|feedback|correct|incorrect|warning|explain|message|prompt|placeholder|render|content|caption|description|assumption)\w*\b/i.test(context);
  }
  function strings(source, offset=0, flavor=language) {
    // Shared lexical masks keep quotes in comments/regular expressions inert.
    const views=lex(source),view=views.strings;
    gap('lexical-extraction','Literal and declaration candidates are found lexically; computed text, concatenation, imported content and conditional execution require source review even when no wording candidate is emitted.');
    function quoteEnd(at, quote, nesting=0) {
      if(nesting>32)return -1;
      for(let end=at+1;end<view.length;end++){
        if(view[end]==='\\'){end++;continue;}
        if(view[end]===quote)return end+1;
        if(quote==='`'&&view[end]==='$'&&view[end+1]==='{'){
          let braces=1;end+=2;
          for(;end<view.length;end++){
            if(['"',"'",'`'].includes(view[end])){const next=quoteEnd(end,view[end],nesting+1);if(next<0)return -1;end=next-1;continue;}
            if(view[end]==='{')braces++;else if(view[end]==='}'&&--braces===0)break;
          }
          if(braces)return -1;
        }
      }
      return -1;
    }
    let found=0;
    for(let i=0;i<view.length;i++) {
      const rawPrefix=flavor==='rust'&&view[i]==='r'?view.slice(i).match(/^r(#{0,12})"/):null;
      let quote=view[i],start=i,end;
      if(rawPrefix){quote='"';const closing='"'+rawPrefix[1];end=view.indexOf(closing,i+rawPrefix[0].length);if(end>=0)end+=closing.length;}
      else{
        if(!['"',"'",'`'].includes(quote)||((flavor==='rust'||flavor==='c'||flavor==='cpp')&&quote!== '"'))continue;
        end=quoteEnd(i,quote);
      }
      if(end<0){gap('unterminated-literal','An unterminated or unsupported string literal requires source review.');break;}
      const raw=source.slice(start,end),context=source.slice(Math.max(0,start-130),start);
      i=end-1;
      if(!candidate(raw,context))continue;
      const dynamic=quote==='`'&&raw.includes('${');
      const assigned=context.match(/([A-Za-z_$][\w$-]*)\s*[:=]\s*$/)?.[1]||context.slice(-80);
      const kind=result.role==='test'?'test-description':dynamic?'dynamic-template':/\b(?:question|quiz|prompt)\w*\b/i.test(assigned)?'quiz-candidate':/\b(?:feedback|correct|incorrect)\w*\b/i.test(assigned)?'feedback-candidate':/\b(?:warning|caveat|assumption|limit)\w*\b/i.test(assigned)?'limit-candidate':'string-candidate';
      add(offset+start,offset+end,kind,result.role==='test'?'test-source':flavor==='rust'||flavor==='c'||flavor==='cpp'?'native-string-candidate':'ui-string-candidate','unverified-static-candidate');found++;
      if(dynamic)gap('dynamic-interpolation','Template source contains runtime interpolation; rendered wording and conditional branches are not reconstructed.');
      if(/\\(?:[nrtuUx]|\r?\n)/.test(raw))gap('escaped-wording','Literal escapes are retained verbatim; runtime decoding is not substituted for source wording.');
    }
    if(found||/\b(?:textContent|innerHTML|render|document|createElement|translate|i18n|t)\s*(?:[=(.]|$)/m.test(views.code))gap('runtime-text','Static string candidates do not prove UI reachability, conditional coverage, localization selection or browser-rendered wording.');
    citations(view,offset);
    const re=flavor==='rust'?/\bfn\s+([A-Za-z_]\w*)\s*\(/g:flavor==='c'||flavor==='cpp'?/\b([A-Za-z_]\w*)\s*\([^;{}]{0,300}\)\s*\{/g:/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(|\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:\([^;{}]{0,200}\)|[A-Za-z_$][\w$]*)\s*=>|\bclass\s+([A-Za-z_$][\w$]*)/g;
    let m;while((m=re.exec(views.code))){const name=m[1]||m[2]||m[3];if(['if','for','while','switch','catch'].includes(name))continue;result.symbols.push({name,line:lineAt(offset+m.index),kind:'declaration-candidate',verification:'not-executed-or-reviewed'});}
    if(flavor==='rust'||flavor==='c'||flavor==='cpp')gap('native-parser-limit','Native declarations and literals are lexical candidates; macros, raw syntax, ABI behavior, compiler reproduction and constant-time properties are not verified.');
  }
  function markup(source,offset=0,jsx=false) {
    // The shared JS lexer would interpret a JSX closing-tag slash as a regex.
    // Mask that slash only in the recognition view, retaining offsets and every
    // original byte for extraction. Once a real JSX island begins, HTML text
    // (including apostrophes) is read as markup rather than JavaScript strings.
    const view=source,jsxCode=jsx?lex(source.replace(/<\//g,'< ')).code:null,stack=[];let i=0,plain=0;
    const emit=(start,end)=>{if(jsx&&!stack.length)return;const raw=source.slice(start,end);if(!raw.trim())return;const hidden=stack.some(s=>s.hidden||s.name==='template'),dynamic=jsx&&/[{}]/.test(raw);trimmed(offset+start,offset+end,dynamic?'dynamic-markup':'markup-text',hidden?'hidden-or-template-candidate':'static-markup-candidate');if(hidden||dynamic)gap('conditional-markup','Hidden/template or expression-containing markup requires runtime verification.');};
    while(i<view.length){
      if(jsx&&view.startsWith('{/*',i)){emit(plain,i);const end=view.indexOf('*/}',i+3);if(end<0){gap('malformed-markup','Unclosed JSX comment requires review.');return;}i=end+3;plain=i;continue;}
      if(view[i]!=='<'){i++;continue;}
      emit(plain,i);
      if(view.startsWith('<!--',i)){const end=view.indexOf('-->',i+4);if(end<0){gap('malformed-markup','Unclosed HTML comment; remainder is not emitted as learner text.');return;}i=end+3;plain=i;continue;}
      let end=i+1,q='';for(;end<view.length;end++){const c=view[end];if(q){if(c===q)q='';}else if(c==='"'||c==="'")q=c;else if(c==='>')break;}
      if(end>=view.length){gap('malformed-markup','Unclosed markup tag; remainder requires review.');return;}
      const tag=source.slice(i,end+1),match=tag.match(/^<\s*(\/?)\s*([A-Za-z][\w:.-]*)\b/);i=end+1;plain=i;if(!match)continue;
      const name=match[2].toLowerCase();
      if(jsx&&!stack.length&&!match[1]&&jsxCode[end+1-tag.length]!=='<')continue;
      if(jsx&&!match[1]&&!['div','span','p','a','h1','h2','h3','h4','h5','h6','button','label','input','select','option','textarea','section','article','main','aside','ul','ol','li','strong','em','code','pre','table','thead','tbody','tr','th','td','small','form','header','footer','nav','svg','text','title','desc'].includes(name)&&!source.slice(i).includes('</'+match[2])){continue;}
      if(match[1]){const index=stack.map(s=>s.name).lastIndexOf(name);if(index>=0)stack.splice(index);continue;}
      const attrs=/\b(aria-label|title|alt|placeholder|value)\s*=\s*(["'])([\s\S]*?)\2/gi;let a;
      while((a=attrs.exec(tag))){if(a[1].toLowerCase()==='value'&&!/^(?:input|button|option)$/.test(name))continue;const start=offset+(end+1-tag.length)+a.index+a[0].indexOf(a[2])+1;add(start,start+a[3].length,'markup-attribute','learner-attribute-candidate');}
      if(name==='script'||name==='style'){
        const closing=new RegExp(`<\\/\\s*${name}\\s*>`,'ig');closing.lastIndex=i;const close=closing.exec(source);
        if(!close){gap('malformed-markup',`Unclosed ${name} body requires review.`);return;}
        if(name==='script')strings(source.slice(i,close.index),offset+i,'javascript');
        i=close.index+close[0].length;plain=i;continue;
      }
      if(!/\/\s*>$/.test(tag)&&!['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'].includes(name))stack.push({name,hidden:/\bhidden(?:\s|=|>)/i.test(tag)||/\baria-hidden\s*=\s*["']true["']/i.test(tag)});
    }
    emit(plain,source.length);citations(source,offset);
    gap('markup-rendering','Markup text and attributes are exact source, not a browser visibility measurement; CSS, event paths and framework expressions remain unverified.');
    if(/&(?:#\w+|\w+);/.test(source))gap('entity-wording','HTML entities are preserved verbatim; decoded browser text is not silently substituted.');
  }
  function markdown() {
    let start=0,fence=null;
    const lines=text.match(/[^\n]*\n|[^\n]+$/g)||[];let at=0;
    for(const line of lines){const m=line.match(/^\s*(`{3,}|~{3,})/);if(m){if(!fence)fence=m[1][0];else if(fence===m[1][0])fence=null;}
      if(!fence&&/^\s*$/.test(line)){trimmed(start,at,'documentation-block','readme-or-documentation-source');start=at+line.length;}
      at+=line.length;
    }
    trimmed(start,text.length,'documentation-block','readme-or-documentation-source');
    if(fence)gap('malformed-markdown','Unclosed code fence; preserved source is not a validated rendered document.');
    gap('documentation-rendering','Markdown blocks preserve raw source, including examples and markup; rendered visibility, links and executable examples are not verified.');citations();
  }
  if(result.role==='dependencies')return result;
  if(/(?:^|\/)(?:AGENTS|CLAUDE|SKILL)\.md$/i.test(file)){gap('maintainer-instructions','Agent/maintainer instructions are inventoried separately and are not emitted as learner-facing wording.');return result;}
  if(language==='html'){
    markup(text);
    if(/\.(?:vue|svelte|astro)$/i.test(file))gap('framework-markup','Framework directives, interpolations and conditional component rendering are retained only as source candidates; runtime text is not reconstructed.');
  }
  else if(language==='markdown'||language==='text')markdown();
  else if(language==='json'){
    try{JSON.parse(text.replace(/^\uFEFF/,''));}catch{gap('malformed-json','Source is readable but invalid JSON; no runtime localization/data-loading claim is made.');}
    const re=/"(?:\\[\s\S]|[^"\\])*"/g;let m;while((m=re.exec(text))){if(/^\s*:/.test(text.slice(re.lastIndex)))continue;if(candidate(m[0],text.slice(Math.max(0,m.index-100),m.index)))add(m.index,re.lastIndex,'json-string-candidate','localization-or-data-candidate','unverified-static-candidate');}
    citations();gap('data-binding','JSON strings are raw source candidates; runtime localization and data-to-UI bindings require review.');
  }else{
    strings(text);
    if(language==='jsx'||language==='tsx'){markup(text,0,true);gap('jsx-parser-limit','JSX/TSX extraction is bounded lexical evidence; fragments, embedded expressions and conditional rendering can require manual review.');}
  }
  citations();
  result.sections.sort((a,b)=>a.startLine-b.startLine||a.endLine-b.endLine||a.id.localeCompare(b.id,'en'));
  result.citations.sort((a,b)=>a.line-b.line||a.url.localeCompare(b.url,'en'));
  // Pins are supplied by the immutable reader, never advanced by extraction.
  void sourceSha;void repository;
  return result;
}
module.exports={GENERATOR_VERSION,extractFile,roleFor};
