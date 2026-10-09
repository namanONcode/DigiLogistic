import requests


def geocode(address):
    url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1&countrycodes=us"
    headers = {"User-Agent": "DigiLogistic/1.0"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200 and len(response.json()) > 0:
        data = response.json()[0]
        return float(data["lon"]), float(data["lat"])
    return None, None


def get_route(coords):
    coords_str = ";".join([f"{lon},{lat}" for lon, lat in coords])
    url = f"http://router.project-osrm.org/route/v1/driving/{coords_str}?overview=full&geometries=geojson"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data.get("code") == "Ok" and data.get("routes"):
            return data["routes"][0]
    return None
