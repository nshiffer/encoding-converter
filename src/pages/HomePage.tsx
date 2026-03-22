import { useState, useMemo } from 'react'
import {
  Box, Flex, Text, Image, Input, Button, SimpleGrid, Badge,
} from '@chakra-ui/react'
import { LuSearch, LuX, LuLock } from 'react-icons/lu'
import { Converter } from '../components/Converter'
import { converters } from '../utils/converterConfigs'
import { SEO } from '../components/SEO'

const CATEGORIES = {
  all: 'All Tools',
  encoding: 'Encoding',
  format: 'Formatting',
  crypto: 'Crypto & Hash',
  devtools: 'Dev Tools',
  misc: 'Generators & Validators',
} as const

type CategoryKey = keyof typeof CATEGORIES

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: converters.length }
    for (const c of converters) {
      counts[c.category] = (counts[c.category] || 0) + 1
    }
    return counts
  }, [])

  const filteredConverters = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return converters
      .filter(
        (c) =>
          (activeCategory === 'all' || c.category === activeCategory) &&
          (term === '' ||
            c.name.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term) ||
            c.category.toLowerCase().includes(term)),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [searchTerm, activeCategory])

  const currentCategoryName = CATEGORIES[activeCategory]

  return (
    <Box w="full">
      <SEO category={currentCategoryName} title={searchTerm ? `Search: ${searchTerm}` : undefined} />

      {/* Hero */}
      <Box textAlign="center" mb={8}>
        <Flex justify="center" align="center" gap={3} mb={3}>
          <Image src="/purple_logo.png" alt="" boxSize="10" objectFit="contain" aria-hidden="true" />
          <Text as="h1" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" letterSpacing="tight">
            converter<Text as="span" opacity={0.5}>.shwrk</Text>
          </Text>
        </Flex>
        <Text fontSize={{ base: 'md', sm: 'lg' }} color="fg.muted" maxW="xl" mx="auto">
          Fast, private developer tools for encoding, decoding, formatting, and more
        </Text>
        <Flex
          display="inline-flex"
          align="center"
          gap={2}
          mt={4}
          bg="colorPalette.subtle"
          color="colorPalette.fg"
          colorPalette="purple"
          rounded="full"
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="medium"
        >
          <LuLock size={14} />
          100% client-side &mdash; your data never leaves your browser
        </Flex>
      </Box>

      {/* Search */}
      <Box mb={6} maxW="lg" mx="auto">
        <Box position="relative">
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1} color="fg.muted" pointerEvents="none">
            <LuSearch size={18} />
          </Box>
          <Input
            pl={10}
            pr={searchTerm ? 10 : 4}
            placeholder="Search 30+ tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            variant="outline"
          />
          {searchTerm && (
            <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" zIndex={1}>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                rounded="full"
              >
                <LuX size={14} />
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Category Tabs */}
      <Flex wrap="wrap" gap={2} justify="center" mb={8}>
        {(Object.entries(CATEGORIES) as [CategoryKey, string][]).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={activeCategory === key ? 'solid' : 'outline'}
            colorPalette={activeCategory === key ? 'purple' : 'gray'}
            onClick={() => setActiveCategory(key)}
            aria-pressed={activeCategory === key}
          >
            {label}
            <Badge ml={1} variant="subtle" fontSize="xs" colorPalette={activeCategory === key ? 'purple' : 'gray'}>
              {categoryCounts[key] || 0}
            </Badge>
          </Button>
        ))}
      </Flex>

      {/* Tools Grid */}
      {filteredConverters.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>
          {filteredConverters.map((converter) => (
            <Converter key={converter.name} converter={converter} />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={16}>
          <Box bg="bg.subtle" rounded="2xl" p={8} maxW="md" mx="auto">
            <Box mb={4} color="fg.muted">
              <LuSearch size={48} style={{ margin: '0 auto' }} />
            </Box>
            <Text fontSize="lg" fontWeight="medium" mb={1}>No tools found</Text>
            <Text color="fg.muted" fontSize="sm" mb={4}>
              No results for &ldquo;{searchTerm}&rdquo;{activeCategory !== 'all' ? ` in ${CATEGORIES[activeCategory]}` : ''}
            </Text>
            <Button
              size="sm"
              colorPalette="purple"
              onClick={() => { setSearchTerm(''); setActiveCategory('all') }}
            >
              Show All Tools
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
