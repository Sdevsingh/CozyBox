import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OurStory from "./pages/OurStory";
import Menu from "./pages/Menu";
import WhatsOn from "./pages/WhatsOn";
import Private from "./pages/Private";
import Shop from "./pages/Shop";
import CocktailPassport from "./pages/CocktailPassport";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/whats-on" element={<WhatsOn />} />
          <Route path="/private" element={<Private />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/passport" element={<CocktailPassport />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
