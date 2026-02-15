class AIGuardrail:
    def __init__(self):
        self.prohibited_patterns = [
            r"(?i)ignore\s+previous\s+instructions",
            r"(?i)system\s+prompt\s+leak",
            r"(?i)reveal\s+secret\s+key"
        ]

    def scan_input(self, text: str) -> bool:
        """
        Returns True if the input is safe, False if a violation is detected.
        """
        import re
        for pattern in self.prohibited_patterns:
            if re.search(pattern, text):
                return False
        return True
