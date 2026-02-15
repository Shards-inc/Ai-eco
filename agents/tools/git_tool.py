import subprocess
import os

class GitTool:
    def __init__(self, repo_path: str):
        self.repo_path = repo_path

    def clone(self, url: str):
        subprocess.run(["git", "clone", url, self.repo_path], check=True)

    def commit_and_push(self, message: str, branch: str = "main"):
        os.chdir(self.repo_path)
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", message], check=True)
        subprocess.run(["git", "push", "origin", branch], check=True)
