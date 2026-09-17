export interface ScholarlyPaper {
  id: string
  doi?: string
  title: string
  authors: string[]
  year?: number
  venue?: string
  sourceUrl: string
  pdfUrl?: string
  citationCount?: number
  provider: 'openalex' | 'crossref'
}

interface OpenAlexWork {
  id: string
  doi?: string
  title?: string
  publication_year?: number
  cited_by_count?: number
  authorships?: Array<{ author?: { display_name?: string } }>
  primary_location?: { source?: { display_name?: string }; landing_page_url?: string; pdf_url?: string }
  best_oa_location?: { landing_page_url?: string; pdf_url?: string }
}

interface CrossrefItem {
  DOI?: string
  title?: string[]
  author?: Array<{ given?: string; family?: string }>
  published?: { 'date-parts'?: number[][] }
  'container-title'?: string[]
  URL?: string
  'is-referenced-by-count'?: number
}

function cleanDoi(value?: string) {
  return value?.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
}

async function searchOpenAlex(query: string, signal?: AbortSignal): Promise<ScholarlyPaper[]> {
  const params = new URLSearchParams({ search: query, per_page: '10' })
  const response = await fetch(`https://api.openalex.org/works?${params}`, { signal })
  if (!response.ok) throw new Error(`OpenAlex returned ${response.status}`)
  const body = await response.json() as { results?: OpenAlexWork[] }
  return (body.results ?? []).filter((work) => work.title).map((work) => {
    const doi = cleanDoi(work.doi)
    return {
      id: work.id.split('/').pop() ?? work.id,
      doi,
      title: work.title!,
      authors: (work.authorships ?? []).map((entry) => entry.author?.display_name).filter((name): name is string => Boolean(name)),
      year: work.publication_year,
      venue: work.primary_location?.source?.display_name,
      sourceUrl: work.primary_location?.landing_page_url ?? (doi ? `https://doi.org/${doi}` : work.id),
      pdfUrl: work.best_oa_location?.pdf_url ?? work.primary_location?.pdf_url,
      citationCount: work.cited_by_count,
      provider: 'openalex' as const,
    }
  })
}

async function searchCrossref(query: string, signal?: AbortSignal): Promise<ScholarlyPaper[]> {
  const params = new URLSearchParams({ 'query.bibliographic': query, rows: '10' })
  const response = await fetch(`https://api.crossref.org/works?${params}`, { signal })
  if (!response.ok) throw new Error(`Crossref returned ${response.status}`)
  const body = await response.json() as { message?: { items?: CrossrefItem[] } }
  return (body.message?.items ?? []).filter((item) => item.title?.[0]).map((item) => {
    const doi = cleanDoi(item.DOI)
    return {
      id: doi ?? crypto.randomUUID(),
      doi,
      title: item.title![0],
      authors: (item.author ?? []).map((author) => [author.given, author.family].filter(Boolean).join(' ')),
      year: item.published?.['date-parts']?.[0]?.[0],
      venue: item['container-title']?.[0],
      sourceUrl: item.URL ?? (doi ? `https://doi.org/${doi}` : 'https://www.crossref.org/'),
      citationCount: item['is-referenced-by-count'],
      provider: 'crossref' as const,
    }
  })
}

export async function searchScholarlyWorks(query: string, signal?: AbortSignal) {
  try {
    return await searchOpenAlex(query, signal)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    return searchCrossref(query, signal)
  }
}
