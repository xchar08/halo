import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Box, HStack, VStack, Text, Badge, Heading } from '@chakra-ui/react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  if (!article) return null;

  const {
    title = 'Untitled',
    description = 'No description available',
    link = '#',
    image,
    category = 'AI/ML',
    sourceName = 'Unknown Source',
    institution = 'Unknown Institution',
    scrapedAt,
  } = article;

  // Safely format date
  let timeAgo = 'recently';
  try {
    if (scrapedAt) {
      timeAgo = formatDistanceToNow(new Date(scrapedAt), { addSuffix: true });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
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
        {image ? (
          <Box position="relative" w="full" h="200px" bg="gray.100" flexShrink={0}>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLElement;
                if (target?.style) {
                  target.style.display = 'none';
                }
              }}
              unoptimized
            />
          </Box>
        ) : (
          <Box
            w="full"
            h="200px"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            flexShrink={0}
          />
        )}

        <VStack p={4} gap={3} align="start" w="full" flex={1} justify="space-between">
          <HStack justify="space-between" w="full" gap={2} align="flex-start">
            <Heading size="md" flex={1} maxWidth="85%" noOfLines={2}>
              {title}
            </Heading>
            <Badge colorScheme="blue" whiteSpace="nowrap" flexShrink={0}>
              {category}
            </Badge>
          </HStack>

          <Text
            color="gray.600"
            fontSize="sm"
            noOfLines={2}
            flex={1}
          >
            {description}
          </Text>

          <HStack
            justify="space-between"
            w="full"
            pt={2}
            borderTop="1px"
            borderColor="gray.100"
            fontSize="xs"
            gap={1}
          >
            <HStack gap={1} minW={0}>
              <Text fontWeight="medium" color="gray.700" noOfLines={1}>
                {sourceName}
              </Text>
              <Text color="gray.400" flexShrink={0}>
                •
              </Text>
              <Text color="gray.600" noOfLines={1}>
                {institution}
              </Text>
            </HStack>
            <Text color="gray.400" whiteSpace="nowrap" flexShrink={0}>
              {timeAgo}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
