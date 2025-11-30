"use client"

import { useEffect, useRef } from "react"

interface GoogleSearchProps {
    query: string
}

export default function GoogleSearch({ query }: GoogleSearchProps) {
    const searchContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadScript = () => {
            if (document.getElementById('google-cse-script')) {
                initializeSearch()
                return
            }

            const script = document.createElement("script")
            script.src = "https://cse.google.com/cse.js?cx=b68b9234dfae14612"
            script.async = true
            script.id = 'google-cse-script'
            script.onload = () => {
                initializeSearch()
            }
            document.body.appendChild(script)
        }

        const initializeSearch = () => {
            if (!searchContainerRef.current) return

            const checkGoogle = setInterval(() => {
                // @ts-ignore
                if (window.google && window.google.search && window.google.search.cse && window.google.search.cse.element) {
                    clearInterval(checkGoogle)
                    renderSearch()
                }
            }, 100)

            // Timeout after 5 seconds
            setTimeout(() => clearInterval(checkGoogle), 5000)
        }

        const renderSearch = () => {
            if (!searchContainerRef.current) return

            try {
                // @ts-ignore
                window.google.search.cse.element.render(
                    {
                        div: searchContainerRef.current,
                        tag: 'searchresults-only',
                        gname: 'historical-news-search',
                        attributes: {
                            resultSetSize: 'small',
                            linkTarget: '_blank'
                        }
                    }
                )

                // Execute search
                setTimeout(() => {
                    // @ts-ignore
                    const element = window.google.search.cse.element.getElement('historical-news-search')
                    if (element) {
                        element.execute(query)
                    }
                }, 200)
            } catch (e) {
                console.error("Error rendering Google Search:", e)
            }
        }

        loadScript()

        return () => {
            // Cleanup if needed
        }
    }, [query])

    return (
        <div className="google-search-container min-h-[300px]">
            <div
                ref={searchContainerRef}
                className="gcse-searchresults-only"
            ></div>

            {/* Fallback styling for CSE elements to match dark mode better */}
            <style jsx global>{`
        .gsc-control-cse {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
        .gsc-webResult.gsc-result {
          background-color: transparent !important;
          border-bottom: 1px solid #374151 !important;
          padding: 10px 0 !important;
        }
        .gs-title {
          text-decoration: none !important;
          color: #60a5fa !important;
        }
        .gs-snippet {
          color: #9ca3af !important;
        }
        .gsc-url-top, .gsc-url-bottom {
          display: none !important;
        }
      `}</style>
        </div>
    )
}
