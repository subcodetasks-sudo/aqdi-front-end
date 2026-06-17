type AuthOrDividerProps = {
  label: string;
};

export default function AuthOrDivider({ label }: AuthOrDividerProps) {
  return (
    <div className="flex items-center gap-4 py-2 w-3/4 mx-auto">
      <div
        className="h-[2px] w-full flex-1 bg-linear-to-r from-black via-black/50 to-transparent"
        aria-hidden="true"
      />
      <span className="shrink-0 text-sm font-bold text-foreground">
        {label}
      </span>
      <div
        className="h-[2px] w-full flex-1 bg-linear-to-l from-black via-black/50 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
