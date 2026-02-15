
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ECOSYSTEM_NODES, ECOSYSTEM_LINKS } from '../constants';
import { EcosystemNode } from '../types';

interface Props {
  onNodeSelect: (node: EcosystemNode) => void;
}

const EcosystemGraph: React.FC<Props> = ({ onNodeSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<any>(ECOSYSTEM_NODES)
      .force('link', d3.forceLink<any, any>(ECOSYSTEM_LINKS).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    const link = svg.append('g')
      .selectAll('line')
      .data(ECOSYSTEM_LINKS)
      .enter().append('line')
      .attr('stroke', '#27272a')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', d => d.type === 'competitor' ? '4,4' : '0');

    const node = svg.append('g')
      .selectAll('g')
      .data(ECOSYSTEM_NODES)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => onNodeSelect(d))
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => 25 - d.tier * 3)
      .attr('fill', d => {
        if (d.tier === 1) return '#3b82f6';
        if (d.tier === 2) return '#10b981';
        return '#8b5cf6';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e4e4e7')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [onNodeSelect]);

  return (
    <div className="w-full h-full bg-zinc-950/50 rounded-xl border border-zinc-800 overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-zinc-400">Tier 1: Foundation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-400">Tier 2: Agents</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-xs text-zinc-400">Tier 3: Infrastructure</span>
        </div>
      </div>
    </div>
  );
};

export default EcosystemGraph;
