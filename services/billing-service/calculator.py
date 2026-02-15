class CostCalculator:
    MODEL_WEIGHTS = {
        "llama-3-70b": 1.0,
        "deepseek-r1": 2.5,
        "qwen-2.5-coder": 1.5,
        "llama-3-8b": 0.1
    }

    def calculate_total(self, tokens: int, model_id: str, is_input: bool = True) -> float:
        base_rate = 0.0001 if is_input else 0.0005
        weight = self.MODEL_WEIGHTS.get(model_id, 1.0)
        return tokens * base_rate * weight
