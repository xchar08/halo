'use client';

import { useState } from 'react';
import { Box, VStack, Heading, Input, Button, SimpleGrid, Center, Spinner } from '@chakra-ui/react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import axios from 'axios';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const response = await axios.get(`/api/articles?search=${encodeURIComponent(search)}&limit=50`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="7xl" mx="auto" px={[4, 6, 8]} py={8}>
      <VStack gap={8} align="stretch">
        <VStack gap={6} align="stretch">
          <Heading size="2xl" color="gray.900">
            Search Articles
          </Heading>
          <Box as="form" onSubmit={handleSearch}>
            <Input
              placeholder="Search by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
              borderColor="gray.300"
            />
          </Box>
        </VStack>

        {loading ? (
          <Center py={12}>
            <Spinner size="lg" color="red.500" />
          </Center>
        ) : searched && articles.length === 0 ? (
          <Center py={12}>
            <Box textAlign="center">
              <Heading size="md" color="gray.500">
                No results found
              </Heading>
            </Box>
          </Center>
        ) : articles.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {articles.map((article, index) => (
              <ArticleCard key={`${article.link}-${index}`} article={article} />
            ))}
          </SimpleGrid>
        ) : null}
      </VStack>
    </Box>
  );
}
