
//document.write('<script data-inline src="http://connect.facebook.net/en_US/all.js"></script>');

var FacebookInvite = new Class({
	initialize : function(options) {
		this.options = options;
		FB.init({appId: options.appId, xfbml: true, cookie: true});
		Delegator.register('click', {'Invite' : this.onInvite.bind(this)});
	},
	onInvite : function(event, el, api) {
		event.stop();		
		this.fbid = api.get('fbid');
		new Request.JSON({
			url : 'index.php/invites/token',
			onSuccess : this.openDialog.bind(this)
		}).get();
	},
	openDialog : function(token) {		
		var msgLink = this.options.appURL;
		msgLink    += '?token='+token.value;
		console.log(msgLink);
		FB.ui({
				display: 'iframe',
				method:	'send',
				name: 'Anahita',
				link: msgLink,
				picture: this.options.picture,				
				to: this.fbid,
				name: this.options.subject,
				description: this.options.body
			},
			function(response){
				if(response.success) {
					new Request.JSON({
							method: 'post',
							url : 'index.php/invites/facebook',
							data: 'action=invite&token=' + token.value
					}).send();
				}				
			}.bind(this)	
		);		
	}
});