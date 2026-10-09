import re

app_tsx_path = "frontend/src/App.tsx"

with open(app_tsx_path, "r") as f:
    content = f.read()

# 1. Remove profile state and useEffect
content = re.sub(r'const \[profile, setProfile\] = useState<any>\(null\);\n\n\s*React\.useEffect\(\(\) => \{\n\s*axios\.get\(\'http://127\.0\.0\.1:8000/api/profile/\'\)\n\s*\.then\(res => setProfile\(res\.data\)\)\n\s*\.catch\(err => console\.error\("Failed to fetch profile", err\)\);\n\s*\}, \[\]\);\n\n', '', content)

# 2. Replace Header
old_header = r'<header className="fixed top-0 left-0 w-full h-16 z-50 bg-surface/90 backdrop-blur-xl shadow-\[0_1px_8px_rgba\(0,0,0,0\.04\)\]"><div className="w-full h-full px-gutter-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-lg"><div className="flex items-center gap-space-sm"><div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span className="material-symbols-outlined text-\[20px\]">local_shipping</span></div><div className="flex flex-col"><span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold leading-none">DigiLogistic</span><span className="font-code-data-sm text-code-data-sm text-on-surface-variant tracking-wider uppercase leading-none mt-1">ELD Enterprise</span></div></div><div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span><span className="font-code-data-sm text-code-data-sm text-on-surface font-semibold">ELD COMPLIANT • 49 CFR § 395</span></div></div><div className="flex items-center gap-space-md"><div className="hidden md:flex items-center gap-2 px-3 py-1\.5 rounded-lg bg-surface-container-low"><span className="material-symbols-outlined text-secondary text-\[18px\]">corporate_fare</span><div className="flex flex-col text-left"><span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Carrier</span><span className="font-title-sm text-title-sm text-on-surface font-semibold leading-tight">\{profile \? `\$\{profile\.carrier\} \(USDOT #\$\{profile\.usdot\}\)` : \'Loading\.\.\.\'\}</span></div><span className="material-symbols-outlined text-on-surface-variant text-\[18px\] ml-1">unfold_more</span></div><a className="hidden sm:flex items-center gap-1\.5 px-3 py-1\.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" href="#"><span className="material-symbols-outlined text-\[18px\]">help_outline</span><span className="font-label-lg text-label-lg">Docs</span></a><div className="h-6 w-px bg-outline-variant/40 hidden sm:block"></div><div className="flex items-center gap-space-sm pl-1"><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-\[18px\]">person</span></div></div></div></div></header>'

new_header = '<header className="fixed top-0 left-0 w-full h-16 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="w-full h-full px-gutter-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-lg"><div className="flex items-center gap-space-sm"><div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span className="material-symbols-outlined text-[20px]">local_shipping</span></div><div className="flex flex-col"><span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold leading-none">DigiLogistic</span><span className="font-code-data-sm text-code-data-sm text-on-surface-variant tracking-wider uppercase leading-none mt-1">ELD Enterprise</span></div></div></div><div className="flex items-center gap-space-md"><div className="flex items-center gap-space-sm pl-1"><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header>'

content = re.sub(old_header, new_header, content)

# 3. Remove Insights Box
insights_regex = r'\{\/\*\s*Live Dispatch Insights Box\s*\*\/\}\s*<div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm">.*?</div>\s*</div>\s*</div>'
content = re.sub(insights_regex, '', content, flags=re.DOTALL)

with open(app_tsx_path, "w") as f:
    f.write(content)

print("App.tsx patched")

# App.test.tsx patch
app_test_path = "frontend/src/App.test.tsx"
with open(app_test_path, "r") as f:
    test_content = f.read()

mock_resolved_regex = r'mockedAxios\.get\.mockResolvedValue\(\{\s*data: \{.*?\}\s*\}\);'
test_content = re.sub(mock_resolved_regex, '', test_content, flags=re.DOTALL)

failure_test_regex = r'it\(\'handles profile fetch failure\', async \(\) => \{.*?\}\);'
test_content = re.sub(failure_test_regex, '', test_content, flags=re.DOTALL)

with open(app_test_path, "w") as f:
    f.write(test_content)

print("App.test.tsx patched")

