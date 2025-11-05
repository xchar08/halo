'use client';

import { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, Badge, HStack, Link, Spinner, Center, Grid, GridItem } from '@chakra-ui/react';

interface DailyReport {
  date: string;
  summary: string;
  categoryBreakdown: Record<string, number>;
  topInstitutions: string[];
  keyTopics: string[];
  articles: {
    title: string;
    link: string;
    category: string;
  }[];
  isBigNews: boolean;
  articleCount?: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [todayReport, setTodayReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const todayRes = await fetch('/api/daily-report');
        const todayData = await todayRes.json();
        setTodayReport(todayData);

        const weeklyRes = await fetch('/api/weekly-report');
        const weeklyData = await weeklyRes.json();
        setReports(weeklyData.reports || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <Center minH="screen">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" px={[4, 6, 8]} py={8}>
      <VStack gap={8} align="stretch">
        <Heading size="2xl" color="gray.900">
          📋 Research Reports
        </Heading>

        {/* Today's Report */}
        {todayReport && (
          <Box
            bg={todayReport.isBigNews ? '#FFF3E0' : 'white'}
            borderWidth={2}
            borderColor={todayReport.isBigNews ? '#FF9800' : 'gray.200'}
            borderRadius="lg"
            p={6}
          >
            <HStack justify="space-between" mb={4} align="flex-start">
              <VStack align="start" gap={2}>
                <Heading size="lg" color="gray.900">
                  Today's Research Activity
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {todayReport.date}
                </Text>
              </VStack>
              {todayReport.isBigNews && (
                <Badge colorScheme="orange" p={2} fontSize="sm">
                  🚀 BIG NEWS
                </Badge>
              )}
            </HStack>

            <Text color="gray.700" fontSize="md" mb={6} lineHeight="1.6" fontWeight="500">
              {todayReport.summary}
            </Text>

            {/* Stats Grid */}
            <Grid templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={4} mb={6}>
              <Box bg="gray.50" p={4} borderRadius="md">
                <Text color="gray.600" fontSize="xs" fontWeight="bold">
                  TOTAL ARTICLES
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                  {todayReport.articles.length}
                </Text>
              </Box>

              <Box bg="gray.50" p={4} borderRadius="md">
                <Text color="gray.600" fontSize="xs" fontWeight="bold">
                  CATEGORIES
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                  {Object.keys(todayReport.categoryBreakdown).length}
                </Text>
              </Box>

              <Box bg="gray.50" p={4} borderRadius="md">
                <Text color="gray.600" fontSize="xs" fontWeight="bold">
                  TOP SOURCE
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.900" noOfLines={1}>
                  {todayReport.topInstitutions[0] || 'N/A'}
                </Text>
              </Box>
            </Grid>

            {/* Category Breakdown */}
            {Object.keys(todayReport.categoryBreakdown).length > 0 && (
              <Box mb={6}>
                <Heading size="sm" mb={3} color="gray.900">
                  📊 By Category
                </Heading>
                <HStack gap={2} flexWrap="wrap">
                  {Object.entries(todayReport.categoryBreakdown).map(([category, count]) => (
                    <Badge key={category} colorScheme="blue" fontSize="sm" p={2}>
                      {category}: {count}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}

            {/* Key Topics */}
            {todayReport.keyTopics.length > 0 && (
              <Box mb={6}>
                <Heading size="sm" mb={3} color="gray.900">
                  🎯 Key Topics
                </Heading>
                <HStack gap={2} flexWrap="wrap">
                  {todayReport.keyTopics.map((topic) => (
                    <Badge key={topic} colorScheme="green" variant="subtle" fontSize="sm">
                      {topic}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}

            {/* Top Institutions */}
            {todayReport.topInstitutions.length > 0 && (
              <Box mb={6}>
                <Heading size="sm" mb={3} color="gray.900">
                  🏢 Top Publishers
                </Heading>
                <VStack align="start" gap={2}>
                  {todayReport.topInstitutions.slice(0, 5).map((institution, idx) => (
                    <Text key={idx} fontSize="sm" color="gray.700">
                      {idx + 1}. {institution}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Articles */}
            {todayReport.articles.length > 0 && (
              <Box pt={4} borderTop="1px" borderColor="gray.200">
                <Heading size="sm" mb={3} color="gray.900">
                  📚 Featured Articles
                </Heading>
                <VStack align="start" gap={2}>
                  {todayReport.articles.slice(0, 8).map((article, idx) => (
                    <HStack key={idx} gap={2} w="full" align="flex-start">
                      <Badge colorScheme="blue" flexShrink={0} fontSize="xs">
                        {article.category}
                      </Badge>
                      <Link
                        href={article.link}
                        isExternal
                        color="blue.600"
                        fontSize="sm"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {article.title.substring(0, 60)}... ↗
                      </Link>
                    </HStack>
                  ))}
                  {todayReport.articles.length > 8 && (
                    <Text color="gray.500" fontSize="xs">
                      +{todayReport.articles.length - 8} more articles...
                    </Text>
                  )}
                </VStack>
              </Box>
            )}
          </Box>
        )}

        {/* Weekly Reports */}
        <VStack align="stretch" gap={4}>
          <Heading size="lg" color="gray.900">
            📈 Last 7 Days
          </Heading>

          {reports.map((report, idx) => (
            <Box key={idx} bg="white" borderWidth={1} borderColor="gray.200" borderRadius="lg" p={4}>
              <HStack justify="space-between" mb={3} align="flex-start">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" color="gray.900">
                    {new Date(report.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </VStack>
                <HStack gap={2}>
                  <Badge colorScheme="gray" fontSize="xs">
                    {report.articles.length} articles
                  </Badge>
                  {report.isBigNews && (
                    <Badge colorScheme="orange" fontSize="xs">
                      Major Activity
                    </Badge>
                  )}
                </HStack>
              </HStack>

              <Text color="gray.700" fontSize="sm" mb={3} lineHeight="1.5">
                {report.summary}
              </Text>

              {Object.keys(report.categoryBreakdown).length > 0 && (
                <HStack gap={2} flexWrap="wrap">
                  {Object.entries(report.categoryBreakdown)
                    .slice(0, 3)
                    .map(([category, count]) => (
                      <Badge key={category} colorScheme="blue" fontSize="xs">
                        {category}: {count}
                      </Badge>
                    ))}
                </HStack>
              )}
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}
