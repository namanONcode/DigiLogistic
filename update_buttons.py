with open('frontend/src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onClick={() => alert('Exporting Inspector Bundle...')}",
    "onClick={() => exportInspectorBundle(routeData, responseTimeline)}"
)

content = content.replace(
    "onClick={() => alert('Downloading PDF Bundle...')}",
    "onClick={() => downloadPDFBundle(images)}"
)

with open('frontend/src/App.tsx', 'w') as f:
    f.write(content)

print("Updated download buttons")
