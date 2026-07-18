import { useMemo } from 'react';
import { StyleSheet, Platform } from 'react-native';

export function useEmojiPickerStyle(logic: any) {
  return useMemo(() => {
    return StyleSheet.create({
      container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
      },
      typeToggleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
      },
      typeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
      },
      typeBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      typeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
      },
      typeTextActive: {
        color: '#0F172A',
      },
      categoriesScroll: {
        flexGrow: 0,
        marginBottom: 16,
      },
      categoriesContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 4,
        ...Platform.select({
          web: {
            // @ts-ignore
            overflowX: 'auto',
          }
        })
      },
      categoryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 6,
        marginRight: 8,
      },
      categoryBtnActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
      },
      categoryIcon: {
        fontSize: 14,
      },
      categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
      },
      categoryTextActive: {
        color: '#2563EB',
      },
      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'flex-start',
      },
      emojiBtn: {
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        margin: 4,
      },
      selected: {
        backgroundColor: '#EFF6FF',
        borderWidth: 2,
        borderColor: '#3B82F6',
      },
      emojiText: {
        fontSize: 32,
      },
      animatedEmoji: {
        width: 40,
        height: 40,
      }
    });
  }, [logic]);
}
