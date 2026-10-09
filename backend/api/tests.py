import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock
from api.hos_engine import HOSEngine
from api.services import geocode, get_route
from datetime import datetime, timedelta


class TestHOSEngine:
    def test_basic_drive(self):
        engine = HOSEngine(current_cycle_used=10.0)
        events = engine.simulate_trip(100.0, 200.0, {"current": "Loc A", "pickup": "Loc B", "dropoff": "Loc C"})
        assert len(events) >= 4

    def test_11_hour_rule(self):
        engine = HOSEngine(current_cycle_used=10.0)
        events = engine.simulate_trip(360.0, 360.0, {"current": "Loc A", "pickup": "Loc B", "dropoff": "Loc C"})
        assert any(e.status == "Sleeper Berth" and e.get_duration() >= 10 for e in events)

    def test_34_hour_restart(self):
        engine = HOSEngine(current_cycle_used=69.0)
        events = engine.simulate_trip(100.0, 200.0, {"current": "Loc A", "pickup": "Loc B", "dropoff": "Loc C"})
        assert any(e.status == "Off Duty" and e.get_duration() >= 34 for e in events)

    def test_fuel_stop(self):
        engine = HOSEngine(current_cycle_used=10.0)
        engine.miles_since_fuel = 990.0
        events = engine.simulate_trip(100.0, 200.0, {"current": "Loc A", "pickup": "Loc B", "dropoff": "Loc C"})
        assert any(e.status == "On Duty" and "Fueling" in e.description for e in events)

    def test_off_duty_branches(self):
        engine = HOSEngine(current_cycle_used=10.0)
        engine.add_event("Off Duty", 0.4, "Loc A", "Short Break")
        engine.add_event("Sleeper Berth", 0.6, "Loc A", "Short Sleeper")
        assert len(engine.events) == 2

    def test_edge_cases(self):
        engine = HOSEngine(current_cycle_used=69.99)
        # Should trigger float precision fallbacks
        engine.add_event("Driving", -1.0, "Loc A") # should be ignored
        events = engine.simulate_trip(1.0, 1.0, {"current": "Loc A", "pickup": "Loc B", "dropoff": "Loc C"})
        assert len(events) >= 4

    def test_float_fallbacks(self):
        # 11-hr fallback
        engine = HOSEngine(0)
        engine.shift_driving_time = 11.0
        engine._drive_segment(1.0, "A", "B")
        
        # 14-hr fallback
        engine = HOSEngine(0)
        engine.shift_elapsed_time = 14.0
        engine._drive_segment(1.0, "A", "B")
        
        # Break fallback
        engine = HOSEngine(0)
        engine.drive_time_since_break = 8.0
        engine._drive_segment(1.0, "A", "B")
        
        # Fuel fallback
        engine = HOSEngine(0)
        engine.miles_since_fuel = 1000.0
        engine._drive_segment(1.0, "A", "B")
        
        # Cycle fallback
        engine = HOSEngine(70.0)
        engine._drive_segment(1.0, "A", "B")


