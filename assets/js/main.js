function projects(){
	this.init();
}

projects.prototype = {
	allProjects: {},
	template: "\
	<h1>{{title}}</h1>\
	<div class='roles'>\
	<h3>Project Role:</h3>\
	<ul class'role'>\
	{{#role}}\
	<li>{{.}} </li>\
	{{/role}}\
	</ul>\
	</div>\
	<h2>Challenge:</h2>\
	<p>{{challenge}}</p>\
	<h2>Approach:</h2>\
	<p>{{approach}}</p>\
	<h2>Result:</h2>\
	<p>{{result}}</p>\
	<img src='assets/images/{{image}}'/>\
	<h4>Links:</h4>\
	<ul>\
	{{#links}}\
	<li><a href='{{.}}' target='_blank' rel='bookmark'>{{.}}</a></li>\
	{{/links}}</ul>",
	init: function(){

	},
	preloadImage: function(src){
		var img = new Image();
		img.src = "assets/images/"+src;
	},
	addProject: function(projectObject){
		var hashname = projectObject['shortname'];
		this.allProjects[hashname] = projectObject;
		this.preloadImage(projectObject['image']);
		return this.allProjects;
	},
	fetchProject: function(name){
		return this.allProjects[name];
	},
	renderProject:function(name, where){
		var that = this;
		$(where).fadeOut('fast',function(){
				$(where).html(Mustache.render(that.template, that.allProjects[name]));
				$(where).fadeIn();
		});

	},
	setupNav: function(where){
		$.each(this.allProjects, function(key,value){
			var linkHtml = Mustache.render("<li><a href='#{{shortname}}''>{{title}}</a></li>", value);
			$(where).fadeOut('fast',function(){
				$(where).append(linkHtml).fadeIn();
			});

		});
	}

};

portfolio = new projects();
portfolio.addProject(
	{
		shortname:"marinbikes",
		title: "Marin Bikes Catalog Site",
		challenge: "2014 is a big year for Marin. With a new owner and CEO the brand is hoping \
		to rejuvenate itself with a new identity and CMS. The site needed the ability to be maintained\
		by anyone inside the company, had to have different content depending on the user's country\
		and needed to be able to help users who were both knowledgable about bikes or who lacked expert knowledgable\
		about bikes.",
		approach: "Given these challenges, the first step was to research multi-lingual CMS options\
		and consumer's bike buying research behaviors. After numerous trips to bike stores for personal\
		interviews I decided it was best to help users find their appropriate bike in a self selective manner.\
		By this I mean each consumer has differing information needs, so the navigation and content was designed\
		in such a manner that a user can drill down to different lengths to find their proper match.\
		The CMS of choice ended up being Expression Engine, this was largely due to the great add on network\
		and the ability to find a multi-lingual tool that with minimal alteration could be changed to meet my needs.",
		result: "The site was a huge success at launch. The sites bounce rate dropped by over 50%,\
		90% of users when surveyed found the navigation easier to use. Traffic to the site increased by 110%.",
		image: "marin.jpg",
		links: ["http://www.marinbikes.com"],
		role:["UI Designer,", "Front End Developer,", "PHP Developer,", "Project Manager"]
	}
);
portfolio.addProject(
	{
		shortname:"marinculture",
		title: "Marin Culture Photo Contest",
		challenge: "2013 was a rough year for Marin, the brand was prepping for a rebrand and we needed a\
		way to change the conversation to where we were headed in 2014. In order to do this it was decided\
		that we should give a nod to the company's past and try to get users to communicate with our brand.",
		approach: "Marin had a strong history of making great bikes, we wanted to leverage this. In order to do\
		so a photo contest site was created that also had a history blog associated with it. The site allowed\
		for marketing to create multiple photo contests allowing users to upload images to and vote for their favorites.\
			The site was built using Ruby On Rails, on Heroku using Codeship for BDD.",
		result: "The site was successful at starting a conversation about the history of the brand and collected hundreds\
		of user generated photos.",
		image: "marinculture.jpg",
		links: ["http://www.marinculture.com"],
		role:["UI Designer,", "Front End Developer,", "Ruby On Rails Developer,", "Project Manager"]
	}
);

portfolio.addProject(
	{
		shortname:"bimvid",
		title: "BIMVid Media Manager",
		challenge: "BIM works with hundreds of tv stations that are collecting video from multiple sources:\
		on air, UGC, mobile devices and b-roll. The BIMVid media manager needed to collect all this content,\
		organize it, transcode the assets for web and mobile use, serve content to the appropriate places,\
		track usage and scale.",
		approach: "As a member of a small team of three, I lead the creation of many pieces of this system using Symphony2, Mongodb and TDD.\
		My contributions included the following services: user registration, building a transcode queue, moving transcoded videos onto s3,\
		creation of a restful api and syncing videos to YouTube channels.",
		result: "The BIMVid manager has proven to be successful. The api is in use by multiple third party video\
		providers, nearly 100 clients have come on board and the tool is now being converted into a dashboard for other\
		projects as well.",
		image: "bimvid.jpg",
		links:["http://www.bimvid.com/"],
		role:["PHP Developer"]
	}
);

