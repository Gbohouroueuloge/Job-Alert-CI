import { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import { TooltipProvider } from "./components/ui/tooltip";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import HowItWorks from "./Pages/HowItWorks";
import { useEffect } from "react";
import DetailsFiliere from "./Pages/Filieres/DetailsFiliere";
import Filieres from "./Pages/Filieres";
import Offres from "./Pages/Offres";
import DetailsOffre from "./Pages/Offres/DetailsOffre";
import BootLoader from "./components/BootLoader";
import Conseils from "./Pages/Conseils";
import DetailsConseil from "./Pages/Conseils/DetailsConseil";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  const [ready, setReady] = useState(false);

  return (
    <TooltipProvider>
      {!ready && <BootLoader onFinish={() => setReady(true)} />}

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="comment-ca-marche" element={<HowItWorks />} />
            <Route path="offres" element={<Offres />} />
            <Route path="filieres" element={<Filieres />} />
            <Route path="filieres/:filiere" element={<DetailsFiliere />} />
            <Route path="/offres/:id" element={<DetailsOffre />} />
            <Route path="/conseils" element={<Conseils />} />
            <Route path="/conseils/:slug" element={<DetailsConseil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;