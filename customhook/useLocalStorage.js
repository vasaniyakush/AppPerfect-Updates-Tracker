import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        if (value !== initialValue) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(error);
            }
        }
    }, [key, value, initialValue]);

    return [value, setValue];
}
