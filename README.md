## Environment variables

Run node server with 2 required environment variables:
 
- MAILCHIMP_API_KEY
- MAILCHIMP_KEY_LIST_ID





## Example:

    $ MAILCHIMP_API_KEY=xxxxxxxxxxxxx MAILCHIMP_LIST_ID=xxxxx node .



    
    
## Endpoints:

- **GET** `//0.0.0.0:3000/instagram/:hashtag`
    
  *Shows 3 latests images from intagram posts matching the given hashtag*

- **GET** `//0.0.0.0:3000/mailchimp`
    
	*Mailchimp subscribe form*
	
- **POST** `//0.0.0.0:3000/mailchimp` 

	*Subscribe new user to list with form body:*
	
	- name
	- email