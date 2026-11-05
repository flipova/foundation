import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FlipovaProvider, type ProviderAdapter } from './index';
import { gluestack } from './gluestack';
import { paper } from './paper';
import { reusables } from './reusables';
import { tamagui } from './tamagui';

/** Each native component a library gained renders through its own adapter and keeps what the contract promises. */
const mount = (a: ProviderAdapter, name: string, props: Record<string, unknown>) => {
  const C = a.components[name as never] as React.ComponentType<Record<string, unknown>>;
  return render(
    <FlipovaProvider adapter={a}>
      <C {...props} />
    </FlipovaProvider>,
  );
};

describe('layout containers render their children in every library that has them', () => {
  for (const a of [gluestack, tamagui, reusables]) {
    for (const n of ['Box', 'Center', 'View'].filter((x) => x in a.components)) {
      it(`${a.name}: ${n}`, () => {
        mount(a, n, { testID: 't', children: <span>inside</span> });
        expect(screen.getByText('inside')).toBeTruthy();
        expect(screen.getByTestId('t')).toBeTruthy();
      });
    }
  }
  for (const a of [gluestack, tamagui]) {
    it(`${a.name}: HStack and VStack lay out in a row / column with the spacing step as gap`, () => {
      mount(a, 'HStack', { testID: 'h', space: '4', children: <span>a</span> });
      mount(a, 'VStack', { testID: 'v', space: '2', children: <span>b</span> });
      expect(getComputedStyle(screen.getByTestId('h')).gap).toBe('16px');
      expect(getComputedStyle(screen.getByTestId('v')).gap).toBe('8px');
      // the direction itself is a class of the library (tamagui: inline), which jsdom cannot resolve for gluestack
      if (a.name === 'tamagui') expect(getComputedStyle(screen.getByTestId('h')).flexDirection).toBe('row');
    });
  }
});

describe('gluestack natives', () => {
  it('Heading, Divider, Spinner, Link, Pressable, Textarea, Skeleton mount and work', () => {
    const onPress = vi.fn();
    const onText = vi.fn();
    mount(gluestack, 'Heading', { level: 1, children: 'Title' });
    mount(gluestack, 'Divider', { testID: 'd' });
    mount(gluestack, 'Spinner', { testID: 's' });
    mount(gluestack, 'Skeleton', { testID: 'sk', width: 20, height: 10 });
    mount(gluestack, 'Link', { onPress, children: 'go' });
    mount(gluestack, 'Pressable', { onPress, accessibilityLabel: 'tap', children: <span>tap</span> });
    mount(gluestack, 'Textarea', { placeholder: 'notes', onChangeText: onText });
    expect(screen.getByText('Title')).toBeTruthy();
    fireEvent.click(screen.getByText('go'));
    fireEvent.click(screen.getByText('tap'));
    expect(onPress).toHaveBeenCalledTimes(2);
    fireEvent.change(screen.getByPlaceholderText('notes'), { target: { value: 'hi' } });
    expect(onText).toHaveBeenCalledWith('hi');
  });
});

describe('paper natives', () => {
  it('Heading, Divider, Spinner, Progress, Textarea, Fab mount; Fab and Textarea respond', () => {
    const onPress = vi.fn();
    const onText = vi.fn();
    mount(paper, 'Heading', { level: 3, children: 'Section' });
    mount(paper, 'Divider', {});
    mount(paper, 'Spinner', { size: 'lg' });
    mount(paper, 'Progress', { value: 40 });
    mount(paper, 'Textarea', { placeholder: 'notes', onChangeText: onText });
    mount(paper, 'Fab', { label: 'New', onPress });
    expect(screen.getByText('Section')).toBeTruthy();
    fireEvent.click(screen.getByText('New'));
    expect(onPress).toHaveBeenCalled();
    fireEvent.change(screen.getByPlaceholderText('notes'), { target: { value: 'x' } });
    expect(onText).toHaveBeenCalledWith('x');
  });
  it('Portal mounts its children', () => {
    mount(paper, 'Portal', { children: <span>portal body</span> });
    expect(screen.getByText('portal body')).toBeTruthy();
  });
});

