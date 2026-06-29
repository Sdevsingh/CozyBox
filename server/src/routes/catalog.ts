import { Router } from "express";
import { useMock } from "../env.js";
import { CATALOG, type CatalogCategory } from "../data/seed.js";
import { squareFetch } from "../square/client.js";
import { asyncHandler } from "../util/http.js";

export const catalogRouter: Router = Router();

catalogRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const category = req.query.category as CatalogCategory | undefined;

    if (useMock) {
      const items = category
        ? CATALOG.filter((i) => i.category === category)
        : CATALOG;
      return res.json({ items, source: "mock" });
    }

    const data = await squareFetch<any>("/v2/catalog/list?types=ITEM", {
      method: "GET",
    });
    const items = (data.objects ?? []).map((obj: any) => {
      const variation = obj.item_data?.variations?.[0]?.item_variation_data;
      return {
        id: obj.id,
        name: obj.item_data?.name ?? "",
        description: obj.item_data?.description ?? "",
        price: Number(variation?.price_money?.amount ?? 0),
        currency: variation?.price_money?.currency ?? "AUD",
        category: "food" as CatalogCategory,
        section: obj.item_data?.category_id ?? "Menu",
        dietary: [],
      };
    });
    res.json({ items, source: "square" });
  }),
);
