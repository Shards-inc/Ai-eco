
import React, { useState, useRef, useEffect } from 'react';
import EcosystemGraph from './components/EcosystemGraph';
import RepoBrowser from './components/RepoBrowser';
import { ECOSYSTEM_NODES } from './constants';
import { EcosystemNode, ChatMessage, RepoNode } from './types';
import { gemini } from './services/gemini';
import { GoogleGenAI, Modality } from '@google/genai';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);
  const [viewingFile, setViewingFile] = useState<RepoNode | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: userInput };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    const response = await gemini.chat(chatHistory, userInput);
    
    const aiMsg: ChatMessage = { role: 'model', content: response };
    setChatHistory(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  // Live Voice Strategy Implementation
  const startLiveSession = async () => {
    try {
      setIsLiveActive(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);
      
      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setChatHistory(prev => [...prev, { role: 'model', content: "[LIVE SESSION STARTED] Speak clearly into your microphone." }]);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(session => session.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const int16 = new Int16Array(bytes.buffer);
              const buffer = outputAudioContext.createBuffer(1, int16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < int16.length; i++) channelData[i] = int16[i] / 32768.0;
              
              nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
              const source = outputAudioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNode);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
            }
            if (msg.serverContent?.outputTranscription) {
              setChatHistory(prev => [...prev, { role: 'model', content: msg.serverContent!.outputTranscription!.text }]);
            }
          },
          onclose: () => setIsLiveActive(false),
          onerror: () => setIsLiveActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "You are a Senior AI Strategic Advisor. Give fast, high-impact audio advice."
        }
      });
    } catch (err) {
      console.error(err);
      setIsLiveActive(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar - Strategy Engine */}
      <aside className="w-full lg:w-[400px] border-r border-zinc-800 flex flex-col bg-zinc-950 z-20">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-1">
              <span className="text-blue-500">AI</span> Navigator
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Strategic Intelligence v2.6</p>
          </div>
          <button 
            onClick={startLiveSession}
            disabled={isLiveActive}
            className={`p-2 rounded-full border ${isLiveActive ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-blue-500/10 border-blue-500/50 text-blue-500 hover:bg-blue-500/20'} transition-all`}
            title="Start Voice Strategy Session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <span className="text-zinc-400">AI</span>
              </div>
              <p className="text-sm text-zinc-400">Consult the AI Strategist on 2026 trends.</p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {['Best stack for RAG?', 'LLaMA vs DeepSeek?', 'SaaS Ideas 2026'].map((prompt) => (
                  <button 
                    key={prompt}
                    onClick={() => setUserInput(prompt)}
                    className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-2 rounded transition-colors text-zinc-300"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-zinc-900 text-zinc-200 border border-zinc-800 shadow-xl'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-tighter">
                {msg.role === 'user' ? 'Architect' : 'Strategist'}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex space-x-1 p-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="relative">
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isLiveActive ? "Listening..." : "Ask for strategic advice..."}
              disabled={isLiveActive}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder:text-zinc-600"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 text-zinc-500 hover:text-blue-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </form>
      </aside>

      {/* Main Content - Visual Explorer */}
      <main className="flex-1 flex flex-col bg-[#0a0a0c] overflow-y-auto relative">
        <header className="px-8 py-6 flex items-center justify-between border-b border-zinc-900 sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Topology <span className="text-zinc-600 text-lg font-normal">/</span> <span className="text-blue-500">2026</span>
            </h2>
            <p className="text-sm text-zinc-500">Interactive mapping of foundation models and frameworks.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Agentic Economy Online
            </div>
          </div>
        </header>

        <div className="p-8 space-y-12">
          {/* Map View */}
          <section className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 aspect-video min-h-[500px] shadow-2xl">
              <EcosystemGraph onNodeSelect={setSelectedNode} />
            </div>
            
            {/* Info Panel */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col backdrop-blur-md">
              {selectedNode ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg ${
                      selectedNode.tier === 1 ? 'bg-blue-600 shadow-blue-500/20' : selectedNode.tier === 2 ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-violet-600 shadow-violet-500/20'
                    }`}>
                      {selectedNode.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">{selectedNode.name}</h3>
                      <p className="text-xs text-zinc-500 font-mono">T-{selectedNode.tier} // {selectedNode.category}</p>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" /> Primary Role
                      </h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{selectedNode.role}</p>
                    </div>
                    
                    {selectedNode.advantage && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                        <h4 className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest mb-1">Key Advantage</h4>
                        <p className="text-sm text-emerald-300 font-medium">{selectedNode.advantage}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2">Detailed Strategic Context</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">{selectedNode.description}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-3">Revenue Use Cases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.useCases.map((uc, i) => (
                          <span key={i} className="text-[10px] px-2.5 py-1 bg-zinc-800/80 text-zinc-300 rounded-md border border-zinc-700/50 hover:border-zinc-500 transition-colors">
                            {uc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setUserInput(`How can I build a profitable AI agency around ${selectedNode.name}?`)}
                    className="mt-8 w-full bg-white hover:bg-zinc-200 text-black text-xs font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    Generate Business Plan
                  </button>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                  <div className="w-20 h-20 border-2 border-dashed border-zinc-700 rounded-full mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-500"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                  </div>
                  <p className="text-sm text-zinc-500 max-w-[200px]">Interactive mapping. Select a node to initiate strategic analysis.</p>
                </div>
              )}
            </div>
          </section>

          {/* Repo and Stack Section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 pb-24">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 8h10"/><path d="M6 12h10"/></svg>
                  Infrastructure Blueprint
                </h3>
                <span className="text-[10px] text-zinc-600 font-mono">SOVEREIGN-STACK_V1.0</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-lg leading-relaxed">
                A standardized mono-repo architecture designed for sovereign enterprise deployment. Focused on security, agent modularity, and rapid MLOps iteration.
              </p>
              <RepoBrowser onFileSelect={setViewingFile} />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                Optimal 2026 Architectures
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'The "Autonomous Agency" Stack', model: 'LLaMA 3.1 405B', agent: 'CrewAI Flows + AutoGen', infra: 'NVIDIA NeMo Enterprise', use: 'Replacing Junior Workforce' },
                  { title: 'The "Cognitive Research" Stack', model: 'DeepSeek R-Series', agent: 'LangChain Reasoning Loop', infra: 'Private H100 Cluster', use: 'High-Value Decisioning' },
                  { title: 'The "Sovereign Intelligence" Stack', model: 'Qwen 2.5 (Open-Weights)', agent: 'Custom Multi-Agent Orchestrator', infra: 'On-Prem / Trusted Cloud', use: 'Gov/Secure Enterprise' }
                ].map((stack, idx) => (
                  <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-default group border-l-4 border-l-transparent hover:border-l-blue-500">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{stack.title}</h4>
                      <span className="text-[9px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold">OPTIMIZED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">Compute Core</p>
                        <p className="text-xs text-zinc-300">{stack.model}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">Automation Layer</p>
                        <p className="text-xs text-zinc-300">{stack.agent}</p>
                      </div>
                      <div className="col-span-2 pt-2 mt-2 border-t border-zinc-800/50">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-zinc-500 italic">{stack.use}</p>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             <span className="text-[10px] font-bold text-emerald-500">PROFITABLE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700" />
                <h4 className="text-sm font-black text-blue-400 mb-4 flex items-center gap-3 uppercase tracking-[0.2em]">
                  <span className="w-3 h-3 rounded-sm bg-blue-500 rotate-45" />
                  Strategic Mandate 2026
                </h4>
                <p className="text-base text-blue-100/80 leading-relaxed font-medium">
                  "Legacy SaaS models are collapsing. The new moat is **Systemic Agency**. Don't sell a chat interface; sell an autonomous worker team that owns a vertical outcome end-to-end."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* File Viewer Overlay */}
        {viewingFile && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-full flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden scale-in duration-300">
              <div className="px-8 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
                  <span className="text-zinc-600 font-mono text-[10px] tracking-widest">{viewingFile.language?.toUpperCase() || 'RAW'}</span>
                  <h3 className="font-bold text-white font-mono text-sm tracking-tight">{viewingFile.name}</h3>
                </div>
                <button 
                  onClick={() => setViewingFile(null)}
                  className="text-zinc-500 hover:text-white transition-all hover:rotate-90 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-0 bg-[#0c0c0e]">
                {viewingFile.content ? (
                  <pre className="p-8 text-sm font-mono text-zinc-400 leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
                    <code className="block">
                      {viewingFile.content}
                    </code>
                  </pre>
                ) : (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border border-zinc-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <p className="text-zinc-600 text-sm">System pointer error: Resource content null.</p>
                  </div>
                )}
              </div>
              <div className="px-8 py-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/20">
                <p className="text-[10px] text-zinc-600 font-mono">MD5: {Math.random().toString(16).slice(2, 10)}... SHA256 VALIDATED</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(viewingFile.content || '');
                    alert('Blueprint fragment cached.');
                  }}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-400 flex items-center gap-2 uppercase tracking-[0.2em] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Export Source
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
