type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantitySelector({ quantity, onDecrease, onIncrease }: Props) {
  return (
    <div aria-label="Seleccionar cantidad" className="product-quantity-selector">
      <button aria-label="Disminuir cantidad" onClick={onDecrease} type="button">−</button>
      <strong>{quantity}</strong>
      <button aria-label="Aumentar cantidad" onClick={onIncrease} type="button">+</button>
    </div>
  );
}
