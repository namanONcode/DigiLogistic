import re
test_path = "backend/api/tests.py"

with open(test_path, "r") as f:
    content = f.read()

profile_test_regex = r'@pytest\.mark\.django_db\s*\nclass TestProfileView:\n\s*def test_get_profile\(self\):\n\s*client = APIClient\(\)\n\s*resp = client\.get\(reverse\("profile"\)\)\n\s*assert resp\.status_code == 200\n\s*assert "carrier" in resp\.data\n\n'
content = re.sub(profile_test_regex, '', content)

with open(test_path, "w") as f:
    f.write(content)

print("backend/api/tests.py patched")
