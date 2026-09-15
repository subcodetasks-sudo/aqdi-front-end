export type ManualDeedEntryLabels = {
  separator: string;
  toggleLabel: string;
  instrumentNumber: {
    label: string;
    placeholder: string;
    hint: string;
  };
  instrumentDate: {
    label: string;
    hijri: string;
    gregorian: string;
    day: string;
    month: string;
    year: string;
    dayPlaceholder: string;
    monthPlaceholder: string;
    yearPlaceholder: string;
  };
};
