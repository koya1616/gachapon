import { Button } from "@/components/Button";
import { useTranslation as t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Lang } from "@/types";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";

const CartItem = memo(
  ({
    item,
    onUpdateQuantity,
    onRemove,
    lang,
  }: {
    item: Product;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemove: (productId: number) => void;
    lang: Lang;
  }) => {
    const isMaxQuantity = item.quantity >= item.stock_quantity;

    return (
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 relative mr-4">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
          </div>
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-blue-700">¥{item.price.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            label="-"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            variant="text"
            color="gray"
            fontSize="text-xl"
          />
          <span className="px-4 py-2" data-testid="item-quantity">
            {item.quantity}
          </span>
          <Button
            label="+"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={isMaxQuantity}
            variant="text"
            color="gray"
            fontSize="text-xl"
          />
          <Button
            label={t(lang).cart.remove}
            type="button"
            onClick={() => onRemove(item.id)}
            variant="text"
            color="red"
          />
        </div>
      </div>
    );
  },
);

interface CartLogic {
  handleCheckout: () => void;
}

export const CartView = ({
  handleCheckout,
  isOpen,
  cart,
  totalPrice,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang,
}: CartProps & CartLogic) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-20 flex justify-center items-start pt-20 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t(lang).cart.title}</h2>
          <Button type="button" label="✕" onClick={onClose} color="gray" variant="text" />
        </div>

        {cart.length === 0 ? (
          <p className="text-center py-8 text-gray-500">{t(lang).cart.empty}</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                  lang={lang}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">{t(lang).cart.total}</span>
                <span className="font-bold text-xl">¥{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between space-x-4">
                <Button type="button" label={t(lang).cart.clear_cart} onClick={onClearCart} color="gray" />
                <Button type="button" label={t(lang).cart.checkout} onClick={handleCheckout} color="blue" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const useCart = (lang: Lang, onClose: () => void): CartLogic => {
  const router = useRouter();

  const handleCheckout = useCallback(() => {
    onClose();
    router.push(`/${lang}/checkout`);
  }, [lang, onClose, router]);

  return { handleCheckout };
};

interface CartProps {
  isOpen: boolean;
  cart: Product[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  lang: Lang;
}
const Cart = memo(
  ({ isOpen, cart, totalPrice, onClose, onUpdateQuantity, onRemoveItem, onClearCart, lang }: CartProps) => {
    const { handleCheckout } = useCart(lang, onClose);

    const cartView = useMemo(() => {
      return (
        <CartView
          isOpen={isOpen}
          cart={cart}
          totalPrice={totalPrice}
          onClose={onClose}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          handleCheckout={handleCheckout}
          lang={lang}
        />
      );
    }, [isOpen, cart, totalPrice, onClose, onUpdateQuantity, onRemoveItem, onClearCart, handleCheckout, lang]);

    return cartView;
  },
);

export default Cart;
