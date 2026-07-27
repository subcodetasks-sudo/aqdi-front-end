import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import Navbar from "@/features/shared/components/navbar";
import { appSettingsKeys } from "@/features/settings/query-keys";
import { getAppSettings } from "@/features/settings/services/get-app-settings";
import { getQueryClient } from "@/lib/react-query/get-query-client";

export default async function NavbarShell() {
  const dialogT = await getTranslations("startWithAqdi.dialog");
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: appSettingsKeys.detail(),
    queryFn: () => getAppSettings(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
        contractTypeDialog: {
          title: dialogT("contractTypeDialog.title"),
          mainTitle: dialogT("contractTypeDialog.mainTitle"),
          subtitle: dialogT("contractTypeDialog.subtitle"),
          iconAlt: dialogT("contractTypeDialog.iconAlt"),
          options: {
            residential: {
              title: dialogT("contractTypeDialog.options.residential.title"),
              description: dialogT(
                "contractTypeDialog.options.residential.description",
              ),
              iconAlt: dialogT("contractTypeDialog.options.residential.iconAlt"),
            },
            commercial: {
              title: dialogT("contractTypeDialog.options.commercial.title"),
              description: dialogT(
                "contractTypeDialog.options.commercial.description",
              ),
              iconAlt: dialogT("contractTypeDialog.options.commercial.iconAlt"),
            },
          },
        },
      }}
    />
    </HydrationBoundary>
  );
}
