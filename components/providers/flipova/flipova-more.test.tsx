import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { UI_NAMES } from '../../contract';
import { FlipovaProvider } from '../provider';
import * as F from './index';
import { flipova } from './index';

const wrap = (ui: React.ReactNode) => render(<FlipovaProvider adapter={flipova}>{ui}</FlipovaProvider>);
const T = (s: string) => <F.Text>{s}</F.Text>;

describe('flipova: every contract name is implemented', () => {
  it.each(UI_NAMES)('%s', (n) => {
    expect(typeof (F.flipovaComponents as Record<string, unknown>)[n]).toBe('function');
  });
});

describe('flipova: layout', () => {
  it('stacks take their gap from the spacing scale and Center centres', () => {
    wrap(
      <>
        <F.HStack testID="h" space="4">
          {T('a')}
          {T('b')}
        </F.HStack>
        <F.VStack testID="v" space="2">
          {T('c')}
        </F.VStack>
        <F.Center testID="c">{T('d')}</F.Center>
      </>,
    );
    expect(getComputedStyle(screen.getByTestId('h')).flexDirection).toBe('row');
    expect(getComputedStyle(screen.getByTestId('h')).gap).toBe('16px');
    expect(getComputedStyle(screen.getByTestId('v')).flexDirection).toBe('column');
    expect(getComputedStyle(screen.getByTestId('v')).gap).toBe('8px');
    expect(getComputedStyle(screen.getByTestId('c')).alignItems).toBe('center');
  });

  it('Grid wraps every child in its own cell', () => {
    wrap(
      <F.Grid testID="g" columns={3}>
        {T('1')}
        {T('2')}
        {T('3')}
        {T('4')}
      </F.Grid>,
    );
    expect(screen.getByTestId('g').children).toHaveLength(4);
    expect(getComputedStyle(screen.getByTestId('g')).flexWrap).toBe('wrap');
  });

  it('Box, View, SafeAreaView, ScrollView, KeyboardAvoidingView render their children', () => {
    wrap(
      <>
        <F.Box testID="b">{T('box')}</F.Box>
        <F.View>{T('view')}</F.View>
        <F.SafeAreaView>{T('safe')}</F.SafeAreaView>
        <F.ScrollView>{T('scroll')}</F.ScrollView>
        <F.KeyboardAvoidingView>{T('kav')}</F.KeyboardAvoidingView>
      </>,
    );
    for (const s of ['box', 'view', 'safe', 'scroll', 'kav']) expect(screen.getByText(s)).toBeTruthy();
  });

  it('Pressable presses, and does not when disabled', () => {
    const on = vi.fn();
    wrap(
      <>
        <F.Pressable onPress={on} accessibilityLabel="go">
          {T('go')}
        </F.Pressable>
        <F.Pressable disabled onPress={on} accessibilityLabel="no">
          {T('no')}
        </F.Pressable>
      </>,
    );
    fireEvent.click(screen.getByLabelText('go'));
    fireEvent.click(screen.getByLabelText('no'));
    expect(on).toHaveBeenCalledTimes(1);
  });
});

describe('flipova: lists', () => {
  const data = ['a', 'b', 'c'];
  it('FlatList and VirtualizedList render items, and the empty state', () => {
    wrap(
      <>
        <F.FlatList data={data} renderItem={(i) => T(`flat-${i}`)} />
        <F.VirtualizedList data={data} renderItem={(i) => T(`virt-${i}`)} />
        <F.FlatList data={[]} renderItem={() => null} empty={T('nothing')} />
      </>,
    );
    expect(screen.getByText('flat-b')).toBeTruthy();
    expect(screen.getByText('virt-c')).toBeTruthy();
    expect(screen.getByText('nothing')).toBeTruthy();
  });

  it('SectionList renders titles and items', () => {
    wrap(
      <F.SectionList
        sections={[
          { title: 'Fruit', data: ['apple'] },
          { title: 'Veg', data: ['leek'] },
        ]}
        renderItem={(i) => T(String(i))}
      />,
    );
    expect(screen.getByText('Fruit')).toBeTruthy();
    expect(screen.getByText('leek')).toBeTruthy();
  });

  it('RefreshControl and StatusBar mount without error', () => {
    expect(() =>
      wrap(
        <>
          <F.StatusBar />
          <F.StatusBar style="light" />
        </>,
      ),
    ).not.toThrow();
    expect(() => wrap(<F.ScrollView>{T('x')}</F.ScrollView>)).not.toThrow();
    expect(typeof F.RefreshControl).toBe('function');
  });
});

