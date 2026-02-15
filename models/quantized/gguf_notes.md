# Quantization Strategy
We use GGUF for edge inference and AWQ for server-side NVIDIA GPUs.
4-bit quantization is preferred for 70B+ models to fit on single-GPU nodes.