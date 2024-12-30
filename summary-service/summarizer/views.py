from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SummaryJob
from .serializers import SummaryRequestSerializer, SummaryResponseSerializer, SummaryStatusSerializer
from .tasks import generate_summary

@api_view(['POST'])
def create_summary(request):
    serializer = SummaryRequestSerializer(data=request.data)
    if serializer.is_valid():
        # Create and save the job
        job = serializer.save()
        
        # Start the summarization task
        generate_summary.delay(str(job.id))
        
        # Return the response
        response_serializer = SummaryResponseSerializer(job)
        return Response(response_serializer.data, status=status.HTTP_202_ACCEPTED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_summary_status(request, job_id):
    try:
        job = SummaryJob.objects.get(id=job_id)
        serializer = SummaryStatusSerializer(job)
        return Response(serializer.data)
    except SummaryJob.DoesNotExist:
        return Response(
            {"error": "Summary job not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "healthy",
        "service": "summary-service"
    })
