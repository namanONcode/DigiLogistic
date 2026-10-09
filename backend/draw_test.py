from PIL import Image, ImageDraw, ImageFont
import math

def generate_blank_log():
    img = Image.new('RGB', (1000, 800), 'white')
    draw = ImageDraw.Draw(img)
    
    font_bold_large = ImageFont.truetype("/usr/share/fonts/liberation-sans-fonts/LiberationSans-Bold.ttf", 36)
    font_bold = ImageFont.truetype("/usr/share/fonts/liberation-sans-fonts/LiberationSans-Bold.ttf", 16)
    font_regular = ImageFont.truetype("/usr/share/fonts/liberation-sans-fonts/LiberationSans-Regular.ttf", 14)
    font_small = ImageFont.truetype("/usr/share/fonts/liberation-sans-fonts/LiberationSans-Regular.ttf", 12)
    
    # Header
    draw.text((50, 40), "Driver's Daily Log (24 hours)", font=font_bold_large, fill="black")
    
    # Date fields
    draw.text((600, 50), "Date: __/__/____", font=font_regular, fill="black")
    
    # Grid variables
    start_x = 120
    end_x = 960
    start_y = 300
    row_h = 40
    
    # Labels for rows
    labels = ["1. Off Duty", "2. Sleeper Berth", "3. Driving", "4. On Duty"]
    for i, label in enumerate(labels):
        draw.text((20, start_y + i * row_h + 10), label, font=font_bold, fill="black")
        
    # Draw horizontal lines for the grid
    for i in range(5):
        y = start_y + i * row_h
        draw.line([(start_x, y), (end_x, y)], fill="black", width=2 if i == 0 or i == 4 else 1)
        
    # Draw vertical lines for the grid
    for h in range(25):
        x = start_x + h * (end_x - start_x) / 24
        # Main hour line
        draw.line([(x, start_y), (x, start_y + 4 * row_h)], fill="black", width=2)
        # Hour label
        if h < 24:
            hour_label = str(h)
            draw.text((x + 2, start_y - 20), hour_label, font=font_small, fill="black")
        
        # Quarter hour lines
        if h < 24:
            for q in range(1, 4):
                qx = x + q * ((end_x - start_x) / 24 / 4)
                draw.line([(qx, start_y), (qx, start_y + 4 * row_h)], fill="gray", width=1)
                
    # Remarks header
    draw.text((50, start_y + 4 * row_h + 40), "Remarks:", font=font_bold_large, fill="black")
    
    img.save('test_grid.png')

generate_blank_log()
