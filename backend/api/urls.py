from django.urls import path
from .views import RouteCalculateView

urlpatterns = [
    path("calculate/", RouteCalculateView.as_view(), name="calculate_route"),
]
