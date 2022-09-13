import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../Components/ShoppingCart";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

type CartItem = {
    id: number
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export const useShoppingCartContext = () => useContext(ShoppingCartContext)

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {


    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    const getItemQuantity = (id: number) => {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    const cartQuantity = cartItems.reduce((quantity, item) => {
        return quantity + item.quantity
    }, 0)

    const increaseCartQuantity = (id: number) => {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, { id, quantity: 1 }]
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    const decreaseCartQuantity = (id: number) => {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    const removeFromCart = (id: number) => {
        const filteredArray = cartItems.filter(item => item.id !== id)
        setCartItems(filteredArray)
    }

    return (
        <ShoppingCartContext.Provider
            value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                cartItems,
                openCart,
                closeCart,
                cartQuantity
            }}>
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    )
}