portfolio.addProject(
	{
		shortname:"bimreg",
		title: "BIMReg JS Library",
		challenge: "BIM had built a javascript library to use with its UGC toolset YouNews.\
		When bringing on a big client the project required that we have a more robust user solution.\
		One of the requirements was that the tool share all users across multiple brands and be usable off the CMS.\
		These requirements lead to a browser based JS solution tied to a PHP backend.",
		approach: "Since the same tool was to be used across multiple properties and for many different processes,\
		we immediately ran into issues with cross domain access. In order to achieve the goals we ended up\
		building a JSONP driven javascript library. The code ended up being a two part event driven js library based on Nicholas Zakas'\
		scalable javascript architecture. Finally in order to simplify use of the library for third party developers a\
		WISDL was created to allow developers to pass in a flat javascript object or use simple getters and setters\
		to update users without needing to format a deeply nested javascript object.",
		result: "The js library allowed for extreme flexibility that ended up tying into multiple third party tools\
		and eventually incorporate oauth with Facebook and Twitter.",
		image: "bimreg.jpg",
		links:["assets/code/bimreg.js"],
		role:["Front End Developer,", "Javascript Developer,", "Project Manager"]
	}
);

portfolio.addProject(
	{
		shortname:"mdotlabs",
		title: "M.Labs Prototype",
		challenge: "A number of people in the Ad Operations department had great ideas for how to improve\
		our ad offering and serve more relevant ads. I worked closely with them on a pet project to come up\
		with a prototype to show management a proof of concept.",
		approach: "BIM is in an incredible position to serve ads that are highly relevant and localized.\
		Unfortunately the way the company was setup doing so was very time intensive. The approach\
		was to create a way to collect as much data about the page being viewed by the user and the user's\
		preferences and get that data to the ad server for improved relevancy.",
		result: "A new javascript library was created as well as a small Django admin. Ad ops was passed\
		back relevant page data based on the number of keywords found for each page taxonomy defined in the admin\
		tool against the keyword count for the viewer's page. This project sparked a much larger project\
		in the company which has since fostered a spinoff company.",
		image: "mdot.jpg",
		links: ["http://www.mdotlabs.com/"],
		role:["Front End Developer,", "Javascript Developer,", "Python/Django Developer,", "Project Manager"]
	}
);

portfolio.addProject(
	{
		shortname:"mobile",
		title: "BIM Mobile",
		challenge: "BIM needed a mobile layout for its hundreds of existing news sites.\
		The layout needed to be modular so it could change according to each sites needs,\
		the functionality needed to be setup in under 15 minutes and ideally was able to be style for each\
		client's identity.",
		approach: "I built a modular website that could take the existing modules on the\
		website and change the layout based on a request parameter and server side device\
		detection. A cookie was dropped if a user wanted to view the full site to bypass this server\
		side detection. Separate mobile specific module settings and stylesheets\
		were available to override the default look and layout.",
		result: "The flexibility was immediately much appreciated leading to most\
		of our clients moving off of third party mobile solutions to the more integrated\
		and flexible in house solution.",
		image: "mobile.jpg",
		links: ["http://www.katu.com/?smobile=y"],
		role:["UI Designer,", "Front End Developer,", "CMS Developer,", "Project Manager"]
	}
);

portfolio.addProject(
	{
		shortname:"belo",
		title: "Belo",
		challenge: "Belo needed 16 local news website built in 6 months while appeasing a large\
		committee with differing ideas and needs.",
		approach: "As project lead on this my approach was to immediately set expectations of\
		what could realistically be accomplished in the given time period and to setup a \
		long term agile approach to quickly iterate on a minimal viable project. Much time and\
		patience was needed to outline the initial offering and once outlined a process was\
		created to stamp out clones of the original site while collecting individual long\
		term site needs.",
		result: "The approach was not immediately well received but in the long run\
		the modular system we developed ended up fulfilling all the site's needs much\
		quicker then they had expected and the initial sites were delivered on time.",
		image: "belo.jpg",
		links: ["http://www.khou.com", "http://www.wfaa.com"],
		role:["UI Designer,", "Front End Developer,", "CMS Developer,", "Project Manager"]
	}
);

portfolio.addProject(
	{
		shortname:"nbc",
		title: "NBC Universal",
		challenge: "NBC Universal wanted to setup an in house division to handle all of it's\
		local news websites, as a part of this project they chose BIM to train them on how to\
		develop on the CMS and to assist with the heavy lifting of the initial site launch.",
		approach: "As project lead it was my job to line up all training for developers, identify and schedule\
		all project deliverables and create the process by which we would launch all the sites in time.\
		In order to do these we devised a template based modular solution to speed up development\
		while allowing for flexibility. We also created a very large content API to assist with a \
		project that required all content from any internal system be available to any other system.",
		result: "All NBC websites launched on time and the internal division that we helped\
		guide inside NBC has been working with BIM ever since.",
		image: "nbc.jpg",
		links: ["http://www.nbcnewyork.com", "http://www.nbcbayarea.com"],
		role:["Front End Developer,", "Project Manager"]
	}
);
portfolio.setupNav($("ul.nav").first());

(function(){
	var originalHash = window.location.hash.replace("#","");
	if(originalHash){
		portfolio.renderProject(originalHash, $(".content"));
		updateCurrentLink(originalHash);
	}

	function updateCurrentLink(hash){
		$("a.current").removeClass("current");
		hash = "#" + hash;
		$("a[href='"+hash+"']").addClass("current");
	}

	$(window).bind('hashchange', function() {
		var newHash = window.location.hash.replace("#","");
		portfolio.renderProject(newHash, $(".content"));
		updateCurrentLink(newHash);
	});
})();
