import * as fs from 'fs';
import * as path from 'path';

// Parse arguments
const args = process.argv.slice(2);
let type = 'base';
let name = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) {
    type = args[i + 1];
    i++;
  } else if (args[i] === '--name' && args[i + 1]) {
    name = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--') && !name && args[i] !== 'component') {
    name = args[i];
  }
}

if (!name) {
  console.error("Error: Component name is required. Usage: npx tsx scripts/generate.ts component --type <type> --name <Name>");
  process.exit(1);
}

const rootDir = path.join(process.cwd(), 'foundation/ui/components');
const targetDir = path.join(rootDir, type, name);

if (fs.existsSync(targetDir)) {
  console.error(`Error: Component ${name} already exists at ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// 1. meta.ts
const metaContent = `import type { ComponentMeta } from '../../../../types';

export const ${name}Meta: ComponentMeta = {
  id: '${name}',
  label: '${name}',
  description: '${name} component',
  category: 'display', // Update category
  tags: ['${name.toLowerCase()}'],
  props: [
    { name: 'variant', label: 'Variant', type: 'enum', options: ['default'], default: 'default' },
  ],
  variants: [],
};
`;

// 2. logic.ts
const logicContent = `import { ${name}Meta } from './${name}.meta';

export function use${name}Logic(props: any) {
  const variant = props.variant ?? 'default';
  
  return { ...props, variant };
}
`;

// 3. style.ts
const styleContent = `import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function use${name}Style(logic: any) {
  const { theme } = useTheme();
  
  return {
    container: {
      // Add your base styles here
    }
  };
}
`;

// 4. tsx (Native)
const nativeContent = `import React from 'react';
import { View, Text } from 'react-native';
import { use${name}Logic } from './${name}.logic';
import { use${name}Style } from './${name}.style';

const ${name} = (rawProps: any) => {
  const logic = use${name}Logic(rawProps);
  const styles = use${name}Style(logic);

  return (
    <View style={styles.container as any}>
      {logic.children}
    </View>
  );
};

export default ${name};
`;

// 5. web.tsx
const webContent = `import React from 'react';
import { use${name}Logic } from './${name}.logic';
import { use${name}Style } from './${name}.style';

const ${name}: React.FC<any> = (rawProps) => {
  const logic = use${name}Logic(rawProps);
  const styles = use${name}Style(logic);

  return (
    <div style={styles.container as React.CSSProperties}>
      {logic.children}
    </div>
  );
};

export default ${name};
`;

fs.writeFileSync(path.join(targetDir, `${name}.meta.ts`), metaContent);
fs.writeFileSync(path.join(targetDir, `${name}.logic.ts`), logicContent);
fs.writeFileSync(path.join(targetDir, `${name}.style.ts`), styleContent);
fs.writeFileSync(path.join(targetDir, `${name}.tsx`), nativeContent);
fs.writeFileSync(path.join(targetDir, `${name}.web.tsx`), webContent);

console.log(`Successfully generated ${name} in ${targetDir}`);
