import CustomIcon from "@/features/shared/components/custom-icon";
import MyPropertiesAddButton from "@/features/my-properties/components/my-properties-add-button";

type MyPropertiesEmptyStateProps = {
  title: string;
  description: string;
  addPropertyLabel: string;
};

export default function MyPropertiesEmptyState({
  title,
  description,
  addPropertyLabel,
}: MyPropertiesEmptyStateProps) {
  return (
    <div className="flex min-h-[min(28rem,70vh)] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[#d9d9d9] bg-white px-6 py-16 text-center sm:px-10">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-brand-background-green">
        <CustomIcon src="/icons/home.svg" size={32} className="text-brand" />
      </div>

      <h2 className="mb-2 text-xl font-extrabold text-brand sm:text-2xl">
        {title}
      </h2>
      <p className="mb-8 max-w-md text-sm leading-7 text-[#7a7a7a] sm:text-base">
        {description}
      </p>

      <MyPropertiesAddButton label={addPropertyLabel} />
    </div>
  );
}
