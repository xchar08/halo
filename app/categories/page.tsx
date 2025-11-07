'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, VStack, HStack, Heading, Text, Badge, Button, Spinner, Center, Wrap, WrapItem, Grid } from '@chakra-ui/react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';

const CATEGORIES = [
  { id: 'AI/ML', name: 'AI & Machine Learning', emoji: '🧠', color: 'pink' },
  { id: 'LLM/AGI', name: 'Large Language Models', emoji: '💬', color: 'teal' },
  { id: 'Robotics', name: 'Robotics', emoji: '🤖', color: 'blue' },
  { id: 'Physics', name: 'Physics & Particles', emoji: '⚡', color: 'green' },
  { id: 'Biotech', name: 'Biotech & Medicine', emoji: '🧬', color: 'yellow' },
  { id: 'Safety', name: 'AI Safety', emoji: '🛡️', color: 'orange' },
  { id: 'Medical', name: 'Medical & Life Sciences', emoji: '🏥', color: 'red' },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('AI/ML');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadArticles = async (category: string, pageNum: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles?category=${encodeURIComponent(category)}&page=${pageNum}&limit=20`);
      const data = await response.json();

      if (pageNum === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles((prev) => [...prev, ...(data.articles || [])]);
      }
      setPage(pageNum);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(selectedCategory, 1);
  }, [selectedCategory]);

  const categoryData = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <Box maxW="7xl" mx="auto" px={[4, 6, 8]} py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="2xl" mb={4} color="gray.900">
            📂 Browse by Category
          </Heading>
          <Text color="gray.600">
            Explore research across different fields and topics
          </Text>
        </Box>

        {/* Category Selector */}
        <Box>
          <Wrap gap={2}>
            {CATEGORIES.map((category) => (
              <WrapItem key={category.id}>
                <Button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setPage(1);
                  }}
                  colorScheme={selectedCategory === category.id ? category.color : 'gray'}
                  variant={selectedCategory === category.id ? 'solid' : 'outline'}
                  size="md"
                  fontSize="sm"
                >
                  {category.emoji} {category.name}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* Selected Category Info */}
        {categoryData && (
          <Box bg="blue.50" p={4} borderRadius="lg" borderLeft="4px" borderLeftColor="blue.500">
            <HStack gap={2} mb={2}>
              <Text fontSize="2xl">{categoryData.emoji}</Text>
              <VStack align="start" gap={0}>
                <Heading size="md" color="gray.900">
                  {categoryData.name}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {loading && page === 1 ? 'Loading...' : `${articles.length} articles found`}
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {/* Articles Grid */}
        {loading && page === 1 ? (
          <Center py={20}>
            <Spinner size="lg" color="red.500" />
          </Center>
        ) : articles.length > 0 ? (
          <>
            <Grid templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={6}>
              {articles.map((article, idx) => (
                <ArticleCard key={`${article.link}-${idx}`} article={article} />
              ))}
            </Grid>

            {/* Load More Button */}
            {hasMore && (
              <Center>
                <Button
                  onClick={() => loadArticles(selectedCategory, page + 1)}
                  isLoading={loading}
                  colorScheme="red"
                  variant="outline"
                  size="lg"
                >
                  Load More Articles
                </Button>
              </Center>
            )}
          </>
        ) : (
          <Center py={20}>
            <VStack gap={4} textAlign="center">
              <Text fontSize="lg" color="gray.600">
                No articles found in this category
              </Text>
              <Link href="/">
                <Button colorScheme="red">Back to Feed</Button>
              </Link>
            </VStack>
          </Center>
        )}
      </VStack>
    </Box>
  );
}
