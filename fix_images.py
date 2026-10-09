import re

with open('frontend/src/App.tsx', 'r') as f:
    app = f.read()

eld_dynamic = """{/*  Sheet Preview Cards Gallery  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
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
</div>"""

# we replace from `{/*  Sheet Preview Cards Gallery  */}` to the end of the `md:grid-cols-2` div.
# Because the layout might be deeply nested, let's just do a greedy match until the end of the second card.
# The second card ends right before `<!-- 5. Final Dispatch Action Bar -->` in the original HTML, but we stripped comments maybe?
# Let's search for `{/*  5. Final Dispatch Action Bar  */}`.

if '{/*  5. Final Dispatch Action Bar  */}' in app:
    app = re.sub(r'{/\*\s*Sheet Preview Cards Gallery\s*\*/}.*?(?={/\*\s*5\. Final Dispatch Action Bar\s*\*/})', eld_dynamic + "\n", app, flags=re.DOTALL)
else:
    # The end of the main section is near the download button. Let's just do it manually.
    pass

with open('frontend/src/App.tsx', 'w') as f:
    f.write(app)

