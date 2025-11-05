import { OpenAI } from 'openai';
import { Article } from '@/types';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebious.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

interface DailyReport {
  date: string;
  summary: string;
  articles: {
    title: string;
    link: string;
    category: string;
  }[];
  isBigNews: boolean;
}

export class ReportGenerator {
  async generateDailyReport(articles: Article[]): Promise<DailyReport> {
    if (articles.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        summary: 'No research published today.',
        articles: [],
        isBigNews: false,
      };
    }

    // Group by category
    const byCategory = articles.reduce(
      (acc, article) => {
        if (!acc[article.category]) acc[article.category] = [];
        acc[article.category].push(article);
        return acc;
      },
      {} as Record<string, Article[]>
    );

    // Prepare article summaries for API
    const articleSummaries = articles
      .slice(0, 20) // Limit to 20 for token efficiency
      .map(
        (a) => `[${a.category}] ${a.title} (${a.sourceName})\n${a.description}`
      )
      .join('\n\n');

    const prompt = `You are a research news summarizer. Analyze these research articles published today and create a concise daily report (2-4 sentences max for normal days, up to 1 paragraph for major breakthroughs).

Focus on:
- What research was released
- Key breakthroughs or announcements
- Notable institutions/companies involved

Mark if this is "BIG NEWS" (major breakthrough, paradigm shift, or significant milestone).

Articles:
${articleSummaries}

Respond in JSON format:
{
  "summary": "2-4 sentence summary of research activity",
  "isBigNews": boolean,
  "highlights": ["key point 1", "key point 2"]
}`;

    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-R1-0528',
        messages: [
          {
            role: 'system',
            content:
              'You are a concise research news summarizer. Keep summaries brief and factual.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      let reportData: { summary: string; isBigNews: boolean; highlights?: string[] } = {
        summary: 'Research activity detected across multiple labs.',
        isBigNews: false,
      };

      try {
        const content = response.choices[0].message.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          reportData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
      }

      return {
        date: new Date().toISOString().split('T')[0],
        summary: reportData.summary,
        articles: articles.map((a) => ({
          title: a.title,
          link: a.link,
          category: a.category,
        })),
        isBigNews: reportData.isBigNews,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        date: new Date().toISOString().split('T')[0],
        summary: `${articles.length} research articles published across ${Object.keys(byCategory).length} categories.`,
        articles: articles.map((a) => ({
          title: a.title,
          link: a.link,
          category: a.category,
        })),
        isBigNews: false,
      };
    }
  }

  async generateWeeklyReports(articles: Article[]): Promise<DailyReport[]> {
    // Group articles by date
    const byDate = articles.reduce(
      (acc, article) => {
        const date = new Date(article.scrapedAt).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(article);
        return acc;
      },
      {} as Record<string, Article[]>
    );

    // Generate report for each day
    const reports = await Promise.all(
      Object.entries(byDate)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .slice(0, 7) // Last 7 days
        .map(([_date, dailyArticles]) => this.generateDailyReport(dailyArticles))
    );

    return reports;
  }
}
