import re

path = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/panels/properties/DesignPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace all semantic colors with C.primary
code = re.sub(r'C\.(cyan|purple|orange|green|pink|blue)', 'C.primary', code)

# Replace any transparent concatenations like C.primary + '25', C.primary + '40'
code = re.sub(r"C\.primary\s*\+\s*'[0-9]{2}'", 'C.primaryGlow', code)
code = re.sub(r'C\.primary\s*\+\s*"[0-9]{2}"', 'C.primaryGlow', code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
print('Replaced colors in DesignPanel.tsx')

# Also process index.tsx (Properties panel root) just in case
path2 = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/panels/properties/index.tsx'
with open(path2, 'r', encoding='utf-8') as f:
    code2 = f.read()
code2 = re.sub(r'C\.(cyan|purple|orange|green|pink|blue)', 'C.primary', code2)
code2 = re.sub(r"C\.primary\s*\+\s*'[0-9]{2}'", 'C.primaryGlow', code2)
with open(path2, 'w', encoding='utf-8') as f:
    f.write(code2)
print('Replaced colors in index.tsx')
