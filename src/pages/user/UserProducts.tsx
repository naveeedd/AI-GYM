
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader, Search, ShoppingCart, Plus, Minus } from 'lucide-react';
import { shoppingService, Product } from '@/services/ShoppingService';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';

const UserProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { items, addToCart, removeFromCart, updateQuantity } = useShoppingCart();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch categories
        const categoriesData = await shoppingService.getCategories();
        setCategories(categoriesData);
        
        // Fetch products
        const productsData = await shoppingService.getProducts(selectedCategory || undefined, searchQuery);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load products. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search') as string;
    setSearchQuery(query);
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const getCartItemQuantity = (productId: string) => {
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };
  
  const handleUpdateCartItem = (productId: string, increment: boolean) => {
    const currentQuantity = getCartItemQuantity(productId);
    
    if (increment) {
      updateQuantity(productId, currentQuantity + 1);
    } else {
      if (currentQuantity > 1) {
        updateQuantity(productId, currentQuantity - 1);
      } else {
        removeFromCart(productId);
      }
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Shop Products</h1>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              name="search" 
              placeholder="Search products..." 
              className="pl-10 w-full md:w-64"
              defaultValue={searchQuery}
            />
            <Button type="submit" className="absolute right-0 top-0 rounded-l-none">
              Search
            </Button>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button 
                  variant={selectedCategory === null ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </Button>
                
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  disabled={items.length === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Product grid */}
        <div className="col-span-1 md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader className="h-8 w-8 animate-spin text-gym-secondary" />
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => {
                const quantity = getCartItemQuantity(product.id);
                
                return (
                  <Card key={product.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-square bg-gray-100 relative">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {product.stock_quantity < 5 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                          Low Stock
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="flex flex-col flex-grow pt-4">
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 flex-grow">{product.description}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                        
                        {quantity === 0 ? (
                          <Button 
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                          >
                            Add to Cart
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="icon" 
                              variant="outline"
                              onClick={() => handleUpdateCartItem(product.id, false)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button 
                              size="icon"
                              variant="outline"
                              onClick={() => handleUpdateCartItem(product.id, true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProducts;
