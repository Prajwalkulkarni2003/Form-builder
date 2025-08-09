import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormSchema } from '../../types'

const load = (): FormSchema[] => {
  try {
    const raw = localStorage.getItem('savedForms')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

interface FormsState { list: FormSchema[] }

const initialState: FormsState = { list: load() }

const slice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm(state, action: PayloadAction<FormSchema>) {
      state.list.push(action.payload)
      localStorage.setItem('savedForms', JSON.stringify(state.list))
    },
    deleteForm(state, action: PayloadAction<string>) {
      state.list = state.list.filter(f=>f.id !== action.payload)
      localStorage.setItem('savedForms', JSON.stringify(state.list))
    }
  }
})

export const { addForm, deleteForm } = slice.actions
export default slice.reducer
