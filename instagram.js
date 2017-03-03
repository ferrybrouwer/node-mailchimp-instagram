import axios from 'axios'

const Instagram = {

	/**
	 * Scrape instagram for hashtag
	 * 
	 * @param  {String} 			hashtag
	 * @param  {Array} 				fields
	 * @param  {Number|null} 	amount 
	 * @return {Array}        
	 */
	async scrapeHashTags(hashtag, fields, amount) {
		try {
			// fetch JSON string from html
			const {data:html} = await axios.get(`https://www.instagram.com/explore/tags/${hashtag}`)
			const {1:dataString} = html.match(/window\._sharedData\s?=\s?({.+);<\/script>/)

			// convert JSON string into an object and trim if neccessary
			let {nodes} = JSON.parse(dataString).entry_data.TagPage[0].tag.media
			nodes = amount ? nodes.slice(0, amount) : nodes

			// when fields are provided, trunc the nodes with given fields
			if (Array.isArray(fields)) {
				nodes = nodes.map((node) => {
					Object.keys(node).forEach((key) => {
						if (fields.indexOf(key) === -1) {
							delete node[key]
						}
					})

					return node
				})
			}

			return nodes
		} catch(err) {
			throw new Error(`Can not scrape instagram`, err.status || 402)
		}
	}
}

export default Instagram;