import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import ShoppingCart from "../Components/ShoppingCart";
import { useLocalStorage } from "../Hooks/useLocalStorage";

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

    // const loadedTodos = localStorage.getItem("cartItem")
    // ? JSON.parse(localStorage.getItem("cartItem") || "")
    // : []; 

    
///decided to use custom hooks useLocalStorage
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])
    const [isOpen, setIsOpen] = useState(false)

    // useEffect(() => {
    //     const items = JSON.parse(localStorage.getItem("cartItem") || "")
    //     if (items)  setCartItems(items)
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem("cartItem", JSON.stringify(cartItems))

    // }, [cartItems])


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