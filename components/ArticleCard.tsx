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
      >
        {article.image && (
          <Box position="relative" h={48} w="full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Box>
        )}

        <VStack p={4} gap={3} align="start" w="full">
          <HStack justify="space-between" w="full" gap={2}>
            <Heading size="md" flex={1} maxWidth="90%">
              {article.title}
            </Heading>
            <Badge colorScheme="blue" whiteSpace="nowrap">
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
          >
            {article.description}
          </Text>

          <HStack justify="space-between" w="full" pt={2} borderTop="1px" borderColor="gray.100" fontSize="xs" gap={1}>
            <HStack gap={1}>
              <Text fontWeight="medium" color="gray.700">
                {article.sourceName}
              </Text>
              <Text color="gray.400">•</Text>
              <Text color="gray.600">{article.institution}</Text>
            </HStack>
            <Text color="gray.400" whiteSpace="nowrap">
              {formatDistanceToNow(new Date(article.scrapedAt), { addSuffix: true })}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
