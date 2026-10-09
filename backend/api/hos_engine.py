from datetime import timedelta, datetime

class HOSEvent:
    def __init__(self, status, start_time, end_time, location_name, description=""):
        self.status = status  # 'Off Duty', 'Sleeper Berth', 'Driving', 'On Duty'
        self.start_time = start_time
        self.end_time = end_time
        self.location_name = location_name
        self.description = description

    def get_duration(self):
        return (self.end_time - self.start_time).total_seconds() / 3600.0


class HOSEngine:
    def __init__(self, current_cycle_used, start_time=None):
        self.cycle_used = current_cycle_used
        self.current_time = start_time or datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)

        self.shift_driving_time = 0.0
        self.shift_elapsed_time = 0.0
        self.drive_time_since_break = 0.0
        self.miles_since_fuel = 0.0

        self.events = []

        # FMCSA Constants
        self.MAX_CYCLE = 70.0
        self.MAX_DAILY_DRIVE = 11.0
        self.MAX_DAILY_DUTY = 14.0
        self.MAX_DRIVE_NO_BREAK = 8.0
        self.MAX_MILES_NO_FUEL = 1000.0

        self.AVG_SPEED_MPH = 60.0

    def add_event(self, status, hours, location, desc=""):
        if hours <= 0:
            return
            
        start = self.current_time
        self.current_time += timedelta(hours=hours)
        event = HOSEvent(status, start, self.current_time, location, desc)
        self.events.append(event)

        if status == "Driving":
            self.shift_driving_time += hours
            self.shift_elapsed_time += hours
            self.drive_time_since_break += hours
            self.cycle_used += hours
            self.miles_since_fuel += hours * self.AVG_SPEED_MPH
        elif status == "On Duty":
            self.shift_elapsed_time += hours
            self.cycle_used += hours
            if hours >= 0.5:
                self.drive_time_since_break = 0.0
        elif status in ["Off Duty", "Sleeper Berth"]:
            if hours >= 10.0:
                self.shift_driving_time = 0.0
                self.shift_elapsed_time = 0.0
                self.drive_time_since_break = 0.0
            else:
                self.shift_elapsed_time += hours

            if hours >= 0.5:
                self.drive_time_since_break = 0.0

            if hours >= 34.0:
                self.cycle_used = 0.0

    def simulate_trip(self, leg1_dist, leg2_dist, locations):
        """
        locations = {'current': 'Loc A', 'pickup': 'Loc B', 'dropoff': 'Loc C'}
        """
        # 1. Drive to Pickup
        self._drive_segment(leg1_dist, locations["current"], locations["pickup"])

        # 2. Pickup Load
        self._check_cycle(1.0, locations["pickup"])
        self.add_event("On Duty", 1.0, locations["pickup"], "Pickup Load")

        # 3. Drive to Dropoff
        self._drive_segment(leg2_dist, locations["pickup"], locations["dropoff"])

        # 4. Dropoff Load
        self._check_cycle(1.0, locations["dropoff"])
        self.add_event("On Duty", 1.0, locations["dropoff"], "Dropoff Load")

        return self.events

    def _drive_segment(self, distance, start_loc, end_loc):
        remaining_dist = distance
        current_loc = start_loc

        while remaining_dist > 0.01:
            self._check_cycle(0.1, current_loc)

            if self.shift_driving_time >= self.MAX_DAILY_DRIVE or self.shift_elapsed_time >= self.MAX_DAILY_DUTY:
                self.add_event("Sleeper Berth", 10.0, current_loc, "10-Hour Reset")
                continue

            if self.drive_time_since_break >= self.MAX_DRIVE_NO_BREAK:
                self.add_event("Off Duty", 0.5, current_loc, "30-Minute Break")
                continue

            if self.miles_since_fuel >= self.MAX_MILES_NO_FUEL:
                self.add_event("On Duty", 0.5, current_loc, "Fueling")
                self.miles_since_fuel = 0.0
                continue

            max_drive_by_11 = self.MAX_DAILY_DRIVE - self.shift_driving_time
            max_drive_by_14 = self.MAX_DAILY_DUTY - self.shift_elapsed_time
            max_drive_by_break = self.MAX_DRIVE_NO_BREAK - self.drive_time_since_break
            max_drive_by_fuel = (self.MAX_MILES_NO_FUEL - self.miles_since_fuel) / self.AVG_SPEED_MPH
            max_drive_by_cycle = self.MAX_CYCLE - self.cycle_used

            hours_needed = remaining_dist / self.AVG_SPEED_MPH

            chunk_hours = min(
                hours_needed,
                max_drive_by_11,
                max_drive_by_14,
                max_drive_by_break,
                max_drive_by_fuel,
                max_drive_by_cycle,
            )

            self.add_event("Driving", chunk_hours, f"En route to {end_loc}")
            remaining_dist -= chunk_hours * self.AVG_SPEED_MPH

    def _check_cycle(self, hours_needed, loc):
        if self.cycle_used + hours_needed > self.MAX_CYCLE:
            self.add_event("Off Duty", 34.0, loc, "34-Hour Restart")
