import subprocess
import json

class KubectlTool:
    def __init__(self, context: str = "default"):
        self.context = context

    def get_pods(self, namespace: str = "default"):
        cmd = ["kubectl", "get", "pods", "-n", namespace, "-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            return json.loads(result.stdout)
        return {"error": result.stderr}

    def scale_deployment(self, name: str, replicas: int, namespace: str = "default"):
        cmd = ["kubectl", "scale", "deployment", name, f"--replicas={replicas}", "-n", namespace]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.returncode == 0

    def get_logs(self, pod_name: str, namespace: str = "default", tail: int = 100):
        cmd = ["kubectl", "logs", pod_name, "-n", namespace, f"--tail={tail}"]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.stdout
