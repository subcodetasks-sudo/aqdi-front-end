import { getUserInitials } from "@/features/auth/utils/get-user-initials";

type ProfileAvatarProps = {
  name: string;
  photo?: string;
  avatarAlt: string;
};

export default function ProfileAvatar({
  name,
  photo,
  avatarAlt,
}: ProfileAvatarProps) {
  const initials = getUserInitials(name);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-white shadow-sm">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={avatarAlt}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-brand">{initials}</span>
        )}
      </div>
    </div>
  );
}
