import re

class GuardrailManager:
    def __init__(self):
        self.sensitive_patterns = [
            r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", # Emails
            r"\b\d{4}-\d{4}-\d{4}-\d{4}\b",               # Credit Cards
            r"(?i)password\s*[:=]\s*\S+",                # Password leaks
            r"(?i)api_key\s*[:=]\s*\S+"                  # API Key leaks
        ]

    def validate_output(self, text: str) -> str:
        """
        Redacts sensitive info from model outputs before they reach the user.
        """
        redacted = text
        for pattern in self.sensitive_patterns:
            redacted = re.sub(pattern, "[REDACTED]", redacted)
        return redacted

    def detect_jailbreak(self, input_text: str) -> bool:
        jailbreak_keywords = [
            "ignore previous instructions",
            "you are now in developer mode",
            "system prompt leak",
            "bypass safety"
        ]
        return any(kw in input_text.lower() for kw in jailbreak_keywords)
