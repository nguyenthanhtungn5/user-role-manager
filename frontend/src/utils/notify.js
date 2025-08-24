export function notify(snackbar, text, color = 'success') {
  snackbar.value = { open: true, text, color }
}
