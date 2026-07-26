import React, { useMemo } from 'react';
import styles from './styles.module.css';

const RADIUS_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
  { label: 'Full', value: 'full' },
];

function ControlField({ propDef, value, onChange }: any) {
  const handleChange = (e: any) => {
    let val = e.target.value;
    if (propDef.type === 'boolean') {
      val = e.target.checked;
    } else if (propDef.type === 'number') {
      val = Number(val);
    }
    onChange(propDef.name, val);
  };

  const renderInput = () => {
    if (propDef.type === 'boolean') {
      return (
        <div className={styles.switchRow}>
          <label className={styles.switch}>
            <input type="checkbox" checked={!!value} onChange={handleChange} />
            <span className={styles.slider}></span>
          </label>
        </div>
      );
    }

    if (propDef.type === 'enum' || propDef.type === 'radius' || propDef.options) {
      const options = propDef.options || (propDef.type === 'radius' ? RADIUS_OPTIONS : []);
      return (
        <select className={styles.select} value={String(value || '')} onChange={handleChange}>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (propDef.type === 'number') {
      return (
        <input 
          type="number" 
          className={styles.input} 
          value={value ?? ''} 
          onChange={handleChange} 
        />
      );
    }

    // Default to text input for string, color, icons, etc.
    return (
      <input 
        type="text" 
        className={styles.input} 
        value={value ?? ''} 
        onChange={handleChange} 
        placeholder={propDef.default ? String(propDef.default) : ''}
      />
    );
  };

  return (
    <div className={styles.controlField}>
      <div className={styles.controlHeader}>
        <span className={styles.controlLabel}>{propDef.label || propDef.name}</span>
      </div>
      {renderInput()}
    </div>
  );
}

export default function Controls({ meta, state, onChange }: any) {
  const groups = useMemo(() => {
    const g: Record<string, any[]> = {};
    if (meta?.props) {
      meta.props.forEach((p: any) => {
        const gName = p.group || 'General';
        if (!g[gName]) g[gName] = [];
        g[gName].push(p);
      });
    }
    return g;
  }, [meta]);

  const handleChange = (name: string, value: any) => {
    onChange((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!meta?.props || meta.props.length === 0) {
    return <div className={styles.controlDefault}>No configurable props for this component.</div>;
  }

  return (
    <div className={styles.controlsList}>
      {Object.entries(groups).map(([groupName, props]) => (
        <div key={groupName} className={styles.propGroup}>
          <div className={styles.groupHeader}>{groupName}</div>
          {(props as any[]).map((p: any) => (
            <ControlField 
              key={p.name} 
              propDef={p} 
              value={state[p.name]} 
              onChange={handleChange} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}
