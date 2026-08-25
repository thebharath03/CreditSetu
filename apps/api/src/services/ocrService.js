/**
 * This is a browser/server OCR stand-in for the mobile app's on-device
 * ML Kit integration, used only until the in-person phone build exists.
 * Do not treat this as the shipped OCR path. Uses Tesseract.js (same
 * library the original web-demo used client-side) running server-side
 * here instead, since apps/api has no browser to run it in.
 */
import { createWorker } from 'tesseract.js'

export async function extractText(imageBuffer) {
  const worker = await createWorker('eng')
  try {
    const {
      data: { text },
    } = await worker.recognize(imageBuffer)
    return text
  } finally {
    await worker.terminate()
  }
}
