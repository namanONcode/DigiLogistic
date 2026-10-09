with open('frontend/src/App.tsx', 'r') as f:
    lines = f.readlines()

eld_dynamic = """<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
{images && images.map((imgBase64: string, idx: number) => (
<div key={idx} className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between pb-2 bg-surface-container-high/40 p-2.5 rounded-lg">
<div className="flex flex-col">
<span className="font-title-sm text-title-sm text-on-surface font-bold">Day {idx + 1} Log</span>
</div>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">VERIFIED LOG</span>
</div>
<div className="w-full bg-surface-container-lowest p-2 rounded-lg flex flex-col gap-1">
<img src={imgBase64} alt={`ELD Log Day ${idx + 1}`} className="w-full h-auto object-contain" />
</div>
</div>
))}
</div>
"""

new_lines = lines[:479] + [eld_dynamic] + lines[607:]

with open('frontend/src/App.tsx', 'w') as f:
    f.writelines(new_lines)
