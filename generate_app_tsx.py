import re

with open('header.jsx', 'r') as f:
    header = f.read()

with open('main.jsx', 'r') as f:
    main = f.read()

# Make main.jsx React-friendly with the state
# 1. Inputs
# The mockup has:
# <input ... placeholder="Chicago Logistics Terminal (Current)"/>
# <input ... placeholder="Acme Corp Warehouse, Detroit"/>
# <input ... placeholder="Port of Miami"/>
# <input ... value="0.0"/>

main = main.replace(
    '<input className="w-full h-11 bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" placeholder="Chicago Logistics Terminal (Current)" type="text" />',
    '<input className="w-full h-11 bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" placeholder="Chicago Logistics Terminal (Current)" type="text" value={current} onChange={(e) => setCurrent(e.target.value)} required />'
)

main = main.replace(
    '<input className="w-full h-11 bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" placeholder="Acme Corp Warehouse, Detroit" type="text" />',
    '<input className="w-full h-11 bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" placeholder="Acme Corp Warehouse, Detroit" type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} required />'
)

main = main.replace(
    '<input className="w-full h-11 bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" placeholder="Port of Miami" type="text" />',
    '<input className="w-full h-11 bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" placeholder="Port of Miami" type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />'
)

main = main.replace(
    '<input className="w-20 bg-transparent text-body-lg font-body-lg text-on-surface text-right focus:outline-none" type="text" value="0.0" />',
    '<input className="w-20 bg-transparent text-body-lg font-body-lg text-on-surface text-right focus:outline-none" type="number" min="0" max="70" step="0.5" value={cycleUsed} onChange={(e) => setCycleUsed(parseFloat(e.target.value))} required />'
)

# Replace the "Generate Route & Logsheets" button
main = main.replace(
    '<button className="w-full h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center gap-space-sm shadow-sm hover:bg-secondary/90 hover:shadow-md transition-all active:scale-[0.98] group mt-space-lg"><span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">route</span><span className="font-title-md text-title-md font-semibold tracking-wide">Generate Route &amp; Logsheets</span></button>',
    '<button type="submit" disabled={loading} className="w-full h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center gap-space-sm shadow-sm hover:bg-secondary/90 hover:shadow-md transition-all active:scale-[0.98] group mt-space-lg disabled:opacity-50"><span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">route</span><span className="font-title-md text-title-md font-semibold tracking-wide">{loading ? "Calculating..." : "Generate Route & Logsheets"}</span></button>'
)

# Put form onSubmit
main = main.replace(
    '<div className="w-full xl:w-[420px] shrink-0 flex flex-col gap-space-lg relative z-20">',
    '<form onSubmit={handleCalculate} className="w-full xl:w-[420px] shrink-0 flex flex-col gap-space-lg relative z-20">'
)
# Close form appropriately (we need to be careful).
# Instead of regex, let's just do it manually with a small script that replaces the specific DIV closing tag for the left sidebar.
# The sidebar ends right before: <!-- Main Content Area -->
main = main.replace('<!-- Main Content Area -->', '')
main = re.sub(r'</div>\s*<div className="flex-1 flex flex-col min-w-0 gap-space-lg">', r'</form><div className="flex-1 flex flex-col min-w-0 gap-space-lg">', main)

# Add error display right before submit button
error_jsx = '{error && <div className="text-error bg-error-container p-3 rounded-lg text-sm mt-4 font-semibold">{error}</div>}'
main = main.replace(
    '<button type="submit"',
    f'{error_jsx}<button type="submit"'
)

# For the map placeholder:
map_placeholder = """
<div className="w-full h-[320px] xl:h-[400px] bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden relative shadow-sm group">
<div className="absolute inset-0 opacity-40 mix-blend-multiply filter blur-[1px]">
"""
# We want to replace this entire block with our `<Map routeGeojson={routeData} points={points} />`
# Actually, the mockup has an SVG and a lot of stuff for the map. We'll find a way to replace the map section.

print("Done preparing replacements. Need to carefully inject the dynamic stuff.")
