import os, re

path = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/panels/properties/LogicPanel'
for root, _, files in os.walk(path):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace any + 'xx' transparency
            content = re.sub(r'C\.[a-zA-Z]+\s*\+\s*\'[0-9]{2}\'', 'C.primaryGlow', content)
            content = re.sub(r'C\.[a-zA-Z]+\s*\+\s*"[0-9]{2}"', 'C.primaryGlow', content)
            
            # Replace rgba with solid colors based on alpha
            # Very transparent backgrounds (alpha 0.01 - 0.19)
            content = re.sub(r"'rgba\(\d+,\d+,\d+,0\.1\d*\)'", 'C.surface2', content)
            content = re.sub(r"'rgba\(\d+,\d+,\d+,0\.0\d*\)'", 'C.surface2', content)
            
            # Slightly more opaque (alpha 0.2 - 0.4) -> border or active bg
            content = re.sub(r"'rgba\(\d+,\d+,\d+,0\.[2-4]\d*\)'", 'C.border', content)
            
            # Specific texts
            content = re.sub(r"'rgba\(255,255,255,0\.7\)'", 'C.textSub', content)
            
            # Overlays (0.5, 0.6, 0.8) -> let's leave overlays or map to C.bg
            content = re.sub(r"'rgba\(\d+,\d+,\d+,0\.[5-9]\d*\)'", 'C.bg', content)
            
            with open(fp, 'w', encoding='utf-8') as file:
                file.write(content)

print("LogicPanel done.")
