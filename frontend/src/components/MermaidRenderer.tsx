import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  id: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, id }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (elementRef.current) {
      try {
        mermaid.render(`mermaid-${id}`, chart).then((result) => {
          if (elementRef.current) {
            elementRef.current.innerHTML = result.svg;
          }
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `<div class="text-red-500 text-sm p-4 border border-red-300 rounded">
            Mermaid 图表渲染错误: ${error}
          </div>`;
        }
      }
    }
  }, [chart, id]);

  return <div ref={elementRef} className="mermaid-container my-4" />;
};

export default MermaidRenderer;
