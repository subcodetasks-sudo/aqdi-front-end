export function formatPhoneDisplay(phone: string) {
  const cleaned = phone.replace(/\s/g, "");

  if (!cleaned.startsWith("+966")) {
    return phone;
  }

  const localNumber = cleaned.slice(4);

  if (localNumber.length < 9) {
    return phone;
  }

  return `+966 ${localNumber.slice(0, 2)} ${localNumber.slice(2, 5)} ${localNumber.slice(5)}`;
}
