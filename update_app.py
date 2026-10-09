import re

with open('frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Add profile state and useEffect
state_hook = """  const [profile, setProfile] = useState<any>(null);

  React.useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/profile/')
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to fetch profile", err));
  }, []);
"""

content = content.replace("  const [mapType, setMapType] = useState('Fleet Vector');", "  const [mapType, setMapType] = useState('Fleet Vector');\n" + state_hook)

# Replace hardcoded header values
header_replacements = [
    ("Prime Haulage Logistics LLC (USDOT #3910294)", "{profile ? `${profile.carrier} (USDOT #${profile.usdot})` : 'Loading...'}"),
    ('<span className="font-title-sm text-title-sm text-on-surface leading-tight font-semibold">Marcus Vance</span>', '<span className="font-title-sm text-title-sm text-on-surface leading-tight font-semibold">{profile?.driver_name || "Driver"}</span>'),
    ('<span className="font-label-md text-label-md text-on-surface-variant leading-tight">Lead Fleet Controller</span>', '<span className="font-label-md text-label-md text-on-surface-variant leading-tight">{profile?.role || "Controller"}</span>')
]

for old, new_ in header_replacements:
    content = content.replace(old, new_)

# Replace Insights box hardcoded values
insights_replacements = [
    ('Electronic pre-pass clearance active for vehicle unit <span className="font-code-data text-code-data font-semibold">#9021</span>', 'Electronic pre-pass clearance active for vehicle unit <span className="font-code-data text-code-data font-semibold">#{profile?.vehicle_unit || "0000"}</span>'),
    ('<span className="font-title-sm text-title-sm text-on-surface font-semibold">I-80 Elk Mtn Pass</span>', '<span className="font-title-sm text-title-sm text-on-surface font-semibold">{profile?.weather_alert?.location || "-"}</span>'),
    ('<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Wind 34 mph • Dry</span>', '<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">{profile?.weather_alert?.condition || "-"}</span>'),
    ('<span className="font-title-sm text-title-sm text-on-surface font-semibold">Stop: North Platte</span>', '<span className="font-title-sm text-title-sm text-on-surface font-semibold">Stop: {profile?.fuel_optimization?.stop || "-"}</span>'),
    ('<span className="font-code-data-sm text-code-data-sm text-secondary font-semibold">$3.74/gal (-$0.28)</span>', '<span className="font-code-data-sm text-code-data-sm text-secondary font-semibold">{profile?.fuel_optimization?.price || "-"}</span>')
]

for old, new_ in insights_replacements:
    content = content.replace(old, new_)

with open('frontend/src/App.tsx', 'w') as f:
    f.write(content)
print("Replaced hardcoded data in App.tsx")
