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
    {
      name: 'agents',
      type: 'folder',
      children: [
        {
          name: 'orchestration',
          type: 'folder',
          children: [
            { name: 'swarm_logic.py', type: 'file', language: 'python' },
            { name: 'crew_manager.py', type: 'file', language: 'python' },
            { name: 'planner.py', type: 'file', language: 'python' }
          ]
        },
        {
          name: 'tools',
          type: 'folder',
          children: [
            { name: 'search_tool.py', type: 'file', language: 'python' },
            { name: 'git_tool.py', type: 'file', language: 'python' },
            { name: 'notion_tool.py', type: 'file', language: 'python' }
          ]
        },
        {
          name: 'workflows',
          type: 'folder',
          children: [
            { name: 'hr_agent.yaml', type: 'file', language: 'yaml' },
            { name: 'ops_agent.yaml', type: 'file', language: 'yaml' }
          ]
        }
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
            { name: 'vpc.tf', type: 'file', language: 'hcl' },
            { name: 'eks.tf', type: 'file', language: 'hcl' },
            { name: 'security-groups.tf', type: 'file', language: 'hcl' },
            { name: 'iam.tf', type: 'file', language: 'hcl' },
            { name: 's3.tf', type: 'file', language: 'hcl' },
            { name: 'rds.tf', type: 'file', language: 'hcl' }
          ]
        },
        {
          name: 'kubernetes',
          type: 'folder',
          children: [
            { name: 'redis.yaml', type: 'file', language: 'yaml' },
            { name: 'hpa.yaml', type: 'file', language: 'yaml' },
            { name: 'service-mesh.yaml', type: 'file', language: 'yaml' }
          ]
        }
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
            { name: 'main.py', type: 'file', language: 'python' },
            { name: 'services/agent_service.py', type: 'file', language: 'python' }
          ]
        }
      ]
    },
    {
      name: 'services',
      type: 'folder',
      children: [
        {
          name: 'auth-service',
          type: 'folder',
          children: [
            { name: 'jwt_handler.py', type: 'file', language: 'python' },
            { name: 'models.py', type: 'file', language: 'python' },
            { name: 'schemas.py', type: 'file', language: 'python' }
          ]
        },
        {
          name: 'billing-service',
          type: 'folder',
          children: [
            { name: 'calculator.py', type: 'file', language: 'python' },
            { name: 'stripe_client.py', type: 'file', language: 'python' },
            { name: 'usage_tracker.py', type: 'file', language: 'python' }
          ]
        }
      ]
    },
    {
      name: 'mlops',
      type: 'folder',
      children: [
        {
          name: 'evaluation',
          type: 'folder',
          children: [
            { name: 'rag_eval.py', type: 'file', language: 'python' }
          ]
        }
      ]
    },
    {
      name: 'security',
      type: 'folder',
      children: [
        { name: 'firewall_config.py', type: 'file', language: 'python' },
        { name: 'encryption_utils.py', type: 'file', language: 'python' },
        { name: 'audit_logger.py', type: 'file', language: 'python' }
      ]
    },
    {
      name: 'docs',
      type: 'folder',
      children: [
        { name: 'sovereignty-manifesto.md', type: 'file', language: 'markdown' },
        { name: 'api-spec.yaml', type: 'file', language: 'yaml' },
        { name: 'troubleshooting.md', type: 'file', language: 'markdown' }
      ]
    },
    {
      name: 'tests',
      type: 'folder',
      children: [
        { name: 'unit/test_tools.py', type: 'file', language: 'python' },
        { name: 'e2e/test_flows.py', type: 'file', language: 'python' }
      ]
    },
    { name: 'scripts/setup_dev.sh', type: 'file', language: 'bash' }
  ]
};
