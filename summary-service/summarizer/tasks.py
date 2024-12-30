from celery import shared_task
from transformers import pipeline
from datetime import datetime
from .models import SummaryJob

# Initialize summarization models for different styles
summarizers = {
    'formal': pipeline('summarization', model='facebook/bart-large-cnn'),
    'informal': pipeline('summarization', model='facebook/bart-base'),
    'technical': pipeline('summarization', model='google/pegasus-arxiv')
}

@shared_task
def generate_summary(job_id):
    try:
        # Get the job
        job = SummaryJob.objects.get(id=job_id)
        job.status = 'processing'
        job.save()

        # Select the appropriate summarizer based on style
        summarizer = summarizers.get(job.style, summarizers['formal'])

        # Generate summary
        summary = summarizer(job.input_text, 
                           max_length=130, 
                           min_length=30, 
                           do_sample=False)[0]['summary_text']

        # Update job with results
        job.summary = summary
        job.status = 'completed'
        job.completed_at = datetime.now()
        job.save()

    except Exception as e:
        # Update job with error
        job.status = 'failed'
        job.error = str(e)
        job.completed_at = datetime.now()
        job.save()

    return str(job.id)
