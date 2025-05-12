import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ProductModal } from "@/components/inventory/ProductModal";

type Product = Database['public']['Tables']['products']['Row'];

interface InventoryStats {
  total_products: number;
  low_stock_items: number;
  out_of_stock_items: number;
  inventory_value: number;
}

const AdminInventory = () => {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;

      if (productsData) {
        setProducts(productsData);

        // Calculate stats
        const totalProducts = productsData.length;
        const lowStock = productsData.filter(p => p.stock_quantity < 10 && p.stock_quantity > 0).length;
        const outOfStock = productsData.filter(p => p.stock_quantity === 0).length;
        const totalValue = productsData.reduce((sum, product) => 
          sum + (Number(product.price) * Number(product.stock_quantity)), 0);

        setStats({
          total_products: totalProducts,
          low_stock_items: lowStock,
          out_of_stock_items: outOfStock,
          inventory_value: totalValue
        });
      }

    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    return searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { text: 'Low Stock', class: 'bg-amber-100 text-amber-800' };
    return { text: 'In Stock', class: 'bg-green-100 text-green-800' };
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gym-secondary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_products || 0}</div>
            <div className="text-sm text-gray-500">In inventory</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats?.low_stock_items || 0}</div>
            <div className="text-sm text-gray-500">Need reordering</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats?.out_of_stock_items || 0}</div>
            <div className="text-sm text-gray-500">Items unavailable</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats?.inventory_value.toFixed(2) || '0.00'}</div>
            <div className="text-sm text-gray-500">Total retail value</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your product stock</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="font-medium p-4">Product</th>
                  <th className="font-medium p-4">In Stock</th>
                  <th className="font-medium p-4">Price</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => {
                  const status = getStockStatus(product.stock_quantity || 0);
                  return (
                    <tr key={product.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0">
                            <img 
                              src={product.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{product.stock_quantity || 0}</td>
                      <td className="p-4">${product.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 ${status.class} rounded-full text-xs`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </Button>
                          <Button size="sm">View</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchData}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminInventory;
