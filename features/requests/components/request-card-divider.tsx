type RequestCardDividerProps = {
  text: string;
};

export default function RequestCardDivider({ text }: RequestCardDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-[#ececec]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-xs font-medium text-muted-foreground">
          {text}
        </span>
      </div>
    </div>
  );
}
