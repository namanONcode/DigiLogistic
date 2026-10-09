with open('frontend/src/App.tsx', 'r') as f:
    app = f.read()

import re

# find all opening and closing tags for each element
def get_balance(text, tag):
    opens = len(re.findall(r'<' + tag + r'(\s|>)', text))
    closes = len(re.findall(r'</' + tag + r'>', text))
    return opens - closes

print("div balance:", get_balance(app, 'div'))
print("main balance:", get_balance(app, 'main'))
print("span balance:", get_balance(app, 'span'))
print("form balance:", get_balance(app, 'form'))
