with open('frontend/src/App.test.tsx', 'r') as f:
    lines = f.readlines()

# The last lines are currently:
#     alertMock.mockRestore();
#     printMock.mockRestore();
#   it('handles profile fetch failure', async () => { ...
#       expect(screen.getByText('Loading...')).toBeInTheDocument();
# });

# we need to ensure it's properly closed.
# The `it('handles UI button interactions correctly', () => {` needs to be closed.

new_content = "".join(lines)
new_content = new_content.replace(
"""    alertMock.mockRestore();
    printMock.mockRestore();
  it('handles profile fetch failure',""",
"""    alertMock.mockRestore();
    printMock.mockRestore();
  });

  it('handles profile fetch failure',"""
)

if not new_content.endswith("});\n});\n"):
    if new_content.endswith("});\n"):
        new_content += "});\n"
    elif new_content.endswith("});"):
        new_content += "\n});\n"
    else:
        new_content += "\n    });\n  });\n});\n"

with open('frontend/src/App.test.tsx', 'w') as f:
    f.write(new_content)
