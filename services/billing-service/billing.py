class BillingProcessor:
    def calculate_cost(self, tokens, model):
        rates = {"llama": 0.001, "deepseek": 0.002}
        return tokens * rates.get(model, 0.001)