"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import type {
  PropertyAgentDataState,
  PropertyHasAgentOption,
  PropertyOwnerDataState,
} from "@/features/create-property/types/owner-step";
import {
  appendPropertyOwnerBirthDate,
  formatPropertyOwnerMobileForApi,
  normalizePropertyOwnerIban,
} from "@/features/create-property/utils/property-owner-api";

export type SubmitPropertyStep2Payload = {
  propertyId: number;
  propertyName: string;
  ownerData: PropertyOwnerDataState;
  agentData: PropertyAgentDataState;
};

type PropertyStep2ApiData = {
  id: number;
  step: number;
};

type PropertyStep2ApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: PropertyStep2ApiData;
};

function appendAgentFlag(
  formData: FormData,
  hasAgent: PropertyHasAgentOption | "",
) {
  formData.append("add_legal_agent_of_owner", hasAgent === "yes" ? "1" : "0");
}

export async function submitPropertyStep2(payload: SubmitPropertyStep2Payload) {
  const formData = new FormData();
  const { ownerData, agentData } = payload;

  formData.append("id", String(payload.propertyId));
  formData.append("name_real_estate", payload.propertyName.trim());
  formData.append("type_dob_property_owner", ownerData.birthDate.calendarType);
  formData.append("name_owner", ownerData.fullName.trim());
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
  formData.append(
    "property_owner_iban",
    normalizePropertyOwnerIban(ownerData.iban),
  );
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

  const response = await apiFormDataRequest<PropertyStep2ApiResponse>(
    "/realstate/step2",
    formData,
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    propertyId: response.data.data?.id ?? payload.propertyId,
    message: response.data.message,
  };
}
