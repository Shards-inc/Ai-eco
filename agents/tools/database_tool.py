import sqlite3

class DatabaseTool:
    def __init__(self, db_path="data/internal.db"):
        self.conn = sqlite3.connect(db_path)

    def run_query(self, sql):
        cursor = self.conn.cursor()
        cursor.execute(sql)
        return cursor.fetchall()