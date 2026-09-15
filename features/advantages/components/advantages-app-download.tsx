import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

export default function AdvantagesAppDownload() {
  return (
    <div className="flex flex-col items-center justify-center gap-6  pt-8 md:flex-row">
      <MobileAppLable />
      <MobileAppBtns />
    </div>
  );
}
