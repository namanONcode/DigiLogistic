from rest_framework.views import APIView
from rest_framework.response import Response
from .services import geocode, get_route


class RouteCalculateView(APIView):
    def post(self, request):
        data = request.data
        current = data.get("current")
        pickup = data.get("pickup")
        dropoff = data.get("dropoff")
        cycle_used = data.get("cycle_used", 0)

        # Geocode
        curr_lon, curr_lat = geocode(current)
        pick_lon, pick_lat = geocode(pickup)
        drop_lon, drop_lat = geocode(dropoff)

        if None in (curr_lon, pick_lon, drop_lon):
            return Response({"error": "Could not geocode one or more addresses"}, status=400)

        route_data = get_route([(curr_lon, curr_lat), (pick_lon, pick_lat), (drop_lon, drop_lat)])
        if not route_data:
            return Response({"error": "Could not calculate route"}, status=400)

        # Distances in meters to miles
        legs = route_data.get("legs", [])
        if len(legs) >= 2:
            leg1_dist = legs[0]["distance"] * 0.000621371
            leg2_dist = legs[1]["distance"] * 0.000621371
        else:
            leg1_dist = route_data["distance"] * 0.000621371 * 0.1
            leg2_dist = route_data["distance"] * 0.000621371 * 0.9

        total_miles = route_data["distance"] * 0.000621371

        from .hos_engine import HOSEngine

        engine = HOSEngine(current_cycle_used=float(cycle_used))
        events = engine.simulate_trip(leg1_dist, leg2_dist, {"current": current, "pickup": pickup, "dropoff": dropoff})

        timeline = []
        for ev in events:
            timeline.append(
                {
                    "status": ev.status,
                    "start_time": ev.start_time.isoformat(),
                    "end_time": ev.end_time.isoformat(),
                    "duration_hours": round(ev.get_duration(), 2),
                    "location": ev.location_name,
                    "description": ev.description,
                }
            )

        from .eld_drawer import generate_log_images

        date_str = events[0].start_time.isoformat() if events else ""
        images = generate_log_images(timeline, date_str, current, pickup, dropoff, total_miles)

        return Response(
            {
                "route": route_data,
                "timeline": timeline,
                "images": images,
                "points": {
                    "current": [curr_lat, curr_lon],
                    "pickup": [pick_lat, pick_lon],
                    "dropoff": [drop_lat, drop_lon],
                },
            }
        )


