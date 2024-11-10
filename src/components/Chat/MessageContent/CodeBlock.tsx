import React, { useMemo } from 'react';
import { Download, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const fileExtension = useMemo(() => {
    const languagePatterns = {
      javascript: /\b(const|let|var|function|=>|import|export)\b/,
      typescript: /\b(interface|type|namespace|enum)\b/,
      python: /\b(def|class|import|from|if __name__ == ['"]__main__['"])\b/,
      java: /\b(public|private|class|void|static)\b/,
      html: /<\/?[a-z][\s\S]*>/i,
      css: /[{;][\s]*[a-z-]+\s*:/,
      sql: /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/i,
      php: /(<\?php|\$[a-zA-Z_])/,
      ruby: /\b(def|class|require|include|attr_)\b/,
      rust: /\b(fn|let|mut|struct|impl)\b/,
      go: /\b(func|package|import|type|struct)\b/,
      swift: /\b(func|var|let|class|struct|import)\b/,
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(code)) {
        return lang;
      }
    }
    return 'text';
  }, [code]);

  const languageInfo = {
    javascript: { ext: '.js', color: '#F7DF1E' },
    typescript: { ext: '.ts', color: '#3178C6' },
    python: { ext: '.py', color: '#3776AB' },
    java: { ext: '.java', color: '#B07219' },
    html: { ext: '.html', color: '#E34F26' },
    css: { ext: '.css', color: '#563D7C' },
    sql: { ext: '.sql', color: '#CC2927' },
    php: { ext: '.php', color: '#777BB4' },
    ruby: { ext: '.rb', color: '#CC342D' },
    rust: { ext: '.rs', color: '#DEA584' },
    go: { ext: '.go', color: '#00ADD8' },
    swift: { ext: '.swift', color: '#F05138' },
    text: { ext: '.txt', color: '#9CA3AF' },
  };

  const { ext, color } = languageInfo[fileExtension as keyof typeof languageInfo];

  const lines = code.split('\n');
  const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);
  const maxLineNumberWidth = Math.max(...lineNumbers.map(n => n.toString().length));

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#323233] border-b border-[#424242]">
        <span className="text-sm text-gray-400">code{ext}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-[#2A2A2A]">
                <td className="py-0.5 pl-4 pr-4 text-right text-gray-500 select-none border-r border-[#424242] bg-[#252526] min-w-[3ch]">
                  {index + 1}
                </td>
                <td className="py-0.5 pl-4 pr-4 font-mono text-[#D4D4D4] whitespace-pre">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[#323233] border-t border-[#424242] flex items-center justify-between">
        <span className="text-xs text-gray-400">{lines.length} lines</span>
        <span className="text-xs font-medium" style={{ color }}>
          {fileExtension.toUpperCase()}
        </span>
      </div>
    </div>
  );
};