describe('tamagui natives', () => {
  it('Heading is a heading; Divider mounts', () => {
    mount(tamagui, 'Heading', { level: 2, children: 'Hello' });
    mount(tamagui, 'Divider', { testID: 'dv' });
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByTestId('dv')).toBeTruthy();
  });
});

describe('checkbox, avatar, progress natives', () => {
  for (const a of [paper, tamagui]) {
    it(`${a.name}: Checkbox reports the toggled value and ignores presses when disabled`, () => {
      const on = vi.fn();
      const { unmount } = mount(a, 'Checkbox', { checked: false, label: 'Agree', onCheckedChange: on });
      fireEvent.click(screen.getByRole('checkbox'));
      expect(on).toHaveBeenCalledWith(true);
      unmount();
      const off = vi.fn();
      mount(a, 'Checkbox', { checked: true, disabled: true, label: 'Agree', onCheckedChange: off });
      fireEvent.click(screen.getByRole('checkbox'));
      expect(off).not.toHaveBeenCalled();
    });
    it(`${a.name}: Avatar shows initials without an image`, () => {
      mount(a, 'Avatar', { name: 'Ada Lovelace' });
      expect(screen.getByText('AL')).toBeTruthy();
    });
  }
  it('tamagui: Progress exposes its clamped value', () => {
    mount(tamagui, 'Progress', { value: 140, testID: 'p' });
    expect(screen.getByTestId('p').getAttribute('aria-valuenow')).toBe('100');
  });
});

describe('gluestack: containers, lists, media, checkbox, fab, modal', () => {
  it('View, ScrollView, SafeAreaView, KeyboardAvoidingView render their children', () => {
    mount(gluestack, 'View', { children: <span>v</span> });
    mount(gluestack, 'ScrollView', { children: <span>s</span> });
    mount(gluestack, 'SafeAreaView', { children: <span>sa</span> });
    mount(gluestack, 'KeyboardAvoidingView', { children: <span>k</span> });
    for (const t of ['v', 's', 'sa', 'k']) expect(screen.getByText(t)).toBeTruthy();
  });
  it('FlatList, VirtualizedList and SectionList render items; the empty state shows', () => {
    const item = (i: unknown) => <span>{`it-${i}`}</span>;
    mount(gluestack, 'FlatList', { data: ['a'], renderItem: item });
    mount(gluestack, 'VirtualizedList', { data: ['b'], renderItem: item });
    mount(gluestack, 'SectionList', { sections: [{ title: 'Head', data: ['c'] }], renderItem: item });
    mount(gluestack, 'FlatList', { data: [], renderItem: item, empty: <span>nothing</span> });
    for (const t of ['it-a', 'it-b', 'it-c', 'Head', 'nothing']) expect(screen.getByText(t)).toBeTruthy();
  });
  it('Image and ImageBackground', () => {
    mount(gluestack, 'Image', { source: 'https://x/y.png', alt: 'logo', width: 10, height: 10 });
    mount(gluestack, 'ImageBackground', { source: 'https://x/b.png', children: <span>over</span> });
    expect(screen.getByLabelText('logo')).toBeTruthy();
    expect(screen.getByText('over')).toBeTruthy();
  });
  it('Fab presses', () => {
    const on = vi.fn();
    mount(gluestack, 'Fab', { label: 'New', onPress: on });
    fireEvent.click(screen.getByText('New'));
    expect(on).toHaveBeenCalled();
  });
  it('Modal shows its title and content only while visible', () => {
    const { unmount } = mount(gluestack, 'Modal', { visible: true, title: 'Hello', children: <span>body</span> });
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('body')).toBeTruthy();
    unmount();
    mount(gluestack, 'Modal', { visible: false, title: 'Hello2', children: <span>body2</span> });
    expect(screen.queryByText('body2')).toBeNull();
  });
});

