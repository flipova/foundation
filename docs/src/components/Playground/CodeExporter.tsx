import React, { useMemo } from 'react';
import styles from './styles.module.css';

export default function CodeExporter({ meta, state, componentName }) {
  const codeString = useMemo(() => {
    let propsString = '';
    
    if (meta?.props) {
      meta.props.forEach(p => {
        const val = state[p.name];
        
        // Skip if value is undefined or matches the default value
        if (val === undefined || val === p.default) {
          return;
        }

        if (typeof val === 'boolean') {
          if (val) {
            propsString += `\n  ${p.name}`;
          } else {
            propsString += `\n  ${p.name}={false}`;
          }
        } else if (typeof val === 'number') {
          propsString += `\n  ${p.name}={${val}}`;
        } else if (typeof val === 'string' && val.trim() !== '') {
          propsString += `\n  ${p.name}="${val}"`;
        }
      });
    }

    if (propsString) {
      return `<${componentName}${propsString}\n/>`;
    }
    
    return `<${componentName} />`;
  }, [meta, state, componentName]);

  return (
    <div className={styles.codeContainer}>
      <code>{codeString}</code>
    </div>
  );
}
