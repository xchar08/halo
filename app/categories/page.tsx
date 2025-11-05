'use client';

import { useEffect, useState } from 'react';
import { Box, VStack, Heading, Wrap, WrapItem, Button, SimpleGrid, Center, Spinner } from '@chakra-ui/react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import labsConfig from '@/lib/labs.json';
import axios from 'axios';

export default function CategoriesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      loadArticles(selectedCategory);
    }
  }, [selectedCategory]);

  const loadArticles = async (category: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/articles?category=${encodeURIComponent(category)}&limit=50`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="7xl" mx="auto" px={[4, 6, 8]} py={8}>
      <VStack gap={8} align="stretch">
        <Heading size="2xl" color="gray.900">
          Browse by Category
        </Heading>

        <Wrap gap={3}>
          {labsConfig.categories.map((category) => (
            <WrapItem key={category.id}>
              <Button
                onClick={() => setSelectedCategory(category.name)}
                colorScheme={selectedCategory === category.name ? 'red' : 'gray'}
                variant={selectedCategory === category.name ? 'solid' : 'outline'}
              >
                {category.icon} {category.name}
              </Button>
            </WrapItem>
          ))}
        </Wrap>

        {loading ? (
          <Center py={12}>
            <Spinner size="lg" color="red.500" />
          </Center>
        ) : selectedCategory && articles.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {articles.map((article, index) => (
              <ArticleCard key={`${article.link}-${index}`} article={article} />
            ))}
          </SimpleGrid>
        ) : selectedCategory && articles.length === 0 ? (
          <Center py={12}>
            <Heading size="md" color="gray.500">
              No articles in this category yet
            </Heading>
          </Center>
        ) : null}
      </VStack>
    </Box>
  );
}
