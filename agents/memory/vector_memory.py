from qdrant_client import QdrantClient

class VectorMemory:
    def __init__(self, host="localhost", port=6333):
        self.client = QdrantClient(host=host, port=port)

    def save_context(self, text, metadata):
        # Logic to embed and store
        pass

    def retrieve(self, query_vector):
        return self.client.search(collection_name="memory", query_vector=query_vector)