class TestServices:
    @patch("api.services.requests.get")
    def test_geocode_success(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [{"lon": "-74", "lat": "40"}]
        mock_get.return_value = mock_resp

        lon, lat = geocode("NY")
        assert lon == -74.0
        assert lat == 40.0

    @patch("api.services.requests.get")
    def test_geocode_fail(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 404
        mock_get.return_value = mock_resp
        lon, lat = geocode("NY")
        assert lon is None
        assert lat is None

    @patch("api.services.requests.get")
    def test_geocode_empty_json(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = []
        mock_get.return_value = mock_resp
        lon, lat = geocode("NY")
        assert lon is None
        assert lat is None

    @patch("api.services.requests.get")
    def test_get_route(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"code": "Ok", "routes": [{"distance": 1000}]}
        mock_get.return_value = mock_resp

        route = get_route([(-74, 40), (-75, 41)])
        assert route["distance"] == 1000

    @patch("api.services.requests.get")
    def test_get_route_fail(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 400
        mock_get.return_value = mock_resp

        route = get_route([(-74, 40), (-75, 41)])
        assert route is None

    @patch("api.services.requests.get")
    def test_get_route_no_routes(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"code": "Ok", "routes": []}
        mock_get.return_value = mock_resp
        route = get_route([(-74, 40), (-75, 41)])
        assert route is None


@pytest.mark.django_db
class TestRouteCalculateView:
    def setup_method(self):
        self.client = APIClient()
        self.url = reverse("calculate_route")

    @patch("api.views.geocode")
    @patch("api.views.get_route")
    @patch("api.eld_drawer.generate_log_images")
    def test_post_success(self, mock_draw, mock_route, mock_geo):
        mock_geo.side_effect = [(-74, 40), (-75, 41), (-76, 42)]
        mock_route.return_value = {"distance": 160934.4, "legs": [{"distance": 80467.2}, {"distance": 80467.2}]}  # 100 miles
        mock_draw.return_value = ["image_data"]

        resp = self.client.post(
            self.url, {"current": "A", "pickup": "B", "dropoff": "C", "cycle_used": 10}, format="json"
        )

        assert resp.status_code == 200
        assert "route" in resp.data
        assert "timeline" in resp.data
        assert "images" in resp.data

    @patch("api.views.geocode")
    def test_post_geocode_fail(self, mock_geo):
        mock_geo.side_effect = [(None, None), (-75, 41), (-76, 42)]

        resp = self.client.post(self.url, {"current": "A", "pickup": "B", "dropoff": "C"}, format="json")

        assert resp.status_code == 400
        assert resp.data["error"] == "Could not geocode one or more addresses"

    @patch("api.views.geocode")
    @patch("api.views.get_route")
    def test_post_route_fail(self, mock_route, mock_geo):
        mock_geo.side_effect = [(-74, 40), (-75, 41), (-76, 42)]
        mock_route.return_value = None

        resp = self.client.post(self.url, {"current": "A", "pickup": "B", "dropoff": "C"}, format="json")

        assert resp.status_code == 400
        assert resp.data["error"] == "Could not calculate route"

    @patch("api.views.geocode")
    @patch("api.views.get_route")
    @patch("api.eld_drawer.generate_log_images")
    def test_post_empty_timeline(self, mock_draw, mock_route, mock_geo):
        mock_geo.side_effect = [(-74, 40), (-75, 41), (-76, 42)]
        mock_route.return_value = {"distance": 0.0}
        mock_draw.return_value = []
        # if distance is 0, might not generate timeline properly
        # actually, with 0 distance, pickup and dropoff still take 1hr each.
        with patch("api.hos_engine.HOSEngine.simulate_trip", return_value=[]):
            resp = self.client.post(self.url, {"current": "A", "pickup": "B", "dropoff": "C"}, format="json")
            assert resp.status_code == 200

    @patch("api.views.geocode")
    @patch("api.views.get_route")
    @patch("api.eld_drawer.generate_log_images")
    def test_post_fallback_legs(self, mock_draw, mock_route, mock_geo):
        mock_geo.side_effect = [(-74, 40), (-75, 41), (-76, 42)]
        mock_route.return_value = {"distance": 1000.0, "legs": [{"distance": 1000.0}]}
        mock_draw.return_value = []
        resp = self.client.post(self.url, {"current": "A", "pickup": "B", "dropoff": "C"}, format="json")
        assert resp.status_code == 200


def test_eld_drawer():
    from api.eld_drawer import get_y_for_status, get_x_for_time, generate_log_images

    assert get_y_for_status("Off Duty") == 250 + int(40 * 0.5)
    assert get_y_for_status("Sleeper Berth") == 250 + int(40 * 1.5)
    assert get_y_for_status("Driving") == 250 + int(40 * 2.5)
    assert get_y_for_status("On Duty") == 250 + int(40 * 3.5)
    assert get_y_for_status("Unknown") == 250 + int(40 * 0.5)

    assert get_x_for_time("2026-10-08T00:00:00") == 150
    assert get_x_for_time("2026-10-08T12:00:00") == int(150 + 12 * ((1150 - 150) / 24))

    # Test generation with empty timeline
    assert generate_log_images([], "", "", "", "", 0) == []

    # Test generation with valid timeline spanning multiple days
    dt1 = datetime(2026, 10, 8, 22, 0, 0)
    dt2 = dt1 + timedelta(hours=3)  # crosses midnight to 2026-10-09 01:00
    dt3 = dt2 + timedelta(hours=10)  # 2026-10-09 11:00

    timeline = [
        {
            "status": "Off Duty",
            "start_time": dt1.isoformat(),
            "end_time": dt2.isoformat(),
            "location": "Loc A",
            "description": "Break",
        },
        {
            "status": "Driving",
            "start_time": dt2.isoformat(),
            "end_time": dt3.isoformat(),
            "location": "Loc B",
            "description": "Driving",
        },
    ]

    images = generate_log_images(timeline, dt1.isoformat(), "Loc A", "Loc A", "Loc B", 100)
    assert len(images) == 2  # 8th and 9th
    assert images[0].startswith("data:image/png;base64,")
    assert images[1].startswith("data:image/png;base64,")


def test_unknown_status():
    engine = HOSEngine(current_cycle_used=10.0)
    engine.add_event("Unknown", 1.0, "Loc A")
    assert len(engine.events) == 1


def test_eld_drawer_no_desc():
    from api.eld_drawer import generate_log_images

    dt1 = datetime(2026, 10, 8, 22, 0, 0)
    dt2 = dt1 + timedelta(hours=3)
    timeline = [
        {
            "status": "Off Duty",
            "start_time": dt1.isoformat(),
            "end_time": dt2.isoformat(),
            "location": "Loc A",
            "description": "",
        }
    ]
    images = generate_log_images(timeline, dt1.isoformat(), "Loc A", "Loc A", "Loc B", 100)
    assert len(images) > 0
