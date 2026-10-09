with open('frontend/src/App.test.tsx', 'r') as f:
    content = f.read()

old_duty = "{ status: 'On Duty', start_time: '2026-10-08T11:30', end_time: '2026-10-08T12:30', duration_hours: 1, location: 'NY', description: 'Duty' }"
new_duty = "{ status: 'On Duty', start_time: '2026-10-08T11:30', end_time: '2026-10-08T12:30', duration_hours: 1, location: 'NY', description: 'Duty' },\n          { status: 'Other', start_time: '2026-10-08T12:30', end_time: '2026-10-08T13:30', duration_hours: 1, location: 'NY', description: 'Other' }"

content = content.replace(old_duty, new_duty)
with open('frontend/src/App.test.tsx', 'w') as f:
    f.write(content)
