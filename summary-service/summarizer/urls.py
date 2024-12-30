from django.urls import path
from . import views

urlpatterns = [
    path('summarize', views.create_summary, name='create_summary'),
    path('summarize/status/<uuid:job_id>', views.get_summary_status, name='get_summary_status'),
    path('health', views.health_check, name='health_check'),
]
