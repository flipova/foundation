const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\david\\Documents\\Github\\foundation\\foundation\\ui';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

function refactorFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Fix registry imports
    // From web/components: ../../layout/registry -> ../../registry
    // From layout/ui: ../registry -> ../../registry
    if (content.includes('../../layout/registry')) {
        content = content.replace(/(\.\.\/)+layout\/registry/g, '../../registry');
        changed = true;
    }
    if (content.includes('../registry') && !content.includes('../../registry')) {
        content = content.replace(/\.\.\/registry/g, '../../registry');
        changed = true;
    }
    
    // Fix types import
    // From web/components: ../../layout/types -> ../../types
    // From layout/ui: ../types -> ../../types
    if (content.includes('../../layout/types')) {
        content = content.replace(/(\.\.\/)+layout\/types/g, '../../types');
        changed = true;
    }
    if (content.includes('../types') && !content.includes('../../types')) {
        content = content.replace(/\.\.\/types/g, '../../types');
        changed = true;
    }

    // Fix primitives imports if any layout was importing from ./primitives
    // layout/ui/AuthLayout used to do `import Box from "./primitives/Box"`
    // Now it's in `ui/layouts/AuthLayout` and primitives are in `ui/primitives/Box`
    // So `./primitives/Box` becomes `../primitives/Box`
    if (filePath.includes('layouts') && content.includes('./primitives/')) {
        content = content.replace(/\.\/primitives\//g, '../primitives/');
        changed = true;
    }
    if (filePath.includes('layouts') && content.includes('../hooks/')) {
        // hooks were in layout/hooks. Let's move them if they exist or maybe they were not moved?
        // Wait, where did hooks go? I didn't move them!
    }

    // Replace component props interface
    if (filePath.includes('components')) {
        const componentMatch = content.match(/const META = getComponentMeta\("([^"]+)"\)/);
        if (componentMatch) {
            const compName = componentMatch[1];
            // Look for interface ButtonProps extends ...
            const interfaceRegex = new RegExp(`export interface ${compName}Props(?: extends [^{]+)? {([^}]*)}`, 'g');
            if (interfaceRegex.test(content)) {
                // We'll replace it with:
                // import { ExtractComponentProps } from "../../registry/typeHelpers";
                // export interface XProps extends Omit<React.ButtonHTMLAttributes..., "children">, ExtractComponentProps<"X"> { ... }
                // Actually, a simpler regex is just to inject the type helper import and let the user manually fix complex inheritance if needed, 
                // OR we just leave the interface as is for now and just fix the imports, to avoid breaking everything blindly.
            }
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
    }
}

walk(baseDir, refactorFile);
