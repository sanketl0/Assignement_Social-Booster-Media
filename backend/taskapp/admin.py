from django.contrib import admin

from .models import Task, WeatherSearch

admin.site.register(Task)
admin.site.register(WeatherSearch)
