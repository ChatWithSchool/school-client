import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageHeader,
  SearchField,
  Tabs,
  Badge,
  Avatar,
  Card,
  Button,
  EmptyState,
} from '../../components/ui';
import { LoadingSkeleton, ErrorState } from '../../components/StateViews';

type ResultCategory = 'students' | 'staff' | 'classes';
type TabKey = 'all' | ResultCategory;

interface SearchItem {
  id: string;
  type: ResultCategory;
  name: string;
  subtitle: string;
  targetPath: string;
}

const MOCK_RESULTS: SearchItem[] = [
  { id: 'st-1', type: 'students', name: 'נועם ביטון', subtitle: 'כיתה ח1', targetPath: '/students' },
  { id: 'st-2', type: 'students', name: 'יובל קליין', subtitle: 'כיתה ח1', targetPath: '/students' },
  { id: 'st-3', type: 'students', name: 'נועה גל', subtitle: 'כיתה ז1', targetPath: '/students' },
  { id: 'sf-1', type: 'staff', name: 'דנה כהן', subtitle: 'מחנכת כיתה ז2', targetPath: '/staff' },
  { id: 'sf-2', type: 'staff', name: 'אבי דוד', subtitle: 'רכז שכבה ח', targetPath: '/staff' },
  { id: 'sf-3', type: 'staff', name: 'מיכל לוי', subtitle: 'יועצת חינוכית', targetPath: '/staff' },
  { id: 'cl-1', type: 'classes', name: 'כיתה ח1', subtitle: 'שכבה ח · 32 תלמידים', targetPath: '/classes' },
  { id: 'cl-2', type: 'classes', name: 'כיתה ח2', subtitle: 'שכבה ח · 30 תלמידים', targetPath: '/classes' },
  { id: 'cl-3', type: 'classes', name: 'כיתה ז1', subtitle: 'שכבה ז · 29 תלמידים', targetPath: '/classes' },
];

const CATEGORY_LABEL: Record<ResultCategory, string> = {
  students: 'תלמידים',
  staff: 'צוות',
  classes: 'כיתות',
};

const CATEGORY_BADGE_TONE: Record<ResultCategory, 'info' | 'neutral' | 'success'> = {
  students: 'info',
  staff: 'neutral',
  classes: 'success',
};

const VALID_TABS: TabKey[] = ['all', 'students', 'staff', 'classes'];

function normalizeQuery(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, '')
    .trim()
    .toLowerCase();
}

async function searchAll(query: string): Promise<SearchItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const normalizedQ = normalizeQuery(query);
  if (normalizedQ.length < 2) {
    return [];
  }
  return MOCK_RESULTS.filter(
    (item) =>
      normalizeQuery(item.name).includes(normalizedQ) ||
      normalizeQuery(item.subtitle).includes(normalizedQ)
  );
}

export default function GlobalSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') ?? '';
  const paramTab = searchParams.get('tab') as TabKey | null;
  const initialTab: TabKey = paramTab && VALID_TABS.includes(paramTab) ? paramTab : 'all';

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlQ = searchParams.get('q') ?? '';
    const urlTab = searchParams.get('tab') as TabKey | null;
    setQueryInput(urlQ);
    if (urlTab && VALID_TABS.includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const updateUrlParams = useCallback(
    (nextQ: string, nextTab: TabKey) => {
      const next = new URLSearchParams();
      if (nextQ.trim()) next.set('q', nextQ.trim());
      if (nextTab !== 'all') next.set('tab', nextTab);
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const items = await searchAll(q);
      setResults(items);
    } catch {
      setError('אירעה שגיאה בעת ביצוע החיפוש');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  const handleSearchChange = (value: string) => {
    setQueryInput(value);
    updateUrlParams(value, activeTab);
  };

  const handleTabChange = (nextTab: string) => {
    const valid = VALID_TABS.includes(nextTab as TabKey) ? (nextTab as TabKey) : 'all';
    setActiveTab(valid);
    updateUrlParams(queryInput, valid);
  };

  const hasEnoughChars = queryInput.trim().length >= 2;

  const groupedResults = useMemo(() => {
    const categories: ResultCategory[] =
      activeTab === 'all' ? ['students', 'staff', 'classes'] : [activeTab];

    return categories
      .map((category) => ({
        category,
        label: CATEGORY_LABEL[category],
        items: results.filter((item) => item.type === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [results, activeTab]);

  const tabItems = [
    { value: 'all', label: `הכול (${results.length})` },
    {
      value: 'students',
      label: `תלמידים (${results.filter((r) => r.type === 'students').length})`,
    },
    { value: 'staff', label: `צוות (${results.filter((r) => r.type === 'staff').length})` },
    {
      value: 'classes',
      label: `כיתות (${results.filter((r) => r.type === 'classes').length})`,
    },
  ];

  const displayTerm = queryInput.trim();

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      <PageHeader
        title={displayTerm ? `תוצאות עבור: ${displayTerm}` : 'חיפוש גלובלי'}
        subtitle="חיפוש על פני תלמידים, צוות וכיתות"
      />

      <div className="max-w-xl" role="search">
        <SearchField
          label="חיפוש"
          placeholder="הקלידי לפחות 2 אותיות לחיפוש..."
          value={queryInput}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {!hasEnoughChars ? (
        <EmptyState
          variant="first-use"
          title="הקלידי לפחות שתי אותיות כדי לחפש"
        />
      ) : isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => runSearch(queryInput)} />
      ) : (
        <>
          <Tabs
            label="קבוצות חיפוש"
            value={activeTab}
            onValueChange={handleTabChange}
            items={tabItems}
          />

          {groupedResults.length === 0 ? (
            <EmptyState
              variant="no-results"
              title={`לא מצאנו כלום עבור ${displayTerm}`}
              action={
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQueryInput('');
                    setActiveTab('all');
                    setSearchParams({}, { replace: true });
                  }}
                >
                  ניקוי חיפוש
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-6">
              {groupedResults.map((group) => (
                <section key={group.category} className="flex flex-col gap-3">
                  <h2 className="text-h2 font-semibold text-fg-primary">{group.label}</h2>
                  <div className="flex flex-col gap-2">
                    {group.items.map((item) => (
                      <Card
                        key={item.id}
                        interactive
                        className="flex items-center justify-between gap-4 p-4"
                        onClick={() => navigate(item.targetPath)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={item.name} size="M" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-fg-primary truncate">
                              {item.name}
                            </span>
                            <span className="text-sm text-fg-secondary truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>
                        <Badge tone={CATEGORY_BADGE_TONE[item.type]}>
                          {CATEGORY_LABEL[item.type]}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}