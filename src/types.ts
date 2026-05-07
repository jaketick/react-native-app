export type EntityListRow = {
  key: string;
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
};
