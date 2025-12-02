import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']

export async function saveUploadedFile(file: File, type: 'image' | 'video'): Promise<string> {
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES
  
  // Validate file size
  if (file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024)
    throw new Error(`File size exceeds ${sizeMB}MB limit`)
  }
  
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    const typeList = type === 'image' ? 'JPEG, PNG, GIF, WebP' : 'MP4, WebM, OGG, MOV'
    throw new Error(`Invalid file type. Only ${type}s are allowed (${typeList})`)
  }
  
  // Ensure upload directory exists
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
  
  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const ext = file.name.split('.').pop()
  const filename = `${timestamp}-${randomString}.${ext}`
  const filepath = join(UPLOAD_DIR, filename)
  
  // Save file
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(filepath, buffer)
  
  // Return relative URL
  return `/uploads/${filename}`
}

