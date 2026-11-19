import React from 'react';

interface ChatMarkdownProps {
  text: string;
  isUser?: boolean;
}

function renderInline(line: string, isUser: boolean): React.ReactNode[] {
  const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong
          key={idx}
          className={
            isUser
              ? 'font-bold text-white'
              : 'font-bold text-emerald-700 dark:text-emerald-300'
          }
        >
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={idx}
          className={
            isUser
              ? 'px-1 py-0.5 rounded bg-white/15 font-mono text-[11px]'
              : 'px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-emerald-700 dark:text-emerald-300'
          }
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={idx} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

export const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ text, isUser = false }) => {
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1.5 leading-relaxed break-words">
      {blocks.map((block, blockIdx) => {
        if (block.startsWith('```') && block.endsWith('```')) {
          const codeContent = block.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/```$/, '').trimEnd();
          return (
            <pre
              key={blockIdx}
              className="p-2.5 rounded-xl bg-slate-950 text-emerald-200 font-mono text-[11px] overflow-x-auto border border-slate-800 my-1.5"
            >
              <code>{codeContent}</code>
            </pre>
          );
        }

        const lines = block.split('\n');
        return (
          <React.Fragment key={blockIdx}>
            {lines.map((rawLine, lineIdx) => {
              const trimmed = rawLine.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1" />;
              }

              // Headings
              const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
              if (headingMatch) {
                return (
                  <div
                    key={lineIdx}
                    className={`font-extrabold pt-1 ${
                      isUser ? 'text-white text-xs' : 'text-slate-900 dark:text-white text-[13px]'
                    }`}
                  >
                    {renderInline(headingMatch[2], isUser)}
                  </div>
                );
              }

              // Bullet points
              const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
              if (bulletMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-1">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        isUser ? 'bg-emerald-200' : 'bg-emerald-500'
                      }`}
                    />
                    <span className="flex-1">{renderInline(bulletMatch[1], isUser)}</span>
                  </div>
                );
              }

              // Numbered lists
              const numMatch = trimmed.match(/^(\d+\.)\s+(.+)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-0.5">
                    <span
                      className={`font-bold shrink-0 ${
                        isUser ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {numMatch[1]}
                    </span>
                    <span className="flex-1">{renderInline(numMatch[2], isUser)}</span>
                  </div>
                );
              }

              return <p key={lineIdx}>{renderInline(trimmed, isUser)}</p>;
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
