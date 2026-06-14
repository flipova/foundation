const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes("\\'Lexend\\'")) {
        content = content.replace(/\\'Lexend\\'/g, "'Lexend'");
        fs.writeFileSync(file, content, 'utf8');
    }
});
