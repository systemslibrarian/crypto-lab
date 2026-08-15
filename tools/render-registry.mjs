import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

function renderRegistry(catalogDir) {
  const registryPath = path.join(catalogDir, 'verification', 'registry.yaml');
  let registryObj;
  try {
    const raw = fs.readFileSync(registryPath, 'utf8');
    registryObj = yaml.load(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`registry.yaml not found at ${registryPath}. Pass 0 must be run first.`);
      process.exit(1);
    }
    console.error(`Failed to read or parse registry.yaml: ${err.message}`);
    process.exit(1);
  }

  const labs = registryObj.labs || [];
  
  let md = `# Crypto Lab Verification Portfolio\n\n`;
  md += `This index is generated from the registry and per-lab manifests. Do not edit by hand.\n\n`;
  md += `| Lab | Status | Categories | Priority |\n`;
  md += `|---|---|---|---|\n`;

  // Sort by audit_priority
  labs.sort((a, b) => (a.audit_priority || 99) - (b.audit_priority || 99));

  for (const lab of labs) {
    const slug = lab.slug;
    const name = lab.display_name || slug;
    
    // Look for manifest
    // The labs are at ../crypto-lab-<slug> relative to catalogDir
    const manifestPath = path.join(catalogDir, '..', `crypto-lab-${slug}`, 'verification', 'manifest.yaml');
    let statusStr = 'not yet audited';
    let auditMode = '';
    
    if (fs.existsSync(manifestPath)) {
      try {
        const manRaw = fs.readFileSync(manifestPath, 'utf8');
        const manifest = yaml.load(manRaw);
        const claims = manifest.claims || [];
        
        if (manifest.audit_mode && manifest.audit_mode.type) {
           auditMode = `<br>*(Mode: ${manifest.audit_mode.type})*`;
        }

        if (claims.length === 0) {
           statusStr = 'extracted (0 claims)';
        } else {
           let allHuman = true;
           let anyIndependent = false;
           let allUntested = true;
           for (const c of claims) {
             const st = c.verification_status;
             if (st !== 'human_reviewed') allHuman = false;
             if (st === 'independently_tested') anyIndependent = true;
             if (st !== 'untested') allUntested = false;
           }
           if (allHuman) {
             statusStr = 'verified';
           } else if (anyIndependent) {
             statusStr = 'independently tested';
           } else {
             statusStr = 'extracted and under review';
           }
        }
      } catch (err) {
        statusStr = `error reading manifest: ${err.message}`;
      }
    }
    
    const catStr = (lab.categories || []).join(', ');
    const linkStr = `[${name}](${lab.repo_url || ''})`;
    const prio = lab.audit_priority || '';
    
    md += `| ${linkStr} | ${statusStr}${auditMode} | ${catStr} | ${prio} |\n`;
  }
  
  const outPath = path.join(catalogDir, 'verification', 'README.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`Wrote ${outPath}`);
}

function main() {
  const catalogDir = process.argv[2] ? path.resolve(process.argv[2]) : path.dirname(path.dirname(new URL(import.meta.url).pathname));
  renderRegistry(catalogDir);
}

main();
