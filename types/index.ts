export interface Article {
    title: string;
    description: string;
    date: string;
    link: string;
    image?: string;
    sourceId: string;
    sourceName: string;
    institution: string;
    region: string;
    category: string;
    scrapedAt: Date;
  }
  
  export interface Source {
    id: string;
    name: string;
    institution: string;
    region: string;
    category: string;
    url: string;
    newsSelector: {
      container: string;
      title: string;
      description: string;
      date: string;
      link: string;
      image: string;
    };
    scrapeInterval: number;
  }
  
  export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
  }
  
  export interface Region {
    id: string;
    name: string;
    emoji: string;
  }
  
  export interface LabsConfig {
    sources: Source[];
    categories: Category[];
    regions: Region[];
  }
  
  export interface ArticleFilters {
    sourceId?: string;
    category?: string;
    region?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
  