#!/bin/bash

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 30

# Create topics
echo "Creating Kafka topics..."

# Translation topics
kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic translation-requests \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2

kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic translation-responses \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2

# Summarization topics
kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic summarization-requests \
  --partitions 4 \
  --replication-factor 3 \
  --config min.insync.replicas=2

kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic summarization-responses \
  --partitions 4 \
  --replication-factor 3 \
  --config min.insync.replicas=2

# User events topic
kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic user-events \
  --partitions 2 \
  --replication-factor 2 \
  --config min.insync.replicas=2

# System metrics topic
kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic system-metrics \
  --partitions 3 \
  --replication-factor 2 \
  --config min.insync.replicas=2

# Dead letter queue
kafka-topics --create --if-not-exists \
  --bootstrap-server kafka-1:9092 \
  --topic dead-letter-queue \
  --partitions 1 \
  --replication-factor 2 \
  --config min.insync.replicas=2

echo "Topics created successfully!"

# List all topics and their details
echo "Listing all topics:"
kafka-topics --describe --bootstrap-server kafka-1:9092
