with open('frontend/src/App.test.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    if i == 116: # line 117 is index 116
        new_lines.append("    });\n")

with open('frontend/src/App.test.tsx', 'w') as f:
    f.writelines(new_lines)