describe('reusables natives (classes)', () => {
  it('Heading, Divider, Link, Avatar, Progress, Skeleton, FormControl, HStack/VStack render', () => {
    const on = vi.fn();
    mount(reusables, 'Heading', { level: 1, children: 'Big' });
    mount(reusables, 'Link', { onPress: on, children: 'go' });
    mount(reusables, 'Avatar', { name: 'Ada Lovelace' });
    mount(reusables, 'Progress', { value: 150, testID: 'p' });
    mount(reusables, 'FormControl', { label: 'Email', required: true, error: 'Bad', children: <span>field</span> });
    mount(reusables, 'HStack', { space: '4', children: <span>h</span> });
    mount(reusables, 'Divider', { testID: 'dv' });
    mount(reusables, 'Skeleton', { testID: 'sk', height: 12, width: 30 });
    expect(screen.getByText('Big')).toBeTruthy();
    fireEvent.click(screen.getByText('go'));
    expect(on).toHaveBeenCalled();
    expect(screen.getByText('AL')).toBeTruthy();
    expect(screen.getByTestId('p').getAttribute('aria-valuenow')).toBe('100');
    expect(screen.getByRole('alert').textContent).toBe('Bad');
    expect(screen.getByText('h')).toBeTruthy();
  });
  it('Checkbox toggles and ignores presses when disabled', () => {
    const on = vi.fn();
    const { unmount } = mount(reusables, 'Checkbox', { checked: false, label: 'Agree', onCheckedChange: on });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(on).toHaveBeenCalledWith(true);
    unmount();
    const off = vi.fn();
    mount(reusables, 'Checkbox', { disabled: true, label: 'Agree', onCheckedChange: off });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(off).not.toHaveBeenCalled();
  });
});

describe('paper: AlertDialog and Accordion', () => {
  it('AlertDialog confirms and cancels, and is absent while hidden', () => {
    const yes = vi.fn();
    const no = vi.fn();
    const { unmount } = mount(paper, 'AlertDialog', { visible: false, title: 'Gone?', onConfirm: yes, onCancel: no });
    expect(screen.queryByText('Gone?')).toBeNull();
    unmount();
    mount(paper, 'AlertDialog', {
      visible: true,
      title: 'Sure?',
      description: 'No undo',
      confirmLabel: 'Delete',
      onConfirm: yes,
      onCancel: no,
    });
    expect(screen.getByText('No undo')).toBeTruthy();
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(yes).toHaveBeenCalled();
    expect(no).toHaveBeenCalled();
  });
  it('Accordion opens one item at a time and skips disabled ones', () => {
    const items = [
      { key: 'a', title: 'A', content: <span>ca</span> },
      { key: 'b', title: 'B', content: <span>cb</span> },
      { key: 'c', title: 'C', content: <span>cc</span>, disabled: true },
    ];
    mount(paper, 'Accordion', { items });
    fireEvent.click(screen.getByText('A'));
    expect(screen.getByText('ca')).toBeTruthy();
    fireEvent.click(screen.getByText('B'));
    expect(screen.queryByText('ca')).toBeNull();
    expect(screen.getByText('cb')).toBeTruthy();
    fireEvent.click(screen.getByText('C'));
    expect(screen.queryByText('cc')).toBeNull();
  });
});

describe('tamagui: Icon, Link, LiquidGlass, FormControl', () => {
  it('render and respond', () => {
    const on = vi.fn();
    mount(tamagui, 'Icon', { name: 'check', testID: 'ic' });
    mount(tamagui, 'Link', { onPress: on, children: 'read' });
    mount(tamagui, 'LiquidGlass', { testID: 'lg', children: <span>glass</span> });
    mount(tamagui, 'FormControl', { label: 'Name', helper: 'Your name', children: <span>f</span> });
    expect(screen.getByTestId('ic').textContent).toBe('✓');
    fireEvent.click(screen.getByText('read'));
    expect(on).toHaveBeenCalled();
    expect(screen.getByText('glass')).toBeTruthy();
    expect(screen.getByText('Your name')).toBeTruthy();
  });
});

describe('React Native base shared by every adapter', () => {
  for (const a of [gluestack, paper, tamagui, reusables]) {
    it(`${a.name} serves the shared lists and containers`, () => {
      mount(a, 'FlatList', { data: ['x'], renderItem: (i: unknown) => <span>{`row-${i}`}</span> });
      mount(a, 'ScrollView', { children: <span>scroll</span> });
      expect(screen.getByText('row-x')).toBeTruthy();
      expect(screen.getByText('scroll')).toBeTruthy();
    });
  }
});
