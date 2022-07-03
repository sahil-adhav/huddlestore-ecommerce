import React, { createContext, useContext, useState, useEffect } from 'react'; 
import { toast } from 'react-hot-toast';


const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    
    // Here usetState () is set to NULL as we will be using our local storage data to see what user has added to his cartItems. 
    // So if a user exits still then also his items will be same as BeforeUnloadEvent.
    const [cartItems, setCartItems] = useState([]);

    const [totalPrice, setTotalPrice] = useState(0);

    const [totalQuantities, setTotalQuantities] = useState(0);

    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    //Function to add to Cart and handling 
    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);

        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart){

            const updateCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartItems, 
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updateCartItems);
        } else {
            product.quantity = quantity;
            
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);

        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);

        setCartItems(newCartItems);
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);

        //Here could have splice but it will override other cart items as it upadates the **state** as it is a mutative method.
        //So, we will use filter which is non-mutative method.
        const newCartItems = cartItems.filter((item) => item._id !== id);

        if(value === 'inc'){
            setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1}])
            
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)

            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
        }else if(value === 'dec'){
            if(foundProduct.quantity > 1){
                setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1}])
                
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)

                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1)
            }
        }
    }

    //Increase Quantity to Cart
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    //Decrease Quantity to Cart
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    }

    return(
        <Context.Provider 
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);  