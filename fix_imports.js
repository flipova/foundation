const fs = require('fs');
const glob = require('glob'); // Note: we might not have glob, better use fs.readdirSync recursively
const path = require('path');

const layoutsDir = path.join(__dirname, 'foundation/ui/layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(layoutsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix wrong paths
  content = content.replace(/from ['"]\.\.\/registry['"]/g, 'from "../../registry"');
  content = content.replace(/from ['"]\.\/primitives\/Box['"]/g, 'from "../primitives/Box"');
  content = content.replace(/from ['"]\.\/primitives\/Scroll['"]/g, 'from "../primitives/Scroll"');
  content = content.replace(/from ['"]\.\/primitives\/Inline['"]/g, 'from "../primitives/Inline"');
  content = content.replace(/from ['"]\.\/primitives\/Stack['"]/g, 'from "../primitives/Stack"');
  content = content.replace(/from ['"]\.\.\/types['"]/g, 'from "../../types"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed imports in', file);
  }
}
