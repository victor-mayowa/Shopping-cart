import React from 'react'
import { Stack, Button } from 'react-bootstrap'
import { useShoppingCartContext } from '../Context/ShoppingCartContext'
import storeItems from "../data/items.json"
import { formatCurrency } from '../Utilities/formatCurrency'

type cartItemProps = {
    id: number
    quantity: number
}
const CartItem = ({ id, quantity }: cartItemProps) => {
    const { removeFromCart } = useShoppingCartContext()
    const item = storeItems.find(i => i.id === id)
    if (item == null) return null
    return (
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img src={item.imgUrl} style={{ width: "125px", height: "75px", objectFit: "cover" }} />

            <div className='me-auto'>
                <div>
                    {item.name}
                    {quantity > 1 && (
                        <span className='text-muted' style={{ fontSize: ".65rem" }}>x{quantity}</span>
                    )}
                </div>
                <div className='text-muted' style={{ fontSize: ".75rem" }}>
                    {formatCurrency(item.price)}
                </div>
            </div>

            <div>
                {formatCurrency(item.price * quantity)}
            </div>
            <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>&times;</Button>
        </Stack>
    )
}

export default CartItem