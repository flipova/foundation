import re

path = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/panels/layers/index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace typeColor definition
# Old: auth: '#555555', protected: '#ffffff', tabs: '#000091', drawer: '#000091', stack: '#555555', custom: '#555555'
code = re.sub(r"auth: '#555555', protected: '#ffffff', tabs: '#000091', drawer: '#000091', stack: '#555555', custom: '#555555'", 
              "auth: C.textSub, protected: C.text, tabs: C.primary, drawer: C.primary, stack: C.textSub, custom: C.textSub", code)

# Replace backgroundColor with + '20'
code = re.sub(r"backgroundColor:\s*\(\s*typeColor\[\w+\.type\]\s*\|\|\s*C\.muted\s*\)\s*\+\s*'20'",
              "backgroundColor: C.surface2", code)

# Also replace the + '20' in line 346 if it exists
code = re.sub(r"backgroundColor:\s*color\s*\+\s*'20'", "backgroundColor: C.surface2", code)

# Look for mode badge config:
#   static:   { label: 'static',   color: '#555555', bg: C.surface2 },
#   template: { label: 'template', color: '#ffffff', bg: C.surface2 },
#   data:     { label: 'data',     color: '#4d7cfe', bg: C.surface2 },
code = re.sub(r"color:\s*'#555555'", "color: C.textSub", code)
code = re.sub(r"color:\s*'#ffffff'", "color: C.text", code)
code = re.sub(r"color:\s*'#4d7cfe'", "color: C.primary", code)


with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated layers panel colors")
