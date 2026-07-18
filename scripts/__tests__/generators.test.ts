import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { buildRegistry } from '../generators/registry';
import { buildThemes } from '../generators/themes';
import { buildTokens } from '../generators/tokens';

// Mock fs to avoid writing real files
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  };
});

describe('Generators', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildRegistry', () => {
    it('should generate registry arrays and return components, blocks, layouts and primitives', () => {
      const mockUiDir = path.resolve(__dirname, '../../foundation/ui/components');
      const outFile = path.resolve(__dirname, '../../foundation/registry/__test_generated.ts');

      // Given that we are running the actual code but preventing file writes via mock,
      // it should at least not throw and return some structure if there's any file
      // Because we mock writeFileSync but not readFileSync, it reads actual project meta files!
      
      const result = buildRegistry(mockUiDir, outFile);
      expect(result).toHaveProperty('components');
      expect(result).toHaveProperty('blocks');
      expect(result).toHaveProperty('layouts');
      expect(result).toHaveProperty('primitives');
      expect(Array.isArray(result.components)).toBe(true);
      
      // Verify writeFileSync was called with the correct output path
      expect(fs.writeFileSync).toHaveBeenCalledWith(outFile, expect.any(String));
    });
  });

  describe('buildThemes', () => {
    it('should parse themes.yaml and write generated ts', () => {
      const inputFile = path.resolve(__dirname, '../../foundation/theme/themes.yaml');
      const outFile = path.resolve(__dirname, '../../foundation/theme/__test_generated.ts');

      const result = buildThemes(inputFile, outFile);
      expect(Object.keys(result).length).toBeGreaterThan(0);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(outFile, expect.any(String));
      
      // Verify generated content contains createTheme call
      const writeCall = vi.mocked(fs.writeFileSync).mock.calls.find(call => call[0] === outFile);
      expect(writeCall).toBeDefined();
      expect(writeCall![1]).toContain('createTheme');
    });

    it('should throw error if input file is missing', () => {
      expect(() => {
        buildThemes('invalid_path.yaml', 'out.ts');
      }).toThrow('File not found: invalid_path.yaml');
    });
  });

  describe('buildTokens', () => {
    it('should parse tokens.yaml and write generated ts', () => {
      const inputFile = path.resolve(__dirname, '../../foundation/tokens/tokens.yaml');
      const outFile = path.resolve(__dirname, '../../foundation/tokens/__test_generated.ts');

      const result = buildTokens(inputFile, outFile);
      expect(Object.keys(result).length).toBeGreaterThan(0);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(outFile, expect.any(String));
      
      // Verify generated content contains export const
      const writeCall = vi.mocked(fs.writeFileSync).mock.calls.find(call => call[0] === outFile);
      expect(writeCall).toBeDefined();
      expect(writeCall![1]).toContain('export const');
      expect(writeCall![1]).toContain('type ColorToken');
    });

    it('should throw error if input file is missing', () => {
      expect(() => {
        buildTokens('invalid_path.yaml', 'out.ts');
      }).toThrow('File not found: invalid_path.yaml');
    });
  });
});
