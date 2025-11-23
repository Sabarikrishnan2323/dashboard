from django.urls import path
from .views import *

urlpatterns = [
    
    path("filters/", get_unique_filters, name="get_filters"),
    path("stats/", get_stats, name="get_stats"),
]
