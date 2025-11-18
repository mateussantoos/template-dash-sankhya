import { Routes, Route, BrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout/dashboard-layout";
import { Home } from "@/app/pages/home/home";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={
              <Home
                title="Home"
                infoTooltipText="Esta é a página inicial do dashboard"
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
