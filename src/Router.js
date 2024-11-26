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
        <Route path="/ads/detail" element={<AdsModalPage type="edit" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
