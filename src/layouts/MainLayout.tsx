import type { ReactNode } from 'react'
import {
  Box, Flex, Container, Text, Image, Link, IconButton,
} from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'
import { LuSun, LuMoon, LuGithub, LuShield } from 'react-icons/lu'

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex minH="100vh" direction="column" bg="bg">
      {/* Header */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={50}
        bg="bg/80"
        backdropFilter="blur(8px)"
        borderBottomWidth="1px"
        borderColor="border"
      >
        <Container maxW="7xl" px={4}>
          <Flex h="14" align="center" justify="space-between">
            {/* Logo */}
            <Link href="/" display="flex" alignItems="center" gap={2} _hover={{ opacity: 0.8 }} textDecoration="none">
              <Image src="/purple_logo.png" alt="converter.shwrk logo" boxSize="8" objectFit="contain" />
              <Text fontWeight="bold" fontSize="lg" letterSpacing="tight">
                converter<Text as="span" opacity={0.5}>.shwrk</Text>
              </Text>
            </Link>

            {/* Center text */}
            <Text display={{ base: 'none', lg: 'block' }} fontSize="sm" color="fg.muted">
              Developer Encoding & Formatting Tools
            </Text>

            {/* Actions */}
            <Flex align="center" gap={1}>
              <IconButton
                aria-label="Toggle color mode"
                variant="ghost"
                size="sm"
                onClick={toggleColorMode}
              >
                {colorMode === 'dark' ? <LuSun /> : <LuMoon />}
              </IconButton>

              <Link
                href="https://github.com/encoding-converter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton
                  aria-label="GitHub Repository"
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <span><LuGithub /></span>
                </IconButton>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box as="main" flex="1">
        <Container maxW="7xl" px={4} py={8}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" borderTopWidth="1px" borderColor="border" bg="bg.subtle">
        <Container maxW="7xl" px={4} py={5}>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align="center"
            justify="space-between"
            gap={3}
            fontSize="sm"
            color="fg.muted"
          >
            <Flex align="center" gap={2}>
              <Image src="/purple_logo.png" alt="" boxSize="4" objectFit="contain" aria-hidden="true" />
              <Text fontWeight="semibold">converter.shwrk</Text>
            </Flex>
            <Flex align="center" gap={1}>
              <LuShield size={16} />
              <Text>All processing happens locally in your browser</Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Flex>
  )
}
