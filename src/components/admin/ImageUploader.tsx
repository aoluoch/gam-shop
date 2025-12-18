import { useState, useRef } from 'react'
import { Upload, X, Loader2, GripVertical, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadToCloudinary, type UploadProgress } from '@/services/cloudinary.service'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  thumbnail?: string
  onThumbnailChange?: (thumbnail: string) => void
  maxImages?: number
  className?: string
}

export function ImageUploader({
  images,
  onImagesChange,
  thumbnail,
  onThumbnailChange,
  maxImages = 10,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    setError(null)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          continue
        }

        const fileId = `${file.name}-${Date.now()}`
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

        try {
          const result = await uploadToCloudinary(file, (progress: UploadProgress) => {
            setUploadProgress((prev) => ({ ...prev, [fileId]: progress.percentage }))
          })
          newImages.push(result.url)
          
          // Set first uploaded image as thumbnail if none set
          if (!thumbnail && images.length === 0 && newImages.length === 1 && onThumbnailChange) {
            onThumbnailChange(result.url)
          }
        } catch (uploadErr) {
          console.error('Upload error for file:', file.name, uploadErr)
        } finally {
          setUploadProgress((prev) => {
            const updated = { ...prev }
            delete updated[fileId]
            return updated
          })
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
      }
    } catch (err) {
      setError('Failed to upload images. Please check your Cloudinary configuration.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const removedImage = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    
    // If removed image was thumbnail, set new thumbnail
    if (removedImage === thumbnail && onThumbnailChange) {
      onThumbnailChange(newImages[0] || '')
    }
  }

  const setAsThumbnail = (url: string) => {
    if (onThumbnailChange) {
      onThumbnailChange(url)
    }
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const uploadingCount = Object.keys(uploadProgress).length

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div 
            key={`${image}-${index}`} 
            className={cn(
              'relative group aspect-square rounded-lg overflow-hidden border-2',
              image === thumbnail ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
            )}
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setAsThumbnail(image)}
                className={cn(
                  'p-1.5 rounded-full transition-colors',
                  image === thumbnail 
                    ? 'bg-primary text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                )}
                title="Set as thumbnail"
              >
                <Star className="h-4 w-4" fill={image === thumbnail ? 'currentColor' : 'none'} />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="p-1.5 bg-white/80 text-gray-700 rounded-full hover:bg-white transition-colors"
                  title="Move left"
                >
                  <GripVertical className="h-4 w-4 rotate-90" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {image === thumbnail && (
              <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center py-1">
                Thumbnail
              </div>
            )}
          </div>
        ))}

        {/* Upload progress indicators */}
        {Object.entries(uploadProgress).map(([fileId, progress]) => (
          <div 
            key={fileId} 
            className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/50"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        ))}

        {images.length + uploadingCount < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors',
              uploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm">Upload</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-muted-foreground">
        {images.length} of {maxImages} images uploaded. Click the star icon to set a thumbnail.
      </p>
    </div>
  )
}
