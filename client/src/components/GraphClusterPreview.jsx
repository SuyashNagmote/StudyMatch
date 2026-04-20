import { useState } from "react";

const domainPalette = {
  AI: "#0f766e",
  Data: "#1d4ed8",
  Backend: "#9333ea",
  Frontend: "#ea580c",
  Design: "#db2777",
  Mobile: "#16a34a",
  Cloud: "#ca8a04",
  Security: "#dc2626"
};

const fallbackPalette = ["#0891b2", "#f97316", "#14b8a6", "#eab308", "#8b5cf6", "#ec4899"];

const getClusterCenters = (domains, width, height) => {
  const columns = Math.min(3, Math.max(domains.length, 1));
  const rows = Math.ceil(domains.length / columns);
  const centers = new Map();

  domains.forEach((domain, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    centers.set(domain, {
      x: ((column + 1) * width) / (columns + 1),
      y: ((row + 1) * height) / (rows + 1)
    });
  });

  return centers;
};

const getPositions = (nodes, width, height) => {
  const groupedNodes = nodes.reduce((groups, node) => {
    const domain = node.domain || "General";

    if (!groups.has(domain)) {
      groups.set(domain, []);
    }

    groups.get(domain).push(node);
    return groups;
  }, new Map());

  const domains = [...groupedNodes.keys()];
  const centers = getClusterCenters(domains, width, height);
  const positionedNodes = [];

  domains.forEach((domain) => {
    const center = centers.get(domain);
    const members = groupedNodes.get(domain) || [];

    members.forEach((node, index) => {
      if (members.length === 1) {
        positionedNodes.push({
          ...node,
          x: center.x,
          y: center.y
        });
        return;
      }

      const angle = (2 * Math.PI * index) / members.length;
      const ring = 24 + Math.floor(index / 6) * 18;

      positionedNodes.push({
        ...node,
        x: center.x + ring * Math.cos(angle),
        y: center.y + ring * Math.sin(angle)
      });
    });
  });

  return {
    positions: positionedNodes,
    centers
  };
};

const UserInfoModal = ({ node, onClose }) => {
  if (!node) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-bold text-slate-900">{node.name}</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-sm font-semibold text-slate-600">Interests:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {(node.interests || []).map((interest) => (
                <span key={interest} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-slate-600">Skill Level:</span>
            <span className="ml-2 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700">
              {node.skillLevel}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold text-slate-600">Learning Style:</span>
            <span className="ml-2 rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">
              {node.learningStyle}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold text-slate-600">Domain Cluster:</span>
            <span className="ml-2 rounded-md bg-purple-100 px-2 py-1 text-xs text-purple-700">
              {node.domain}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GraphClusterPreview = ({ graph }) => {
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];
  const domainStats = graph?.domainStats || [];
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const width = 760;
  const height = 460;
  const { positions: positionedNodes, centers } = getPositions(nodes, width, height);
  const positions = Object.fromEntries(positionedNodes.map((node) => [node.id, node]));

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setScale((previous) => Math.min(Math.max(previous * delta, 0.5), 3));
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - translate.x, y: event.clientY - translate.y });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) {
      return;
    }

    setTranslate({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y
    });
  };

  if (!nodes.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No graph data is available yet. Complete a profile and add demo users to generate a study network.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">Study Network Map</h3>
            <p className="text-sm text-slate-500">
              Domain clusters show where students are concentrated. Click nodes for details, and hover to inspect connections.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setScale(1);
                setTranslate({ x: 0, y: 0 });
              }}
              className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-white"
            >
              Reset View
            </button>
            <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {nodes.length} nodes / {edges.length} edges
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          {domainStats.slice(0, 6).map((stat, index) => (
            <div key={stat.domain} className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{stat.domain}</span>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: domainPalette[stat.domain] || fallbackPalette[index % fallbackPalette.length] }}
                />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-ink">{stat.peopleCount}</p>
                  <p className="text-xs text-slate-500">students</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-700">{stat.connectionCount}</p>
                  <p className="text-xs text-slate-500">links</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[420px] w-full cursor-move"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
              {[...centers.entries()].map(([domain, center], index) => (
                <g key={domain}>
                  <circle
                    cx={center.x}
                    cy={center.y}
                    r="58"
                    fill={domainPalette[domain] || fallbackPalette[index % fallbackPalette.length]}
                    fillOpacity="0.08"
                    stroke={domainPalette[domain] || fallbackPalette[index % fallbackPalette.length]}
                    strokeOpacity="0.18"
                    strokeWidth="1"
                  />
                  <text
                    x={center.x}
                    y={center.y - 68}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#334155"
                    fontWeight="700"
                  >
                    {domain}
                  </text>
                </g>
              ))}

              {edges.map((edge) => {
                const source = positions[edge.source];
                const target = positions[edge.target];

                if (!source || !target) {
                  return null;
                }

                const isHighlighted =
                  hoveredNode && (edge.source === hoveredNode.id || edge.target === hoveredNode.id);

                return (
                  <line
                    key={`${edge.source}-${edge.target}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted ? "#2563eb" : "#94a3b8"}
                    strokeOpacity={isHighlighted ? Math.max(edge.weight, 0.8) : Math.max(edge.weight, 0.18)}
                    strokeWidth={isHighlighted ? 2 + edge.weight * 4 : 1 + edge.weight * 3}
                    className="transition-all duration-200"
                  />
                );
              })}

              {positionedNodes.map((node, index) => {
                const isHovered = hoveredNode?.id === node.id;
                const isSelected = selectedNode?.id === node.id;
                const fillColor = domainPalette[node.domain] || fallbackPalette[index % fallbackPalette.length];

                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered || isSelected ? 28 : 24}
                      fill={fillColor}
                      fillOpacity="0.94"
                      stroke={node.isCurrentUser ? "#0f172a" : isSelected ? "#1e293b" : "transparent"}
                      strokeWidth={node.isCurrentUser || isSelected ? "3" : "2"}
                      className="cursor-pointer transition-all duration-200 hover:fill-opacity-100"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      fontSize={isHovered || isSelected ? "12" : "11"}
                      fill="white"
                      fontWeight="700"
                      className="pointer-events-none select-none"
                    >
                      {(node.name || "User").split(" ")[0]}
                    </text>
                    {isHovered && (
                      <text
                        x={node.x}
                        y={node.y + 40}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#475569"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {node.domain}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {hoveredNode && (
          <div className="mt-3 rounded-lg bg-slate-50 p-2 text-sm">
            <span className="font-semibold text-slate-700">{hoveredNode.name}</span>
            <span className="ml-2 text-slate-500">({hoveredNode.domain})</span>
          </div>
        )}
      </div>

      <UserInfoModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </>
  );
};

export default GraphClusterPreview;
