import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import { TooltipProvider } from "./components/ui/tooltip";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import HowItWorks from "./Pages/HowItWorks";
import { useEffect } from "react";
import DetailsFiliere from "./Pages/Filieres/DetailsFiliere";
import Filieres from "./Pages/Filieres";

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
  )
}

const App = () => {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="comment-ca-marche" element={<HowItWorks />} />
            <Route path="filieres" element={<Filieres />} />
            <Route path="filieres/:filiere" element={<DetailsFiliere />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
