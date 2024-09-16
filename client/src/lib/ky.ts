import ky from 'ky'

export const kyInstance: typeof ky = ky.create({
	parseJson: (text) =>
		JSON.parse(text, (key, value) => {
			if (key.endsWith('At')) {
				return new Date(value)
			}
			return value
		})
})

export default kyInstance
