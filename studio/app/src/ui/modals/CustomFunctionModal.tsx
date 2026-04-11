/**
 * CustomFunctionModal — Guided assistant for creating custom functions/hooks.
 *
 * Allows creating custom TypeScript functions that:
 * - Use service methods (Supabase auth, REST, etc.)
 * - Accept parameters linked to state/props
 * - Return values stored in state
 * - Are callable via callApi-style actions
 *
 * Generated as: hooks/use{FunctionName}.ts
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../../store/StudioProvider';
import ModalShell from './shared/ModalShell';
import { Field, Check } from './shared/FormPrimitives';
import { C } from './shared/colors';
import SmartInput from '../shared/SmartInput';

interface FunctionParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'any';
  stateBinding: string; // $state.x to read from
  description: string;
}

interface CustomFunction {
  id: string;
  name: string;
  description: string;
  serviceId: string;
  template: string; // 'supabase-auth-signin' | 'supabase-auth-signup' | 'supabase-query' | 'rest-call' | 'custom'
  params: FunctionParam[];
  returnStateKey: string; // where to store the result
  returnType: 'object' | 'array' | 'string' | 'boolean' | 'void' | 'any';
  errorStateKey: string;
  code: string; // the actual function body
}

const TEMPLATES = [
  // ── Supabase Auth ──────────────────────────────────────────────────────
  {
    id: 'supabase-auth-signin',
    label: 'Supabase Sign In',
    icon: 'log-in' as const,
    color: '#3ecf8e',
    description: 'Sign in a user with email and password using Supabase Auth',
    defaultParams: [
      { name: 'email', type: 'string' as const, stateBinding: '$state.email', description: 'User email address' },
      { name: 'password', type: 'string' as const, stateBinding: '$state.password', description: 'User password' },
    ],
    returnType: 'object' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}.auth.signInWithPassword({
  email: ${params[0]?.name || 'email'},
  password: ${params[1]?.name || 'password'},
});
if (error) throw error;
return data;`,
  },
  {
    id: 'supabase-auth-signup',
    label: 'Supabase Sign Up',
    icon: 'user-plus' as const,
    color: '#3ecf8e',
    description: 'Create a new user account with Supabase Auth',
    defaultParams: [
      { name: 'email', type: 'string' as const, stateBinding: '$state.email', description: 'User email address' },
      { name: 'password', type: 'string' as const, stateBinding: '$state.password', description: 'User password' },
    ],
    returnType: 'object' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}.auth.signUp({
  email: ${params[0]?.name || 'email'},
  password: ${params[1]?.name || 'password'},
});
if (error) throw error;
return data;`,
  },
  {
    id: 'supabase-auth-signout',
    label: 'Supabase Sign Out',
    icon: 'log-out' as const,
    color: '#3ecf8e',
    description: 'Sign out the current user',
    defaultParams: [],
    returnType: 'void' as const,
    generateCode: (svcId: string) => `
const { error } = await ${svcId}.auth.signOut();
if (error) throw error;`,
  },
  {
    id: 'supabase-get-user',
    label: 'Supabase Get User',
    icon: 'user' as const,
    color: '#3ecf8e',
    description: 'Get the currently authenticated user',
    defaultParams: [],
    returnType: 'object' as const,
    generateCode: (svcId: string) => `
const { data: { user }, error } = await ${svcId}.auth.getUser();
if (error) throw error;
return user;`,
  },
  // ── Supabase Database ──────────────────────────────────────────────────
  {
    id: 'supabase-query',
    label: 'Supabase DB Query',
    icon: 'database' as const,
    color: '#3ecf8e',
    description: 'Query a Supabase database table with optional filters',
    defaultParams: [
      { name: 'table', type: 'string' as const, stateBinding: '', description: 'Table name (literal string)' },
    ],
    returnType: 'array' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}
  .from(${params[0]?.name || '"table_name"'})
  .select('*');
if (error) throw error;
return data;`,
  },
  {
    id: 'supabase-insert',
    label: 'Supabase Insert Row',
    icon: 'plus-circle' as const,
    color: '#3ecf8e',
    description: 'Insert a new row into a Supabase table',
    defaultParams: [
      { name: 'table', type: 'string' as const, stateBinding: '', description: 'Table name' },
      { name: 'payload', type: 'any' as const, stateBinding: '$state.formData', description: 'Data object to insert' },
    ],
    returnType: 'object' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}
  .from(${params[0]?.name || '"table_name"'})
  .insert(${params[1]?.name || 'payload'})
  .select()
  .single();
if (error) throw error;
return data;`,
  },
  {
    id: 'supabase-update',
    label: 'Supabase Update Row',
    icon: 'edit-2' as const,
    color: '#3ecf8e',
    description: 'Update a row in a Supabase table by ID',
    defaultParams: [
      { name: 'table', type: 'string' as const, stateBinding: '', description: 'Table name' },
      { name: 'id', type: 'any' as const, stateBinding: '$state.selectedId', description: 'Row ID to update' },
      { name: 'updates', type: 'any' as const, stateBinding: '$state.formData', description: 'Fields to update' },
    ],
    returnType: 'object' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}
  .from(${params[0]?.name || '"table_name"'})
  .update(${params[2]?.name || 'updates'})
  .eq('id', ${params[1]?.name || 'id'})
  .select()
  .single();
if (error) throw error;
return data;`,
  },
  {
    id: 'supabase-delete',
    label: 'Supabase Delete Row',
    icon: 'trash-2' as const,
    color: '#ef4444',
    description: 'Delete a row from a Supabase table by ID',
    defaultParams: [
      { name: 'table', type: 'string' as const, stateBinding: '', description: 'Table name' },
      { name: 'id', type: 'any' as const, stateBinding: '$state.selectedId', description: 'Row ID to delete' },
    ],
    returnType: 'void' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { error } = await ${svcId}
  .from(${params[0]?.name || '"table_name"'})
  .delete()
  .eq('id', ${params[1]?.name || 'id'});
if (error) throw error;`,
  },
  {
    id: 'supabase-storage-upload',
    label: 'Supabase Storage Upload',
    icon: 'upload-cloud' as const,
    color: '#3ecf8e',
    description: 'Upload a file to Supabase Storage',
    defaultParams: [
      { name: 'bucket', type: 'string' as const, stateBinding: '', description: 'Storage bucket name' },
      { name: 'path', type: 'string' as const, stateBinding: '$state.filePath', description: 'File path in bucket' },
      { name: 'file', type: 'any' as const, stateBinding: '$state.file', description: 'File object to upload' },
    ],
    returnType: 'object' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}.storage
  .from(${params[0]?.name || '"bucket"'})
  .upload(${params[1]?.name || 'path'}, ${params[2]?.name || 'file'});
if (error) throw error;
return data;`,
  },
  // ── REST / HTTP ────────────────────────────────────────────────────────
  {
    id: 'rest-get',
    label: 'REST GET Request',
    icon: 'download' as const,
    color: '#22c55e',
    description: 'Fetch data from a REST API endpoint',
    defaultParams: [
      { name: 'url', type: 'string' as const, stateBinding: '', description: 'Full URL to fetch' },
    ],
    returnType: 'any' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
const response = await fetch(${params[0]?.name || 'url'});
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
return response.json();`,
  },
  {
    id: 'rest-post',
    label: 'REST POST Request',
    icon: 'send' as const,
    color: '#3b82f6',
    description: 'Send data to a REST API endpoint',
    defaultParams: [
      { name: 'url', type: 'string' as const, stateBinding: '', description: 'Full URL' },
      { name: 'body', type: 'any' as const, stateBinding: '$state.formData', description: 'Request body' },
    ],
    returnType: 'any' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
const response = await fetch(${params[0]?.name || 'url'}, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${params[1]?.name || 'body'}),
});
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
return response.json();`,
  },
  // ── Supabase Realtime & Storage ──────────────────────────────────────────
  {
    id: 'supabase-realtime-subscribe',
    label: 'Supabase Realtime Subscribe',
    icon: 'activity' as const,
    color: '#ec4899',
    description: 'Subscribe to realtime changes on a Supabase table',
    defaultParams: [
      { name: 'table', type: 'string' as const, stateBinding: '', description: 'Table name to subscribe to' },
      { name: 'event', type: 'string' as const, stateBinding: '', description: 'Event type: *, INSERT, UPDATE, DELETE' },
    ],
    returnType: 'void' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const channel = ${svcId}.channel('table-changes')
  .on('postgres_changes', { 
    event: ${params[1]?.name || "'*'"}, 
    schema: 'public', 
    table: ${params[0]?.name || '"table_name"'} 
  }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
return () => { ${svcId}.removeChannel(channel); };`,
  },
  {
    id: 'supabase-storage-download',
    label: 'Supabase Storage Download',
    icon: 'download-cloud' as const,
    color: '#3ecf8e',
    description: 'Download a file from Supabase Storage',
    defaultParams: [
      { name: 'bucket', type: 'string' as const, stateBinding: '', description: 'Storage bucket name' },
      { name: 'path', type: 'string' as const, stateBinding: '$state.filePath', description: 'File path in bucket' },
    ],
    returnType: 'object' as const,
    generateCode: (svcId: string, params: FunctionParam[]) => `
const { data, error } = await ${svcId}.storage
  .from(${params[0]?.name || '"bucket"'})
  .download(${params[1]?.name || 'path'});
if (error) throw error;
return data;`,
  },
  // ── Data Processing ──────────────────────────────────────────────────────
  {
    id: 'search-filter',
    label: 'Search / Filter Array',
    icon: 'search' as const,
    color: '#f59e0b',
    description: 'Filter an array by search term',
    defaultParams: [
      { name: 'data', type: 'any' as const, stateBinding: '$state.items', description: 'Array to filter' },
      { name: 'searchTerm', type: 'string' as const, stateBinding: '$state.search', description: 'Search string' },
      { name: 'fields', type: 'string' as const, stateBinding: '', description: 'Comma-separated field names' },
    ],
    returnType: 'array' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
const items = ${params[0]?.name || 'data'} || [];
const term = (${params[1]?.name || 'searchTerm'} || '').toLowerCase();
const searchFields = (${params[2]?.name || "'name'"} || 'name').split(',');
if (!term) return items;
return items.filter((item: any) => 
  searchFields.some((f: string) => 
    String(item[f.trim()] || '').toLowerCase().includes(term)
  )
);`,
  },
  {
    id: 'sort-data',
    label: 'Sort Array',
    icon: 'bar-chart-2' as const,
    color: '#8b5cf6',
    description: 'Sort an array by a field',
    defaultParams: [
      { name: 'data', type: 'any' as const, stateBinding: '$state.items', description: 'Array to sort' },
      { name: 'sortField', type: 'string' as const, stateBinding: '$state.sortBy', description: 'Field to sort by' },
      { name: 'sortOrder', type: 'string' as const, stateBinding: '$state.sortOrder', description: 'asc or desc' },
    ],
    returnType: 'array' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
const items = [...(${params[0]?.name || 'data'} || [])];
const field = ${params[1]?.name || 'sortField'} || 'id';
const order = ${params[2]?.name || 'sortOrder'} || 'asc';
items.sort((a: any, b: any) => {
  const aVal = a[field] ?? '';
  const bVal = b[field] ?? '';
  if (aVal < bVal) return order === 'asc' ? -1 : 1;
  if (aVal > bVal) return order === 'asc' ? 1 : -1;
  return 0;
});
return items;`,
  },
  {
    id: 'paginate-data',
    label: 'Paginate Array',
    icon: 'layers' as const,
    color: '#3b82f6',
    description: 'Slice array for pagination',
    defaultParams: [
      { name: 'data', type: 'any' as const, stateBinding: '$state.items', description: 'Full array' },
      { name: 'page', type: 'number' as const, stateBinding: '$state.page', description: 'Current page (1-based)' },
      { name: 'limit', type: 'number' as const, stateBinding: '$state.limit', description: 'Items per page' },
    ],
    returnType: 'object' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
const items = ${params[0]?.name || 'data'} || [];
const page = Math.max(1, Number(${params[1]?.name || 'page'}) || 1);
const limit = Math.max(1, Number(${params[2]?.name || 'limit'}) || 10);
const start = (page - 1) * limit;
return {
  items: items.slice(start, start + limit),
  page,
  total: items.length,
  totalPages: Math.ceil(items.length / limit),
};`,
  },
  // ── Utilities ──────────────────────────────────────────────────────────
  {
    id: 'validate-form',
    label: 'Form Validation',
    icon: 'check-circle' as const,
    color: '#f59e0b',
    description: 'Validate form fields and return errors',
    defaultParams: [
      { name: 'email', type: 'string' as const, stateBinding: '$state.email', description: 'Email to validate' },
      { name: 'password', type: 'string' as const, stateBinding: '$state.password', description: 'Password to validate' },
    ],
    returnType: 'object' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
const errors: Record<string, string> = {};
if (!${params[0]?.name || 'email'} || !${params[0]?.name || 'email'}.includes('@')) {
  errors.email = 'Valid email required';
}
if (!${params[1]?.name || 'password'} || ${params[1]?.name || 'password'}.length < 6) {
  errors.password = 'Password must be at least 6 characters';
}
if (Object.keys(errors).length > 0) throw new Error(JSON.stringify(errors));
return { valid: true };`,
  },
  {
    id: 'format-data',
    label: 'Transform / Format Data',
    icon: 'filter' as const,
    color: '#8b5cf6',
    description: 'Transform or format data before using it',
    defaultParams: [
      { name: 'data', type: 'any' as const, stateBinding: '$state.rawData', description: 'Data to transform' },
    ],
    returnType: 'any' as const,
    generateCode: (_svcId: string, params: FunctionParam[]) => `
// Transform the data as needed
const result = (${params[0]?.name || 'data'} || []).map((item: any) => ({
  ...item,
  // Add computed fields here
  label: item.name || item.title || String(item.id),
}));
return result;`,
  },
  {
    id: 'custom',
    label: 'Custom Function',
    icon: 'code' as const,
    color: '#6a7494',
    description: 'Write your own custom function from scratch',
    defaultParams: [],
    returnType: 'any' as const,
    generateCode: () => `\n// Write your custom logic here\nreturn null;`,
  },
];

interface Props { onClose: () => void; }

const CustomFunctionModal: React.FC<Props> = ({ onClose }) => {
  const { project, updateProject } = useStudio();
  const services = project?.services || [];

  const [step, setStep] = useState<'template' | 'configure' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [params, setParams] = useState<FunctionParam[]>([]);
  const [returnStateKey, setReturnStateKey] = useState('result');
  const [errorStateKey, setErrorStateKey] = useState('error');
  const [returnType, setReturnType] = useState<CustomFunction['returnType']>('object');
  const [customCode, setCustomCode] = useState('');
  const [copied, setCopied] = useState(false);

  const selectTemplate = (tpl: typeof TEMPLATES[0]) => {
    setSelectedTemplate(tpl);
    setParams(tpl.defaultParams.map(p => ({ ...p })));
    setReturnType(tpl.returnType);
    setName(tpl.label.replace(/\s+/g, ''));
    setDescription(tpl.description);
    setStep('configure');
  };

  const generatedCode = React.useMemo(() => {
    if (!selectedTemplate) return '';
    const svc = services.find((s: any) => s.id === serviceId);
    const svcVar = svc?.id || 'supabase';
    const fnName = `use${name.charAt(0).toUpperCase() + name.slice(1)}`;
    const paramList = params.map(p => `${p.name}: ${p.type}`).join(', ');
    const body = selectedTemplate.id === 'custom'
      ? customCode
      : selectedTemplate.generateCode(svcVar, params);

    return `import { useState, useCallback } from "react";
import { ${svcVar} } from "../services/${svcVar}";

export function ${fnName}() {
  const [${returnStateKey}, set${returnStateKey.charAt(0).toUpperCase() + returnStateKey.slice(1)}] = useState<${returnType === 'array' ? 'any[]' : returnType === 'void' ? 'void' : 'any'}>(${returnType === 'array' ? '[]' : returnType === 'void' ? 'undefined' : 'null'});
  const [${errorStateKey}, set${errorStateKey.charAt(0).toUpperCase() + errorStateKey.slice(1)}] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (${paramList}) => {
    setLoading(true);
    set${errorStateKey.charAt(0).toUpperCase() + errorStateKey.slice(1)}(null);
    try {${body}
      ${returnType !== 'void' ? `set${returnStateKey.charAt(0).toUpperCase() + returnStateKey.slice(1)}(result);` : ''}
    } catch (err: any) {
      set${errorStateKey.charAt(0).toUpperCase() + errorStateKey.slice(1)}(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ${returnStateKey}, ${errorStateKey}, loading, execute };
}
`;
  }, [selectedTemplate, name, serviceId, params, returnStateKey, errorStateKey, returnType, customCode, services]);

  const copyCode = () => {
    if (typeof navigator !== 'undefined') {
      try { navigator.clipboard.writeText(generatedCode); } catch {}
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalShell title="Custom Function Builder" icon="code" iconColor="#a78bfa" onClose={onClose} width="88%" height="88%">
      {/* Step indicator */}
      <View style={m.steps}>
        {(['template', 'configure', 'preview'] as const).map((s, i) => (
          <Pressable key={s} style={[m.step, step === s && m.stepActive]} onPress={() => step !== 'template' && setStep(s)}>
            <View style={[m.stepDot, step === s && m.stepDotActive]}>
              <Text style={[m.stepNum, step === s && { color: '#fff' }]}>{i + 1}</Text>
            </View>
            <Text style={[m.stepLabel, step === s && { color: C.text }]}>
              {s === 'template' ? 'Choose template' : s === 'configure' ? 'Configure' : 'Generated code'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Step 1: Template picker */}
      {step === 'template' && (
        <ScrollView contentContainerStyle={m.templateGrid}>
          <Text style={m.stepTitle}>What kind of function do you want to create?</Text>
          <Text style={m.stepDesc}>Choose a template to get started quickly, or write your own from scratch.</Text>
          <View style={m.grid}>
            {TEMPLATES.map(tpl => (
              <Pressable key={tpl.id} style={m.templateCard} onPress={() => selectTemplate(tpl)}>
                <View style={[m.templateIcon, { backgroundColor: tpl.color + '20' }]}>
                  <Feather name={tpl.icon} size={20} color={tpl.color} />
                </View>
                <Text style={m.templateLabel}>{tpl.label}</Text>
                <Text style={m.templateDesc}>{tpl.description}</Text>
                <View style={m.templateArrow}>
                  <Feather name="arrow-right" size={12} color={tpl.color} />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Step 2: Configure */}
      {step === 'configure' && selectedTemplate && (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <View style={m.templateBadge}>
            <Feather name={selectedTemplate.icon} size={14} color={selectedTemplate.color} />
            <Text style={[m.templateBadgeText, { color: selectedTemplate.color }]}>{selectedTemplate.label}</Text>
            <Pressable onPress={() => setStep('template')} style={m.changeTplBtn}>
              <Text style={m.changeTplText}>Change template</Text>
            </Pressable>
          </View>

          <Field label="Function name (camelCase)" value={name} onChange={setName} placeholder="signInUser" hint="Will be exported as use{Name}()" />
          <Field label="Description (optional)" value={description} onChange={setDescription} placeholder="Signs in a user with email and password" />

          {/* Service selector */}
          {services.length > 0 && (
            <View>
              <Text style={m.fieldLabel}>Service to use</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {services.map((svc: any) => (
                  <Pressable key={svc.id} style={[m.svcBtn, serviceId === svc.id && m.svcBtnOn]} onPress={() => setServiceId(svc.id)}>
                    <Text style={[m.svcBtnText, serviceId === svc.id && { color: '#fff' }]}>{svc.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Parameters */}
          <View>
            <Text style={m.sectionTitle}>Parameters</Text>
            <Text style={m.sectionDesc}>These are the inputs your function needs. Link them to state variables so they're filled automatically when called.</Text>
            {params.map((p, i) => (
              <View key={i} style={m.paramRow}>
                <View style={m.paramHeader}>
                  <Text style={m.paramName}>{p.name}</Text>
                  <Text style={m.paramType}>{p.type}</Text>
                  <Pressable onPress={() => setParams(prev => prev.filter((_, j) => j !== i))} hitSlop={6}>
                    <Feather name="x" size={10} color={C.muted} />
                  </Pressable>
                </View>
                <SmartInput
                  label={`${p.name} (${p.type}) - ${p.description || 'Link to state'}`}
                  value={p.stateBinding}
                  onChange={v => setParams(prev => prev.map((pp, j) => j === i ? { ...pp, stateBinding: v } : pp))}
                  propType="string"
                  isExpression
                  placeholder={`$state.${p.name}`}
                />
              </View>
            ))}
            <Pressable style={m.addParamBtn} onPress={() => setParams(prev => [...prev, { name: 'param' + (prev.length + 1), type: 'string', stateBinding: '', description: '' }])}>
              <Feather name="plus" size={11} color={C.primary} />
              <Text style={m.addParamText}>Add parameter</Text>
            </Pressable>
          </View>

          {/* Return value */}
          <View>
            <Text style={m.sectionTitle}>Return value</Text>
            <Text style={m.sectionDesc}>Where should the result be stored when the function succeeds?</Text>
            <Field label="Store result in state variable" value={returnStateKey} onChange={setReturnStateKey} placeholder="result" hint={`Accessible as $state.${returnStateKey}`} />
            <Field label="Store error in state variable" value={errorStateKey} onChange={setErrorStateKey} placeholder="error" hint={`Accessible as $state.${errorStateKey}`} />
          </View>

          {/* Custom code editor */}
          {selectedTemplate.id === 'custom' && (
            <View>
              <Text style={m.sectionTitle}>Function body</Text>
              <Text style={m.sectionDesc}>Write the async function body. Use the parameter names defined above. Return the result.</Text>
              <TextInput
                style={m.codeEditor}
                value={customCode}
                onChangeText={setCustomCode}
                multiline
                numberOfLines={10}
                placeholder="// Your async code here&#10;const result = await someApi.call();&#10;return result;"
                placeholderTextColor={C.muted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          <Pressable style={m.nextBtn} onPress={() => setStep('preview')}>
            <Text style={m.nextBtnText}>Preview generated code →</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <View style={{ flex: 1 }}>
          <View style={m.previewHeader}>
            <View>
              <Text style={m.previewTitle}>hooks/use{name}.ts</Text>
              <Text style={m.previewDesc}>Copy this file into your generated project's hooks/ folder.</Text>
            </View>
            <Pressable style={[m.copyBtn, copied && m.copyBtnDone]} onPress={copyCode}>
              <Feather name={copied ? 'check' : 'copy'} size={12} color={copied ? C.success : '#fff'} />
              <Text style={[m.copyBtnText, copied && { color: C.success }]}>{copied ? 'Copied!' : 'Copy code'}</Text>
            </Pressable>
          </View>
          <ScrollView style={m.codeScroll} contentContainerStyle={{ padding: 16 }}>
            <Text style={m.codeText} selectable>{generatedCode}</Text>
          </ScrollView>
          <View style={m.usageBox}>
            <Text style={m.usageTitle}>How to use this function in your app:</Text>
            <Text style={m.usageCode}>{`// In your hook:\nconst { ${returnStateKey}, ${errorStateKey}, loading, execute } = use${name.charAt(0).toUpperCase() + name.slice(1)}();\n\n// Call it:\nawait execute(${params.map(p => p.stateBinding || p.name).join(', ')});\n\n// Access result:\n$state.${returnStateKey}  →  the returned data\n$state.${errorStateKey}  →  any error message`}</Text>
          </View>
        </View>
      )}
    </ModalShell>
  );
};

export default CustomFunctionModal;

const m = StyleSheet.create({
  steps: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 16 },
  step: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 },
  stepActive: {},
  stepDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: C.primary, borderColor: C.primary },
  stepNum: { color: C.muted, fontSize: 9, fontWeight: '700' },
  stepLabel: { color: C.muted, fontSize: 10, fontWeight: '500' },
  // Template grid
  templateGrid: { padding: 20, gap: 12 },
  stepTitle: { color: C.text, fontSize: 15, fontWeight: '700' },
  stepDesc: { color: C.muted, fontSize: 11, lineHeight: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  templateCard: { width: '47%', backgroundColor: C.s2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 14, gap: 6 },
  templateIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  templateLabel: { color: C.text, fontSize: 12, fontWeight: '700' },
  templateDesc: { color: C.muted, fontSize: 10, lineHeight: 14 },
  templateArrow: { alignSelf: 'flex-end' },
  // Configure
  templateBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.s2, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: C.border },
  templateBadgeText: { fontSize: 12, fontWeight: '600', flex: 1 },
  changeTplBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  changeTplText: { color: C.muted, fontSize: 9 },
  fieldLabel: { color: C.muted, fontSize: 11, marginBottom: 6 },
  sectionTitle: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  sectionDesc: { color: C.muted, fontSize: 10, lineHeight: 14, marginBottom: 8 },
  paramRow: { backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 10, marginBottom: 8, gap: 6 },
  paramHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paramName: { color: C.text, fontSize: 11, fontWeight: '600', flex: 1 },
  paramType: { color: C.muted, fontSize: 9, backgroundColor: C.bg, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  addParamBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6 },
  addParamText: { color: C.primary, fontSize: 10, fontWeight: '500' },
  svcBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  svcBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  svcBtnText: { color: C.muted, fontSize: 10, fontWeight: '500' },
  codeEditor: { backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.border, color: '#22c55e', fontSize: 11, fontFamily: 'monospace' as any, padding: 12, minHeight: 160, textAlignVertical: 'top' },
  nextBtn: { backgroundColor: C.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  // Preview
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  previewTitle: { color: C.text, fontSize: 12, fontWeight: '600', fontFamily: 'monospace' as any },
  previewDesc: { color: C.muted, fontSize: 10, marginTop: 2 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  copyBtnDone: { backgroundColor: 'rgba(34,197,94,0.15)', borderWidth: 1, borderColor: C.success },
  copyBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  codeScroll: { flex: 1 },
  codeText: { color: '#22c55e', fontSize: 11, fontFamily: 'monospace' as any, lineHeight: 18 },
  usageBox: { backgroundColor: 'rgba(167,139,250,0.06)', borderTopWidth: 1, borderTopColor: 'rgba(167,139,250,0.2)', padding: 14, gap: 6 },
  usageTitle: { color: C.accent, fontSize: 10, fontWeight: '600' },
  usageCode: { color: C.muted, fontSize: 9, fontFamily: 'monospace' as any, lineHeight: 15 },
});
