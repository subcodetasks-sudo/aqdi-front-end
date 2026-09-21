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
 * Proxies property step1 multipart uploads. Prefer this over a server action
 * when several File fields are attached — Next 16.3.x can drop FormData file
 * parts when they cross the server-action boundary.
 */
export async function POST(request: Request) {
  const formData = cloneFormData(await request.formData());
  const response = await apiFormDataRequest<PropertyStep1ApiResponse>(
    "/realstate/step1",
    formData,
  );

  if (!response.ok || !response.data?.success || !response.data.data?.id) {
    return Response.json(
      {
        ok: false,
        error:
          response.error || response.data?.message || "Something went wrong",
      },
      { status: response.ok ? 400 : response.status },
    );
  }

  return Response.json({
    ok: true,
    propertyId: response.data.data.id,
    message: response.data.message,
  });
}
