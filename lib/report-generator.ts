import { OpenAI } from 'openai';
import { Article } from '@/types';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebious.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

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
}

export class ReportGenerator {
  private extractKeyTopics(articles: Article[]): string[] {
    const text = articles
      .map((a) => `${a.title} ${a.description}`)
      .join(' ')
      .toLowerCase();

    const topics: Record<string, number> = {};
    const keywords = [
      'quantum',
      'llm',
      'transformer',
      'robotics',
      'medical',
      'gene therapy',
      'drug discovery',
      'protein folding',
      'neural network',
      'safety',
      'alignment',
      'multimodal',
      'reasoning',
      'benchmark',
      'breakthrough',
      'efficiency',
      'optimization',
      'inference',
      'fine-tuning',
      'open-source',
    ];

    for (const keyword of keywords) {
      const count = (text.match(new RegExp(keyword, 'g')) || []).length;
      if (count > 0) {
        topics[keyword] = count;
      }
    }

    // Return top 5 topics
    return Object.entries(topics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic.charAt(0).toUpperCase() + topic.slice(1));
  }

  private getTopInstitutions(articles: Article[]): string[] {
    const institutions = articles.reduce(
      (acc, article) => {
        acc[article.sourceName] = (acc[article.sourceName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(institutions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([institution]) => institution);
  }

  async generateDailyReport(articles: Article[]): Promise<DailyReport> {
    if (articles.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        summary: 'No research published today.',
        categoryBreakdown: {},
        topInstitutions: [],
        keyTopics: [],
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

    const categoryBreakdown = Object.entries(byCategory).reduce(
      (acc, [cat, items]) => {
        acc[cat] = items.length;
        return acc;
      },
      {} as Record<string, number>
    );

    const topInstitutions = this.getTopInstitutions(articles);
    const keyTopics = this.extractKeyTopics(articles);

    // Prepare article summaries for API
    const articleSummaries = articles
      .slice(0, 20)
      .map(
        (a) => `[${a.category}] ${a.title} (${a.sourceName})\n${a.description}`
      )
      .join('\n\n');

    const prompt = `You are a research news summarizer. Analyze these research articles published today and create a concise daily report (2-4 sentences max for normal days, up to 1 paragraph for major breakthroughs).

Focus on:
- What research was released (specific breakthroughs or announcements)
- Key developments across categories
- Notable institutions/companies involved
- Emerging trends

Mark if this is "BIG NEWS" (major breakthrough, paradigm shift, or significant milestone).

Articles:
${articleSummaries}

Respond in JSON format:
{
  "summary": "2-4 sentence summary of research activity and key developments",
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
              'You are a concise research news summarizer. Keep summaries brief, factual, and focused on specific breakthroughs and developments.',
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
        summary: `Research activity detected across ${Object.keys(byCategory).length} categories with ${articles.length} total articles published.`,
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
        categoryBreakdown,
        topInstitutions,
        keyTopics,
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
        summary: `${articles.length} research articles published across ${Object.keys(byCategory).length} categories: ${Object.entries(categoryBreakdown)
          .map(([cat, count]) => `${count} ${cat}`)
          .join(', ')}.`,
        categoryBreakdown,
        topInstitutions,
        keyTopics,
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
        .slice(0, 7)
        .map(([_date, dailyArticles]) => this.generateDailyReport(dailyArticles))
    );

    return reports;
  }
}