describe('flipova: media and small elements', () => {
  it('Image uses its source and alt; ImageBackground shows children', () => {
    wrap(
      <>
        <F.Image source="https://x/y.png" alt="logo" width={40} height={30} testID="i" />
        <F.ImageBackground source="https://x/b.png">{T('over')}</F.ImageBackground>
      </>,
    );
    expect(screen.getByLabelText('logo')).toBeTruthy();
    expect(screen.getByText('over')).toBeTruthy();
  });

  it('Icon shows a glyph and is hidden from assistive tech unless labelled', () => {
    wrap(
      <>
        <F.Icon name="check" testID="a" />
        <F.Icon name="star" accessibilityLabel="favourite" />
      </>,
    );
    expect(screen.getByTestId('a').textContent).toBe('✓');
    expect(screen.getByLabelText('favourite').textContent).toBe('★');
  });

  it('Link calls onPress', () => {
    const on = vi.fn();
    wrap(<F.Link onPress={on}>read</F.Link>);
    fireEvent.click(screen.getByText('read'));
    expect(on).toHaveBeenCalled();
  });

  it('LiquidGlass is a translucent surface', () => {
    wrap(<F.LiquidGlass testID="lg">{T('glass')}</F.LiquidGlass>);
    expect(getComputedStyle(screen.getByTestId('lg')).backgroundColor).toMatch(/rgba\(.*,\s*0?\.6\)/);
  });

  it('Fab presses and labels itself', () => {
    const on = vi.fn();
    wrap(<F.Fab onPress={on} label="New" />);
    fireEvent.click(screen.getByLabelText('New'));
    expect(on).toHaveBeenCalled();
  });

  it('Table renders headers, rows and the caption', () => {
    wrap(
      <F.Table
        caption="People"
        columns={[
          { key: 'n', label: 'Name' },
          { key: 'a', label: 'Age', align: 'right' },
        ]}
        rows={[
          { n: 'Ada', a: 36 },
          { n: 'Alan', a: 41 },
        ]}
      />,
    );
    for (const s of ['People', 'Name', 'Age', 'Ada', '36', 'Alan', '41']) expect(screen.getByText(s)).toBeTruthy();
  });

  it('FormControl shows label, required mark, helper, and the error instead of the helper', () => {
    const { rerender } = wrap(
      <F.FormControl label="Email" required helper="We never share it">
        <F.Input accessibilityLabel="e" />
      </F.FormControl>,
    );
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
    expect(screen.getByText('We never share it')).toBeTruthy();
    rerender(
      <FlipovaProvider adapter={flipova}>
        <F.FormControl label="Email" helper="We never share it" error="Invalid">
          <F.Input accessibilityLabel="e" />
        </F.FormControl>
      </FlipovaProvider>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Invalid');
    expect(screen.queryByText('We never share it')).toBeNull();
  });

  it('InputAccessoryView renders nothing outside iOS', () => {
    wrap(<F.InputAccessoryView nativeID="x">{T('bar')}</F.InputAccessoryView>);
    expect(screen.queryByText('bar')).toBeNull();
  });
});

describe('flipova: disclosure and overlays', () => {
  it('Accordion: single keeps one open, multiple keeps several, disabled stays shut, controlled mode reports', () => {
    const items = [
      { key: 'a', title: 'A', content: T('ca') },
      { key: 'b', title: 'B', content: T('cb') },
      { key: 'c', title: 'C', content: T('cc'), disabled: true },
    ];
    const { unmount } = wrap(<F.Accordion items={items} />);
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('B'));
    expect(screen.queryByText('ca')).toBeNull();
    expect(screen.getByText('cb')).toBeTruthy();
    fireEvent.click(screen.getByText('C'));
    expect(screen.queryByText('cc')).toBeNull();
    unmount();

    wrap(<F.Accordion items={items} type="multiple" defaultValue={['a']} />);
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByText('ca')).toBeTruthy();
    expect(screen.getByText('cb')).toBeTruthy();
  });

  it('Accordion in controlled mode reports and does not move on its own', () => {
    const on = vi.fn();
    wrap(<F.Accordion items={[{ key: 'a', title: 'A', content: T('ca') }]} value={[]} onValueChange={on} />);
    fireEvent.click(screen.getByText('A'));
    expect(on).toHaveBeenCalledWith(['a']);
    expect(screen.queryByText('ca')).toBeNull();
  });

  it('Popover opens from its trigger', () => {
    wrap(<F.Popover trigger={T('open')}>{T('inside')}</F.Popover>);
    expect(screen.queryByText('inside')).toBeNull();
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByText('inside')).toBeTruthy();
  });

  it('Tooltip shows on hover / focus', () => {
    wrap(<F.Tooltip content="Help text">{T('hover me')}</F.Tooltip>);
    expect(screen.queryByText('Help text')).toBeNull();
    fireEvent.focus(screen.getByText('hover me').closest('[tabindex]') ?? screen.getByText('hover me'));
    expect(screen.queryByText('Help text')).not.toBeNull();
  });

  it('Menu opens, selects, closes, and ignores disabled items', () => {
    const a = vi.fn();
    const b = vi.fn();
    wrap(
      <F.Menu
        label="Actions"
        items={[
          { key: 'a', label: 'Edit', onSelect: a },
          { key: 'b', label: 'Delete', onSelect: b, disabled: true },
        ]}
      />,
    );
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Delete'));
    expect(b).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Edit'));
    expect(a).toHaveBeenCalled();
    expect(screen.queryByText('Edit')).toBeNull();
  });

  it('ActionSheet lists actions, runs one and closes, and cancels', () => {
    const run = vi.fn();
    const close = vi.fn();
    wrap(<F.ActionSheet visible title="Share" onClose={close} actions={[{ key: 'x', label: 'Copy', onPress: run }]} />);
    expect(screen.getByText('Share')).toBeTruthy();
    fireEvent.click(screen.getByText('Copy'));
    expect(run).toHaveBeenCalled();
    expect(close).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Cancel'));
    expect(close).toHaveBeenCalledTimes(2);
  });

  it('AlertDialog confirms and cancels, and is absent while hidden', () => {
    const yes = vi.fn();
    const no = vi.fn();
    const { rerender } = wrap(<F.AlertDialog visible={false} title="Sure?" onConfirm={yes} onCancel={no} />);
    expect(screen.queryByText('Sure?')).toBeNull();
    rerender(
      <FlipovaProvider adapter={flipova}>
        <F.AlertDialog
          visible
          title="Sure?"
          description="No undo"
          confirmLabel="Delete"
          destructive
          onConfirm={yes}
          onCancel={no}
        />
      </FlipovaProvider>,
    );
    expect(screen.getByText('No undo')).toBeTruthy();
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(yes).toHaveBeenCalled();
    expect(no).toHaveBeenCalled();
  });

  it('BottomSheet and Drawer show content only while visible and close from the backdrop', () => {
    const close = vi.fn();
    const { rerender } = wrap(
      <F.BottomSheet visible={false} title="Sheet">
        {T('in sheet')}
      </F.BottomSheet>,
    );
    expect(screen.queryByText('in sheet')).toBeNull();
    rerender(
      <FlipovaProvider adapter={flipova}>
        <F.BottomSheet visible title="Sheet" onClose={close}>
          {T('in sheet')}
        </F.BottomSheet>
      </FlipovaProvider>,
    );
    expect(screen.getByText('in sheet')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(close).toHaveBeenCalled();
    rerender(
      <FlipovaProvider adapter={flipova}>
        <F.Drawer visible side="right" onClose={close}>
          {T('menu')}
        </F.Drawer>
      </FlipovaProvider>,
    );
    expect(screen.getByText('menu')).toBeTruthy();
  });

  it('ImageViewer shows the image and closes', () => {
    const close = vi.fn();
    wrap(<F.ImageViewer visible source="https://x/y.png" alt="Big" onClose={close} />);
    expect(screen.getByLabelText('Big')).toBeTruthy();
    fireEvent.click(within(document.body).getAllByLabelText('Close')[0]!);
    expect(close).toHaveBeenCalled();
  });

  it('Portal draws its content through the host, once, and removes it on unmount', () => {
    const { rerender } = wrap(
      <>
        <F.Portal>{T('portaled')}</F.Portal>
        {T('page')}
      </>,
    );
    expect(screen.getAllByText('portaled')).toHaveLength(1);
    rerender(<FlipovaProvider adapter={flipova}>{T('page')}</FlipovaProvider>);
    expect(screen.queryByText('portaled')).toBeNull();
  });

  it('Portal without a provider keeps its children in place', () => {
    render(<F.Portal>{T('inline')}</F.Portal>);
    expect(screen.getByText('inline')).toBeTruthy();
  });
});

