import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { RealEstateListItem } from "@/features/my-properties/types/real-estate-list-item";

type ContractTypeLabels = {
  housing: string;
  commercial: string;
};

function formatPropertyDate(isoDate: string) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function mapRealEstateToCard(
  item: RealEstateListItem,
  contractTypeLabels: ContractTypeLabels,
): MyPropertyCardData {
  const contractLabel =
    item.contract_type === "commercial"
      ? contractTypeLabels.commercial
      : contractTypeLabels.housing;

  return {
    id: String(item.id),
    propertyId: item.id,
    contractType: item.contract_type,
    deedImageUrl: item.image_instrument,
    step: item.step,
    title: item.property_type_name?.trim() || `${contractLabel} #${item.id}`,
    date: formatPropertyDate(item.created_at),
  };
}
