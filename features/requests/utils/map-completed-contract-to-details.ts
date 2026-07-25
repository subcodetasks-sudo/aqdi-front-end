import type { CompletedContractDetails } from "@/features/requests/services/get-completed-contract-details";

export type RequestContractDetailsRow = { label: string; value: string };

export type RequestContractDetailsSection = {
  title: string;
  rows: RequestContractDetailsRow[];
};

export type RequestContractDetailsViewModel = {
  requestNumber: string;
  sections: RequestContractDetailsSection[];
};

export type RequestContractDialogLabels = {
  title: string;
  subtitle: string;
  close: string;
  loading: string;
  emptyValue: string;
  ownerSection: string;
  tenantSection: string;
  unitSection: string;
  financeSection: string;
  fields: {
    idNumber: string;
    unitType: string;
    usage: string;
    area: string;
    floor: string;
    electricityMeter: string;
    waterMeter: string;
    contractDuration: string;
    docFee: string;
    totalPrice: string;
  };
  duration: {
    oneYear: string;
    years: string;
    months: string;
  };
  currency: string;
  areaUnit: string;
};

function toDisplayValue(
  value: string | number | null | undefined,
  emptyValue = "—",
) {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  if (
    text === "" ||
    text === emptyValue ||
    text === "-" ||
    text === "–" ||
    text === "—" ||
    text === "null" ||
    text === "undefined"
  ) {
    return null;
  }

  return text;
}

function pushRow(
  rows: RequestContractDetailsRow[],
  label: string,
  value: string | null,
) {
  if (value) {
    rows.push({ label, value });
  }
}

function formatAmount(value: number | null | undefined, currency: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return `${value.toLocaleString("en-US")} ${currency}`;
}

function buildSection(
  title: string,
  rows: RequestContractDetailsRow[],
): RequestContractDetailsSection | null {
  if (rows.length === 0) {
    return null;
  }

  return { title, rows };
}

function formatDuration(
  contract: CompletedContractDetails["contract"],
  labels: RequestContractDialogLabels,
) {
  const years = contract.duration_years;
  const months = contract.duration_months;

  if (contract.duration_preset === "other") {
    const parts: string[] = [];

    if (typeof years === "number" && years > 0) {
      parts.push(
        years === 1
          ? labels.duration.oneYear
          : labels.duration.years.replace("{count}", String(years)),
      );
    }

    if (typeof months === "number" && months > 0) {
      parts.push(labels.duration.months.replace("{count}", String(months)));
    }

    return parts.length > 0 ? parts.join(" · ") : null;
  }

  if (typeof years === "number" && years > 0) {
    return years === 1
      ? labels.duration.oneYear
      : labels.duration.years.replace("{count}", String(years));
  }

  return null;
}

function resolveUnit(contract: CompletedContractDetails["contract"]) {
  if (Array.isArray(contract.units) && contract.units.length > 0) {
    return contract.units[0];
  }

  return null;
}

export function mapCompletedContractToDetails(
  data: CompletedContractDetails,
  labels: RequestContractDialogLabels,
): RequestContractDetailsViewModel {
  const empty = labels.emptyValue;
  const { contract, financial } = data;
  const unit = resolveUnit(contract);

  const ownerRows: RequestContractDetailsRow[] = [];
  pushRow(
    ownerRows,
    labels.fields.idNumber,
    toDisplayValue(contract.property_owner_id_num, empty),
  );

  const tenantRows: RequestContractDetailsRow[] = [];
  pushRow(
    tenantRows,
    labels.fields.idNumber,
    toDisplayValue(contract.tenant_id_num, empty),
  );

  const unitRows: RequestContractDetailsRow[] = [];
  pushRow(
    unitRows,
    labels.fields.unitType,
    toDisplayValue(unit?.unit_type_name, empty),
  );
  pushRow(
    unitRows,
    labels.fields.usage,
    toDisplayValue(unit?.unit_usage_name, empty),
  );
  const area = toDisplayValue(unit?.unit_area, empty);
  pushRow(
    unitRows,
    labels.fields.area,
    area ? `${area} ${labels.areaUnit}` : null,
  );
  pushRow(
    unitRows,
    labels.fields.floor,
    toDisplayValue(unit?.floor_number, empty),
  );
  pushRow(
    unitRows,
    labels.fields.electricityMeter,
    toDisplayValue(unit?.electricity_meter_number, empty),
  );
  pushRow(
    unitRows,
    labels.fields.waterMeter,
    toDisplayValue(unit?.water_meter_number, empty),
  );

  const financeRows: RequestContractDetailsRow[] = [];
  pushRow(
    financeRows,
    labels.fields.contractDuration,
    formatDuration(contract, labels),
  );
  pushRow(
    financeRows,
    labels.fields.docFee,
    formatAmount(financial?.doc_fee, labels.currency),
  );
  pushRow(
    financeRows,
    labels.fields.totalPrice,
    formatAmount(financial?.total_price, labels.currency),
  );

  const sections = [
    buildSection(labels.ownerSection, ownerRows),
    buildSection(labels.tenantSection, tenantRows),
    buildSection(labels.unitSection, unitRows),
    buildSection(labels.financeSection, financeRows),
  ].filter(
    (section): section is RequestContractDetailsSection => section !== null,
  );

  return {
    requestNumber: String(contract.uuid),
    sections,
  };
}
