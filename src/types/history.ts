export interface SynchronousEvent {
  region: string;
  event: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  period: string;
  numericYear: number; // for chronological sorting
  category: string;
  region: string;
  summary: string;
  details: string[];
  impact: string;
  keyFigures?: string[];
  keyConcepts?: string[];
  synchronousEvents?: SynchronousEvent[];
  archivalQuote?: string;
  warningNote?: string;
  imagePath?: string;
}

export interface HistorySection {
  id: string;
  number: string;
  title: string;
  subTitle: string;
  description: string;
  imagePath?: string;
  items: HistoryItem[];
}

export interface SynchronousComparison {
  id: string;
  year: string;
  numericYear: number;
  title: string;
  theme: string;
  west: {
    title: string;
    description: string;
    significance: string;
  };
  east: {
    title: string;
    description: string;
    significance: string;
  };
  insight: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: string;
}

export interface BookmarkNote {
  itemId: string;
  savedAt: string;
  userNote?: string;
}
