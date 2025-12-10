import requests
from django.conf import settings
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task, WeatherSearch
from .serializers import TaskSerializer, WeatherSearchSerializer


# ViewSet for Task Management Application
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer


# View for Weather Search Application
@api_view(['GET'])
def get_weather(request):
    city = request.GET.get('city')

    if not city:
        return Response(
            {"error": "City parameter is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # 1. Convert city to latitude & longitude (using Open-Meteo geocoding)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}"
        geo_response = requests.get(geo_url).json()

        if not geo_response.get("results"):
            return Response(
                {"error": "City not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        lat = geo_response["results"][0]["latitude"]
        lon = geo_response["results"][0]["longitude"]

        # 2. Fetch weather using lat/lon
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}&current_weather=true"
        )

        weather_response = requests.get(weather_url).json()
        temperature = weather_response["current_weather"]["temperature"]
        condition_code = weather_response["current_weather"]["weathercode"]

        condition_map = {
            0: "Clear",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Rime Fog",
            51: "Light Drizzle",
            61: "Rain",
            71: "Snow",
            80: "Rain Showers",
        }

        condition = condition_map.get(condition_code, "Unknown")

        weather_record = WeatherSearch.objects.create(
            city=city,
            temperature=temperature,
            condition=condition
        )

        serializer = WeatherSearchSerializer(weather_record)
        return Response(serializer.data)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Report View for Task Management Application
@api_view(['GET'])
def task_report(request):
    report = Task.objects.values('status').annotate(count=Count('status'))

    return Response(report)


# Report View for Weather Search Application
@api_view(['GET'])
def weather_report(request):
    report = (
        WeatherSearch.objects
        .annotate(day=TruncDate('created_at'))
        .values('day')
        .annotate(count=Count('id'))
        .order_by('day')
    )

    return Response(report)
