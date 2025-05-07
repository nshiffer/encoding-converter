import { useState, useCallback } from 'react';

export type ConversionFunction = (input: string) => string | { [key: string]: any };

export type ConverterType = {
  name: string;
  encode?: ConversionFunction;
  decode?: ConversionFunction;
  validate?: ConversionFunction;
  description: string;
  category: string;
};

export const useConverter = (converterType: ConverterType) => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setError(null);
  }, []);

  const handleEncode = useCallback(() => {
    if (!converterType.encode) {
      setError('Encoding not supported for this converter');
      return;
    }

    try {
      const result = converterType.encode(input);
      if (typeof result === 'string') {
        setOutput(result);
      } else {
        setOutput(JSON.stringify(result, null, 2));
      }
      setError(null);
    } catch (err) {
      setError(`Encoding error: ${(err as Error).message}`);
      setOutput('');
    }
  }, [input, converterType.encode]);

  const handleDecode = useCallback(() => {
    if (!converterType.decode) {
      setError('Decoding not supported for this converter');
      return;
    }

    try {
      const result = converterType.decode(input);
      if (typeof result === 'string') {
        setOutput(result);
      } else {
        setOutput(JSON.stringify(result, null, 2));
      }
      setError(null);
    } catch (err) {
      setError(`Decoding error: ${(err as Error).message}`);
      setOutput('');
    }
  }, [input, converterType.decode]);

  const handleValidate = useCallback(() => {
    if (!converterType.validate) {
      setError('Validation not supported for this converter');
      return;
    }

    try {
      const result = converterType.validate(input);
      if (typeof result === 'object' && 'valid' in result) {
        setIsValid(result.valid);
        if (result.valid && result.formatted) {
          setOutput(result.formatted);
        } else if (!result.valid && result.error) {
          setError(result.error);
          setOutput('');
        }
      } else {
        setOutput(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError(`Validation error: ${(err as Error).message}`);
      setOutput('');
      setIsValid(false);
    }
  }, [input, converterType.validate]);

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
      setError(`Failed to copy to clipboard: ${(err as Error).message}`);
    }
  }, [output]);

  return {
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
  };
}; 