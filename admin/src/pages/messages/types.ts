export const MESSAGE_STATUSES = ["NEW", "REVIEWING", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST", "SPAM", "ARCHIVED"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export type Message = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  message: string;
  status: MessageStatus;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MessageCollection = { data: Message[]; pagesNumber: number; totalCount: number };
export type MessageForm = { status: MessageStatus; internalNotes: string };
