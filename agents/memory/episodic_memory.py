class EpisodicMemory:
    def __init__(self, max_episodes=10):
        self.buffer = []
        self.max = max_episodes

    def add(self, turn):
        self.buffer.append(turn)
        if len(self.buffer) > self.max:
            self.buffer.pop(0)