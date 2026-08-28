import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faFile,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileZipper,
  faFileCode,
  faFileLines,
  faFileCsv,
} from '@fortawesome/free-solid-svg-icons';

export const MIME_ICON_MAP: Record<string, IconDefinition> = {
  // PDF
  'application/pdf': faFilePdf,

  // Word
  'application/msword': faFileWord,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': faFileWord,

  // Excel
  'application/vnd.ms-excel': faFileExcel,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': faFileExcel,

  // PowerPoint
  'application/vnd.ms-powerpoint': faFilePowerpoint,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': faFilePowerpoint,

  // Archives
  'application/zip': faFileZipper,
  'application/x-rar-compressed': faFileZipper,
  'application/x-7z-compressed': faFileZipper,
  'application/x-tar': faFileZipper,
  'application/gzip': faFileZipper,
  
  // Text
  'text/plain': faFileLines,
  'text/csv': faFileCsv,
  'text/markdown': faFileLines,

  // Code
  'text/html': faFileCode,
  'text/css': faFileCode,
  'application/json': faFileCode,
  'application/xml': faFileCode,
  'text/xml': faFileCode,
};

export function getMimeIcon(mimeType?: string): IconDefinition {
  const type = mimeType?.toLowerCase() ?? '';

  if (MIME_ICON_MAP[type]) {
    return MIME_ICON_MAP[type];
  }

  // Category fallback
  if (type.startsWith('image/')) return faFileImage;
  if (type.startsWith('audio/')) return faFileAudio;
  if (type.startsWith('video/')) return faFileVideo;
  if (type.startsWith('text/')) return faFileLines;
  if (type.endsWith('python')) return faFileCode;
  if (type.endsWith('javascript')) return faFileCode;

  return faFile;
}
