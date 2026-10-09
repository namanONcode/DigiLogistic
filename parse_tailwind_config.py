import json
import re

config_str = """{"darkMode":"class","theme":{"extend":{"colors":{"error-container":"#ffdad6","secondary-fixed-dim":"#b4c5ff","on-secondary-fixed":"#00174b","secondary-container":"#316bf3","error":"#ba1a1a","surface-container-highest":"#d3e4fe","on-tertiary-container":"#188ace","tertiary-container":"#001d31","surface-tint":"#565d79","on-background":"#0b1c30","surface-dim":"#cbdbf5","tertiary":"#000000","primary-fixed":"#dbe1ff","surface-container":"#e5eeff","on-secondary":"#ffffff","on-primary-fixed-variant":"#3e4660","primary-container":"#131a33","on-tertiary-fixed":"#001d31","on-tertiary":"#ffffff","on-primary":"#ffffff","on-primary-container":"#7b83a0","on-primary-fixed":"#131a33","on-surface-variant":"#45464d","surface-container-low":"#eff4ff","surface":"#f8f9ff","outline":"#76767e","on-secondary-fixed-variant":"#003ea8","inverse-on-surface":"#eaf1ff","primary-fixed-dim":"#bec5e5","tertiary-fixed-dim":"#93ccff","on-surface":"#0b1c30","secondary":"#0051d5","on-error":"#ffffff","background":"#f8f9ff","surface-variant":"#d3e4fe","inverse-primary":"#bec5e5","on-tertiary-fixed-variant":"#004b73","surface-container-high":"#dce9ff","tertiary-fixed":"#cce5ff","inverse-surface":"#213145","on-secondary-container":"#fefcff","surface-bright":"#f8f9ff","primary":"#000000","outline-variant":"#c6c6ce","secondary-fixed":"#dbe1ff","surface-container-lowest":"#ffffff","on-error-container":"#93000a"},"borderRadius":{"DEFAULT":"0.125rem","lg":"0.25rem","xl":"0.5rem","full":"0.75rem"},"spacing":{"space-xl":"2rem","gutter-desktop":"1.5rem","gutter":"1rem","space-sm":"0.5rem","space-xs":"0.25rem","space-lg":"1.25rem","margin":"1rem","margin-desktop":"2rem","space-md":"0.75rem"},"fontFamily":{"headline-sm":["Hanken Grotesk"],"title-md":["Hanken Grotesk"],"label-md":["Inter"],"label-lg":["Inter"],"headline-md":["Hanken Grotesk"],"code-data":["JetBrains Mono"],"headline-lg":["Hanken Grotesk"],"headline-lg-mobile":["Hanken Grotesk"],"body-md":["Inter"],"body-lg":["Inter"],"body-sm":["Inter"],"code-data-sm":["JetBrains Mono"],"title-sm":["Hanken Grotesk"]},"fontSize":{"headline-sm":["18px",{"lineHeight":"24px","fontWeight":"600"}],"title-md":["16px",{"lineHeight":"22px","fontWeight":"600"}],"label-md":["11px",{"lineHeight":"16px","fontWeight":"600"}],"label-lg":["13px",{"lineHeight":"18px","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"code-data":["13px",{"lineHeight":"18px","fontWeight":"500"}],"headline-lg":["32px",{"lineHeight":"40px","fontWeight":"700"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"20px","fontWeight":"400"}],"body-lg":["16px",{"lineHeight":"24px","fontWeight":"400"}],"body-sm":["12px",{"lineHeight":"16px","fontWeight":"400"}],"code-data-sm":["11px",{"lineHeight":"14px","fontWeight":"400"}],"title-sm":["14px",{"lineHeight":"20px","fontWeight":"600"}]}}}}"""
config = json.loads(config_str)
theme = config['theme']['extend']

output = ['@import "tailwindcss";', '', '@theme {']

for color_name, color_val in theme.get('colors', {}).items():
    output.append(f"  --color-{color_name}: {color_val};")

for radius_name, radius_val in theme.get('borderRadius', {}).items():
    name = 'radius' if radius_name == 'DEFAULT' else f"radius-{radius_name}"
    output.append(f"  --{name}: {radius_val};")

for spacing_name, spacing_val in theme.get('spacing', {}).items():
    output.append(f"  --spacing-{spacing_name}: {spacing_val};")

for font_name, font_val in theme.get('fontFamily', {}).items():
    fonts = ', '.join([f"'{f}'" for f in font_val])
    output.append(f"  --font-{font_name}: {fonts};")

output.append('}')
output.append('')

# Custom text sizes usually need custom utility classes in v4 if they have specific line heights/font weights, 
# or can be added to the theme as well. In Tailwind v4, we can define custom text styles using `@utility`.

for name, val in theme.get('fontSize', {}).items():
    size = val[0]
    line_height = val[1]['lineHeight']
    font_weight = val[1]['fontWeight']
    
    # We can create custom utility classes for these font setups
    output.append(f"@utility text-{name} {{")
    output.append(f"  font-size: {size};")
    output.append(f"  line-height: {line_height};")
    output.append(f"  font-weight: {font_weight};")
    output.append("}")

with open('frontend/src/index.css', 'w') as f:
    f.write('\n'.join(output))

print("Updated index.css")
