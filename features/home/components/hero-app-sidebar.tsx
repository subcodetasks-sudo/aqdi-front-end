import Link from "next/link";

type HeroAppSidebarProps = {
  downloadApp: string;
  googlePlay: string;
  appStore: string;
};

export default function HeroAppSidebar({
  downloadApp,
  googlePlay,
  appStore,
}: HeroAppSidebarProps) {
  return (
    <aside className="order-1 hidden w-16 shrink-0 flex-col items-center gap-5 self-stretch rounded-2xl bg-white px-2 py-6 shadow-sm xl:flex">
      <p className="text-center text-xs font-bold leading-tight text-foreground [writing-mode:vertical-rl]">
        {downloadApp}
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/app"
          className="flex min-h-24 w-12 items-center justify-center rounded-xl bg-black px-1 text-center text-[10px] font-bold leading-tight text-white transition-opacity hover:opacity-80"
          aria-label={googlePlay}
        >
          {googlePlay}
        </Link>
        <Link
          href="/app"
          className="flex min-h-24 w-12 items-center justify-center rounded-xl bg-black px-1 text-center text-[10px] font-bold leading-tight text-white transition-opacity hover:opacity-80"
          aria-label={appStore}
        >
          {appStore}
        </Link>
      </div>
    </aside>
  );
}
