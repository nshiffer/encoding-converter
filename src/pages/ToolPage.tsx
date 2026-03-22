import { useParams, Link as RouterLink } from 'react-router-dom'
import { Box, Text, Flex, Container, Link, Badge, SimpleGrid } from '@chakra-ui/react'
import { LuArrowLeft, LuLock, LuArrowRight } from 'react-icons/lu'
import { Converter } from '../components/Converter'
import { converters } from '../utils/converterConfigs'
import { SEO } from '../components/SEO'

const CATEGORY_LABELS: Record<string, string> = {
  encoding: 'Encoding',
  format: 'Formatting',
  crypto: 'Crypto & Hash',
  devtools: 'Dev Tools',
  misc: 'Generators & Validators',
}

export const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const tool = converters.find((c) => c.slug === slug)

  if (!tool) {
    return (
      <Container maxW="3xl" py={16} textAlign="center">
        <Text fontSize="4xl" fontWeight="bold" mb={4}>Tool Not Found</Text>
        <Text color="fg.muted" mb={6}>The tool you're looking for doesn't exist.</Text>
        <Link asChild>
          <RouterLink to="/">
            <Flex align="center" gap={2} justify="center" color="purple.500">
              <LuArrowLeft size={16} />
              Back to all tools
            </Flex>
          </RouterLink>
        </Link>
      </Container>
    )
  }

  const related = converters
    .filter((c) => c.category === tool.category && c.slug !== tool.slug)
    .slice(0, 6)

  return (
    <Box w="full">
      <SEO
        title={`${tool.name} - Free Online Tool`}
        description={tool.longDescription || tool.description}
        canonical={`https://converter.shwrk.com/tools/${tool.slug}`}
        keywords={tool.keywords}
      />

      {/* Breadcrumb */}
      <Flex align="center" gap={2} mb={6} fontSize="sm" color="fg.muted">
        <Link asChild _hover={{ color: 'purple.500' }}>
          <RouterLink to="/">Home</RouterLink>
        </Link>
        <Text>/</Text>
        <Link asChild _hover={{ color: 'purple.500' }}>
          <RouterLink to={`/?category=${tool.category}`}>{CATEGORY_LABELS[tool.category] || tool.category}</RouterLink>
        </Link>
        <Text>/</Text>
        <Text color="fg" fontWeight="medium">{tool.name}</Text>
      </Flex>

      {/* Page header */}
      <Box mb={6}>
        <Flex align="center" gap={3} mb={2}>
          <Text as="h1" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="extrabold" letterSpacing="tight">
            {tool.name}
          </Text>
          <Badge colorPalette="purple" variant="subtle" fontSize="xs">
            {CATEGORY_LABELS[tool.category] || tool.category}
          </Badge>
        </Flex>
        {tool.longDescription && (
          <Text fontSize="md" color="fg.muted" maxW="3xl" lineHeight="tall">
            {tool.longDescription}
          </Text>
        )}
        <Flex align="center" gap={1.5} mt={3} fontSize="xs" color="fg.muted">
          <LuLock size={12} />
          <Text>All processing happens locally in your browser</Text>
        </Flex>
      </Box>

      {/* The tool itself */}
      <Box maxW="3xl" mb={12}>
        <Converter converter={tool} compact />
      </Box>

      {/* How to use section */}
      <Box mb={12} maxW="3xl">
        <Text as="h2" fontSize="xl" fontWeight="bold" mb={4}>
          How to Use {tool.name}
        </Text>
        <Box as="ol" pl={5} fontSize="sm" color="fg.muted" lineHeight="tall">
          {tool.encode && tool.decode ? (
            <>
              <li>Enter your text or data in the input field above.</li>
              <li>Click <strong>Encode</strong> to convert your input, or <strong>Decode</strong> to reverse the conversion.</li>
              <li>Copy the result using the <strong>Copy</strong> button.</li>
            </>
          ) : tool.encode ? (
            <>
              <li>Enter your text or data in the input field above.</li>
              <li>Click <strong>Encode</strong> to process your input.</li>
              <li>Copy the result using the <strong>Copy</strong> button.</li>
            </>
          ) : tool.validate ? (
            <>
              <li>Paste your data in the input field above.</li>
              <li>Click <strong>Format / Validate</strong> to check and format your input.</li>
              <li>Copy the formatted result using the <strong>Copy</strong> button.</li>
            </>
          ) : (
            <>
              <li>Enter your text in the input field above.</li>
              <li>Click the action button to process.</li>
              <li>Copy the result using the <strong>Copy</strong> button.</li>
            </>
          )}
        </Box>
      </Box>

      {/* Keywords */}
      {tool.keywords && tool.keywords.length > 0 && (
        <Box mb={12}>
          <Text as="h2" fontSize="xl" fontWeight="bold" mb={4}>
            Related Topics
          </Text>
          <Flex wrap="wrap" gap={2}>
            {tool.keywords.map((kw) => (
              <Badge key={kw} variant="outline" colorPalette="gray" fontSize="xs" px={3} py={1}>
                {kw}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}

      {/* Related tools */}
      {related.length > 0 && (
        <Box mb={8}>
          <Text as="h2" fontSize="xl" fontWeight="bold" mb={4}>
            Related {CATEGORY_LABELS[tool.category] || tool.category} Tools
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={3}>
            {related.map((r) => (
              <Link
                key={r.slug}
                asChild
                _hover={{ textDecoration: 'none' }}
              >
                <RouterLink to={`/tools/${r.slug}`}>
                  <Box
                    bg="bg"
                    borderWidth="1px"
                    borderColor="border"
                    rounded="lg"
                    px={4}
                    py={3}
                    transition="all 0.2s"
                    _hover={{ shadow: 'md', transform: 'translateY(-1px)', borderColor: 'purple.500' }}
                  >
                    <Flex align="center" justify="space-between">
                      <Text fontWeight="semibold" fontSize="sm">{r.name}</Text>
                      <LuArrowRight size={14} color="var(--chakra-colors-purple-500)" />
                    </Flex>
                    <Text fontSize="xs" color="fg.muted" mt={1} lineClamp={2}>{r.description}</Text>
                  </Box>
                </RouterLink>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Back link */}
      <Link asChild>
        <RouterLink to="/">
          <Flex align="center" gap={2} color="purple.500" fontSize="sm" fontWeight="medium">
            <LuArrowLeft size={14} />
            Back to all tools
          </Flex>
        </RouterLink>
      </Link>
    </Box>
  )
}
