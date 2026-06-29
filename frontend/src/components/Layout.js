import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import SpotlightCursor from "./SpotlightCursor";
import AgeGate from "./AgeGate";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <>
      <SmoothScroll />
      <SpotlightCursor />
      <div className="grain" aria-hidden />
      <AgeGate />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
