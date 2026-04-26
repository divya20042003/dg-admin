import { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api/productApi";

// SortIcon component moved outside to avoid re-creation on every render
function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <span className="ml-1 text-gray-400">⇅</span>;
  }
  return (
    <span className="ml-1 text-purple-600">
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data.data || data);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [nextId, setNextId] = useState(4);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    categoryId: "",
    sellingPrice: "",
    strikePrice: "",
    stock: "",
    material: "",
    sleeve: "",
    neck: "",
    lining: "",
    component: "",
    dispatch: "",
    sizes: [],
    colors: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (type, value) => {
    setFormData((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      productName: formData.productName,
      description: formData.description,
      categoryId: formData.categoryId,
      sellingPrice: Number(formData.sellingPrice),
      strikePrice: Number(formData.strikePrice),
      stockQuantity: Number(formData.stock),
      attributes: [
        { name: "material", value: formData.material },
        { name: "sleeve", value: formData.sleeve },
        { name: "neck", value: formData.neck },
      ],
      sizes: formData.sizes,
      colors: formData.colors,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description,
      categoryId: product.categoryId,
      sellingPrice: product.sellingPrice,
      strikePrice: product.strikePrice,
      stock: product.stockQuantity || product.stock,
      material: product.material,
      sleeve: product.sleeve,
      neck: product.neck,
      lining: "",
      component: "",
      dispatch: "",
      sizes: product.sizes || [],
      colors: product.colors || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      productName: "",
      description: "",
      categoryId: "",
      sellingPrice: "",
      strikePrice: "",
      stock: "",
      material: "",
      sleeve: "",
      neck: "",
      lining: "",
      component: "",
      dispatch: "",
      sizes: [],
      colors: [],
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (showForm) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to List
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 bg-white p-6 rounded-lg shadow"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Category ID
              </label>
              <input
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Selling Price
              </label>
              <input
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Strike Price
              </label>
              <input
                name="strikePrice"
                type="number"
                value={formData.strikePrice}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
          </div>

          <h3 className="font-semibold mt-2">Attributes</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              name="material"
              placeholder="Material"
              value={formData.material}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="sleeve"
              placeholder="Sleeve"
              value={formData.sleeve}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="neck"
              placeholder="Neck"
              value={formData.neck}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <h3 className="font-semibold mt-2">Sizes</h3>
          <div className="flex gap-4">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <label key={s} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(s)}
                  onChange={() => handleCheckbox("sizes", s)}
                />
                {s}
              </label>
            ))}
          </div>

          <h3 className="font-semibold mt-2">Colors</h3>
          <div className="flex gap-4">
            {["Red", "Blue", "Black", "Beetroot"].map((c) => (
              <label key={c} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.colors.includes(c)}
                  onChange={() => handleCheckbox("colors", c)}
                />
                {c}
              </label>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              {editingProduct ? "Update Product" : "Save Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("id")}
              >
                ID <SortIcon column="id" sortConfig={sortConfig} />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("productName")}
              >
                Product Name <SortIcon column="productName" sortConfig={sortConfig} />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("sellingPrice")}
              >
                Price <SortIcon column="sellingPrice" sortConfig={sortConfig} />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("stock")}
              >
                Stock <SortIcon column="stock" sortConfig={sortConfig} />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("material")}
              >
                Material <SortIcon column="material" sortConfig={sortConfig} />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 text-sm">{product.id}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {product.productName}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-green-600 font-medium">
                    ₹{product.sellingPrice}
                  </span>
                  {product.strikePrice && (
                    <span className="text-gray-400 line-through ml-2 text-sm">
                      ₹{product.strikePrice}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.stock > 20
                        ? "bg-green-100 text-green-700"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{product.material}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found. Click "Add Product" to create one.
          </div>
        )}
      </div>
    </div>
  );
}