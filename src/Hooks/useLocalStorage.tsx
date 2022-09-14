import { useEffect, useState } from "react"

///created a custom hook
export const useLocalStorage = <T extends {}>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key)
        if (jsonValue != null) {
            return JSON.parse(jsonValue)
        }else{
            return initialValue
        }
    })

    useEffect(() =>{
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue] as [T, typeof setValue]
}