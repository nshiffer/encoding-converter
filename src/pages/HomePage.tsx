import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Text, Input, Button, SimpleGrid, Badge, Link,
} from '@chakra-ui/react'
import { LuSearch, LuX, LuLock, LuArrowRight } from 'react-icons/lu'
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

const CATEGORY_COLORS: Record<string, string> = {
  encoding: 'purple',
  format: 'teal',
  crypto: 'orange',
  devtools: 'blue',
  misc: 'yellow',
}

const CATEGORY_ICONS: Record<string, string> = {
  encoding: '{ }',
  format: '< >',
  crypto: '#',
  devtools: '/>',
  misc: '*',
}

export const HomePage = () => {
  const [searchParams] = useSearchParams()
  const initialCategory = (searchParams.get('category') as CategoryKey) || 'all'

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(
    initialCategory in CATEGORIES ? initialCategory : 'all'
  )

  useEffect(() => {
    const cat = searchParams.get('category') as CategoryKey
    if (cat && cat in CATEGORIES) {
      setActiveCategory(cat)
    }
  }, [searchParams])

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
      <Box textAlign="center" mb={10}>
        <Text as="h1" fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }} fontWeight="extrabold" letterSpacing="tight" mb={3}>
          Developer Tools
        </Text>
        <Text fontSize={{ base: 'md', sm: 'lg' }} color="fg.muted" maxW="lg" mx="auto" mb={4}>
          Encode, decode, format, hash, and validate — fast and private
        </Text>
        <Flex
          display="inline-flex"
          align="center"
          gap={2}
          bg="colorPalette.subtle"
          color="colorPalette.fg"
          colorPalette="purple"
          rounded="full"
          px={4}
          py={1.5}
          fontSize="sm"
          fontWeight="medium"
        >
          <LuLock size={14} />
          100% client-side — your data never leaves your browser
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
            placeholder={`Search ${converters.length} tools...`}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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

      {/* Tools Grid — Cards only, no inline converters */}
      {filteredConverters.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={4}>
          {filteredConverters.map((converter) => {
            const colorPalette = CATEGORY_COLORS[converter.category] ?? 'gray'
            const icon = CATEGORY_ICONS[converter.category] ?? '·'
            return (
              <Link
                key={converter.slug}
                asChild
                _hover={{ textDecoration: 'none' }}
              >
                <RouterLink to={`/tools/${converter.slug}`}>
                  <Box
                    bg="bg"
                    borderWidth="1px"
                    borderColor="border"
                    rounded="xl"
                    p={5}
                    h="full"
                    transition="all 0.2s"
                    _hover={{ shadow: 'lg', transform: 'translateY(-2px)', borderColor: 'purple.500' }}
                    cursor="pointer"
                    position="relative"
                  >
                    <Flex align="center" justify="space-between" mb={2}>
                      <Text
                        fontFamily="mono"
                        fontSize="xs"
                        color={`${colorPalette}.fg`}
                        bg={`${colorPalette}.subtle`}
                        px={2}
                        py={0.5}
                        rounded="md"
                        fontWeight="bold"
                      >
                        {icon}
                      </Text>
                      <Badge colorPalette={colorPalette} variant="subtle" fontSize="2xs">
                        {converter.category}
                      </Badge>
                    </Flex>
                    <Text fontWeight="bold" fontSize="md" mb={1}>
                      {converter.name}
                    </Text>
                    <Text fontSize="sm" color="fg.muted" lineClamp={2} lineHeight="short">
                      {converter.description}
                    </Text>
                    <Flex
                      align="center"
                      gap={1}
                      mt={3}
                      fontSize="xs"
                      fontWeight="medium"
                      color="purple.500"
                    >
                      Use tool <LuArrowRight size={12} />
                    </Flex>
                  </Box>
                </RouterLink>
              </Link>
            )
          })}
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

      {/* SEO: Tools Directory */}
      <Box mt={16} borderTopWidth="1px" borderColor="border" pt={8}>
        <Text as="h2" fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
          All Developer Tools
        </Text>
        {(Object.entries(CATEGORIES) as [CategoryKey, string][])
          .filter(([key]) => key !== 'all')
          .map(([key, label]) => {
            const tools = converters.filter((c) => c.category === key)
            return (
              <Box key={key} mb={6}>
                <Text as="h3" fontSize="md" fontWeight="semibold" mb={2} color="fg.muted">
                  {label}
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {tools.map((t) => (
                    <Link
                      key={t.slug}
                      asChild
                      fontSize="sm"
                      px={3}
                      py={1}
                      bg="bg.subtle"
                      rounded="md"
                      _hover={{ bg: 'purple.subtle', color: 'purple.fg' }}
                    >
                      <RouterLink to={`/tools/${t.slug}`}>{t.name}</RouterLink>
                    </Link>
                  ))}
                </Flex>
              </Box>
            )
          })}
      </Box>
    </Box>
  )
}
