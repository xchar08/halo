'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Flex, HStack, Button, Text } from '@chakra-ui/react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={50}>
      <Flex maxW="7xl" mx="auto" px={[4, 6, 8]} py={4} justify="space-between" align="center" h={16}>
        <Link href="/">
          <HStack gap={2} cursor="pointer">
            <Text fontSize="2xl">🧬</Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              Lab News Feed
            </Text>
          </HStack>
        </Link>

        <HStack gap={6}>
          <Link href="/">
            <Button
              variant={isActive('/') ? 'solid' : 'ghost'}
              colorScheme={isActive('/') ? 'red' : 'gray'}
              fontSize="sm"
              fontWeight="medium"
            >
              Feed
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant={isActive('/search') ? 'solid' : 'ghost'}
              colorScheme={isActive('/search') ? 'red' : 'gray'}
              fontSize="sm"
              fontWeight="medium"
            >
              Search
            </Button>
          </Link>
          <Link href="/categories">
            <Button
              variant={isActive('/categories') ? 'solid' : 'ghost'}
              colorScheme={isActive('/categories') ? 'red' : 'gray'}
              fontSize="sm"
              fontWeight="medium"
            >
              Categories
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}
