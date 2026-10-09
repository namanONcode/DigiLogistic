from PIL import Image, ImageDraw

im = Image.open("backend/api/template.png")
draw = ImageDraw.Draw(im)

# Grid bounds estimations
START_X = 64
END_X = 454
START_Y = 182
ROW_HEIGHT = 17.5

draw.line([(START_X, START_Y), (START_X, START_Y + 4 * ROW_HEIGHT)], fill="red", width=2)
draw.line([(END_X, START_Y), (END_X, START_Y + 4 * ROW_HEIGHT)], fill="red", width=2)

for i in range(5):
    y = int(START_Y + i * ROW_HEIGHT)
    draw.line([(START_X, y), (END_X, y)], fill="red", width=1)

im.save("backend/api/calibrated.png")
