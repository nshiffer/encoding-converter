import { useState } from 'react';
import type { ConverterType } from '../hooks/useConverter';
import { useConverter } from '../hooks/useConverter';

interface ConverterProps {
  converter: ConverterType;
}

// Icon mapping based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'encoding':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      );
    case 'format':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case 'crypto':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
  }
};

export const Converter: React.FC<ConverterProps> = ({ converter }) => {
  const {
    input,
    output,
    error,
    isValid,
    handleInputChange,
    handleEncode,
    handleDecode,
    handleValidate,
    handleClearAll,
    handleCopyToClipboard,
  } = useConverter(converter);

  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyOutput = async () => {
    await handleCopyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 w-full">
      <div className="card-body p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="badge badge-sm badge-primary">{converter.category}</div>
          <span className="text-xs text-base-content/50">{getCategoryIcon(converter.category)}</span>
        </div>
        
        <h2 className="card-title text-xl font-bold">{converter.name}</h2>
        <p className="text-sm text-base-content/70 mb-3">{converter.description}</p>
        
        <div className="divider my-1"></div>
        
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium">Input</span>
            {input && (
              <button 
                className="btn btn-ghost btn-xs"
                onClick={handleClearAll}
                aria-label="Clear input and output"
              >
                Clear
              </button>
            )}
          </label>
          <textarea 
            className="textarea textarea-bordered h-24 min-h-24 font-mono text-sm focus:textarea-primary"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter text to convert..."
          />
        </div>
        
        <div className="flex flex-wrap gap-2 my-3">
          {converter.encode && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleEncode}
              disabled={!input}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Encode
            </button>
          )}
          
          {converter.decode && (
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleDecode}
              disabled={!input}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Decode
            </button>
          )}
          
          {converter.validate && (
            <button 
              className="btn btn-accent btn-sm" 
              onClick={handleValidate}
              disabled={!input}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Validate
            </button>
          )}
        </div>
        
        {error && (
          <div className="alert alert-error mt-2 py-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {isValid === true && (
          <div className="alert alert-success mt-2 py-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Valid format!</span>
          </div>
        )}
        
        {output && (
          <div className="form-control mt-2">
            <label className="label py-1">
              <span className="label-text font-medium">Output</span>
              <div className="flex gap-1">
                <button 
                  className="btn btn-ghost btn-xs" 
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
                <button 
                  className={`btn ${copied ? 'btn-success' : 'btn-ghost'} btn-xs`}
                  onClick={copyOutput}
                >
                  {copied ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  }
                </button>
              </div>
            </label>
            <textarea 
              className={`textarea textarea-bordered font-mono text-sm bg-base-200 ${isExpanded ? 'h-64' : 'h-24'}`}
              value={output}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}; 