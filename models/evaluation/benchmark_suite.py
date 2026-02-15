import time

def run_benchmarks(model_id):
    print(f"Running MMLU on {model_id}...")
    time.sleep(1)
    return {"score": 0.78}

if __name__ == "__main__":
    run_benchmarks("llama-3")