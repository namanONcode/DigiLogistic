with open('frontend/src/App.test.tsx', 'r') as f:
    content = f.read()

# Add mock for utils
utils_mock = """
vi.mock('./utils', () => ({
  downloadPDFBundle: vi.fn(),
  exportInspectorBundle: vi.fn()
}));
import * as utils from './utils';
"""
content = content.replace("import App from './App';", "import App from './App';\n" + utils_mock)

# Update the timeline mock in form submission
old_timeline = """timeline: [
          { status: 'Driving', start_time: '2026-10-08T00:00', end_time: '2026-10-08T01:00', duration_hours: 1, location: 'NY', description: 'Driving' }
        ]"""
new_timeline = """timeline: [
          { status: 'Driving', start_time: '2026-10-08T00:00', end_time: '2026-10-08T01:00', duration_hours: 1, location: 'NY', description: 'Driving' },
          { status: 'Off Duty', start_time: '2026-10-08T01:00', end_time: '2026-10-08T01:30', duration_hours: 0.5, location: 'NY', description: 'Break' },
          { status: 'Sleeper Berth', start_time: '2026-10-08T01:30', end_time: '2026-10-08T11:30', duration_hours: 10, location: 'NY', description: 'Sleep' },
          { status: 'On Duty', start_time: '2026-10-08T11:30', end_time: '2026-10-08T12:30', duration_hours: 1, location: 'NY', description: 'Duty' }
        ]"""
content = content.replace(old_timeline, new_timeline)

# Add button clicks for export/download
old_clicks = """    // Bottom print/download buttons
    fireEvent.click(screen.getByText('Print Formats'));
    expect(printMock).toHaveBeenCalled();"""

new_clicks = """    // Bottom print/download buttons
    fireEvent.click(screen.getByText('Print Formats'));
    expect(printMock).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Download PDF Bundle'));
    expect(utils.downloadPDFBundle).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Export Inspector Bundle'));
    expect(utils.exportInspectorBundle).toHaveBeenCalled();"""

content = content.replace(old_clicks, new_clicks)

with open('frontend/src/App.test.tsx', 'w') as f:
    f.write(content)

