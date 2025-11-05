import { OpenAI } from 'openai';
import { Article } from '@/types';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebious.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

interface TopArticle {
  title: string;
  link: string;
  reason: string;
  institution: string;
}

interface DailyReport {
  date: string;
  summary: string;
  categoryBreakdown: Record<string, number>;
  topInstitutions: string[];
  keyTopics: string[];
  topArticlesByCategory: Record<string, TopArticle>;
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

  private async findTopArticleByCategory(
    category: string,
    articles: Article[]
  ): Promise<TopArticle | null> {
    if (articles.length === 0) return null;

    // If only one article, return it
    if (articles.length === 1) {
      return {
        title: articles[0].title,
        link: articles[0].link,
        reason: 'Latest development',
        institution: articles[0].sourceName,
      };
    }

    // Format articles for AI evaluation
    const articleList = articles
      .slice(0, 10)
      .map((a, i) => `${i + 1}. "${a.title}"\n   Description: ${a.description}\n   Source: ${a.sourceName}`)
      .join('\n\n');

    const prompt = `You are a research curator. Given these articles from the "${category}" category, identify the MOST INTERESTING or SIGNIFICANT one based on:
- Novelty/breakthrough potential
- Real-world impact
- Institutional prestige
- Specificity of findings

Articles:
${articleList}

Respond in JSON format ONLY:
{
  "articleNumber": 1,
  "reason": "Brief explanation of why this is the most interesting (one sentence)"
}`;

    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-R1-0528',
        messages: [
          {
            role: 'system',
            content: 'You are a research curator. Be concise and identify the most impactful article.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      try {
        const content = response.choices[0].message.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          const selectedArticle = articles[result.articleNumber - 1] || articles[0];
          return {
            title: selectedArticle.title,
            link: selectedArticle.link,
            reason: result.reason || 'Notable development',
            institution: selectedArticle.sourceName,
          };
        }
      } catch (e) {
        console.error('Error parsing article selection:', e);
      }
    } catch (error) {
      console.error('Error finding top article:', error);
    }

    // Fallback: return first article
    return {
      title: articles[0].title,
      link: articles[0].link,
      reason: 'Latest development',
      institution: articles[0].sourceName,
    };
  }

  async generateDailyReport(articles: Article[]): Promise<DailyReport> {
    if (articles.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        summary: 'No research published today.',
        categoryBreakdown: {},
        topInstitutions: [],
        keyTopics: [],
        topArticlesByCategory: {},
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

    // Find top article per category
    const topArticlesByCategory: Record<string, TopArticle> = {};
    for (const [category, categoryArticles] of Object.entries(byCategory)) {
      const topArticle = await this.findTopArticleByCategory(category, categoryArticles);
      if (topArticle) {
        topArticlesByCategory[category] = topArticle;
      }
    }

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
        topArticlesByCategory,
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
        topArticlesByCategory,
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
    const byDate = articles.reduce(
      (acc, article) => {
        const date = new Date(article.scrapedAt).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(article);
        return acc;
      },
      {} as Record<string, Article[]>
    );

    const reports = await Promise.all(
      Object.entries(byDate)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .slice(0, 7)
        .map(([_date, dailyArticles]) => this.generateDailyReport(dailyArticles))
    );

    return reports;
  }
}
