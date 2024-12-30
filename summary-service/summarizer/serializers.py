from rest_framework import serializers
from .models import SummaryJob

class SummaryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummaryJob
        fields = ['input_text', 'style']

class SummaryResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummaryJob
        fields = ['id', 'status']

class SummaryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummaryJob
        fields = ['id', 'status', 'summary', 'error', 'created_at', 'completed_at']
