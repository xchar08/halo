'use client';

import { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, Badge, HStack, Link, Spinner, Center } from '@chakra-ui/react';

interface DailyReport {
  date: string;
  summary: string;
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
        // Fetch today's report
        const todayRes = await fetch('/api/daily-report');
        const todayData = await todayRes.json();
        setTodayReport(todayData);

        // Fetch weekly reports
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

            <Text color="gray.700" fontSize="md" mb={4} lineHeight="1.6">
              {todayReport.summary}
            </Text>

            {todayReport.articles.length > 0 && (
              <VStack align="start" gap={2} pt={4} borderTop="1px" borderColor="gray.200">
                <Text fontWeight="bold" color="gray.600" fontSize="sm">
                  📚 {todayReport.articles.length} Articles Referenced:
                </Text>
                {todayReport.articles.slice(0, 10).map((article, idx) => (
                  <HStack key={idx} gap={2} w="full" align="flex-start">
                    <Badge colorScheme="blue" flexShrink={0}>
                      {article.category}
                    </Badge>
                    <Link
                      href={article.link}
                      isExternal
                      color="blue.600"
                      fontSize="sm"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {article.title} ↗
                    </Link>
                  </HStack>
                ))}
                {todayReport.articles.length > 10 && (
                  <Text color="gray.500" fontSize="xs">
                    +{todayReport.articles.length - 10} more articles...
                  </Text>
                )}
              </VStack>
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
              <HStack justify="space-between" mb={2} align="flex-start">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" color="gray.900">
                    {new Date(report.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </VStack>
                {report.isBigNews && (
                  <Badge colorScheme="orange" fontSize="xs">
                    Major Activity
                  </Badge>
                )}
              </HStack>

              <Text color="gray.700" fontSize="sm" mb={2}>
                {report.summary}
              </Text>

              <Text color="gray.500" fontSize="xs">
                {report.articles.length} articles
              </Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}
