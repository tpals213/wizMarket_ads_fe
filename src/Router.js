import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import AdsModalPage from "./pages/Ads/AdsModalPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/ads/:storeBusinessNumber" element={<AdsModalPage type="create" />} />
        <Route path="/ads/light/:storeBusinessNumber" element={<AdsModalPage type="light" />} />
        <Route path="/ads/temp/:storeBusinessNumber" element={<AdsModalPage type="temp" />} />
        <Route path="/ads/detail" element={<AdsModalPage type="edit" />} />
        <Route path="/ads/promote" element={<AdsModalPage type="promote" />} />
        <Route path="/ads/auth/callback" element={<AdsModalPage type="youtube" />} />
        <Route path="/ads/detail/insta" element={<AdsModalPage type="insta" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
