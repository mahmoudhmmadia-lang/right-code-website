export type AnalyticsOverview = {
  windowDays: number;
  generatedAt: string;
  summary: {
    publishedPages: number;
    activeServices: number;
    publicProjects: number;
    publishedPosts: number;
    trainingPrograms: number;
    teamMembers: number;
    totalInquiries: number;
    newInquiries: number;
    averageProgress: number;
  };
  inquiryStatuses: StatusCount[];
  projectStatuses: StatusCount[];
  inquiryActivity: ActivityPoint[];
  recentInquiries: RecentInquiry[];
};

export type StatusCount = { status: string; count: number };
export type ActivityPoint = { date: string; count: number };
export type RecentInquiry = {
  id: string;
  fullName: string;
  email: string;
  organization?: string | null;
  status: string;
  createdAt: string;
};
