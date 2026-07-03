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

function fixFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Fix overshoot from double replacements
    if (content.includes('../../../registry')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/registry/g, '../../registry');
        changed = true;
    }
    if (content.includes('../../../types')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/types/g, '../../types');
        changed = true;
    }

    if (content.includes('../../layout/ui/BentoLayout')) {
        content = content.replace(/\.\.\/\.\.\/layout\/ui\/BentoLayout/g, './BentoLayout');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed: ${filePath}`);
    }
}

walk(baseDir, fixFile);
