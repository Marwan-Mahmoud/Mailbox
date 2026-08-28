import { Attachment } from "./attachment";

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  draft: boolean;
  attachments?: Attachment[];
  attachmentsId?: string[];
}
