import supabase from '../supabaseClient.js'

export async function getAll(req, res) {
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function getById(req, res) {
  const { id } = req.params
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Not found' })
      return res.status(500).json({ error: error.message })
    }
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function create(req, res) {
  const payload = req.body
  if (!payload) return res.status(400).json({ error: 'Missing request body' })
  try {
    const { data, error } = await supabase.from('products').insert([payload]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function update(req, res) {
  const { id } = req.params
  const payload = req.body
  try {
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function remove(req, res) {
  const { id } = req.params
  try {
    const { data, error } = await supabase.from('products').delete().eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true, deleted: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
