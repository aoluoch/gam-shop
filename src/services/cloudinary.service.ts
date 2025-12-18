const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export interface CloudinaryUploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'gam-shop/products')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        })
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height,
            format: response.format,
          })
        } catch {
          reject(new Error('Failed to parse Cloudinary response'))
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'))
    })

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`)
    xhr.send(formData)
  })
}

export async function uploadMultipleToCloudinary(
  files: File[],
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<CloudinaryUploadResult[]> {
  const results: CloudinaryUploadResult[] = []

  for (let i = 0; i < files.length; i++) {
    const result = await uploadToCloudinary(files[i], (progress) => {
      onProgress?.(i, progress)
    })
    results.push(result)
  }

  return results
}

export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  } = {}
): string {
  if (!url.includes('cloudinary.com')) {
    return url
  }

  const { width, height, quality = 'auto', format = 'auto' } = options
  const transformations: string[] = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)
  transformations.push('c_fill')

  const transformString = transformations.join(',')

  // Insert transformations into the URL
  return url.replace('/upload/', `/upload/${transformString}/`)
}

export function getThumbnailUrl(url: string, size = 200): string {
  return getOptimizedImageUrl(url, { width: size, height: size })
}
