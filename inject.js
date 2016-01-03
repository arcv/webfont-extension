window.webfontExtention = {};
window.webfontExtention.fonts = {};
window.webfontExtention.tempFontList = [];
window.webfontExtention.limit = 20;
window.webfontExtention.offset = 0;

window.webfontExtention.insert_font = function() {
	$.each(window.webfontExtention.fonts.items, function(key, item) {

		if (key >= window.webfontExtention.offset && key < window.webfontExtention.limit) {
			var li = $("<li/>")
			var a = $("<a/>").attr("data-font-id", key).text(item.family).attr({
				style: "font-family: '" + item.family + "'"
			})
			$(".extension-webfont .side-nav").append(li.append(a))
			set_style(item);
		}
		// return (key + window.webfontExtention.offset < window.webfontExtention.limit);
	})

	// $(".extension-webfont .side-nav li[data-more]").remove()
	// var button = $("<button/>").addClass("load-more-button").text("Load More Fonts")
	// $("<li/>").attr("data-more", "").html(button).appendTo(".extension-webfont .side-nav")
}

window.webfontExtention.filter_font = function(filterString) {
	$(".extension-webfont .side-nav").empty();
	var continueToLoad = true;
	window.webfontExtention.tempFontList = [];

	$.each(window.webfontExtention.fonts.items, function(key, item) {
		var searchReg = new RegExp(filterString, 'gi');

		if(item.family.search(searchReg) != -1 && continueToLoad == true) {
			window.webfontExtention.tempFontList.push(item);

			/// Disable loading
			if(window.webfontExtention.tempFontList.length > 10)
				continueToLoad = false;
		}
	})

	/// Show tempFontList
	$.each(window.webfontExtention.tempFontList, function(key, item) {

		if (key >= window.webfontExtention.offset && key < window.webfontExtention.limit) {
			var li = $("<li/>")
			var a = $("<a/>").attr({"data-font-id": key, "data-filter-result": true}).text(item.family).attr({
				style: "font-family: '" + item.family + "'"
			})
			$(".extension-webfont .side-nav").append(li.append(a))
			set_style(item);
		}
		// return (key + window.webfontExtention.offset < window.webfontExtention.limit);
	})
}

function set_style(font) {
	var str = "@import url(http://fonts.googleapis.com/css?family=%s);"
	str = str.replace("%s", font.family.replace(" ", "+"))
	$("[name='extension-webfont-stylesheet']").append(str)
}

function insert_css(fontFamily) {
	var selector = $(".extension-webfont-selector").val()
	var str = "%s {font-family: '%s' !important; font-weight: 300 !important}"
	str = str.replace("%s", selector).replace("%s", fontFamily)

	$("[name='extension-webfont-css']").text(str)
}

$(document).on("click", "[data-font-id]", function(ev) {

	var fontList = {};

	if($(this).data("filter-result") == true) {
		console.log(window.webfontExtention.tempFontList)
		var font = window.webfontExtention.tempFontList[$(this).data('font-id')]
	} else {
		var font = window.webfontExtention.fonts.items[$(this).data('font-id')]
	}
	insert_css(font.family)
})

$(document).on("click", "[data-more]", function(ev) {
	window.webfontExtention.limit += 20;
	window.webfontExtention.offset += 20;
	window.webfontExtention.insert_font();
})

$(document).on("keyup", ".extension-webfont-filter", function(ev) {
	var string = $(".extension-webfont-filter").val();
	if (string.length == 0) {
		window.webfontExtention.insert_font();
	} else {
		window.webfontExtention.filter_font(string);
	}
})

/**
 * Handler
 */
chrome.extension.onMessage.addListener(
	function(request, sender) {

		if (request.message = 'init') {
			$.get(chrome.extension.getURL('template.html'), function(data) {

				if ($(".extension-webfont").length !== 0) {
					$(".extension-webfont").remove();
				}

				$("body").append(data)

				// insert new stylesheet
				$("<style/>").attr("name", "extension-webfont-stylesheet").appendTo(".extension-webfont")
				$("<style/>").attr("name", "extension-webfont-css").appendTo(".extension-webfont")

				$.getJSON(chrome.extension.getURL('fontcache.json'), function(responseData) {
					window.webfontExtention.fonts = responseData;

					// start inserting font
					window.webfontExtention.insert_font()
				})

			})
		}
	});