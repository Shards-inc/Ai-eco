import requests
import os
from datetime import datetime, timedelta

class PrometheusTool:
    def __init__(self, endpoint: str = None):
        self.endpoint = endpoint or os.getenv("PROMETHEUS_ENDPOINT", "http://prometheus:9090")

    def query_metric(self, query: str):
        """
        Executes a PromQL query and returns results.
        """
        response = requests.get(f"{self.endpoint}/api/v1/query", params={'query': query})
        if response.status_code == 200:
            return response.json().get('data', {}).get('result', [])
        return None

    def get_node_cpu_utilization(self):
        query = '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'
        return self.query_metric(query)

    def get_gpu_memory_usage(self):
        query = 'nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes'
        return self.query_metric(query)
