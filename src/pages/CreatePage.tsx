import React, { useState } from 'react'
import { Box, Button, TextField, Paper, IconButton, List, ListItem, ListItemText, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../storeHooks'
import { setName, addField, removeField } from '../features/formBuilder/formBuilderSlice'
import { addForm } from '../features/forms/formsSlice'
import FieldEditor from '../components/FieldEditor'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

export default function CreatePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const builder = useAppSelector(s=>s.formBuilder)
  const [editing, setEditing] = useState(false)
  const [editFieldId, setEditFieldId] = useState<string | null>(null)

  function handleSaveForm() {
    if (!builder.name) { alert('Provide a form name'); return }
    if (builder.fields.length === 0) { alert('Add at least one field'); return }
    const schema = { id: uuidv4(), name: builder.name, createdAt: new Date().toISOString(), fields: builder.fields }
    dispatch(addForm(schema))
    // clear builder
    localStorage.removeItem('currentBuilder')
    dispatch({ type: 'formBuilder/clearBuilder' })
    alert('Form saved. Opening My Forms.')
    navigate('/myforms')
  }

  return (
    <Box>
      <Paper sx={{ p:2, mb:2 }}>
        <TextField fullWidth value={builder.name} onChange={(e)=>dispatch(setName(e.target.value))} label="Form Name" />
        <Stack direction="row" spacing={1} sx={{ mt:2 }}>
          <Button variant="contained" onClick={()=>{ setEditFieldId(null); setEditing(true); }}>Add Field</Button>
          <Button variant="outlined" onClick={handleSaveForm}>Save Form</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p:2 }}>
        <List>
          {builder.fields.map(f=>(
            <ListItem key={f.id} secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={()=>{ setEditFieldId(f.id); setEditing(true); }}>Edit</Button>
                <Button size="small" color="error" onClick={()=>dispatch(removeField(f.id))}>Delete</Button>
              </Stack>
            }>
              <ListItemText primary={f.label} secondary={f.type} />
            </ListItem>
          ))}
          {builder.fields.length===0 && <div>No fields yet</div>}
        </List>
      </Paper>

      {editing && <FieldEditor onClose={()=>setEditing(false)} editId={editFieldId} />}
    </Box>
  )
}
