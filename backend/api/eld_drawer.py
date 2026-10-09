import os
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime, timedelta
import base64
from io import BytesIO

START_X = 150
END_X = 1150
START_Y = 250
ROW_HEIGHT = 40
PX_PER_HOUR = (END_X - START_X) / 24.0


def get_y_for_status(status):
    if status == "Off Duty":
        return int(START_Y + ROW_HEIGHT * 0.5)
    elif status == "Sleeper Berth":
        return int(START_Y + ROW_HEIGHT * 1.5)
    elif status == "Driving":
        return int(START_Y + ROW_HEIGHT * 2.5)
    elif status == "On Duty":
        return int(START_Y + ROW_HEIGHT * 3.5)
    return int(START_Y + ROW_HEIGHT * 0.5)


def get_x_for_time(dt_str):
    dt = datetime.fromisoformat(dt_str)
    hours = dt.hour + (dt.minute / 60.0)
    return int(START_X + hours * PX_PER_HOUR)


def generate_log_images(timeline, date_str, current, pickup, dropoff, total_miles):
    timeline.sort(key=lambda x: x["start_time"])
    if not timeline:
        return []

    start_date = datetime.fromisoformat(timeline[0]["start_time"]).date()
    end_date = datetime.fromisoformat(timeline[-1]["end_time"]).date()

    font_dir = os.path.join(os.path.dirname(__file__), "fonts")
    font_bold_large = ImageFont.truetype(os.path.join(font_dir, "Roboto-Bold.ttf"), 36)
    font_bold = ImageFont.truetype(os.path.join(font_dir, "Roboto-Bold.ttf"), 16)
    font_regular = ImageFont.truetype(os.path.join(font_dir, "Roboto-Regular.ttf"), 14)
    font_small = ImageFont.truetype(os.path.join(font_dir, "Roboto-Regular.ttf"), 12)

    images = []

    current_date = start_date
    while current_date <= end_date:
        im = Image.new("RGB", (1200, 900), "white")
        draw = ImageDraw.Draw(im)

        # Header
        draw.text((50, 40), "Driver's Daily Log (24 hours)", font=font_bold_large, fill="black")

        # Date
        draw.text(
            (700, 50),
            f"Date: {current_date.month:02d} / {current_date.day:02d} / {current_date.year}",
            font=font_bold,
            fill="black",
        )

        # Details
        draw.text((50, 120), f"From: {current}", font=font_regular, fill="black")
        draw.line([(90, 138), (350, 138)], fill="black", width=1)

        draw.text((400, 120), f"To: {dropoff}", font=font_regular, fill="black")
        draw.line([(425, 138), (680, 138)], fill="black", width=1)

        draw.text((700, 120), f"Total Miles Today: {int(total_miles)}", font=font_regular, fill="black")
        draw.line([(830, 138), (950, 138)], fill="black", width=1)

        # Grid Labels
        labels = ["1. Off Duty", "2. Sleeper Berth", "3. Driving", "4. On Duty"]
        for i, label in enumerate(labels):
            draw.text((20, START_Y + i * ROW_HEIGHT + 10), label, font=font_bold, fill="black")

        # Draw Grid
        # Horizontal lines
        for i in range(5):
            y = START_Y + i * ROW_HEIGHT
            draw.line([(START_X, y), (END_X, y)], fill="black", width=2 if i == 0 or i == 4 else 1)

        # Hour labels
        hour_labels = [
            "Mid\nnight",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "Noon",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "Mid\nnight",
        ]

        for h in range(25):
            x = START_X + h * PX_PER_HOUR
            draw.line([(x, START_Y), (x, START_Y + 4 * ROW_HEIGHT)], fill="black", width=2)

            draw.text((x - 10, START_Y - 35), hour_labels[h], font=font_small, fill="black", align="center")

            if h < 24:
                # 30-min line
                hx = x + PX_PER_HOUR * 0.5
                draw.line([(hx, START_Y), (hx, START_Y + 4 * ROW_HEIGHT)], fill="gray", width=1)

                # 15-min and 45-min lines (short)
                qx1 = x + PX_PER_HOUR * 0.25
                qx2 = x + PX_PER_HOUR * 0.75
                for qx in [qx1, qx2]:
                    for r in range(4):
                        ry = START_Y + r * ROW_HEIGHT
                        draw.line([(qx, ry), (qx, ry + 10)], fill="gray", width=1)
                    draw.line(
                        [(qx, START_Y + 4 * ROW_HEIGHT - 10), (qx, START_Y + 4 * ROW_HEIGHT)], fill="gray", width=1
                    )

        # Draw the timeline for this day
        day_start = datetime.combine(current_date, datetime.min.time())
        day_end = datetime.combine(current_date, datetime.max.time())

        prev_x, prev_y = None, None

        for ev in timeline:
            ev_start = datetime.fromisoformat(ev["start_time"])
            ev_end = datetime.fromisoformat(ev["end_time"])

            if ev_end <= day_start or ev_start > day_end:
                continue

            draw_start = max(ev_start, day_start)
            draw_end = min(ev_end, day_end)

            x1 = get_x_for_time(draw_start.isoformat())
            x2 = get_x_for_time(draw_end.isoformat())
            y = get_y_for_status(ev["status"])

            if prev_x is not None and abs(x1 - prev_x) < 2:
                draw.line([(prev_x, prev_y), (prev_x, y)], fill="red", width=4)

            draw.line([(x1, y), (x2, y)], fill="red", width=4)

            prev_x = x2
            prev_y = y

            if ev["description"]:
                remark_y = 520 + (timeline.index(ev) % 15) * 20
                time_str = draw_start.strftime("%H:%M")
                draw.text(
                    (50, remark_y),
                    f"{time_str} - {ev['status']}: {ev['description']} ({ev['location']})",
                    font=font_regular,
                    fill="black",
                )

        draw.text((50, 470), "Remarks:", font=font_bold_large, fill="black")

        buffered = BytesIO()
        im.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        images.append(f"data:image/png;base64,{img_str}")

        current_date += timedelta(days=1)

    return images
