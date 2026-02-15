import re
from collections import Counter

class LogAnalyzer:
    def __init__(self):
        self.error_patterns = [
            r"ERROR", r"CRITICAL", r"Exception", r"Timeout", r"500 Internal Server Error"
        ]

    def analyze_chunk(self, logs: str):
        """
        Parses a block of logs and identifies key anomalies.
        """
        lines = logs.splitlines()
        stats = {
            "total_lines": len(lines),
            "errors": 0,
            "patterns": Counter(),
            "anomalies": []
        }

        for line in lines:
            for pattern in self.error_patterns:
                if re.search(pattern, line):
                    stats["errors"] += 1
                    stats["patterns"][pattern] += 1
                    stats["anomalies"].append(line)
        
        return stats

    def find_trace_ids(self, logs: str):
        return re.findall(r"trace_id=([a-f0-9\-]+)", logs)
