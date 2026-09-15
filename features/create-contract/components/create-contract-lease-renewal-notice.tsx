"use client";

type CreateContractLeaseRenewalNoticeProps = {
  message: string;
};

export default function CreateContractLeaseRenewalNotice({
  message,
}: CreateContractLeaseRenewalNoticeProps) {
  return (
    <div className="rounded-2xl border border-[#cfe0f5] bg-[#eef5fc] px-4 py-3 text-start text-sm leading-relaxed text-[#3d5a80]">
      {message}
    </div>
  );
}
