import { Email } from "./email";
import { PageInfo } from "./page-info";

export interface EmailPage {
    content: Email[];
    page: PageInfo;
}
