import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FormDataEntry {
  id: string
  formId: string
  formName: string
  createdAt: string
  values: Record<string, any>
}

const load = (): FormDataEntry[] => {
  try {
    const raw = localStorage.getItem('formData')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

interface FormDataState {
  entries: FormDataEntry[]
}

const initialState: FormDataState = { entries: load() }

const slice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    addEntry(state, action: PayloadAction<FormDataEntry>) {
      state.entries.push(action.payload)
      localStorage.setItem('formData', JSON.stringify(state.entries))
    },
    deleteEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter(e => e.id !== action.payload)
      localStorage.setItem('formData', JSON.stringify(state.entries))
    }
  }
})

export const { addEntry, deleteEntry } = slice.actions
export default slice.reducer
export type { FormDataEntry }
