/**
 * Exports the contents of a basket
 * TODO: Refactor to support the correct data
 * @param {*} param0
 */
const exportBasketContents = async ({ basketContents, format = 'csv' }) => {
  let exportedData = ''

  if (format === 'csv') {
    const header = ['ID', 'Name', 'Description']
    const csvContent = basketContents.map(item => `${item.id},"${item.name}","${item.description}"`).join('\n')
    exportedData = `${header.join(',')}\n${csvContent}`
    const blob = new Blob([exportedData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'basket_contents.csv'
    link.click()
  } else if (format === 'json') {
    exportedData = JSON.stringify(basketContents, null, 2)
    const blob = new Blob([exportedData], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'basket_contents.json'
    link.click()
  }
}
export default exportBasketContents
