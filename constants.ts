
import { EcosystemNode, EcosystemLink, RepoNode } from './types';

export const ECOSYSTEM_NODES: EcosystemNode[] = [
  // Tier 1
  {
    id: 'llama',
    name: 'Meta LLaMA',
    tier: 1,
    category: 'Foundation Models',
    role: 'General foundation LLM backbone',
    description: 'The industry default open baseline with the widest global adoption.',
    useCases: ['Enterprise copilots', 'Autonomous agents', 'Research prototyping']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek (R/V Series)',
    tier: 1,
    category: 'Foundation Models',
    role: 'Reasoning-heavy LLMs',
    advantage: 'Strong math, coding, and scientific reasoning with sparse architectures.',
    description: 'Leading reasoning model for complex scientific and coding pipelines.',
    useCases: ['Coding agents', 'Scientific AI', 'Quant reasoning']
  },
  {
    id: 'minimax',
    name: 'MiniMax AI',
    tier: 1,
    category: 'Foundation Models',
    role: 'Long-context frontier',
    advantage: 'Hybrid MoE + lightning attention, 1M+ token context.',
    description: 'Strategic value in long-context reasoning and autonomous coding.',
    useCases: ['Legal document intelligence', 'Long-context RAG']
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    tier: 1,
    category: 'Foundation Models',
    role: 'Multilingual + Long-context',
    description: 'Massive context windows and multimodal integration.',
    useCases: ['Global localization', 'Multimodal automation']
  },
  // Tier 2
  {
    id: 'crewai',
    name: 'CrewAI',
    tier: 2,
    category: 'Agent Frameworks',
    role: 'Multi-agent orchestration',
    description: 'Production-ready framework for autonomous agent collaboration using Flows.',
    useCases: ['Operational automation', 'Business process agents']
  },
  {
    id: 'langchain',
    name: 'LangChain',
    tier: 2,
    category: 'Agent Frameworks',
    role: 'AI middleware',
    description: 'The standard for tool integration, memory systems, and RAG pipelines.',
    useCases: ['RAG apps', 'Scaffolding']
  },
  {
    id: 'autogen',
    name: 'Microsoft AutoGen',
    tier: 2,
    category: 'Agent Frameworks',
    role: 'Conversational coordination',
    description: 'Strong research and enterprise traction for conversational agent teams.',
    useCases: ['Research workflows', 'Complex problem solving']
  },
  // Tier 3
  {
    id: 'nvidia',
    name: 'NVIDIA Open Stack',
    tier: 3,
    category: 'Infrastructure',
    role: 'Industrial AI backbone',
    description: 'Vertical integration of models (Nemotron), tools (NeMo), and servers (Triton).',
    useCases: ['Enterprise training', 'Production inference']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    tier: 3,
    category: 'Infrastructure',
    role: 'Distribution Hub',
    description: 'The GitHub and Docker Hub of the AI world.',
    useCases: ['Model hosting', 'Dataset management']
  }
];

export const ECOSYSTEM_LINKS: EcosystemLink[] = [
  { source: 'crewai', target: 'llama', type: 'dependency' },
  { source: 'crewai', target: 'deepseek', type: 'dependency' },
  { source: 'langchain', target: 'llama', type: 'dependency' },
  { source: 'autogen', target: 'deepseek', type: 'dependency' },
  { source: 'nvidia', target: 'huggingface', type: 'integration' },
  { source: 'minimax', target: 'deepseek', type: 'competitor' },
  { source: 'llama', target: 'qwen', type: 'competitor' }
];

