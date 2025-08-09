import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Checkbox, FormControlLabel, Stack } from '@mui/material'
import { FieldType, FieldConfig } from '../types'
import { useAppDispatch, useAppSelector } from '../storeHooks'
import { addField, updateField } from '../features/formBuilder/formBuilderSlice'
import { v4 as uuidv4 } from 'uuid'

const fieldTypes: FieldType[] = ['text','number','textarea','select','radio','checkbox','date']

export default function FieldEditor({ onClose, editId }: { onClose: ()=>void, editId: string | null }) {
  const dispatch = useAppDispatch()
  const builder = useAppSelector(s=>s.formBuilder)
  const existing = builder.fields.find(f=>f.id===editId) || null

  const [label, setLabel] = useState(existing?.label||'')
  const [type, setType] = useState<FieldType>(existing?.type || 'text')
  const [options, setOptions] = useState((existing?.options||[] as string[]).join('\n'))
  const [required, setRequired] = useState(existing?.validation?.required||false)
  const [derived, setDerived] = useState(existing?.derived? existing.derived.formula : '')
  const [parents, setParents] = useState(existing?.derived? existing.derived.parents.join(',') : '')

  useEffect(()=> {
    if (existing) {
      setLabel(existing.label); setType(existing.type);
      setOptions((existing.options||[]).join('\n'))
      setRequired(!!existing.validation?.required)
      setDerived(existing.derived?.formula || '')
      setParents(existing.derived?.parents.join(',') || '')
    }
  }, [existing])

  function handleSave() {
    const cfg: FieldConfig = {
      id: existing?.id || uuidv4(),
      label: label || 'Untitled',
      type,
      options: type==='select'||type==='radio'||type==='checkbox' ? options.split(/\n/).map(s=>s.trim()).filter(Boolean) : undefined,
      validation: { required },
      derived: derived ? { parents: parents.split(',').map(s=>s.trim()).filter(Boolean), formula: derived } : null
    }
    if (existing) dispatch(updateField(cfg))
    else dispatch(addField(cfg))
    onClose()
  }

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>{existing ? 'Edit Field' : 'Add Field'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField label="Label" value={label} onChange={(e)=>setLabel(e.target.value)} />
          <TextField select label="Type" value={type} onChange={(e)=>setType(e.target.value as FieldType)}>
            {fieldTypes.map(ft=> <MenuItem key={ft} value={ft}>{ft}</MenuItem>)}
          </TextField>
          {(type==='select' || type==='radio' || type==='checkbox') && (
            <TextField label="Options (one per line)" multiline minRows={3} value={options} onChange={(e)=>setOptions(e.target.value)} />
          )}
          <FormControlLabel control={<Checkbox checked={required} onChange={(e)=>setRequired(e.target.checked)} />} label="Required" />
          <TextField label="Derived formula (JS expression using values object)" helperText="Use values['fieldId'] to reference parent values. Example: Number(values['dob']) ? '' : '' " value={derived} onChange={(e)=>setDerived(e.target.value)} />
          <TextField label="Derived parents (comma separated field ids)" value={parents} onChange={(e)=>setParents(e.target.value)} helperText="e.g. f1,f2" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
