import React from "react";
import { useEffect, useState } from "react";
import { getProductsApi } from "../api/product.api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi().then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-4">Admin Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
