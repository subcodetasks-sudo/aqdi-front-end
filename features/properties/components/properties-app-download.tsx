
import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";


export default function PropertiesAppDownload() {
  return (
    <div className="flex flex-col gap-4 pt-2 w-fit">
      <MobileAppLable />
      <MobileAppBtns />
    </div>
  );
}
