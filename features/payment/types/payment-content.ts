export type PaymentContentType = "success" | "failed";

export type PaymentContentItem = {
  id: number;
  type: PaymentContentType;
  message: string;
  button_text: string | null;
  button_link: string | null;
  button_text_2: string | null;
  button_link_2: string | null;
};

export type PaymentContentApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: PaymentContentItem[];
};

export type PaymentContentButton = {
  text: string;
  href: string;
};

export function parsePaymentContentButtons(
  content: PaymentContentItem | null | undefined,
): PaymentContentButton[] {
  if (!content) {
    return [];
  }

  const buttons: PaymentContentButton[] = [];

  if (content.button_text?.trim() && content.button_link?.trim()) {
    buttons.push({
      text: content.button_text.trim(),
      href: content.button_link.trim(),
    });
  }

  if (content.button_text_2?.trim() && content.button_link_2?.trim()) {
    buttons.push({
      text: content.button_text_2.trim(),
      href: content.button_link_2.trim(),
    });
  }

  return buttons;
}
