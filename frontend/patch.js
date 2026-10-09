const fs = require('fs');
let content = fs.readFileSync('src/App.test.tsx', 'utf8');
content = content.replace(
  "render(<App />);\n    fireEvent.click(screen.getByText('Calculate Route & Logs'));",
  "render(<App />);\n    fireEvent.change(screen.getByPlaceholderText('e.g. New York, NY'), { target: { value: 'NY' } });\n    fireEvent.change(screen.getByPlaceholderText('e.g. Philadelphia, PA'), { target: { value: 'PA' } });\n    fireEvent.change(screen.getByPlaceholderText('e.g. Washington, DC'), { target: { value: 'DC' } });\n    fireEvent.click(screen.getByText('Calculate Route & Logs'));"
);
fs.writeFileSync('src/App.test.tsx', content);
