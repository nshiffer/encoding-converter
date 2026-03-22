import { useState } from 'react';
import type { ConverterType } from '../hooks/useConverter';
import { useConverter } from '../hooks/useConverter';

interface ConverterProps {
  converter: ConverterType;
}

const CATEGORY_COLORS: Record<string, string> = {
  encoding: 'badge-primary',
  format: 'badge-secondary',
  crypto: 'badge-accent',
  devtools: 'badge-info',
  misc: 'badge-warning',
};

export const Converter: React.FC<ConverterProps> = ({ converter }) => {
  const {
    input, output, error, isValid,
    handleInputChange, handleEncode, handleDecode, handleValidate, handleClearAll, handleCopyToClipboard,
  } = useConverter(converter);

  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyOutput = async () => {
    await handleCopyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeClass = CATEGORY_COLORS[converter.category] ?? 'badge-ghost';

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg border border-base-200 transition-shadow duration-200">
      <div className="card-body p-5 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="card-title text-lg font-bold leading-tight">{converter.name}</h2>
            <p className="text-xs text-base-content/50 mt-1 line-clamp-2">{converter.description}</p>
          </div>
          <span className={`badge ${badgeClass} badge-sm shrink-0`}>{converter.category}</span>
        </div>

        <div className="divider my-0" />

        {/* Input */}
        <div className="form-control">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Input</label>
            {input && (
              <button className="btn btn-ghost btn-xs text-base-content/40 hover:text-base-content" onClick={handleClearAll}>
                Clear
              </button>
            )}
          </div>
          <textarea
            className="textarea textarea-bordered h-24 font-mono text-sm resize-y focus:textarea-primary"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={getPlaceholder(converter)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {converter.encode && (
            <button className="btn btn-primary btn-sm flex-1 min-w-[80px]" onClick={handleEncode} disabled={!input}>
              {converter.validate ? 'Convert' : 'Encode'}
            </button>
          )}
          {converter.decode && (
            <button className="btn btn-secondary btn-sm flex-1 min-w-[80px]" onClick={handleDecode} disabled={!input}>
              Decode
            </button>
          )}
          {converter.validate && (
            <button className="btn btn-accent btn-sm flex-1 min-w-[80px]" onClick={handleValidate} disabled={!input}>
              {converter.encode || converter.decode ? 'Validate' : 'Format / Validate'}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error py-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="break-all">{error}</span>
          </div>
        )}

        {/* Success */}
        {isValid === true && !error && (
          <div className="alert alert-success py-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Valid!</span>
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="form-control">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Output</label>
              <div className="flex gap-1">
                <button className="btn btn-ghost btn-xs" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
                <button className={`btn btn-xs ${copied ? 'btn-success' : 'btn-primary btn-outline'}`} onClick={copyOutput}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <textarea
              className={`textarea textarea-bordered font-mono text-sm bg-base-200/50 resize-y ${isExpanded ? 'h-64' : 'h-24'}`}
              value={output}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};

function getPlaceholder(converter: ConverterType): string {
  const name = converter.name.toLowerCase();
  if (name.includes('timestamp')) return 'Date string or Unix timestamp...';
  if (name.includes('color')) return '#ff0000 or rgb(255,0,0) or hsl(0,100%,50%)';
  if (name.includes('regex')) return '/pattern/flags\n---\ntest string';
  if (name.includes('cron')) return '*/5 * * * *';
  if (name.includes('url parser')) return 'https://example.com/path?key=value';
  if (name.includes('lorem')) return 'Number of paragraphs (1-50)';
  if (name.includes('number base')) return '255 or 0xFF or 0b11111111';
  if (name.includes('uuid')) return 'Click Encode to generate';
  if (name.includes('json') && name.includes('yaml')) return '{"key": "value"}';
  return 'Enter text to convert...';
}
