export interface Update {
  id: number;
  category: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  jiraLink: string;
  statuses: Status[];
  mergeRequests: link[];
  appLinks: link[];
}

export interface link {
  id: number;
  url: string;
}

export interface Status {
  id: number;
  status: "In Progress" | "Completed"; // e.g., "Completed", "In Progress"
  details: Detail[];
}

export interface Detail {
  id: number;
  description: string;
  subPoints?: SubDetail[]; // Optional subpoints
}

export interface SubDetail {
  id: number;
  description: string;
}
export type formatForTypes = "email" | "skype" | "slack";
