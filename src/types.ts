export type Node = {
  name: string;
  nodes?: Node[];
  size?: string;
  lastModified?: string;
  parentPath?: string;
};