import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { REQUIRED_ROLES, defaultRegistry, type ThemeRegistry } from '../../contract';
import { FlipovaProvider } from '../provider';
import { flipova } from './index';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Heading,
  Input,
  Modal,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  Text,
  Textarea,
  Toast,
} from './index';

const wrap = (ui: React.ReactNode, props: Partial<React.ComponentProps<typeof FlipovaProvider>> = {}) =>
  render(
    <FlipovaProvider adapter={flipova} {...props}>
      {ui}
    </FlipovaProvider>,
  );

/** a registry whose colours are deliberately unlike the starter: nothing may assume the starter's theme ids or values */
function brandRegistry(): ThemeRegistry {
  const colors = Object.fromEntries(REQUIRED_ROLES.map((r) => [r, '#123456']));
  return {
    ...defaultRegistry,
    themes: {
      'acme-day': {
        mode: 'light',
        variant: 'acme',
        colors: { ...colors, primary: '#ff0066', primaryForeground: '#00ffcc', background: '#fefefe' },
      },
      'acme-night': {
        mode: 'dark',
        variant: 'acme',
        colors: { ...colors, primary: '#aa0044', primaryForeground: '#ccffee', background: '#010101' },
      },
    },
    variants: { acme: { light: 'acme-day', dark: 'acme-night' } },
  };
}

const bg = (el: HTMLElement) => getComputedStyle(el).backgroundColor;

describe('flipova provider: behaviour of the components', () => {
  it('Button presses, shows loading, ignores press when disabled', () => {
    const onPress = vi.fn();
    const { rerender } = wrap(<Button onPress={onPress}>Go</Button>);
    fireEvent.click(screen.getByText('Go'));
    expect(onPress).toHaveBeenCalledTimes(1);
    rerender(
      <FlipovaProvider adapter={flipova}>
        <Button onPress={onPress} loading>
          Go
        </Button>
      </FlipovaProvider>,
    );
    fireEvent.click(screen.getByText('Go'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
  });

  it('Text and Heading render their content; Heading is a header with its level', () => {
    wrap(
      <>
        <Text>plain</Text>
        <Heading level={3}>title</Heading>
      </>,
    );
    expect(screen.getByText('plain')).toBeTruthy();
    const h = screen.getByRole('heading');
    expect(h.textContent).toBe('title');
    expect(h.getAttribute('aria-level')).toBe('3');
  });

  it('Input and Textarea report their text and can be disabled', () => {
    const a = vi.fn();
    const b = vi.fn();
    wrap(
      <>
        <Input placeholder="one" onChangeText={a} />
        <Textarea placeholder="two" onChangeText={b} rows={6} />
        <Input placeholder="off" disabled />
      </>,
    );
    fireEvent.change(screen.getByPlaceholderText('one'), { target: { value: 'x' } });
    fireEvent.change(screen.getByPlaceholderText('two'), { target: { value: 'y' } });
    expect(a).toHaveBeenCalledWith('x');
    expect(b).toHaveBeenCalledWith('y');
    expect((screen.getByPlaceholderText('off') as HTMLInputElement).readOnly).toBe(true);
  });

  it('Select opens, picks an option, closes, and skips disabled options', () => {
    const onValueChange = vi.fn();
    function K() {
      const [v, setV] = useState<string>();
      return (
        <Select
          placeholder="Pick"
          value={v}
          onValueChange={(x) => {
            onValueChange(x);
            setV(x);
          }}
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta', disabled: true },
            { value: 'c', label: 'Gamma' },
          ]}
        />
      );
    }
    wrap(<K />);
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.click(screen.getByText('Pick'));
    fireEvent.click(screen.getByText('Beta'));
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Gamma'));
    expect(onValueChange).toHaveBeenCalledWith('c');
    expect(screen.queryByText('Alpha')).toBeNull();
    expect(screen.getByText('Gamma')).toBeTruthy();
  });

  it('Checkbox toggles; RadioGroup selects; Switch is exposed', () => {
    const onCheck = vi.fn();
    const onRadio = vi.fn();
    wrap(
      <>
        <Checkbox label="Agree" checked={false} onCheckedChange={onCheck} />
        <RadioGroup
          value="x"
          onValueChange={onRadio}
          options={[
            { value: 'x', label: 'X' },
            { value: 'y', label: 'Y' },
          ]}
        />
        <Switch accessibilityLabel="sw" value={false} />
      </>,
    );
    fireEvent.click(screen.getByText('Agree'));
    expect(onCheck).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByText('Y'));
    expect(onRadio).toHaveBeenCalledWith('y');
    expect(screen.getByRole('radio', { checked: true }).textContent).toContain('X');
    expect(screen.getByLabelText('sw')).toBeTruthy();
  });

  it('Avatar shows initials without an image, Card/Badge/Divider render', () => {
    wrap(
      <>
        <Avatar name="Ada Lovelace" />
        <Card testID="card">
          <Badge>New</Badge>
        </Card>
        <Divider testID="d" />
      </>,
    );
    expect(screen.getByText('AL')).toBeTruthy();
    expect(within(screen.getByTestId('card')).getByText('New')).toBeTruthy();
    expect(screen.getByTestId('d')).toBeTruthy();
  });

  it('Modal shows its title and content only while visible, and closes from the backdrop', () => {
    const onClose = vi.fn();
    const { rerender } = wrap(
      <Modal visible={false} onClose={onClose} title="Sure?">
        <Text>body</Text>
      </Modal>,
    );
    expect(screen.queryByText('Sure?')).toBeNull();
    rerender(
      <FlipovaProvider adapter={flipova}>
        <Modal visible onClose={onClose} title="Sure?">
          <Text>body</Text>
        </Modal>
      </FlipovaProvider>,
    );
    expect(screen.getByText('Sure?')).toBeTruthy();
    fireEvent.click(screen.getByText('body'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Tabs switch panels (uncontrolled and controlled) and skip disabled tabs', () => {
    const onValueChange = vi.fn();
    wrap(
      <Tabs
        onValueChange={onValueChange}
        tabs={[
          { key: 'a', label: 'A', content: <Text>panel a</Text> },
          { key: 'b', label: 'B', content: <Text>panel b</Text> },
          { key: 'c', label: 'C', content: <Text>panel c</Text>, disabled: true },
        ]}
      />,
    );
    expect(screen.getByText('panel a')).toBeTruthy();
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByText('panel b')).toBeTruthy();
    expect(onValueChange).toHaveBeenCalledWith('b');
    fireEvent.click(screen.getByText('C'));
    expect(screen.queryByText('panel c')).toBeNull();
  });

  it('Alert and Toast announce themselves; Toast closes', () => {
    const onClose = vi.fn();
    wrap(
      <>
        <Alert variant="error" title="Oops">
          Something broke
        </Alert>
        <Toast variant="success" title="Saved" description="All good" onClose={onClose} />
      </>,
    );
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText('Something broke')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onClose).toHaveBeenCalled();
  });

  it('Progress clamps and exposes its value; Skeleton and Spinner render', () => {
    wrap(
      <>
        <Progress value={140} accessibilityLabel="p" />
        <Skeleton testID="sk" circle height={40} />
        <Spinner accessibilityLabel="wait" />
      </>,
    );
    expect(screen.getByLabelText('p').getAttribute('aria-valuenow')).toBe('100');
    expect(screen.getByTestId('sk')).toBeTruthy();
    expect(screen.getByLabelText('wait')).toBeTruthy();
  });
});

