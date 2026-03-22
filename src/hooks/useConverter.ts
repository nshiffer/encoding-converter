import { useState, useCallback } from 'react';

export type ConversionFunction = (input: string) => string | Promise<string> | Record<string, unknown>;

export type ConverterType = {
  name: string;
  slug: string;
  encode?: ConversionFunction;
  decode?: ConversionFunction;
  validate?: ConversionFunction;
  description: string;
  longDescription?: string;
  keywords?: string[];
  category: string;
};

export const useConverter = (converterType: ConverterType) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setError(null);
    setIsValid(null);
  }, []);

  const processResult = useCallback((result: unknown) => {
    if (typeof result === 'string') {
      setOutput(result);
    } else if (result && typeof result === 'object') {
      setOutput(JSON.stringify(result, null, 2));
    }
    setError(null);
  }, []);

  const handleEncode = useCallback(async () => {
    if (!converterType.encode) return;
    try {
      const result = converterType.encode(input);
      // Handle both sync and async (Promise) results
      processResult(result instanceof Promise ? await result : result);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  }, [input, converterType, processResult]);

  const handleDecode = useCallback(async () => {
    if (!converterType.decode) return;
    try {
      const result = converterType.decode(input);
      processResult(result instanceof Promise ? await result : result);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  }, [input, converterType, processResult]);

  const handleValidate = useCallback(async () => {
    if (!converterType.validate) return;
    try {
      const result = converterType.validate(input);
      const resolved = result instanceof Promise ? await result : result;

      if (typeof resolved === 'object' && resolved !== null && 'valid' in resolved) {
        const validation = resolved as { valid: boolean; formatted?: string; error?: string };
        setIsValid(validation.valid);
        if (validation.valid && validation.formatted) {
          setOutput(validation.formatted);
        } else if (!validation.valid && validation.error) {
          setError(validation.error);
          setOutput('');
        }
      } else {
        processResult(resolved);
      }
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
      setIsValid(false);
    }
  }, [input, converterType, processResult]);

  const handleClearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
  }, []);

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      setError(`Copy failed: ${(err as Error).message}`);
    }
  }, [output]);

  return {
    input, output, error, isValid,
    handleInputChange, handleEncode, handleDecode, handleValidate, handleClearAll, handleCopyToClipboard,
  };
};
