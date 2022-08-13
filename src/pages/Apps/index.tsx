import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useSSE from "../../hooks/use-sse";
import { AppStatus } from "../../models/app-status";
import { App } from "../../models/app.model";
import { availableApps } from "../../util/availableApps";
import { checkError } from "../../util/checkError";
import { instance } from "../../util/interceptor";
import { enableGutter } from "../../util";
import AppCard from "./AppCard";
import AppInfo from "./AppInfo";

export const Apps: FC = () => {
  const { t } = useTranslation(["translation", "apps"]);

  const { appStatus, installingApp } = useSSE();

  const [showDetails, setShowDetails] = useState(false);
  const [app, setApp] = useState<App | null>(null);

  useEffect(() => {
    enableGutter();
  }, []);

  // on every render sort installed & uninstalled app keys
  const installedApps = appStatus.filter((app: AppStatus) => {
    return app.installed;
  });
  const notInstalledApps = appStatus.filter((app: AppStatus) => {
    return !app.installed;
  });

  // in case no App data received yet => show loading
  const isLoading = appStatus.length === 0;

  const installHandler = (id: string) => {
    instance.post(`apps/install/${id}`).catch((err) => {
      toast.error(checkError(err));
    });
  };

  const uninstallHandler = (id: string) => {
    instance.post(`apps/uninstall/${id}`, { keepData: true }).catch((err) => {
      toast.error(checkError(err));
    });
  };

  const openDetailsHandler = (app: App) => {
    setApp(app);
    setShowDetails(true);
  };

  const closeDetailsHandler = () => {
    setApp(null);
    setShowDetails(false);
  };

  if (showDetails && app) {
    const appInfos = appStatus.find((a) => a.id === app.id)!;
    return (
      <AppInfo
        app={app}
        installingApp={installingApp}
        onInstall={() => installHandler(app.id)}
        onUninstall={() => uninstallHandler(app.id)}
        installed={appInfos?.installed}
        onClose={closeDetailsHandler}
      />
    );
  }

  return (
    <main className="content-container page-container bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white">
      {isLoading && (
        <section className="content-container flex items-center justify-center">
          <LoadingSpinner color="text-yellow-500" />
        </section>
      )}
      {!isLoading && (
        <>
          <section className="flex h-full flex-wrap">
            <h2 className="w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200">
              {t("apps.installed")}
            </h2>
            {installedApps.map((appStatus: AppStatus) => {
              return (
                <article className="w-full p-3 lg:w-1/3" key={appStatus.id}>
                  <AppCard
                    appInfo={availableApps.get(appStatus.id)!}
                    appStatusInfo={appStatus}
                    installed={true}
                    installingApp={null}
                    onInstall={() => installHandler(appStatus.id)}
                    onOpenDetails={openDetailsHandler}
                    address={appStatus.address}
                    hiddenService={appStatus.hiddenService}
                  />
                </article>
              );
            })}
          </section>
          <section className="flex h-full flex-wrap">
            <h2 className="block w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200 ">
              {t("apps.available")}
            </h2>
            {notInstalledApps.map((appStatus: AppStatus) => {
              return (
                <article className="w-full p-3 lg:w-1/3" key={appStatus.id}>
                  <AppCard
                    appInfo={availableApps.get(appStatus.id)!}
                    appStatusInfo={appStatus}
                    installed={false}
                    installingApp={installingApp}
                    onInstall={() => installHandler(appStatus.id)}
                    onOpenDetails={openDetailsHandler}
                  />
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
};

export default Apps;