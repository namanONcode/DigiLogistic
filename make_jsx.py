from bs4 import BeautifulSoup
import re

html_content = open('ui_mockup.html').read()
soup = BeautifulSoup(html_content, 'html.parser')

body = soup.body

# Remove the script tags if any
for script in body.find_all('script'):
    script.decompose()

# The mockup has a header and main tag. Let's extract them.
header = body.find('header')
main = body.find('main')

# We need to convert to JSX.
def html_to_jsx(html_str):
    # Basic replacements
    jsx_str = html_str
    jsx_str = re.sub(r'\bclass=', 'className=', jsx_str)
    jsx_str = re.sub(r'\bfor=', 'htmlFor=', jsx_str)
    jsx_str = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx_str)
    
    # Self close empty tags like <input>, <img>, <br>, <hr>
    # It's tricky to do perfectly with regex, so we'll do some basic ones
    jsx_str = re.sub(r'<input([^>]*?[^\/])>', r'<input\1 />', jsx_str)
    jsx_str = re.sub(r'<img([^>]*?[^\/])>', r'<img\1 />', jsx_str)
    jsx_str = re.sub(r'<br([^>]*?[^\/])>', r'<br\1 />', jsx_str)
    jsx_str = re.sub(r'<hr([^>]*?[^\/])>', r'<hr\1 />', jsx_str)
    jsx_str = re.sub(r'<circle([^>]*?[^\/])>', r'<circle\1 />', jsx_str)
    jsx_str = re.sub(r'<path([^>]*?[^\/])>', r'<path\1 />', jsx_str)
    jsx_str = re.sub(r'<rect([^>]*?[^\/])>', r'<rect\1 />', jsx_str)
    jsx_str = re.sub(r'<line([^>]*?[^\/])>', r'<line\1 />', jsx_str)
    
    # Fix inline styles (if any)
    # E.g. style="width: 100%" -> style={{ width: '100%' }}
    # This is complex, hopefully not many inline styles
    
    return jsx_str

with open('header.jsx', 'w') as f:
    f.write(html_to_jsx(str(header)))

with open('main.jsx', 'w') as f:
    f.write(html_to_jsx(str(main)))

