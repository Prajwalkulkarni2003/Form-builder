import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FieldConfig } from '../../types'

interface FormBuilderState {
  name: string;
  fields: FieldConfig[];
}

const initialState: FormBuilderState = {
  name: '',
  fields: []
}

const slice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) { state.name = action.payload },
    addField(state, action: PayloadAction<FieldConfig>) { state.fields.push(action.payload) },
    updateField(state, action: PayloadAction<FieldConfig>) {
      const idx = state.fields.findIndex(f => f.id === action.payload.id)
      if (idx >= 0) state.fields[idx] = action.payload
    },
    removeField(state, action: PayloadAction<string>) { state.fields = state.fields.filter(f=>f.id !== action.payload) },
    reorderFields(state, action: PayloadAction<FieldConfig[]>) { state.fields = action.payload },
    clearBuilder(state) { state.name=''; state.fields = [] }
  }
})

export const { setName, addField, updateField, removeField, reorderFields, clearBuilder } = slice.actions
export default slice.reducer
