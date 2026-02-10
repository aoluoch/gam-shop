import { useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Product } from '@/types/product';

interface UseProductSubscriptionProps {
  category?: string
  onUpdate: (updatedProduct: Partial<Product> & { id: string }) => void
}

export function useProductSubscription({ category, onUpdate }: UseProductSubscriptionProps) {
  useEffect(() => {
    const channelName = category 
      ? `products-stock-${category}` 
      : 'products-stock-all'
    
    let channel = supabase.channel(channelName)
    
    if (category) {
      channel = channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `category=eq.${category}`,
        },
        (payload) => {
          onUpdate({
            id: payload.new.id as string,
            stock: Number(payload.new.stock),
          })
        }
      )
    } else {
      channel = channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          onUpdate({
            id: payload.new.id as string,
            stock: Number(payload.new.stock),
          })
        }
      )
    }
    
    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [category, onUpdate])
}
