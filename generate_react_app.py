import re

with open('header.jsx', 'r') as f:
    header = f.read()

with open('main.jsx', 'r') as f:
    main = f.read()

# Make form inputs dynamic
main = re.sub(
    r'<input[^>]*id="inputCurrent"[^>]*>',
    r'<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputCurrent" type="text" placeholder="e.g. New York, NY" value={current} onChange={(e) => setCurrent(e.target.value)} required />',
    main
)
main = re.sub(
    r'<input[^>]*id="inputPickup"[^>]*>',
    r'<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputPickup" type="text" placeholder="e.g. Philadelphia, PA" value={pickup} onChange={(e) => setPickup(e.target.value)} required />',
    main
)
main = re.sub(
    r'<input[^>]*id="inputDropoff"[^>]*>',
    r'<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputDropoff" type="text" placeholder="e.g. Washington, DC" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />',
    main
)
main = re.sub(
    r'<input[^>]*id="cycleUsedInput"[^>]*>',
    r'<input className="w-full h-9 pl-3 pr-2 rounded-lg bg-surface-container-low text-on-surface font-code-data text-code-data focus:outline-none focus:ring-1 focus:ring-secondary shadow-sm" id="cycleUsedInput" type="number" min="0" max="70" step="0.5" value={cycleUsed} onChange={(e) => setCycleUsed(parseFloat(e.target.value))} required />',
    main
)

# Replace the "Calculate Route & Logs" button
main = main.replace(
    '<span className="font-title-md text-title-md font-semibold">Calculate Route &amp; Logs</span>',
    '<span className="font-title-md text-title-md font-semibold">{loading ? "Calculating..." : "Calculate Route & Logs"}</span>'
)
main = main.replace(
    '<button className="w-full h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center gap-space-sm shadow-sm hover:bg-secondary/90 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden mt-space-md">',
    '<button type="submit" disabled={loading} className="w-full h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center gap-space-sm shadow-sm hover:bg-secondary/90 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden mt-space-md disabled:opacity-50">'
)

# Convert left column to form
main = main.replace('<div className="w-full xl:w-[440px] shrink-0 flex flex-col gap-space-lg relative z-20">', '<form onSubmit={handleCalculate} className="w-full xl:w-[440px] shrink-0 flex flex-col gap-space-lg relative z-20">')
main = re.sub(r'</div>\s*{/\*\s*Main Content Area\s*\*/}', '</form>{/* Main Content Area */}', main)

# Error display
main = main.replace(
    '<button type="submit"',
    '{error && <div className="text-error bg-error-container p-3 rounded-lg text-sm mt-4 font-semibold">{error}</div>}<button type="submit"'
)

# Dynamic stats
main = main.replace('>1,438.2 mi<', '>{routeData ? (routeData.distance * 0.000621371).toFixed(1) : "0.0"} mi<')
main = main.replace('>24h 15m<', '>{routeData ? (routeData.duration / 3600).toFixed(1) + "h" : "0.0h"}<')
main = main.replace('>3 stops<', '>{responseTimeline ? responseTimeline.filter((t: any) => t.status !== "Driving").length : 0} stops<')
main = main.replace('>4 Pages<', '>{images ? images.length : 0} Pages<')

# Replace the map SVG placeholder with dynamic React component
main = re.sub(r'<svg className="absolute inset-0 w-full h-full text-secondary"[^>]*>.*?</svg>', r'<Map routeGeojson={routeData} points={points} />', main, flags=re.DOTALL)

# Replace the timeline items
timeline_dynamic = """{responseTimeline && responseTimeline.map((ev: any, idx: number) => (
<div key={idx} className="flex gap-4 items-start relative pb-6 group">
<div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-outline-variant/40 group-last:bg-transparent"></div>
<div className={`relative z-10 mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-surface border-2 flex items-center justify-center ${ev.status === 'Driving' ? 'border-secondary' : 'border-[#f59e0b]'}`}>
<div className={`w-2 h-2 rounded-full ${ev.status === 'Driving' ? 'bg-secondary' : 'bg-[#f59e0b]'}`}></div>
</div>
<div className="flex-1 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 hover:shadow-sm transition-all">
<div className="flex justify-between items-start mb-1">
<span className="font-title-sm text-title-sm text-on-surface font-semibold">{ev.status}</span>
<span className="font-code-data text-code-data font-bold text-on-surface-variant">{new Date(ev.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">{ev.location} - {ev.description}</span>
<span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">{ev.duration_hours} hrs</span>
</div>
</div>
</div>
))}"""

# Strip out the static timeline manually using regex
main = re.sub(r'{/\*\s*HOS Event Item 1\s*\*/}.*?{/\*\s*HOS Event Item 3\s*\*/}.*?</div>\s*</div>\s*</div>', timeline_dynamic + "\n</div>\n</div>\n</div>", main, flags=re.DOTALL)

# Let's replace the grid of ELD Document components
eld_dynamic = """<div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
{images && images.map((imgBase64: string, idx: number) => (
<div key={idx} className="w-full bg-surface rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow cursor-pointer">
<div className="p-3 bg-surface-container-lowest border-b border-outline-variant/20 flex justify-between items-center">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">description</span>
<span className="font-label-md text-label-md text-on-surface font-semibold tracking-wide">DAY {idx + 1} LOG</span>
</div>
</div>
<div className="bg-[#fdfdfd] relative flex items-center justify-center p-4">
<img src={imgBase64} alt={`ELD Log Day ${idx + 1}`} className="w-full h-auto object-contain" />
</div>
</div>
))}
</div>"""
main = re.sub(r'<div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">.*?</div>\s*</div>\s*</div>\s*</div>', eld_dynamic + "\n</div>\n</div>", main, flags=re.DOTALL)

# Checkboxes without onChange warning: replace all type="checkbox" with defaultChecked instead of checked="" or just remove checked="" if read-only
main = re.sub(r'checked=""', 'defaultChecked', main)

# Ensure no empty style attributes
main = main.replace('style=""', '')

app_tsx = f"""import React, {{ useState }} from 'react';
import axios from 'axios';
import Map from './components/Map';

function App() {{
  const [current, setCurrent] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [cycleUsed, setCycleUsed] = useState<number>(0);
  
  const [routeData, setRouteData] = useState<any>(null);
  const [responseTimeline, setResponseTimeline] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {{
    e.preventDefault();
    setLoading(true);
    setError('');
    try {{
      const response = await axios.post('http://localhost:8000/api/calculate/', {{
        current,
        pickup,
        dropoff,
        cycle_used: cycleUsed
      }});
      setRouteData(response.data.route);
      setResponseTimeline(response.data.timeline);
      setImages(response.data.images || []);
      setPoints(response.data.points);
    }} catch (err: any) {{
      setError(err.response?.data?.error || 'Failed to calculate route');
    }} finally {{
      setLoading(false);
    }}
  }};

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {header}
      {main}
    </div>
  );
}}

export default App;
"""

with open('frontend/src/App.tsx', 'w') as f:
    f.write(app_tsx)

print("Updated App.tsx")
