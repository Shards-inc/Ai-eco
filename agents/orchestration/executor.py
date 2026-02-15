class TaskExecutor:
    def __init__(self, crew_manager):
        self.manager = crew_manager

    def run(self, plan):
        results = []
        for step in plan:
            result = self.manager.execute(step)
            results.append(result)
        return results