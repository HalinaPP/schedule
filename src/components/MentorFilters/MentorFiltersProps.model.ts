export interface MentorFiltersProps {
  data: any;
  filterFlag: any;
  setFilterFlags(flag: {}): void;
  setDates(date: any): void;
  tagRender(props: any): JSX.Element;
  defaultColumns: string[];
  optionsKeyOfEvents: any;
  changeColumnsSelect(value: any): void;
}
