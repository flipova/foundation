import re
import os

root = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/'

# 1. Fix CodePanel.tsx
code_panel = os.path.join(root, 'panels/properties/CodePanel.tsx')
with open(code_panel, 'r', encoding='utf-8') as f:
    code = f.read()
code = code.replace('C.yellow', 'C.primary')
code = code.replace('C.red', 'C.error')
code = code.replace('C.orange', 'C.primary')
code = code.replace('C.purple', 'C.primary')
with open(code_panel, 'w', encoding='utf-8') as f:
    f.write(code)

# 2. Fix Toast.tsx
toast = os.path.join(root, 'shared/Toast.tsx')
with open(toast, 'r', encoding='utf-8') as f:
    code = f.read()
code = code.replace('C.successBg', 'C.success')
code = code.replace('C.errorBg', 'C.error')
code = code.replace('C.successBorder', 'C.success')
code = code.replace('C.errorBorder', 'C.error')
with open(toast, 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed TS errors")
