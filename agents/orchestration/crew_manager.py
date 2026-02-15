from crewai import Crew, Process
from .planner import TaskPlanner

class EnterpriseCrewManager:
    def __init__(self, agents, tasks):
        self.crew = Crew(
            agents=agents,
            tasks=tasks,
            process=Process.sequential,
            verbose=True
        )

    def execute(self, inputs):
        return self.crew.kickoff(inputs=inputs)