# AI Platform Threat Model

## 1. Prompt Injection
- **Risk**: Direct hijacking of agent logic via user input.
- **Mitigation**: Structural output enforcement, input sanitization layers.

## 2. Training Data Poisoning
- **Risk**: Malicious inputs in fine-tuning datasets.
- **Mitigation**: Data lineage verification, PII scrubbing.

## 3. Model Theft
- **Risk**: Extraction of proprietary weights from inference servers.
- **Mitigation**: Hardware-based security (TPM/HSM).