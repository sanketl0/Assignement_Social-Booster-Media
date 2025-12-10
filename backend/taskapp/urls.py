from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, get_weather, task_report, weather_report


# Router for TaskViewSet
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('weather/', get_weather),
    path('reports/tasks/', task_report),
    path('reports/weather/', weather_report),
]
