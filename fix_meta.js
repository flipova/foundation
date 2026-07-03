const fs = require('fs');
const path = require('path');

function addMeta(file, layoutName) {
  const filePath = path.join(__dirname, 'foundation/ui/layouts', file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('const META')) {
    content = content.replace(/export interface /, const META = getLayoutMeta('')!;\n\nexport interface );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added META to', file);
  }
}

addMeta('ResponsiveLayout.tsx', 'ResponsiveLayout');
addMeta('VoidLayout.tsx', 'VoidLayout');
