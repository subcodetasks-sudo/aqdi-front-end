import { getTranslations } from "next-intl/server";

import Navbar from "@/features/shared/components/navbar";

export default async function NavbarShell() {
  const dialogT = await getTranslations("startWithAqdi.dialog");

  return (
    <Navbar
      dialogLabels={{
        title: dialogT("title"),
        close: dialogT("close"),
        mainTitle: dialogT("mainTitle"),
        subtitle: dialogT("subtitle"),
        ejarLogoAlt: dialogT("ejarLogoAlt"),
        aqdiLogoAlt: dialogT("aqdiLogoAlt"),
        divider: dialogT("divider"),
        continue: dialogT("continue"),
        newContract: {
          title: dialogT("newContract.title"),
          description: dialogT("newContract.description"),
          imageAlt: dialogT("newContract.imageAlt"),
        },
        estateContract: {
          title: dialogT("estateContract.title"),
          description: dialogT("estateContract.description"),
          imageAlt: dialogT("estateContract.imageAlt"),
        },
      }}
    />
  );
}
