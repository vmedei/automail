// app/page.tsx
'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  
  const handleUpload = async () => {
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await axios.post('http://localhost:8000/upload', formData)
      console.log(response.data)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div className="p-8">
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}