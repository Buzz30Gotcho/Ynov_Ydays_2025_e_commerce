import supabase from '../supabaseClient.js'

export async function getAll(req, res) {
  try {
    const { data, error } = await supabase.from('shops').select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function getById(req, res) {
  const { id } = req.params
  try {
    const { data, error } = await supabase.from('shops').select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Not found' })
      return res.status(500).json({ error: error.message })
    }
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}


// CREATE SHOP
export async function create(req, res) {
  try {
    const userId = req.user?.id // ID auth.users
    const payload = req.body

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!payload?.name || !payload?.category || !payload?.city) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const shopData = {
      ...payload,
      owner_id: userId, // 👈 OBLIGATOIRE
    }

    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(201).json(data)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function update(req, res) {
  const { id } = req.params
  const payload = req.body
  try {
    const { data, error } = await supabase.from('shops').update(payload).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function remove(req, res) {
  const { id } = req.params;

  try {
    // Supprime le shop
    const { data, error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id)
      .select(); // pas de .single() ici

    if (error) return res.status(500).json({ error: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Shop not found or not allowed to delete' });
    }

    return res.json({ success: true, deleted: data[0] }); // retourne le premier élément
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

