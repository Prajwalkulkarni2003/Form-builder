import { configureStore } from '@reduxjs/toolkit'
import formBuilderReducer from '../features/formBuilder/formBuilderSlice'
import formsReducer from '../features/forms/formsSlice'
import formDataReducer from '../features/formData/formDataSlice'


export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    forms: formsReducer,
    formData: formDataReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
