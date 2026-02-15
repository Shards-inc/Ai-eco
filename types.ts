
export interface EcosystemNode {
  id: string;
  name: string;
  tier: number;
  category: string;
  role: string;
  advantage?: string;
  description: string;
  useCases: string[];
  strategicValue?: string;
}

export interface EcosystemLink {
  source: string;
  target: string;
  type: 'dependency' | 'competitor' | 'integration';
}

export interface RepoNode {
  name: string;
  type: 'folder' | 'file';
  children?: RepoNode[];
  description?: string;
  content?: string;
  language?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
