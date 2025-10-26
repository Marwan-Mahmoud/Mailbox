import { Folder } from "./folder";
import { PageInfo } from "./page-info";

export interface FolderPage {
    content: Folder[];
    page: PageInfo;
}
