import requests
from functools import lru_cache

@lru_cache(maxsize=128)
def geocode(address):
    url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1&countrycodes=us"
    headers = {"User-Agent": "DigiLogistic/1.0"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200 and len(response.json()) > 0:
            data = response.json()[0]
            return float(data["lon"]), float(data["lat"])
    except Exception:
        pass
    return None, None

@lru_cache(maxsize=128)
def get_route(coords):
    coords_str = ";".join([f"{lon},{lat}" for lon, lat in coords])
    url = f"http://router.project-osrm.org/route/v1/driving/{coords_str}?overview=full&geometries=geojson"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("code") == "Ok" and data.get("routes"):
                return data["routes"][0], None
            return None, f"OSRM Error: Code {data.get('code')}"
        return None, f"OSRM HTTP {response.status_code}: {response.text[:100]}"
    except Exception as e:
        return None, f"Exception: {str(e)}"
