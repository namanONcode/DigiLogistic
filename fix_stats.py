import re

with open('frontend/src/App.tsx', 'r') as f:
    app = f.read()

# Replace the static 1,482.6 with dynamic distance
app = app.replace(
    '<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">1,482.6</span>',
    '<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{routeData ? (routeData.distance * 0.000621371).toFixed(1) : "0.0"}</span>'
)

# Replace the static 22h 45m with dynamic duration
duration_dynamic = """{routeData ? Math.floor(routeData.duration / 3600) : 0}<span className="text-title-md font-semibold text-on-surface-variant">h</span> {routeData ? Math.floor((routeData.duration % 3600) / 60) : 0}<span className="text-title-md font-semibold text-on-surface-variant">m</span>"""
app = re.sub(
    r'<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">22<span className="text-title-md font-semibold text-on-surface-variant">h</span> 45<span className="text-title-md font-semibold text-on-surface-variant">m</span></span>',
    f'<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{duration_dynamic}</span>',
    app
)

# Replace the mandatory rests static 2
rests_dynamic = """{responseTimeline ? responseTimeline.filter((t: any) => t.status === "10-Hour Sleeper Berth" || t.status === "Sleeper Berth").length : 0}"""
app = re.sub(
    r'<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">2</span>',
    f'<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{rests_dynamic}</span>',
    app
)

with open('frontend/src/App.tsx', 'w') as f:
    f.write(app)

print("Fixed stats in App.tsx")
