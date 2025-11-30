// News article interface
export interface NewsArticle {
    title: string
    description: string
    url: string
    publishedAt: string
    source: string
    image?: string
}

// API Response interface
export interface NewsResponse {
    success: boolean
    articles: NewsArticle[]
    error?: string
}
