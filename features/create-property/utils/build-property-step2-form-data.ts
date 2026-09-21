import type { PropertyAgentDataState } from "@/features/create-property/types/owner-step";
import type { PropertyOwnerDataState } from "@/features/create-property/types/owner-step";
import {
  appendPropertyOwnerBirthDate,
  formatPropertyOwnerMobileForApi,
  normalizePropertyOwnerIban,
} from "@/features/create-property/utils/property-owner-api";
import type { PropertyHasAgentOption } from "@/features/create-property/types/owner-step";

export type PropertyStep2FormPayload = {
  propertyId: number;
  propertyName: string;
  ownerData: PropertyOwnerDataState;
  agentData: PropertyAgentDataState;
  /** @deprecated Deceased-owner no longer skips owner fields; prefer agentOnly. */
  skipOwnerFields?: boolean;
  /** Deceased-owner flow collects agent fields only. */
  agentOnly?: boolean;
};

function appendAgentFlag(
  formData: FormData,
  hasAgent: PropertyHasAgentOption | "",
) {
  formData.append("add_legal_agent_of_owner", hasAgent === "yes" ? "1" : "0");
}

function appendAgentFields(formData: FormData, agentData: PropertyAgentDataState) {
  formData.append(
    "id_num_of_property_owner_agent",
    agentData.idNumber.replace(/\D/g, ""),
  );
  appendPropertyOwnerBirthDate(formData, agentData.birthDate, {
    calendarField: "type_dob_property_owner_agent",
    dayField: "dob_of_property_owner_agent_day",
    monthField: "dob_of_property_owner_agent_month",
    yearField: "dob_of_property_owner_agent_year",
  });
  formData.append(
    "mobile_of_property_owner_agent",
    formatPropertyOwnerMobileForApi(agentData.phone),
  );

  const powerOfAttorneyFile = agentData.powerOfAttorneyFiles[0];
  if (powerOfAttorneyFile) {
    formData.append(
      "copy_of_the_authorization_or_agency",
      powerOfAttorneyFile,
    );
  }
}

export function appendPropertyStep2Fields(
  formData: FormData,
  payload: PropertyStep2FormPayload,
) {
  const {
    ownerData,
    agentData,
    skipOwnerFields = false,
    agentOnly = false,
  } = payload;

  formData.append("id", String(payload.propertyId));
  formData.append("name_real_estate", payload.propertyName.trim());

  if (skipOwnerFields && !agentOnly) {
    appendAgentFlag(formData, "no");
    return;
  }

  // Deceased-owner UI collects agent fields only, but the API still requires
  // property_owner_* — mirror the agent identity into those owner fields.
  const ownerSource = agentOnly
    ? {
        idNumber: agentData.idNumber,
        birthDate: agentData.birthDate,
        phone: agentData.phone,
        iban: ownerData.iban,
        hasAgent: "yes" as const,
      }
    : ownerData;

  formData.append(
    "type_dob_property_owner",
    ownerSource.birthDate.calendarType,
  );

  formData.append(
    "property_owner_id_num",
    ownerSource.idNumber.replace(/\D/g, ""),
  );
  formData.append(
    "property_owner_dob_day",
    ownerSource.birthDate.day.replace(/\D/g, "").padStart(2, "0"),
  );
  formData.append(
    "property_owner_dob_month",
    ownerSource.birthDate.month.replace(/\D/g, "").padStart(2, "0"),
  );
  formData.append(
    "property_owner_dob_year",
    ownerSource.birthDate.year.replace(/\D/g, ""),
  );
  formData.append(
    "property_owner_mobile",
    formatPropertyOwnerMobileForApi(ownerSource.phone),
  );

  const ownerIban = normalizePropertyOwnerIban(ownerSource.iban);
  if (ownerIban) {
    formData.append("property_owner_iban", ownerIban);
  }

  const includeAgent = agentOnly || ownerSource.hasAgent === "yes";
  appendAgentFlag(formData, includeAgent ? "yes" : "no");

  if (includeAgent) {
    appendAgentFields(formData, agentData);
  }
}