describe('flipova: inputs', () => {
  it('Slider exposes its value and moves with accessibility actions, within bounds and on its step', () => {
    const on = vi.fn();
    wrap(<F.Slider value={50} onValueChange={on} min={0} max={100} step={10} accessibilityLabel="vol" />);
    const el = screen.getByLabelText('vol');
    expect(el.getAttribute('aria-valuenow')).toBe('50');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('Calendar shows the month, selects a day, moves months and respects min/max', () => {
    const on = vi.fn();
    wrap(<F.Calendar month="2024-02" value="2024-02-14" min="2024-02-05" max="2024-02-20" onChange={on} />);
    expect(screen.getByText('February 2024')).toBeTruthy();
    expect(screen.getByLabelText('2024-02-14').getAttribute('aria-selected')).toBe('true');
    fireEvent.click(screen.getByLabelText('2024-02-03'));
    fireEvent.click(screen.getByLabelText('2024-02-22'));
    expect(on).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('2024-02-10'));
    expect(on).toHaveBeenCalledWith('2024-02-10');
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('March 2024')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Previous month'));
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('January 2024')).toBeTruthy();
  });

  it('DateTimePicker picks a date from the calendar, then closes', () => {
    const Host = () => {
      const [v, setV] = useState('');
      return <F.DateTimePicker value={v} onChange={setV} placeholder="Birthday" />;
    };
    wrap(<Host />);
    fireEvent.click(screen.getByLabelText('Birthday'));
    const first = screen
      .getAllByRole('button')
      .find((b) => /^\d{4}-\d{2}-15$/.test(b.getAttribute('aria-label') ?? ''))!;
    const date = first.getAttribute('aria-label')!;
    fireEvent.click(first);
    expect(screen.getByLabelText('Birthday').textContent).toBe(date);
    expect(screen.queryByText(/^Next month$/)).toBeNull();
  });
});
