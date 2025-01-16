import { Email } from "./email";
import { PageInfo } from "./page-info";

export interface Page {
    content: Email[];
    page: PageInfo;
}
