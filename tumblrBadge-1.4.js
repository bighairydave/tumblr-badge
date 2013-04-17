// tumblrBadge by Robert Nyman, http://www.robertnyman.com/, http://code.google.com/p/tumblrbadge/
//then messed with by me.
var tumblrBadge = function () {
	// User settings
	var settings = {
		userName : "minecraft101net", // Your Tumblr user name
		itemsToShow : 10, // Number of Tumblr posts to retrieve
		itemToAddBadgeTo : "tumblr-badge", // Id of HTML element to put badge code into
		imageSize : 100, // Values can be 75, 100, 250, 400 or 500
		shortPublishDate : false, // Whether the publishing date should be cut shorter
		timeToWait : 2000 // Milliseconds, 1000 = 1 second
	};
	
	// Badge functionality
	var head = document.getElementsByTagName("head")[0];
	var badgeContainer = document.getElementById(settings.itemToAddBadgeTo);
	if (head && badgeContainer) {
		var badgeJSON = document.createElement("script");
		badgeJSON.type = "text/javascript";
		badgeJSON.src = "http://" + settings.userName + ".tumblr.com/api/read/json?callback=tumblrBadge.listItems&num=" + settings.itemsToShow;
		head.appendChild(badgeJSON);
		
		var wait = setTimeout(function () {
			badgeJSON.onload = null;
			badgeJSON.parentNode.removeChild(badgeJSON);
			badgeJSON = null;
		}, settings.timeToWait);
		
		listItems = function (json) {
			var posts = json.posts,
				list = document.createElement("ul"), 
				post, 
				listItem, 
				text, 
				link, 
				img, 
				conversation, 
				postLink;
			list.className = "tumblr";
			for (var i=0, il=posts.length; i<il; i=i+1) {
				post = posts[i];

				// Only get content for text, photo, quote and link posts
				if (/regular|photo|quote|link|conversation/.test(post.type)) {
					listItem = document.createElement("li");
					
					
					// Create a link to Tumblr post
					//postLink = document.createElement("a");
					//postLink.className = "tumblr-post-date";
					//postLink.href = post.url;
					//postLink.innerHTML = (settings.shortPublishDate)? post["date"].replace(/(^\w{3},\s)|(:\d{2}$)/g, "") : post["date"];
					//listItem.appendChild(postLink);
	
					//I just want a date, not a link so I use this code instead of the above block. Also trimmed date.
					postLink = document.createElement("span");
					postLink.className = "tumblr-post-date";
					postLink.innerHTML = post["date"].substring(0, 16);
					listItem.appendChild(postLink);
					
					//these lines are the title: let's just do plain text posts
					if (post.type === "regular"){
						postTitle = document.createElement("h2");
						postTitle.className = "tumblr-post-title";
						postTitle.innerHTML = post["regular-title"];
						listItem.appendChild(postTitle);
						};
					
					text = post["regular-body"] || post["photo-caption"] || post["quote-source"] || post["link-text"] || post["link-url"] || "";
					
					if (post.type === "photo") {
						link = document.createElement("a");
						link.href = post.url;
						img = document.createElement("img");
						// To avoid a creeping page
						img.width = settings.imageSize;
						img.src = post["photo-url-" + settings.imageSize];
						link.appendChild(img);
						listItem.appendChild(link);
						text = "<em>" + text + "</em>";
					}
					else if (post.type === "quote") {
						text = post["quote-text"] + "<em>" + text + "</em>";
					}
					else if (post.type === "link") {
						text = '<a href="' + post["link-url"] + '">' + text + '</a>';
					}
					else if (post.type === "conversation") {
						conversation = post["conversation-lines"];
						for (var j=0, jl=conversation.length; j<jl; j=j+1) {
							text += conversation[j].label + " " + conversation[j].phrase + ((j === (jl -1))? "" : "<br>");
						}
					}
					listItem.innerHTML += text;

					// Apply list item to list
					list.appendChild(listItem);
				}
			}
			
			// Apply list to container element
			badgeContainer.innerHTML = "";
			badgeContainer.appendChild(list);
		};
		
		return {
			listItems : listItems
		};
	}
}();
