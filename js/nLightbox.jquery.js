(function($) {

	var $body = null, // now, the body is null, then, when document is ready, the body gets value
		$document = $(document),
		$window = $(window);
	
	var nLightbox = {

		matchedObj: null,
		preparedObj: null,
		lightboxContainer: null,
		lightboxBackground: null,

		settings: {			
			showCaption:       true,
			imageLoading:      'img/nLightbox/n-lightbox-loader.gif',
			imageBtnPrev:      'img/nLightbox/n-lightbox-prev.png',			
			imageBtnNext:      'img/nLightbox/n-lightbox-next.png',			
			imageBtnClose:     'img/nLightbox/n-lightbox-close.png'
		},

		init: function(matchedObj, settings) {

			$body = $('body');

			this.matchedObj = matchedObj;
			this.preparedObj = $();
			this.lightboxContainer = $('<div class="n-lightbox-container"/>');
			this.lightboxBackground = $('<div class="n-lightbox-background"/>');
			this.navigation = this.createNavigation();			

			this.setSettings(settings);

			this.createLightbox();

			this.bindEvents();

		},

		setSettings: function(settings) {

			$.extend(this.settings, settings);

		},

		prepareObj: function() {

			var self = this;

			this.matchedObj.each(function() {

				var $this = $(this);
				self.preparedObj = self.preparedObj.add(
					$('<div class="n-lightbox-item"/>')
						.append($this.attr('src', $this.data('large')))
						.append(function() {
							var alt = $this.attr('alt');
							if (self.settings.showCaption && alt) {
								return '<div class="n-lightbox-item-caption">' + alt + '</div>';
							}
							return '';
						})
						.append(function() {
							if (this.navigation) {
								return this.navigation;
							}
							return '';
						})
				);

			});

		},

		createNavigation: function() {

			if (this.matchedObj.length > 1) {
				return $('<div class="n-lightbox-navigation">' +
					'<a href="#" class="n-lightbox-prev">' +
						'<img src="' + this.settings.imageBtnPrev + '" alt="Prev" />' +
					'</a>' +
					'<a href="#" class="n-lightbox-next">' +
					'<img src="' + this.settings.imageBtnNext + '" alt="Next"/>' + 
					'</a>' +
				'</div>');
			}
			return null;
			
		},

		createLightbox: function() {

			this.prepareObj();			
			
			$body.append(
				this.lightboxContainer
					.append(this.preparedObj)
			).append(this.lightboxBackground);

			if (this.navigation) {
				this.lightboxContainer.append(this.navigation);
			}

			this.applyStyles();
		},

		applyStyles: function() {
			this.lightboxBackground.css('height', $(document).height());
			this.lightboxContainer.css({
				'height': this.matchedObj.eq(0).height(),
				'top': (($window.height() - this.preparedObj.eq(0).outerHeight()) / 2) - $window.scrollTop() + 'px',
				'left': (($window.width() - this.preparedObj.eq(0).outerWidth()) / 2) - $window.scrollLeft() + 'px',
				'width': this.matchedObj.eq(0).width()
			})
		},

		bindEvents: function() {
			var self = this;

			var close = function() {
				self.lightboxContainer.add(self.lightboxBackground).remove();
			};
			
			if (self.settings.showCaption || self.navigation) {
				this.lightboxContainer.hover(
					function() {
						if (self.settings.showCaption) {
							self.lightboxContainer.find('.n-lightbox-item-caption').fadeIn('slow');
						}
						if (self.navigation) {
							self.lightboxContainer.find('.n-lightbox-navigation').fadeIn('slow');
						}
					},
					function() {
						if (self.settings.showCaption) {
							self.lightboxContainer.find('.n-lightbox-item-caption').fadeOut('slow');
						}
						if (self.navigation) {
							self.lightboxContainer.find('.n-lightbox-navigation').fadeOut('slow');
						}
					}
				);
			}			
			
			this.lightboxBackground.click(close);

		}

	};

	$.fn.nLightbox = function(settings) {

		nLightbox.init(this.clone(), settings);

	};

})(jQuery, window, document);
