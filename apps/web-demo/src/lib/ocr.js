import Tesseract from 'tesseract.js'

export async function extractText(imageFile) {
  const { data } = await Tesseract.recognize(imageFile, 'eng')
  return data.text
}
