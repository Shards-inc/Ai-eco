class ModelGateway:
    def route_request(self, query):
        if "code" in query:
            return "deepseek-coder"
        return "llama-3"