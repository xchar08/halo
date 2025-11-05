'use client';

import { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, Button, SimpleGrid, Center, Spinner } from '@chakra-ui/react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import axios from 'axios';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/articles?page=1&limit=20');
      setArticles(response.data.articles);
      setHasMore(response.data.articles.length === 20);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get(`/api/articles?page=${nextPage}&limit=20`);
      if (response.data.articles.length > 0) {
        setArticles([...articles, ...response.data.articles]);
        setPage(nextPage);
        setHasMore(response.data.articles.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more:', error);
    }
  };

  if (loading && articles.length === 0) {
    return (
      <Center minH="screen">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" px={[4, 6, 8]} py={8}>
      <VStack gap={8} align="stretch">
        <VStack gap={2} align="start">
          <Heading size="2xl" color="gray.900">
            Latest Research News
          </Heading>
          <Text color="gray.600">
            Curated from top AI, ML, and research labs worldwide
          </Text>
        </VStack>

        {articles.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {articles.map((article, index) => (
                <ArticleCard key={`${article.link}-${index}`} article={article} />
              ))}
            </SimpleGrid>

            {hasMore && articles.length > 0 && (
              <Center pt={8}>
                <Button onClick={loadMore} colorScheme="red" size="lg">
                  Load More
                </Button>
              </Center>
            )}
          </>
        ) : (
          <Center py={12}>
            <Text color="gray.500" fontSize="lg">
              No articles yet. Run the scraper to fetch content.
            </Text>
          </Center>
        )}
      </VStack>
    </Box>
  );
}
