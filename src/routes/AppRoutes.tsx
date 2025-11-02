import HomePage from "@/modules/Main/pages/HomePage";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>{t("There's nothing here!")}</p>
          </main>
        }
      />
    </Routes>
  );
}
