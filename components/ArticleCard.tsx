import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Box, HStack, VStack, Text, Badge, Heading } from '@chakra-ui/react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.link} target="_blank" rel="noopener noreferrer">
      <Box
        bg="white"
        borderWidth={1}
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
        _hover={{ shadow: 'lg', transition: 'all 0.2s' }}
        cursor="pointer"
        h="100%"
        display="flex"
        flexDirection="column"
      >
        {article.image ? (
          <Box position="relative" w="full" h="200px" bg="gray.100" flexShrink={0}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              priority={false}
            />
          </Box>
        ) : (
          <Box w="full" h="200px" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" flexShrink={0} />
        )}

        <VStack p={4} gap={3} align="start" w="full" flex={1} justify="space-between">
          <HStack justify="space-between" w="full" gap={2} align="flex-start">
            <Heading size="md" flex={1} maxWidth="85%">
              {article.title}
            </Heading>
            <Badge colorScheme="blue" whiteSpace="nowrap" flexShrink={0}>
              {article.category}
            </Badge>
          </HStack>

          <Text 
            color="gray.600" 
            fontSize="sm"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            flex={1}
          >
            {article.description || 'No description available'}
          </Text>

          <HStack justify="space-between" w="full" pt={2} borderTop="1px" borderColor="gray.100" fontSize="xs" gap={1}>
            <HStack gap={1} minW={0}>
              <Text fontWeight="medium" color="gray.700" noOfLines={1}>
                {article.sourceName}
              </Text>
              <Text color="gray.400" flexShrink={0}>•</Text>
              <Text color="gray.600" noOfLines={1}>
                {article.institution}
              </Text>
            </HStack>
            <Text color="gray.400" whiteSpace="nowrap" flexShrink={0}>
              {formatDistanceToNow(new Date(article.scrapedAt), { addSuffix: true })}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
