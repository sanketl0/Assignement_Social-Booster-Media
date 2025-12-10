from rest_framework import serializers
from .models import Task, WeatherSearch


# Serializers for Task Management Application 
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


# Serializer for Weather Search Application
class WeatherSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherSearch
        fields = '__all__'
