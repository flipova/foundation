import React, { useState } from 'react';
import Controls from './Controls';
import CodeExporter from './CodeExporter';
import styles from './styles.module.css';

export default function Playground({ component: Component, meta, componentName }: any) {
  const [propsState, setPropsState] = useState(() => {
    const initialState: Record<string, any> = {};
    if (meta?.props) {
      meta.props.forEach((p: any) => {
        if (p.default !== undefined) {
          initialState[p.name] = p.default;
        }
      });
    }
    return initialState;
  });

  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'code'

  return (
    <div className={styles.playgroundContainer}>
      <div className={styles.previewPane}>
        <div className={styles.canvas}>
           {Component ? <Component {...propsState} /> : <div>Component not found</div>}
        </div>
      </div>
      
      <div className={styles.sidebar}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'controls' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            Props
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'code' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          {activeTab === 'controls' && (
            <Controls meta={meta} state={propsState} onChange={setPropsState} />
          )}
          {activeTab === 'code' && (
            <CodeExporter meta={meta} state={propsState} componentName={componentName} />
          )}
        </div>
      </div>
    </div>
  );
}
