import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Booking from "./pages/Booking";
import PlatePass from "./pages/PlatePass";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="book" element={<Booking />} />
        <Route path="plate-pass" element={<PlatePass />} />
      </Route>
    </Routes>
  );
}
