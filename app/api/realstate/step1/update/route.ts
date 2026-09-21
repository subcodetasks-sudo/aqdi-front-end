import { apiFormDataRequest } from "@/lib/api/api-request";

export const runtime = "nodejs";

type PropertyStep1ApiData = {
  id: number;
  step: number;
};

type PropertyStep1ApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: PropertyStep1ApiData;
};

function cloneFormData(source: FormData): FormData {
  const formData = new FormData();

  for (const [key, value] of source.entries()) {
    formData.append(key, value);
  }

  return formData;
}

/**
 * Proxies property step1 update multipart uploads (edit mode).
 * See `/api/realstate/step1` for why this bypasses server actions.
 */
export async function POST(request: Request) {
  // Rebuild FormData so File/Blob parts are not tied to the consumed request
  // body stream (can arrive empty when re-forwarded as-is on some Next builds).
  const formData = cloneFormData(await request.formData());

  const response = await apiFormDataRequest<PropertyStep1ApiResponse>(
    "/realstate/update/step1",
    formData,
  );

  if (!response.ok || !response.data?.success) {
    return Response.json(
      {
        ok: false,
        error:
          response.error || response.data?.message || "Something went wrong",
      },
      { status: response.ok ? 400 : response.status },
    );
  }

  const propertyIdValue = formData.get("id");
  const fallbackPropertyId =
    typeof propertyIdValue === "string" ? Number(propertyIdValue) : 0;

  return Response.json({
    ok: true,
    propertyId: response.data.data?.id ?? fallbackPropertyId,
    message: response.data.message,
  });
}