describe('flipova provider: the design is applied from the app’s own themes', () => {
  it('Button takes primary / primaryForeground from the registry the app passes', () => {
    wrap(<Button testID="b">Go</Button>, { theme: brandRegistry(), variant: 'acme', mode: 'light' });
    expect(bg(screen.getByTestId('b'))).toBe('rgb(255, 0, 102)');
  });
  it('switching mode switches theme', () => {
    const { rerender } = wrap(<Button testID="b">Go</Button>, {
      theme: brandRegistry(),
      variant: 'acme',
      mode: 'light',
    });
    rerender(
      <FlipovaProvider adapter={flipova} theme={brandRegistry()} variant="acme" mode="dark">
        <Button testID="b">Go</Button>
      </FlipovaProvider>,
    );
    expect(bg(screen.getByTestId('b'))).toBe('rgb(170, 0, 68)');
  });
  it('a registry that lacks a role the components read is refused, naming the role', () => {
    const r = brandRegistry();
    delete (r.themes['acme-day'].colors as Record<string, string>).ring;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => wrap(<Text>x</Text>, { theme: r, variant: 'acme' })).toThrow(/acme-day.*ring/);
    spy.mockRestore();
  });
});

describe('flipova provider: no value is written by hand', () => {
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) =>
      statSync(join(dir, f)).isDirectory()
        ? files(join(dir, f))
        : /\.tsx?$/.test(f) && !/\.test\./.test(f)
          ? [join(dir, f)]
          : [],
    );
  const dirs = [resolve(__dirname), resolve(__dirname, '../../ui')];
  for (const f of dirs.flatMap(files)) {
    it(`${f.split('/components/')[1]} has no colour literal`, () => {
      const src = readFileSync(f, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      expect(src.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) ?? []).toEqual([]);
    });
  }
});
