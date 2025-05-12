
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/supabase-extensions';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_id: string;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
}

class ShoppingService {
  // Fetch all products
  async getProducts(categoryId?: string, searchQuery?: string): Promise<Product[]> {
    try {
      let query = supabase.from('products').select('*').eq('is_active', true);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  
  // Get product categories
  async getCategories(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  
  // Get a single product
  async getProduct(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
  
  // Create an order from cart items
  async createOrder(
    userId: string,
    items: CartItem[],
    address: string,
    paymentMethod: string
  ): Promise<Order | null> {
    try {
      // Calculate total
      const totalAmount = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
          delivery_address: address
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Update payment status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          status: 'processing'
        })
        .eq('id', order.id);
        
      if (updateError) throw updateError;
      
      // Cast the result to the proper type
      return {
        ...order,
        payment_status: 'completed' as const,
        status: 'processing' as const
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
  
  // Get orders for a user
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            id,
            quantity,
            unit_price,
            product:products (
              id, 
              name, 
              image_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Ensure the returned data complies with our Order type
      return (data || []).map(order => ({
        ...order,
        // Cast the string status to the specific order status types
        status: order.status as 'pending' | 'processing' | 'completed' | 'cancelled',
        payment_status: order.payment_status as 'pending' | 'completed' | 'failed' | 'refunded'
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }
  
  // Admin: Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            id,
            quantity,
            unit_price,
            product:products (
              id, 
              name, 
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Ensure the returned data complies with our Order type
      return (data || []).map(order => ({
        ...order,
        // Cast the string status to the specific order status types
        status: order.status as 'pending' | 'processing' | 'completed' | 'cancelled',
        payment_status: order.payment_status as 'pending' | 'completed' | 'failed' | 'refunded'
      }));
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }
  
  // Admin: Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }
  
  // Admin: Update product
  async updateProduct(productId: string, productData: Partial<Product>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }
}

export const shoppingService = new ShoppingService();
