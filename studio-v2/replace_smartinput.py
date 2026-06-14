import re

path = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/shared/SmartInput.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove rgba(...) with solid C.primaryGlow or surface2
code = re.sub(r"'rgba\(34,211,238,0.1\)'", 'C.primaryGlow', code)
code = re.sub(r"'rgba\(59,130,246,0.1\)'", 'C.primaryGlow', code)
code = re.sub(r"'rgba\(59,130,246,0.2\)'", 'C.border', code)
code = re.sub(r"'rgba\(34,211,238,0.08\)'", 'C.primaryGlow', code)
code = re.sub(r"'rgba\(34,211,238,0.25\)'", 'C.border', code)

code = re.sub(r"'rgba\(255,255,255,0.03\)'", 'C.surface2', code)
code = re.sub(r"'rgba\(249,115,22,0.15\)'", 'C.primaryGlow', code)
code = re.sub(r"'rgba\(6,182,212,0.15\)'", 'C.primaryGlow', code)
code = re.sub(r"'rgba\(249,115,22,0.06\)'", 'C.surface2', code)
code = re.sub(r"'rgba\(249,115,22,0.1\)'", 'C.border', code)

# We leave rgba(0,0,0,0.5) for the modal overlay since that needs transparency

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
print('Replaced rgba in SmartInput.tsx')
