import logging
import json
from datetime import datetime

class AuditLogger:
    def __init__(self, service_name: str):
        self.logger = logging.getLogger(f"audit.{service_name}")
        self.logger.setLevel(logging.INFO)

    def log_action(self, user_id: str, action: str, resource: str, success: bool):
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "success": success
        }
        self.logger.info(json.dumps(entry))
