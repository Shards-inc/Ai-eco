import sys
from assistant import InternalAssistant

def main():
    assistant = InternalAssistant()
    print("Welcome to SovereignAI Internal Assistant.")
    while True:
        query = input("> ")
        if query.lower() in ["exit", "quit"]:
            break
        response = assistant.ask(query)
        print(f"Assistant: {response}")

if __name__ == "__main__":
    main()