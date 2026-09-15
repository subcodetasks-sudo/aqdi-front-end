export type BlogListingLabels = {
  tabs: Record<
    "all" | "propertyManagement" | "contracts" | "realEstateMarket",
    string
  >;
  sidebar: {
    stats: {
      title: string;
      subtitle: string;
      description: string;
      statsHeading: string;
      logoAlt: string;
      activeUsers: string;
      activeUsersLabel: string;
      annualContracts: string;
      annualContractsLabel: string;
      leasedUnits: string;
      leasedUnitsLabel: string;
    };
    categories: {
      title: string;
      items: {
        id: string;
        label: string;
        count: string;
      }[];
    };
    tags: {
      title: string;
      items: string[];
    };
    newsletter: {
      badge: string;
      title: string;
      description: string;
      placeholder: string;
      subscribe: string;
      submitEmailLabel: string;
    };
  };
  post: {
    listCategory: string;
    listTitle: string;
    date: string;
    readTime: string;
    views: string;
    readMore: string;
  };
  pagination: {
    previous: string;
    next: string;
  };
};
