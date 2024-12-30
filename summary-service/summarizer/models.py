from django.db import models
import uuid

class SummaryJob(models.Model):
    STYLE_CHOICES = [
        ('formal', 'Formal'),
        ('informal', 'Informal'),
        ('technical', 'Technical'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    input_text = models.TextField()
    summary = models.TextField(null=True, blank=True)
    style = models.CharField(max_length=20, choices=STYLE_CHOICES, default='formal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Summary Job {self.id} - {self.status}"
