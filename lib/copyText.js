export default async function copyText (text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
     console.log(err)
  }
}
