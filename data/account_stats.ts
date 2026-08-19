
export interface AccountStat {
  label: string;
  count: number | string;
  iconClass: string;
}

export const accountStats: AccountStat[] = [
  {
    label: "Awaiting Pickup",
    count: 4,
    iconClass: "icon-HourglassMedium",
  },
  {
    label: "Cancelled Orders",
    count: 12,
    iconClass: "icon-ReceiptX",
  },
  {
    label: "Total Number of Orders",
    count: 200,
    iconClass: "icon-Package",
  },
];
