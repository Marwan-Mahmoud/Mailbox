export interface Attachment {
  id?: string;
  filename: string;
  contentType: string;
  size: number;
  progress?: number;
}