export const ENTERPRISE_REPO: RepoNode = {
  name: 'enterprise-ai-platform',
  type: 'folder',
  children: [
    { name: 'README.md', type: 'file', language: 'markdown', content: '# 🚀 enterprise-ai-platform\n\nEnterprise-grade, sovereign AI monorepo for production-scale multi-agent orchestration, model lifecycle management, and secure deployment.\n\n## 🏗 Architecture\n- **apps/**: Production AI applications and gateways.\n- **agents/**: Autonomous agent swarms and orchestration logic.\n- **models/**: Model governance, fine-tuning, and quantization configs.\n- **infrastructure/**: IaC for GPU clusters and networking.\n- **mlops/**: Continuous training and deployment pipelines.\n- **security/**: AI-specific safety guardrails and red-teaming.\n\n## ⚡ Quick Start\n```bash\nmake install\nscripts/bootstrap.sh\n```\n\n## 🛠 Tech Stack\n- **Foundation**: LLaMA 3, DeepSeek R1, Qwen 2.5\n- **Agents**: CrewAI, AutoGen, LangChain\n- **Infra**: Terraform, K8s, NVIDIA NeMo\n- **Database**: Qdrant, Milvus (Vector DB)' },
    { name: 'LICENSE', type: 'file', language: 'text', content: 'Apache License 2.0\n\nCopyright 2026 Shards Inc.' },
    { name: '.gitignore', type: 'file', language: 'text', content: '__pycache__/\n*.py[cod]\n*$py.class\n.env\n.venv\nvenv/\nENV/\n.idea/\n.vscode/\ndist/\nbuild/\n*.log\n*.checkpoint\ndata/raw/' },
    { name: '.editorconfig', type: 'file', language: 'ini', content: 'root = true\n\n[*]\nindent_style = space\nindent_size = 2\ncharset = utf-8\ntrim_trailing_whitespace = true\ninsert_final_newline = true\n\n[*.py]\nindent_size = 4' },
    { name: 'docker-compose.yml', type: 'file', language: 'yaml', content: 'version: "3.8"\nservices:\n  gateway:\n    build: ./services/model-gateway\n    ports: ["8000:8000"]\n  vector-db:\n    image: qdrant/qdrant\n    ports: ["6333:6333"]\n  auth:\n    build: ./services/auth-service' },
    { name: 'Makefile', type: 'file', language: 'text', content: 'install:\n\tpip install -r requirements.txt\n\ntest:\n\tpytest tests/\n\nbuild:\n\tdocker-compose build\n\ndeploy-prod:\n\t./scripts/deploy.sh production' },
    { name: 'pyproject.toml', type: 'file', language: 'toml', content: '[tool.poetry]\nname = "enterprise-ai-platform"\nversion = "1.0.0"\ndescription = "Enterprise AI Orchestration"\nauthors = ["AI Strategist <architect@shards.inc>"]\n\n[tool.poetry.dependencies]\npython = "^3.11"\nfastapi = "^0.104.0"\ncrewai = "^0.1.0"\nlangchain = "^0.1.0"\ntorch = "^2.1.0"\n\n[build-system]\nrequires = ["poetry-core"]\nbuild-backend = "poetry.core.masonry.api"' },
    { name: 'package.json', type: 'file', language: 'json', content: '{\n  "name": "enterprise-ai-platform",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "lint": "eslint .",\n    "dashboard:dev": "npm run dev --prefix apps/automation-dashboard"\n  }\n}' },
    { name: 'requirements.txt', type: 'file', content: 'fastapi==0.104.1\nuvicorn==0.24.0\npydantic==2.5.2\npython-dotenv==1.0.0\nrequests==2.31.0\ncrewai==0.30.0\nlangchain==0.1.0\nqdrant-client==1.7.0' },
    {
      name: 'configs',
      type: 'folder',
      children: [
        { name: 'base.yaml', type: 'file', language: 'yaml', content: 'platform:\n  name: "SovereignAI"\n  version: "2026.1"\n  region: "global"\nlogging:\n  level: "INFO"\n  format: "json"' },
        { name: 'development.yaml', type: 'file', language: 'yaml', content: 'debug: true\nmock_external_apis: true\ndatabase:\n  url: "localhost:5432"' },
        { name: 'production.yaml', type: 'file', language: 'yaml', content: 'env: production\ndebug: false\nreplica_count: 10\nautoscale:\n  min: 5\n  max: 50\n  cpu_threshold: 70\nsecurity:\n  enforce_mfa: true\n  encryption_at_rest: true' },
        { name: 'model-routing.yaml', type: 'file', language: 'yaml', content: 'routing:\n  default: "llama-3-70b"\n  reasoning_tasks: "deepseek-r1"\n  multilingual: "qwen-max"\n  fallback: "llama-3-8b"' }
      ]
    },
    {
      name: 'apps',
      type: 'folder',
      children: [
        {
          name: 'copilot-api',
          type: 'folder',
          children: [
            { name: 'app.py', type: 'file', language: 'python', content: 'from fastapi import FastAPI\nfrom routes import router\n\napp = FastAPI(title="AI Copilot API")\napp.include_router(router)\n\n@app.get("/health")\ndef health():\n    return {"status": "operational"}' },
            { name: 'routes.py', type: 'file', language: 'python', content: 'from fastapi import APIRouter, Depends\nfrom schemas import QueryRequest, QueryResponse\n\nrouter = APIRouter()\n\n@router.post("/query", response_model=QueryResponse)\nasync def process_query(request: QueryRequest):\n    return {"id": "req-123", "answer": "Analysis complete.", "sources": []}' },
            { name: 'schemas.py', type: 'file', language: 'python', content: 'from pydantic import BaseModel\nfrom typing import List, Optional\n\nclass QueryRequest(BaseModel):\n    prompt: str\n    context_id: Optional[str] = None\n\nclass QueryResponse(BaseModel):\n    id: str\n    answer: str\n    sources: List[str]' },
            { name: 'Dockerfile', type: 'file', language: 'dockerfile', content: 'FROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ["uvicorn", "app:app", "--host", "0.0.0.0"]' }
          ]
        },
        {
          name: 'automation-dashboard',
          type: 'folder',
          children: [
            { name: 'server.js', type: 'file', language: 'javascript', content: 'const express = require("express");\nconst app = express();\nconst port = process.env.PORT || 3000;\n\napp.use(express.json());\n\napp.get("/api/status", (req, res) => {\n  res.json({ agents_active: 12, tasks_completed: 450 });\n});\n\napp.listen(port, () => {\n  console.log(`Dashboard running on ${port}`);\n});' },
            { name: 'README.md', type: 'file', content: '# Automation Dashboard\n\nReal-time monitoring for multi-agent workflows.' }
          ]
        }
      ]
    },
    {
      name: 'agents',
      type: 'folder',
      children: [
        {
          name: 'orchestration',
          type: 'folder',
          children: [
            { name: 'crew_manager.py', type: 'file', language: 'python', content: 'from crewai import Crew, Process\n\nclass EnterpriseCrewManager:\n    def __init__(self, agents, tasks):\n        self.crew = Crew(agents=agents, tasks=tasks, process=Process.sequential)\n\n    def execute(self, inputs):\n        return self.crew.kickoff(inputs=inputs)' },
            { name: 'planner.py', type: 'file', language: 'python', content: 'class TaskPlanner:\n    def create_plan(self, objective):\n        return [{"id": 1, "task": "Search", "agent": "researcher"}]' }
          ]
        },
        {
          name: 'tools',
          type: 'folder',
          children: [
            { name: 'browser_tool.py', type: 'file', language: 'python', content: 'import requests\ndef scrape(url): return requests.get(url).text[:2000]' },
            { name: 'database_tool.py', type: 'file', language: 'python', content: 'import sqlite3\nclass DBTool: pass' }
          ]
        }
      ]
    },
    {
      name: 'mlops',
      type: 'folder',
      children: [
        { name: 'pipeline.py', type: 'file', content: 'class TrainingPipeline:\n    def run(self): print("Training started...")' },
        { name: 'drift_detector.py', type: 'file', content: 'class DriftDetector: pass' }
      ]
    },
    {
      name: 'infrastructure',
      type: 'folder',
      children: [
        {
          name: 'terraform',
          type: 'folder',
          children: [
            { name: 'main.tf', type: 'file', language: 'hcl', content: 'provider "aws" { region = "us-east-1" }\nresource "aws_eks_cluster" "ai" { name = "ai-cluster" }' },
            { name: 'gpu-cluster.tf', type: 'file', language: 'hcl', content: 'resource "aws_eks_node_group" "gpu" { instance_types = ["p4d.24xlarge"] }' }
          ]
        }
      ]
    },
    {
      name: 'security',
      type: 'folder',
      children: [
        { name: 'threat-model.md', type: 'file', content: '# AI Threat Model\n1. Prompt Injection\n2. Data Poisoning\n3. Model Theft' },
        { name: 'pii-policy.md', type: 'file', content: '# PII Handling Policy\nNo raw PII in fine-tuning sets.' }
      ]
    },
    {
      name: 'scripts',
      type: 'folder',
      children: [
        { name: 'bootstrap.sh', type: 'file', language: 'bash', content: '#!/bin/bash\necho "🚀 Initializing..."\nmkdir -p data/raw data/processed\npip install -r requirements.txt' },
        { name: 'deploy.sh', type: 'file', language: 'bash', content: '#!/bin/bash\nkubectl apply -f infrastructure/kubernetes/' }
      ]
    }
  ]
};
