import type { NationalAddressMethodId } from "@/features/create-contract/types/national-address";
import type { AgentDataState } from "@/features/create-contract/types/owner-step";
import {
  appendPropertyOwnerBirthDate,
  formatPropertyOwnerMobileForApi,
} from "@/features/create-property/utils/property-owner-api";
import {
  appendManualNationalAddressFields,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";

export type SubmitContractStep2Payload = {
  contractId: number;
  addressMethod: NationalAddressMethodId;
  latitude: number;
  longitude: number;
  imageAddress?: File;
  addressUrl?: string;
  manualAddress?: ManualNationalAddressData;
  /** Deceased-owner legal agent — submitted with address in V2 step 2. */
  legalAgent?: Omit<AgentDataState, "powerOfAttorneyFiles">;
  /** Top-level File so server actions keep the binary. */
  legalAgentPoaFile?: File;
  /** When step1 already stored the POA, omit the file on step2. */
  hasExistingLegalAgentPoa?: boolean;
  /** Endowment (waqf) nazir — same identity keys as legal agent, different doc. */
  waqfNazir?: Omit<AgentDataState, "powerOfAttorneyFiles">;
  /** Optional re-upload; step1 usually already has copy_of_the_trusteeship_deed. */
  waqfNazirDocumentFile?: File;
};

function appendAgentIdentityFields(
  formData: FormData,
  agentData: Omit<AgentDataState, "powerOfAttorneyFiles">,
) {
  formData.append(
    "id_num_of_property_owner_agent",
    agentData.idNumber.replace(/\D/g, ""),
  );
  formData.append(
    "mobile_of_property_owner_agent",
    formatPropertyOwnerMobileForApi(agentData.phone),
  );
  appendPropertyOwnerBirthDate(formData, agentData.birthDate, {
    calendarField: "type_dob_property_owner_agent",
    dayField: "dob_of_property_owner_agent_day",
    monthField: "dob_of_property_owner_agent_month",
    yearField: "dob_of_property_owner_agent_year",
  });

  const day = agentData.birthDate.day.replace(/\D/g, "").padStart(2, "0");
  const month = agentData.birthDate.month.replace(/\D/g, "").padStart(2, "0");
  const year = agentData.birthDate.year.replace(/\D/g, "");
  if (day && month && year) {
    formData.append(
      "dob_of_property_owner_agent",
      `${day}-${month}-${year}`,
    );
  }
}

function appendLegalAgentFields(
  formData: FormData,
  agentData: Omit<AgentDataState, "powerOfAttorneyFiles">,
  legalAgentPoaFile: File | undefined,
) {
  appendAgentIdentityFields(formData, agentData);

  if (legalAgentPoaFile) {
    formData.append(
      "copy_power_of_attorney_from_heirs_to_agent",
      legalAgentPoaFile,
    );
    formData.append(
      "copy_of_the_authorization_or_agency",
      legalAgentPoaFile,
    );
  }
}

function appendWaqfNazirFields(
  formData: FormData,
  agentData: Omit<AgentDataState, "powerOfAttorneyFiles">,
  documentFile: File | undefined,
) {
  appendAgentIdentityFields(formData, agentData);

  if (documentFile) {
    formData.append("copy_of_the_trusteeship_deed", documentFile);
    formData.append(
      "copy_of_guardians_power_of_attorney_for_agent",
      documentFile,
    );
  }
}

export function appendContractStep2Fields(
  formData: FormData,
  payload: SubmitContractStep2Payload,
) {
  formData.append("id", String(payload.contractId));
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));
  formData.append("lat", String(payload.latitude));
  formData.append("lng", String(payload.longitude));

  if (payload.addressMethod === "photo" && payload.imageAddress) {
    formData.append("image_address", payload.imageAddress);
  }

  if (payload.addressMethod === "link" && payload.addressUrl) {
    formData.append("address_url", payload.addressUrl);
  }

  if (payload.addressMethod === "manual" && payload.manualAddress) {
    appendManualNationalAddressFields(formData, payload.manualAddress);
  }

  if (payload.legalAgent) {
    appendLegalAgentFields(
      formData,
      payload.legalAgent,
      payload.legalAgentPoaFile,
    );
  }

  if (payload.waqfNazir) {
    appendWaqfNazirFields(
      formData,
      payload.waqfNazir,
      payload.waqfNazirDocumentFile,
    );
  }
}
