import re

app_tsx_path = "frontend/src/App.tsx"
app_test_path = "frontend/src/App.test.tsx"

with open(app_tsx_path, "r") as f:
    app_content = f.read()

# 1. Remove Preset Lanes and ELD Webhook buttons
app_content = re.sub(
    r'<button onClick=\{[^}]+\} [^>]+>\s*<span className="material-symbols-outlined [^>]+>history</span>\s*<span>Preset Lanes</span>\s*</button>',
    '', app_content
)
app_content = re.sub(
    r'<button onClick=\{[^}]+\} [^>]+>\s*<span className="material-symbols-outlined [^>]+>share_location</span>\s*<span>ELD Webhook</span>\s*</button>',
    '', app_content
)
app_content = re.sub(
    r'<div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>',
    '', app_content
)

# 2. Remove "GPS Latched" and "Tractor UNIT-9021"
app_content = re.sub(
    r'<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">GPS Latched</span>',
    '', app_content
)
app_content = re.sub(
    r'<span className="font-body-sm text-body-sm text-on-surface-variant">41\.8781° N, 87\.6298° W • Tractor UNIT-9021</span>',
    '', app_content
)

# 3. Remove "BOL #774-8839" and "Dock Appointment..."
app_content = re.sub(
    r'<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">BOL #774-8839</span>',
    '', app_content
)
app_content = re.sub(
    r'<span className="font-body-sm text-body-sm text-on-surface-variant">Dock Appointment: Oct 28, 08:30 CDT \(Firm\)</span>',
    '', app_content
)

# 4. Remove "Salt Lake City Port" and "Unload Target..."
app_content = re.sub(
    r'<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Salt Lake City Port</span>',
    '', app_content
)
app_content = re.sub(
    r'<span className="font-body-sm text-body-sm text-on-surface-variant">Unload Target: Oct 30, 14:00 MDT</span>',
    '', app_content
)

# 5. Driver profile snippet removal
driver_profile_regex = r'\{\/\*\s*Driver Profile Snippet\s*\*\/\}\s*<div className="p-3 rounded-lg bg-surface-container flex items-center justify-between">.*?ELITE 99\.8%</span>\s*</div>'
app_content = re.sub(driver_profile_regex, '', app_content, flags=re.DOTALL)

# 6. "Driving Left (11h)" mock input removal
app_content = re.sub(r'<div className="grid grid-cols-2 gap-space-sm">', r'<div className="grid grid-cols-1 gap-space-sm">', app_content)
driving_left_regex = r'<div className="flex flex-col gap-1\.5">\s*<label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-1">\s*<span className="material-symbols-outlined text-\[14px\]">timer</span>\s*Driving Left \(11h\)\s*</label>.*?14h shift resets 07:00</span>\s*</div>'
app_content = re.sub(driving_left_regex, '', app_content, flags=re.DOTALL)
app_content = re.sub(r'<span className="font-code-data-sm text-code-data-sm text-secondary">31h 45m left</span>', '', app_content)

# 7. Routing Constraints Toggle Checkboxes
routing_constraints_regex = r'\{\/\*\s*Routing Constraints Toggle Checkboxes\s*\*\/\}\s*<div className="flex flex-col gap-2 pt-1">.*?Prioritize Toll-Free Interstate Bypass routes</span>\s*</label>\s*</div>'
app_content = re.sub(routing_constraints_regex, '', app_content, flags=re.DOTALL)

# 8. Live Dispatch Insights Box - removing the static text
app_content = re.sub(
    r'<p className="font-body-sm text-body-sm text-on-surface leading-relaxed">\s*Predicted lane crosses 3 State POE weigh-scales \(Iowa, Nebraska, Wyoming\)\. Electronic pre-pass clearance active for vehicle unit <span className="font-code-data text-code-data font-semibold">#\{profile\?\.vehicle_unit \|\| "0000"\}</span>\.\s*</p>',
    '<p className="font-body-sm text-body-sm text-on-surface leading-relaxed">Electronic pre-pass clearance active for vehicle unit <span className="font-code-data text-code-data font-semibold">#{profile?.vehicle_unit || "0000"}</span>.</p>',
    app_content
)

# 9. Dummy sub-labels in KPI cards
app_content = re.sub(r'<div className="flex items-center gap-1\.5 pt-1">\s*<span className="font-code-data-sm text-code-data-sm px-1\.5 py-0\.5 rounded bg-surface-container-high text-secondary font-semibold">\+18\.2 mi</span>\s*<span className="font-body-sm text-body-sm text-on-surface-variant">vs toll-free path</span>\s*</div>', '', app_content)
app_content = re.sub(r'<div className="flex items-center gap-1\.5 pt-1">\s*<span className="material-symbols-outlined text-secondary text-\[14px\]">timelapse</span>\s*<span className="font-body-sm text-body-sm text-on-surface-variant">2 Driver Duty Shifts</span>\s*</div>', '', app_content)
app_content = re.sub(r'<div className="flex items-center gap-1\.5 pt-1">\s*<span className="font-code-data-sm text-code-data-sm px-1\.5 py-0\.5 rounded bg-surface-container text-on-surface font-medium">\+ 2x 30m Breaks</span>\s*</div>', '', app_content)
app_content = re.sub(r'<div className="flex items-center gap-1 pt-1">\s*<span className="w-2 h-2 rounded-full bg-secondary"></span>\s*<span className="font-body-sm text-body-sm text-on-surface-variant">Zero Infractions Predicted</span>\s*</div>', '', app_content)

# 10. Map labels
app_content = re.sub(r'<span className="font-code-data-sm text-code-data-sm text-on-surface-variant hidden md:inline">I-80 WEST CORRIDOR \(IL &gt; IA &gt; NE &gt; WY &gt; UT\)</span>', '', app_content)
telemetry_hud_regex = r'\{\/\*\s*Floating Glass Telemetry HUD overlay\s*\*\/\}\s*<div className="absolute top-4 left-4 p-3 rounded-lg bg-surface/90 backdrop-blur-md shadow-md flex flex-col gap-2 max-w-xs">.*?</div>\s*</div>'
app_content = re.sub(telemetry_hud_regex, '', app_content, flags=re.DOTALL)
telemetry_strip_regex = r'\{\/\*\s*Telemetry Strip below map\s*\*\/\}\s*<div className="px-space-md py-2\.5 bg-surface-container-low flex flex-wrap items-center justify-between text-on-surface-variant font-code-data-sm text-code-data-sm gap-2">.*?EST\. ARRIVAL: OCT 30 • 13:42 MDT</span>\s*</div>'
app_content = re.sub(telemetry_strip_regex, '', app_content, flags=re.DOTALL)

with open(app_tsx_path, "w") as f:
    f.write(app_content)

with open(app_test_path, "r") as f:
    app_test_content = f.read()

app_test_content = re.sub(r'fireEvent\.click\(screen\.getByText\(\'Preset Lanes\'\)\);\s*expect\(alertMock\)\.toHaveBeenCalledWith\(\'Preset Lanes: Not implemented in Phase 1\'\);\s*', '', app_test_content)
app_test_content = re.sub(r'fireEvent\.click\(screen\.getByText\(\'ELD Webhook\'\)\);\s*expect\(alertMock\)\.toHaveBeenCalledWith\(\'ELD Webhook: Not implemented in Phase 1\'\);\s*', '', app_test_content)

with open(app_test_path, "w") as f:
    f.write(app_test_content)

print("Patch applied")
