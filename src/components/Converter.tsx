import { useState } from 'react'
import {
  Box, Flex, Text, Textarea, Button, Badge, Alert, Separator,
} from '@chakra-ui/react'
import { LuCopy, LuCheck, LuChevronDown, LuChevronUp } from 'react-icons/lu'
import type { ConverterType } from '../hooks/useConverter'
import { useConverter } from '../hooks/useConverter'

interface ConverterProps {
  converter: ConverterType
}

const CATEGORY_COLORS: Record<string, string> = {
  encoding: 'purple',
  format: 'teal',
  crypto: 'orange',
  devtools: 'blue',
  misc: 'yellow',
}

export const Converter: React.FC<ConverterProps> = ({ converter }) => {
  const {
    input, output, error, isValid,
    handleInputChange, handleEncode, handleDecode, handleValidate, handleClearAll, handleCopyToClipboard,
  } = useConverter(converter)

  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const copyOutput = async () => {
    await handleCopyToClipboard()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colorPalette = CATEGORY_COLORS[converter.category] ?? 'gray'

  return (
    <Box
      bg="bg"
      borderWidth="1px"
      borderColor="border"
      rounded="xl"
      p={5}
      transition="all 0.2s"
      _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
    >
      {/* Header */}
      <Flex align="flex-start" justify="space-between" gap={2} mb={2}>
        <Box minW={0}>
          <Text as="h2" fontSize="lg" fontWeight="bold" lineHeight="tight">
            {converter.name}
          </Text>
          <Text fontSize="xs" color="fg.muted" mt={1} lineClamp={2}>
            {converter.description}
          </Text>
        </Box>
        <Badge colorPalette={colorPalette} variant="subtle" fontSize="xs" flexShrink={0}>
          {converter.category}
        </Badge>
      </Flex>

      <Separator my={3} />

      {/* Input */}
      <Box mb={3}>
        <Flex align="center" justify="space-between" mb={1}>
          <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide" color="fg.muted">
            Input
          </Text>
          {input && (
            <Button size="xs" variant="ghost" onClick={handleClearAll} color="fg.muted">
              Clear
            </Button>
          )}
        </Flex>
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={getPlaceholder(converter)}
          fontFamily="mono"
          fontSize="sm"
          h="24"
          resize="vertical"
        />
      </Box>

      {/* Action Buttons */}
      <Flex gap={2} mb={3} wrap="wrap">
        {converter.encode && (
          <Button
            flex="1"
            minW="80px"
            size="sm"
            colorPalette="purple"
            onClick={handleEncode}
            disabled={!input}
          >
            {converter.validate ? 'Convert' : 'Encode'}
          </Button>
        )}
        {converter.decode && (
          <Button
            flex="1"
            minW="80px"
            size="sm"
            colorPalette="teal"
            onClick={handleDecode}
            disabled={!input}
          >
            Decode
          </Button>
        )}
        {converter.validate && (
          <Button
            flex="1"
            minW="80px"
            size="sm"
            colorPalette="blue"
            variant="outline"
            onClick={handleValidate}
            disabled={!input}
          >
            {converter.encode || converter.decode ? 'Validate' : 'Format / Validate'}
          </Button>
        )}
      </Flex>

      {/* Error */}
      {error && (
        <Alert.Root status="error" mb={3} rounded="md" size="sm">
          <Alert.Indicator />
          <Alert.Content>
            <Text fontSize="sm" wordBreak="break-all">{error}</Text>
          </Alert.Content>
        </Alert.Root>
      )}

      {/* Success */}
      {isValid === true && !error && (
        <Alert.Root status="success" mb={3} rounded="md" size="sm">
          <Alert.Indicator />
          <Alert.Content>
            <Text fontSize="sm">Valid!</Text>
          </Alert.Content>
        </Alert.Root>
      )}

      {/* Output */}
      {output && (
        <Box>
          <Flex align="center" justify="space-between" mb={1}>
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide" color="fg.muted">
              Output
            </Text>
            <Flex gap={1}>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <><LuChevronUp size={12} /> Collapse</> : <><LuChevronDown size={12} /> Expand</>}
              </Button>
              <Button
                size="xs"
                variant={copied ? 'solid' : 'outline'}
                colorPalette={copied ? 'green' : 'purple'}
                onClick={copyOutput}
              >
                {copied ? <><LuCheck size={12} /> Copied!</> : <><LuCopy size={12} /> Copy</>}
              </Button>
            </Flex>
          </Flex>
          <Textarea
            value={output}
            readOnly
            fontFamily="mono"
            fontSize="sm"
            h={isExpanded ? '64' : '24'}
            resize="vertical"
            bg="bg.subtle"
          />
        </Box>
      )}
    </Box>
  )
}

function getPlaceholder(converter: ConverterType): string {
  const name = converter.name.toLowerCase()
  if (name.includes('timestamp')) return 'Date string or Unix timestamp...'
  if (name.includes('color')) return '#ff0000 or rgb(255,0,0) or hsl(0,100%,50%)'
  if (name.includes('regex')) return '/pattern/flags\n---\ntest string'
  if (name.includes('cron')) return '*/5 * * * *'
  if (name.includes('url parser')) return 'https://example.com/path?key=value'
  if (name.includes('lorem')) return 'Number of paragraphs (1-50)'
  if (name.includes('number base')) return '255 or 0xFF or 0b11111111'
  if (name.includes('uuid')) return 'Click Encode to generate'
  if (name.includes('json') && name.includes('yaml')) return '{"key": "value"}'
  return 'Enter text to convert...'
}
