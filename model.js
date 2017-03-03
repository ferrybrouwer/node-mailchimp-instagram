import Instagram from './instagram'
import Mailchimp from 'mailchimp-api-v3'

export const InstagramModel = {
    cache: {},

    /**
     * Get instagram nodes
     *
     * @param  {String}        hashtag
     * @param  {Array|null} fields
     * @param  {Number}            amount
     * @return {Array}
     */
    async getNodes(hashtag, fields = ['display_src', 'thumbnail_src'], amount = 3) {
        const cache = this.cache.hasOwnProperty(hashtag) ? this.cache[hashtag] : {};

        // fetch nodes when there're no nodes or ttl expires 
        const expireTime = cache.hasOwnProperty('timestamp') ? Math.abs(Date.now() - cache.timestamp) : false;

        if (expireTime === false || this._toMinutes(expireTime) >= 1) {
            cache.nodes     = await Instagram.scrapeHashTags(hashtag, fields, amount)
            cache.timestamp = Date.now()
        }

        // set cache
        this.cache[hashtag] = cache

        // return the nodes
        return cache.nodes
    },

    /**
     * Convert milliseconds to minutes
     *
     * @param  {Number} milliseconds
     * @return {Number}
     */
    _toMinutes(milliseconds) {
        return Math.floor((milliseconds / 1000) / 60)
    }
}

export const MailchimpModel = {
    mailchimp: null,

    /**
     * Set API key
     *
     * @param {string} key
     */
    setKey(key) {
        this.mailchimp = new Mailchimp(key)
    },

    /**
     * Fetch lists
     *
     * @return {Array}
     */
    async fetchLists() {
        return await this.mailchimp.get('/lists')
    },

    /**
     * Subscribe user
     *
     * @param   {String}    listId
     * @param   {String}    name
     * @param   {String}    email
     * @return  {Object}
     * @throws  {Error}     If can not subscribe
     */
    async subscribeList(listId, name, email) {
        return await this.mailchimp.post(`/lists/${listId}/members`, {
            email_address: email,
            status:        'subscribed',
            merge_fields:  {NAME: name}
        })
    }
}