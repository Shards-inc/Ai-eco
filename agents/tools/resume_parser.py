import json

class ResumeParser:
    def parse(self, content: str):
        """
        Heuristic-based extraction for candidate screening.
        In production, this would call a vision-LLM or specialized parser.
        """
        data = {
            "name": self._extract_name(content),
            "skills": self._extract_skills(content),
            "experience_years": self._calculate_experience(content)
        }
        return data

    def _extract_name(self, text):
        # Mock logic
        return text.split('\n')[0]

    def _extract_skills(self, text):
        known_skills = ["Python", "AWS", "Docker", "React", "Terraform", "LLM"]
        return [skill for skill in known_skills if skill.lower() in text.lower()]

    def _calculate_experience(self, text):
        # Logic to find date ranges
        return 5
