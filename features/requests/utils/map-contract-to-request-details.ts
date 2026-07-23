import type { UncompletedContractData } from "@/features/create-contract/types/uncompleted-contract";

export type RequestDetailsSection = {
  title: string;
  rows: { label: string; value: string }[];
};

export type RequestDetailsViewModel = {
  requestNumber: string;
  sections: RequestDetailsSection[];
};

export type RequestDetailsDialogLabels = {
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
    name: string;
    idNumber: string;
    mobile: string;
    unitType: string;
    usage: string;
    area: string;
    floor: string;
    electricityMeter: string;
    waterMeter: string;
    annualRent: string;
    contractDuration: string;
    paymentsCount: string;
    financialFee: string;
  };
  duration: {
    oneYear: string;
    years: string;
    months: string;
  };
  payments: {
    monthly: string;
    quarterly: string;
    semiAnnual: string;
    annual: string;
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
  rows: { label: string; value: string }[],
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

function formatDuration(
  data: UncompletedContractData,
  labels: RequestDetailsDialogLabels,
) {
  const step6 = data.step6;
  if (!step6) {
    return null;
  }

  if (step6.duration_preset === "other") {
    const years = step6.duration_years ?? 0;
    const months = step6.duration_months ?? 0;
    const parts: string[] = [];

    if (years > 0) {
      parts.push(
        years === 1
          ? labels.duration.oneYear
          : labels.duration.years.replace("{count}", String(years)),
      );
    }

    if (months > 0) {
      parts.push(labels.duration.months.replace("{count}", String(months)));
    }

    return parts.length > 0 ? parts.join(" · ") : null;
  }

  const years = step6.contract_term_in_years ?? step6.duration_years;
  if (typeof years !== "number" || years <= 0) {
    return null;
  }

  return years === 1
    ? labels.duration.oneYear
    : labels.duration.years.replace("{count}", String(years));
}

function formatPayments(
  paymentTypeId: number | null | undefined,
  paymentTypeName: string | null | undefined,
  labels: RequestDetailsDialogLabels,
) {
  if (paymentTypeName?.trim()) {
    return paymentTypeName.trim();
  }

  switch (paymentTypeId) {
    case 1:
      return labels.payments.monthly;
    case 2:
      return labels.payments.quarterly;
    case 3:
      return labels.payments.semiAnnual;
    case 4:
      return labels.payments.annual;
    default:
      return null;
  }
}

function resolveUnit(data: UncompletedContractData) {
  if (Array.isArray(data.units) && data.units.length > 0) {
    return data.units[0];
  }

  if (Array.isArray(data.step5?.units) && data.step5.units.length > 0) {
    return data.step5.units[0];
  }

  return data.step5 ?? null;
}

function buildSection(
  title: string,
  rows: { label: string; value: string }[],
): RequestDetailsSection | null {
  if (rows.length === 0) {
    return null;
  }

  return { title, rows };
}

export function mapContractToRequestDetails(
  data: UncompletedContractData,
  labels: RequestDetailsDialogLabels,
): RequestDetailsViewModel {
  const empty = labels.emptyValue;
  const owner = data.step3;
  const tenant = data.step4;
  const unit = resolveUnit(data);
  const finance = data.step6;

  const ownerRows: { label: string; value: string }[] = [];
  pushRow(
    ownerRows,
    labels.fields.name,
    toDisplayValue(owner?.name_owner, empty),
  );
  pushRow(
    ownerRows,
    labels.fields.idNumber,
    toDisplayValue(owner?.property_owner_id_num, empty),
  );
  pushRow(
    ownerRows,
    labels.fields.mobile,
    toDisplayValue(owner?.property_owner_mobile, empty),
  );

  const tenantRows: { label: string; value: string }[] = [];
  pushRow(
    tenantRows,
    labels.fields.name,
    toDisplayValue(
      tenant?.tenant_name || tenant?.name_tenant || tenant?.name,
      empty,
    ),
  );
  pushRow(
    tenantRows,
    labels.fields.idNumber,
    toDisplayValue(
      tenant?.tenant_id_num || tenant?.tenant_entity_unified_registry_number,
      empty,
    ),
  );
  pushRow(
    tenantRows,
    labels.fields.mobile,
    toDisplayValue(tenant?.tenant_mobile, empty),
  );

  const unitRows: { label: string; value: string }[] = [];
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

  const financeRows: { label: string; value: string }[] = [];
  pushRow(
    financeRows,
    labels.fields.annualRent,
    formatAmount(finance?.annual_rent_amount_for_the_unit, labels.currency),
  );
  pushRow(
    financeRows,
    labels.fields.contractDuration,
    formatDuration(data, labels),
  );
  pushRow(
    financeRows,
    labels.fields.paymentsCount,
    formatPayments(
      finance?.payment_type_id,
      finance?.payment_type_name,
      labels,
    ),
  );
  pushRow(
    financeRows,
    labels.fields.financialFee,
    formatAmount(finance?.doc_fee, labels.currency),
  );

  const sections = [
    buildSection(labels.ownerSection, ownerRows),
    buildSection(labels.tenantSection, tenantRows),
    buildSection(labels.unitSection, unitRows),
    buildSection(labels.financeSection, financeRows),
  ].filter((section): section is RequestDetailsSection => section !== null);

  return {
    requestNumber: String(data.contract_id),
    sections,
  };
}
