from django.db import models

# Create your models here.
from django.db import models
import uuid

class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=500)
    url = models.CharField(max_length=500)
    courseId = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='attachments', db_column='courseId')

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Attachment'
        indexes = [
            models.Index(fields=['courseId']),
        ]


class BankAccount(models.Model):
    id = models.AutoField(primary_key=True)
    card_number = models.CharField(max_length=16)
    card_holder = models.CharField(max_length=100)
    expire_year = models.IntegerField()
    expire_month = models.IntegerField()
    cvv = models.CharField(max_length=3)
    balance = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'BankAccount'


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=500, unique=True)

    class Meta:
        db_table = 'Category'


class Chapter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    videoUrl = models.CharField(max_length=500, blank=True, null=True)
    position = models.IntegerField()
    isPublished = models.BooleanField(default=False)
    isFree = models.BooleanField(default=False)
    courseId = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='chapters', db_column='courseId')

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Chapter'
        indexes = [
            models.Index(fields=['courseId']),
        ]


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userId = models.CharField(max_length=500)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    imageUrl = models.CharField(max_length=500, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    isPublished = models.BooleanField(default=False)
    categoryId = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True, related_name='courses', db_column='categoryId')

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Course'
        indexes = [
            models.Index(fields=['categoryId']),
        ]


class MuxData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assetId = models.CharField(max_length=500)
    playbackId = models.CharField(max_length=500, blank=True, null=True)
    chapterId = models.OneToOneField(Chapter, on_delete=models.CASCADE, related_name='mux_data', db_column='chapterId')

    class Meta:
        db_table = 'MuxData'


class Purchase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userId = models.CharField(max_length=500)
    courseId = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='purchases', db_column='courseId')

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Purchase'
        unique_together = (('userId', 'courseId'),)
        indexes = [
            models.Index(fields=['courseId']),
        ]


class UserProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userId = models.CharField(max_length=500)
    chapterId = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='user_progresses', db_column='chapterId')
    isCompleted = models.BooleanField(default=False)

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'UserProgress'
        unique_together = (('userId', 'chapterId'),)
        indexes = [
            models.Index(fields=['chapterId']),
        ]