"use client"

import { ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/lib/types/news"

interface NewsCardProps {
    article: NewsArticle
    index: number
}

export default function NewsCard({ article, index }: NewsCardProps) {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            })
        } catch {
            return "Date unknown"
        }
    }

    return (
        <div className="bg-muted/50 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                    >
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {article.title}
                            <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                    </a>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="font-medium">{article.source}</span>
                        <span>•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3">
                        {article.description}
                    </p>
                </div>
            </div>
        </div>
    )
}
