# Troubleshooting Guide

## Model Latency Spikes
- Check GPU utilization in Grafana.
- Verify that the Triton Inference Server isn't queueing requests due to batch size limits.
- Restart the gateway if the connection pool is exhausted.

## Agent Loop Hallucinations
- Inspect the system prompt in `agents/workflows/`.
- Ensure the vector DB retrieval score is above 0.7.
- Try switching to the `deepseek-r1` reasoning model for the specific task.
