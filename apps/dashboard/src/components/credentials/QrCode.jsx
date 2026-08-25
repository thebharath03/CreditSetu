import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

function QrCode({ value, size = 180 }) {
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(value, { width: size, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [value, size])

  if (!dataUrl) {
    return <div className="credential-qr-placeholder" style={{ width: size, height: size }} />
  }

  return <img className="credential-qr" src={dataUrl} width={size} height={size} alt="Credential QR code" />
}

export default QrCode
