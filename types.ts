
export interface AnalysisResult {
  roomType: string;
  mood: string;
  declutteringSteps: {
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  organizationHacks: {
    item: string;
    suggestion: string;
  }[];
  storageSolutions: {
    productType: string;
    reason: string;
  }[];
  aestheticTips: string[];
}

export interface ComparisonResult {
  isSameRoom: boolean;
  similarityReason: string;
  score: number;
  completedTasks: string[];
  missedTasks: string[];
  feedback: string;
}

export interface UploadedImage {
  file: File | null;
  previewUrl: string;
  base64: string;
}

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  imageBase64: string;
  result: AnalysisResult;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  UPLOADING_FOLLOWUP = 'UPLOADING_FOLLOWUP',
  COMPARING = 'COMPARING'
}
