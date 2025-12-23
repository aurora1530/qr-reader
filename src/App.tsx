import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

function validateFile(file: File) {
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    return '対応していない画像形式です。PNG / JPEG / WEBP のみ対応しています。'
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return '画像サイズが大きすぎます。最大 5MB まで対応しています。'
  }
  return null
}

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedFile) {
      setImageUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items || items.length === 0) {
        setErrorMessage('クリップボードに画像が見つかりませんでした。')
        return
      }

      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'))
      if (!imageItem) {
        setErrorMessage('クリップボードに画像が見つかりませんでした。')
        return
      }

      const file = imageItem.getAsFile()
      if (!file) {
        setErrorMessage('クリップボードの画像を読み込めませんでした。')
        return
      }

      const validationError = validateFile(file)
      if (validationError) {
        setErrorMessage(validationError)
        return
      }

      setErrorMessage(null)
      setSelectedFile(file)
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  const fileMeta = useMemo(() => {
    if (!selectedFile) return null
    return {
      name: selectedFile.name || 'clipboard-image',
      size: formatBytes(selectedFile.size),
      type: selectedFile.type,
    }
  }, [selectedFile])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setErrorMessage(validationError)
      setSelectedFile(null)
      event.target.value = ''
      return
    }

    setErrorMessage(null)
    setSelectedFile(file)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] px-6 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9b4d2a]">
            QR Reader
          </p>
          <h1 className="text-4xl font-semibold text-[#1f1f1f]">
            画像から QR コードを読み取ります
          </h1>
          <p className="text-base text-[#3d3d3d]">
            画像ファイルを選択するか、ページを開いた状態で Ctrl + V / Command + V を押して
            画像を貼り付けてください。
          </p>
        </header>

        <section className="rounded-3xl border border-[#e2d7c4] bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#3d3d3d]" htmlFor="qr-image">
                画像を選択
              </label>
              <input
                ref={fileInputRef}
                id="qr-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="mt-2 block w-full cursor-pointer rounded-lg border border-[#d8cbb4] bg-white px-3 py-2 text-sm text-[#1f1f1f] file:mr-4 file:rounded-md file:border-0 file:bg-[#1f1f1f] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-[#bfa785]"
              />
              <p className="mt-2 text-xs text-[#6b5e4b]">
                PNG / JPEG / WEBP（最大 5MB）
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-[#d76b3d] bg-[#fff1ea] px-4 py-3 text-sm text-[#a5401a]">
                {errorMessage}
              </div>
            )}

            {selectedFile && (
              <div className="flex flex-col gap-4 rounded-2xl border border-[#e2d7c4] bg-[#fdf9f2] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#3d3d3d]">
                  <div className="space-y-1">
                    <p className="font-semibold">{fileMeta?.name}</p>
                    <p className="text-xs text-[#6b5e4b]">
                      {fileMeta?.type} · {fileMeta?.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-[#d8cbb4] px-4 py-1 text-xs font-semibold text-[#3d3d3d] hover:border-[#bfa785] hover:text-[#1f1f1f]"
                  >
                    クリア
                  </button>
                </div>

                {imageUrl && (
                  <div className="overflow-hidden rounded-xl border border-[#e2d7c4] bg-white">
                    <img
                      src={imageUrl}
                      alt="選択した画像のプレビュー"
                      className="max-h-[360px] w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
