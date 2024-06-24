import { createSlice } from "@reduxjs/toolkit";

const data = []

const cartSlice = createSlice({
    name: "post",
    initialState: {
      items: data,
      totalAmount: 0,
      totalCount: 0,
    },
  
    reducers: {
      getCartTotal: (state, action) => {
        let { totalAmount, totalCount } = state.items.reduce(
          (cartTotal, cartItem) => {
            const { price, quantity } = cartItem;
            const itemTotal = price * quantity;
  
            cartTotal.totalAmount += itemTotal;
            cartTotal.totalCount += quantity;
            return cartTotal;
          },
          {
            totalAmount: 0,
            totalCount: 0,
          }
        );
        state.totalAmount = totalAmount;
        state.totalCount = totalCount
      },
      remove: (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      },
      increase: (state, action) => {
        state.items = state.items.map((item) => {
          if (item.id === action.payload && item.quantity < 10) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      },
      decrease: (state, action) => {
        state.items = state.items
          .map((item) => {
            if (item.id === action.payload) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter((item) => item.quantity !== 0);
      },
      clearCart: (state, action) => {
        state.items = [];
      },
      addToCart: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);

        if (index !== -1) {
          // If the item is found, update its quantity
          state.items[index].quantity += action.payload.quantity;
        } else {
          // If the item is not found, insert the new item
          state.items.push(action.payload);
        }
      },
      setCartItems: (state, action) => {
        state.items = action.payload.data;
      },
    },
  });
  
  export const {
    getCartTotal,
    remove,
    increase,
    decrease,
    clearCart,
    setCartItems,
    addToCart,
  } = cartSlice.actions;
  
  export default cartSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     data: [
//         {
//             "_id": "667726bcf0e07efea0ffe9df",
//             "username": "abcdfe",
//             "title": "Microsoft Surface Laptop 4",
//             "price": 1499,
//             "id": 8,
//             "quantity": 3,
//             "thumbnail": "https://cdn.dummyjson.com/product-images/8/thumbnail.jpg",
//             "__v": 0
//         },
//         {
//             "_id": "6677273af0e07efea0ffe9e2",
//             "username": "abcdfe",
//             "title": "Orange Essence Food Flavou",
//             "price": 14,
//             "id": 23,
//             "quantity": 6,
//             "thumbnail": "https://cdn.dummyjson.com/product-images/23/thumbnail.jpg",
//             "__v": 0
//         }],
//     totalCount: 0,
//     totalAmount: 0
//    }

// const cartSlice = createSlice({
//  name: "cart",
//  initialState: initialState,
//  reducers : {
//     cartAction : (state , action) => {
//         console.log(action)
//         switch (action.payload.type) {
//           case 'setData': {
//             return {
//                 ...state,
//                 data : action.payload.data
//               }
//           }
//           case 'increment': {
//             const item = state.data.find(item => item.id === action.id);
//             if (item) {
//                 item.quantity = (item.quantity || 0) + 1;
//                 state.totalCount += 1;
//                 state.totalAmount += item.price;  // Assuming each item has a price field
//                 return {
//                     ...state,
//                     data : {
//                         ...state.data,
//                         item
//                     }
//                 }
//             }
//             return state
//           }
//           case 'getCartTotal': {
            
//             state.totalAmount = 10;
//             state.totalCount = 20;
//             break;
//           }
//           default:
//           return state
//       }
//     }
//    }
// });

// export const { cartAction } = cartSlice.actions;

// export default cartSlice.reducer;