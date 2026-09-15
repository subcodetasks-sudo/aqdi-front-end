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
};

function appendAgentFlag(
  formData: FormData,
  hasAgent: PropertyHasAgentOption | "",
) {
  formData.append("add_legal_agent_of_owner", hasAgent === "yes" ? "1" : "0");
}

export function appendPropertyStep2Fields(
  formData: FormData,
  payload: PropertyStep2FormPayload,
) {
  const { ownerData, agentData } = payload;

  formData.append("id", String(payload.propertyId));
  formData.append("name_real_estate", payload.propertyName.trim());
  formData.append("type_dob_property_owner", ownerData.birthDate.calendarType);

  const ownerName = ownerData.fullName.trim();
  if (ownerName) {
    formData.append("name_owner", ownerName);
  }

  formData.append(
    "property_owner_id_num",
    ownerData.idNumber.replace(/\D/g, ""),
  );
  formData.append(
    "property_owner_dob_day",
    ownerData.birthDate.day.replace(/\D/g, "").padStart(2, "0"),
  );
  formData.append(
    "property_owner_dob_month",
    ownerData.birthDate.month.replace(/\D/g, "").padStart(2, "0"),
  );
  formData.append(
    "property_owner_dob_year",
    ownerData.birthDate.year.replace(/\D/g, ""),
  );
  formData.append(
    "property_owner_mobile",
    formatPropertyOwnerMobileForApi(ownerData.phone),
  );

  const ownerIban = normalizePropertyOwnerIban(ownerData.iban);
  if (ownerIban) {
    formData.append("property_owner_iban", ownerIban);
  }

  appendAgentFlag(formData, ownerData.hasAgent);

  if (ownerData.hasAgent === "yes") {
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
}
