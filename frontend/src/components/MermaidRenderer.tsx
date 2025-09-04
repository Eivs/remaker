import mermaid from 'mermaid';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface MermaidRendererProps {
  chart: string;
  id: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, id }) => {
  const { t } = useI18n();
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
            ${t('mermaid.renderError')}${error}
          </div>`;
        }
      }
    }
  }, [chart, id]);

  return <div ref={elementRef} className="mermaid-container my-4" />;
};

export default MermaidRenderer;
