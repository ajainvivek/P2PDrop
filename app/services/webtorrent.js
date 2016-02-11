/**** WebTorrent Service Layer ******/

import Ember from "ember";

const {
	Service,
	RSVP
} = Ember;

export default Service.extend({
	torrentClient : function () {
		if (!this.get("client")) {
			this.set("client", new WebTorrent());
		}
		return this.get("client");
	},
	download : function (magnetURI) {
		let client = this.torrentClient();

		return new RSVP.Promise(function (resolve, reject) {
			client.add("magnet:?xt=urn:btih:" + magnetURI, function (torrent) {
				// Got torrent metadata!
				console.log('Client is downloading:', torrent.infoHash)

				resolve(torrent.files);
			});
		});
	},
	seed : function (files) {
		var client = this.torrentClient();

		return new RSVP.Promise(function (resolve, reject) {
			client.seed(files, function (torrent) {
				console.log('Client is seeding:', torrent.infoHash);
				resolve(torrent.infoHash);
			});
		});
	}
});
