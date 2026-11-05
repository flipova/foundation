import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { UI_NAMES } from '../contract';
import { FlipovaProvider, type ProviderAdapter } from '../providers';
import { flipova, flipovaComponents } from '../providers/flipova';
import { RN_BASE_NAMES } from '../providers/rn-base';
import { gluestack } from '../providers/gluestack';
import { paper } from '../providers/paper';
import { reusables } from '../providers/reusables';
import { tamagui } from '../providers/tamagui';
import * as ui from './index';
import { Button, Card, Heading, Select, Tabs, Text, componentsOf, coverageOf, useProviderName } from './index';

const adapters: ProviderAdapter[] = [flipova, gluestack, reusables, paper, tamagui];

const SIX = ['Badge', 'Button', 'Card', 'Input', 'Switch', 'Text'];
/** what each library implements natively (the six, plus what it really has and the tests can verify); the rest is flipova's */
const own = (...names: string[]) => [...new Set([...SIX, ...RN_BASE_NAMES, ...names])];
const NATIVE: Record<string, string[]> = {
  gluestack: own(
    'Box',
    'Center',
    'Divider',
    'Heading',
    'HStack',
    'Link',
    'Skeleton',
    'Spinner',
    'Textarea',
    'VStack',
    'Fab',
    'Modal',
  ),
  paper: own(
    'Accordion',
    'AlertDialog',
    'Avatar',
    'Checkbox',
    'Divider',
    'Fab',
    'Heading',
    'Portal',
    'Progress',
    'Spinner',
    'Textarea',
  ),
  tamagui: own(
    'Icon',
    'Link',
    'LiquidGlass',
    'FormControl',
    'Avatar',
    'Checkbox',
    'Progress',
    'Box',
    'Center',
    'Divider',
    'Heading',
    'HStack',
    'VStack',
  ),
  reusables: own(
    'Box',
    'Center',
    'Divider',
    'HStack',
    'VStack',
    'Heading',
    'Link',
    'Avatar',
    'Progress',
    'Checkbox',
    'FormControl',
    'Skeleton',
  ),
};

describe('unified ui: structure', () => {
  it('exports exactly the components of the contract', () => {
    for (const name of UI_NAMES) expect(typeof (ui as Record<string, unknown>)[name], name).toBe('function');
  });
  it('flipova implements every component natively', () => {
    expect(coverageOf(flipova)).toEqual({ provider: 'flipova', native: [...UI_NAMES], fallback: [] });
    expect(Object.keys(flipovaComponents).sort()).toEqual([...UI_NAMES].sort());
  });
  for (const a of [gluestack, reusables, paper, tamagui]) {
    it(`${a.name}: native components are its own, the others fall back to flipova`, () => {
      const cov = coverageOf(a);
      expect([...cov.native].sort()).toEqual([...NATIVE[a.name]!].sort());
      expect(cov.native.length + cov.fallback.length).toBe(UI_NAMES.length);
      const all = componentsOf(a);
      for (const n of UI_NAMES) expect(all[n], n).toBe(cov.native.includes(n) ? a.components[n] : flipovaComponents[n]);
    });
  }
});

describe.each(adapters.map((a) => [a.name, a] as const))('unified ui resolves through %s', (_n, adapter) => {
  it('renders native and fallback components side by side and keeps them interactive', () => {
    const onPress = vi.fn();
    const onValue = vi.fn();
    const onTab = vi.fn();
    render(
      <FlipovaProvider adapter={adapter}>
        <Card>
          <Heading level={1}>Welcome</Heading>
          <Text>hello</Text>
          <Button onPress={onPress}>Press</Button>
          <Select placeholder="Pick" onValueChange={onValue} options={[{ value: 'a', label: 'Alpha' }]} />
          <Tabs
            onValueChange={onTab}
            tabs={[
              { key: 'one', label: 'One' },
              { key: 'two', label: 'Two' },
            ]}
          />
        </Card>
      </FlipovaProvider>,
    );
    expect(screen.getByText('Welcome')).toBeTruthy();
    fireEvent.click(screen.getByText('Press'));
    expect(onPress).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Pick'));
    fireEvent.click(screen.getByText('Alpha'));
    expect(onValue).toHaveBeenCalledWith('a');
    fireEvent.click(screen.getByText('Two'));
    expect(onTab).toHaveBeenCalledWith('two');
  });
  it('reports which provider is mounted', () => {
    const Who = () => <>{useProviderName()}</>;
    render(
      <FlipovaProvider adapter={adapter}>
        <Who />
      </FlipovaProvider>,
    );
    expect(screen.getByText(adapter.name)).toBeTruthy();
  });
});

describe('unified ui: fallback without a provider', () => {
  it('renders with flipova and its default design when no provider is mounted', () => {
    const onPress = vi.fn();
    const Who = () => <>{useProviderName()}</>;
    render(
      <>
        <Button onPress={onPress}>Alone</Button>
        <Who />
      </>,
    );
    fireEvent.click(screen.getByText('Alone'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('flipova')).toBeTruthy();
  });
});
