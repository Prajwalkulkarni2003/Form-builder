import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, TextField, MenuItem, FormControlLabel, Checkbox, Typography, Paper } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../storeHooks'
import { useParams } from 'react-router-dom'
import { FormSchema } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { addEntry } from '../features/formData/formDataSlice' // ⬅ NEW

function evaluateFormula(formula: string, values: Record<string, any>) {
  // WARNING: using Function has security considerations. For this assignment we keep it simple.
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('values', `return (${formula})`)
    return fn(values)
  } catch (e) {
    return `ERR: ${String(e)}`
  }
}

export default function PreviewPage() {
  const params = useParams()
  const forms = useAppSelector(s => s.forms.list)
  const builder = useAppSelector(s => s.formBuilder)
  const dispatch = useAppDispatch() // ⬅ NEW

  const schema: FormSchema | undefined = useMemo(() => {
    if (params.id) return forms.find(f => f.id === params.id)

    // Auto-load latest saved form if no ID in URL
    if (forms.length > 0) {
      return forms[forms.length - 1] // last saved form
    }

    // else use live builder
    if (builder.fields.length > 0 && builder.name) {
      return { id: 'live', name: builder.name, createdAt: new Date().toISOString(), fields: builder.fields }
    }

    return undefined
  }, [params.id, forms, builder])

  const [values, setValues] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!schema) return
    // initialize defaults
    const v: Record<string, any> = {}
    for (const f of schema.fields) {
      v[f.id] = f.defaultValue ?? ''
    }
    setValues(v)
  }, [schema?.id])

  useEffect(() => {
    if (!schema) return
    // compute derived fields
    for (const f of schema.fields) {
      if (f.derived && f.derived.parents.length > 0 && f.derived.formula) {
        try {
          const out = evaluateFormula(f.derived.formula, values)
          setValues(prev => ({ ...prev, [f.id]: out }))
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  if (!schema) return <Paper sx={{ p: 2 }}>No form selected. Go to Create or My Forms.</Paper>

  function handleChange(id: string, v: any) {
    setValues(prev => ({ ...prev, [id]: v }))
  }

  function validateField(f: any, val: any) {
    if (f.validation?.required && (val === '' || val === null || val === undefined)) return 'Required'
    if (f.validation?.minLength && String(val).length < f.validation.minLength) return 'Too short'
    return undefined
  }

  // ⬅ NEW: Submit handler that persists data
  function handleSubmit() {
    if (!schema) {
      alert('No form schema available.')
      return
    }
    // Basic validation
    const hasErrors = schema.fields.some(f => validateField(f, values[f.id]))
    if (hasErrors) {
      alert('Please fix validation errors before submitting')
      return
    }

    // Save to Redux + localStorage
    dispatch(
      addEntry({
        id: uuidv4(),
        formId: schema.id,
        formName: schema.name,
        createdAt: new Date().toISOString(),
        values
      })
    )

    alert('Form submitted and saved!')
    // Optionally clear values
    setValues({})
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{schema.name}</Typography>
      <Paper sx={{ p: 2 }}>
        {schema.fields.map(f => {
          const error = validateField(f, values[f.id])
          const common = {
            key: f.id,
            label: f.label,
            value: values[f.id] ?? '',
            onChange: (e: any) => handleChange(f.id, e?.target?.value ?? e)
          }
          if (f.derived) {
            return (
              <TextField {...common} fullWidth disabled helperText="Derived field" sx={{ mb: 2 }} />
            )
          }
          switch (f.type) {
            case 'text': return <TextField {...common} fullWidth error={!!error} helperText={error} sx={{ mb: 2 }} />
            case 'number': return <TextField {...common} fullWidth type="number" error={!!error} helperText={error} sx={{ mb: 2 }} />
            case 'textarea': return <TextField {...common} fullWidth multiline minRows={3} error={!!error} helperText={error} sx={{ mb: 2 }} />
            case 'select': return (
              <TextField {...common} select fullWidth sx={{ mb: 2 }}>
                {(f.options || []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            )
            case 'checkbox': return <FormControlLabel control={<Checkbox checked={!!values[f.id]} onChange={(e) => handleChange(f.id, e.target.checked)} />} label={f.label} />
            case 'radio': return (
              <TextField {...common} select fullWidth sx={{ mb: 2 }}>
                {(f.options || []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            )
            case 'date': return <TextField {...common} fullWidth type="date" InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            default: return null
          }
        })}
        {/* Updated Submit button */}
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Submit</Button>
      </Paper>
    </Box>
  )
}
