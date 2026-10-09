import re

with open('frontend/src/App.tsx', 'r') as f:
    app = f.read()

# Add the error display before the button
if '{error &&' not in app:
    app = re.sub(
        r'(<button[^>]*id="btnCalculate"[^>]*>)',
        r'{error && <div className="text-error bg-error-container p-3 rounded-lg text-sm mt-4 font-semibold">{error}</div>}\n\1',
        app
    )

# The button needs disabled={loading}
app = re.sub(
    r'(<button[^>]*id="btnCalculate"[^>]*)>',
    r'\1 disabled={loading}>',
    app
)
# Ensure we don't have multiple disabled props
app = app.replace('disabled={loading} disabled={loading}', 'disabled={loading}')

with open('frontend/src/App.tsx', 'w') as f:
    f.write(app)

print("Fixed App.tsx")
