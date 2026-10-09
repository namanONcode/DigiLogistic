with open('frontend/src/App.test.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == "});" and len(new_lines) > 100:
        continue
    new_lines.append(line)
new_lines.append("});\n")

with open('frontend/src/App.test.tsx', 'w') as f:
    f.writelines(new_lines)
