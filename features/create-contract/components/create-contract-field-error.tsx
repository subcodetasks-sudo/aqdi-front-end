type CreateContractFieldErrorProps = {
  message: string;
};

export default function CreateContractFieldError({
  message,
}: CreateContractFieldErrorProps) {
  return <p className="mt-1.5 text-xs font-medium text-[#c62828]">{message}</p>;
}
