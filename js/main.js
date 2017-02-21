var DOMAIN = "https://us.locogram.com/locogram/";

// var domain_name = "localhost";
var domain_name = "locogram.com";
// var DOMAIN = "/json/";

/** HANDLE BAR helpers */
Handlebars
        .registerHelper("modulo",
                function(index_count, block) {
                  if ((parseInt(index_count)) % 4 == 0
                          && (parseInt(index_count)) > 0) { return block
                          .fn(this); }
                });

Handlebars.registerHelper('iflist', function(v1, options) {
  if (v1 != undefined && v1.length > 0) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('getType', function(data) {
  if (data['created'] == undefined) {
    return "offer";
  } else {
    return "update";
  }
});

Handlebars.registerHelper('esc', function(data) {
  if (data == undefined) return data;
  return data.replace(/'/g, '\\\'');
});

Handlebars.registerHelper('ifzero', function(v1, options) {
  if (v1 != "0") { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifsubmenu', function(obj, attr, options) {
  if (obj.hasOwnProperty(attr)) { return options.fn(attr); }
  return options.inverse(attr);
});

Handlebars.registerHelper('ifcond', function(v1, v2, options) {
  // console.log(v1 + "--" + v2);
  if (v1 == v2) { return options.fn(this); }
  return options.inverse(this);
});
Handlebars.registerHelper('ifgreater', function(v1, v2, options) {
  // console.log(v1 + "--" + v2);
  if (v1 > v2) { return options.fn(this); }
  return options.inverse(this);
});
Handlebars.registerHelper('eachSubmenu', function(obj, attr, options) {
  return options.fn({
    value: obj[attr]
  });
});

Handlebars.registerHelper('getimageheight', function(w, w1, h1) {
  return w * h1 / w1;
});

(function($) {
  $.hasScrollBar = function() {
    // console.log($(document).height());
    // console.log($(window).height());
    // console.log($('body').height());
    return $(document).height() > $(window).height();
  }

})(jQuery);

// Helper Function
(function($) {
  $.checkScroll = function(size, cb) {
    if (!$.hasScrollBar() && size != 0) {
      // console.log($.hasScrollBar());
      cb();
    }
  }
  $.QueryString = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=');
      if (p.length != 2) continue;
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  $.getInfo = function(el) {
    var type = $(el).attr('data-type');
    var id = $(el).attr('data-id');
    var token = _preferences.token();

    $.ajax(
            {
              headers: {
                'Cookie': document.cookie
              },
              method: "GET",
              url: DOMAIN + 'getItemDetails.json?type=' + type + '&id=' + id
                      + '&token=' + token
            // ,
            // xhrFields : {
            // withCredentials : true
            // }
            }).done(function(msg) {

    });

    // $.get(DOMAIN + 'getItemDetails.json?type=' + type + '&id=' + id
    // + '&token=' + token, function() {
    //
    // });
  }

  $.goFavorites = function() {
    window.location.href = "favorites.html?token=" + _preferences.token();
  }

  $.favorite = function(el) {
    if(!login.getInfo().mallId){
      login.modal();
      return; 
    }
    var type = $(el).attr('data-type');
    var id = $(el).attr('data-id');
    var token = _preferences.token();
    var fav = $(el).attr('data-fav');

    if (fav == "true" && (type == "shop" || type == "mall")) {
      // https://us.locogram.com/locogram/subscribe.json?id=XXXXX&token=YYYYYY
      $
              .get(
                      DOMAIN + 'unsubscribe.json',
                      {
                        type: type,
                        id: id,
                        token: token
                      },
                      function(d) {
                        $(el).attr('data-fav', false);
                        var html = $(el).html();
                        var flag = false;
                        if (html.indexOf("all") > 0) flag = true;

                        if (type == "shop") {
                          if (flag) {
                            $(el)
                                    .html(
                                            '<i class="fa fa-plus fa-lg"></i> Add To My Mall');
                          } else {
                            $(el).html(
                                    '<i class="fa fa-plus fa-lg"></i>');
                          }

                          $(el).attr('title', 'Add to my mall');
                        } else {
                          if (flag) {
                            $(el)
                                    .html(
                                            '<i class="fa fa-plus fa-lg"></i> Follow This Mall');
                          } else {
                            $(el).html(
                                    '<i class="fa fa-plus fa-lg"></i>');
                          }
                          $(el).attr('title', 'Add to my favorite malls');
                        }

                      });
    } else if ((type == "shop" || type == "mall")) {
      $
              .get(
                      DOMAIN + 'subscribe.json',
                      {
                        type: type,
                        id: id,
                        token: token
                      },
                      function(d) {
                        // console.log(d);
                        $(el).attr('data-fav', true);
                        var html = $(el).html();
                        var flag = false;
                        if (html.indexOf("all") > 0) flag = true;

                        if (type == "shop") {
                          if (flag) {
                            $(el)
                                    .html(
                                            '<i class="fa fa-times fa-lg"></i> Remove From My Mall');
                          } else {
                            $(el).html('<i class="fa fa-times fa-lg"></i>');
                          }
                          $(el).attr('title', 'Remove from my mall');
                        } else {
                          if (flag) {
                            $(el)
                                    .html(
                                            '<i class="fa fa-times fa-lg"></i> Unfollow This Mall');
                          } else {
                            $(el).html('<i class="fa fa-times fa-lg"></i>');
                          }
                          $(el).attr('title', 'Remove from my favorite malls');
                        }

                      });
    } else if (fav == "true") {
      // remove to toggle
      $.get(DOMAIN + 'removeFromFavorites.json', {
        type: type,
        id: id,
        token: token
      }, function(d) {
        $(el).attr('data-fav', false);
        $(el).find("i").removeClass('fa-heart');
        $(el).find("i").addClass('fa-heart-o');
      });
    } else {
      // add
      $.get(DOMAIN + 'addToFavorites.json', {
        type: type,
        id: id,
        token: token
      }, function(d) {
        // console.log(d);
        $(el).attr('data-fav', true);
        $(el).find("i").removeClass('fa-heart-o');
        $(el).find("i").addClass('fa-heart');
      });
    }
    // if using the favorites page
    if (favorites.$masonry_container != null) {
      // if favorites is changed .. reload page..
      $('#modal_close').click(function() {
        favorites.reloadPage();
      });
    }

  }

  $.shareButton = function(el, flyout, btnText) {
    // Documentation: https://github.com/carrot/share-button
    // console.log($(el).attr('data-merchant'));
    // console.log($(el).attr('data-msg'));
    var t = $(el).data('type');
    if (t == 'offer') {
      var title = $(el).attr('data-merchant');
      var caption = "Via Locogram";
      var desc = "\n";
      var text_twitter = title;
      var text_pinterest = title;
    } else if (t == 'update') {
      var title = $(el).attr('data-merchant');
      var caption = "Via Locogram";
      var desc = $(el).attr('data-msg');
      var text_twitter = desc;
      var text_pinterest = desc+"\n"+title;
    } else if (t == 'product') {
	  var title = $(el).attr('data-title')+" $"+$(el).attr('data-price');
      var caption = "Via Locogram";
      var desc = $(el).attr('data-merchant');
      var text_twitter = title;
      var text_pinterest = title+"\n"+desc;
    } else {
	  var title = $(el).attr('data-name');
	  var caption = "locogram.com";
      var desc = $(el).attr('data-title');
      var text_twitter = title;
      var text_pinterest = title+"\n"+desc;
    }
    
    if(t=="mall"){
      var className= ".mall";
    }else{
      var className=".sb";
    }
    var share = new ShareButton({
      className:className,
      ui: {
        flyout: flyout == undefined ? 'middle right' : flyout,
        buttonText: btnText == undefined
                ? '<i class="fa fa-share-square-o"></i> Share' : btnText
      },
      networks: {
        facebook: {
          appId: "385036888214910",
          before: function() {
          	this.url = $(el).attr('data-url');
            this.image = $(el).attr('data-image');
            this.title = title;
            this.caption = caption;
            this.description = desc;
          }
        },
        twitter: {
          before: function(element) {
            if ($(el).attr('data-url') != "") {
              this.url = $(el).attr('data-url');
            } else {
              this.url = $(el).attr('data-image');
            }
            // console.log(desc);
            this.description = text_twitter;
          }
        },
        pinterest: {
          before: function(element) {
            this.url = $(el).attr('data-url');
            this.image = $(el).attr('data-image');
            this.description = text_pinterest;
          }
        },
        email: {
          enabled:false
//          before: function(element) {
//          	this.title = "";
//            this.description = desc + "\n" + $(el).attr('data-url');
//          }
        },
        googlePlus: {
          enabled: false
        },
        reddit: {
          enabled: false
        },
        linkedin: {
          enabled: false
        },
        whatsapp: {
          enabled: false
        }
      }
    });

  }

  // init pretty photo with share button
  $.initPrettyPhoto = function(data) {

    $(data).find("img").on("click", function(e) {
      e.preventDefault();
    });

    $(data).find("a[rel^='prettyPhoto']").each(function(i, el) {
      $(el).on('click', function() {
        previewModal.modal(el);
      });
    });

    // $(data).find("a[rel^='prettyPhoto']").each(function(i, el) {
    // $(el).prettyPhoto({
    // allow_resize : true,
    // show_title : true,
    // inline_markup : '<div class="pp_inline">{content}</div>',
    // custom_markup : '',
    // changepicturecallback : function() {
    // $.shareButton($(el));
    // $.getInfo($(el));
    // },
    // social_tools : '<div class="pp_social"></div>',
    // obj : el
    // });
    // });
  }
  // initialize typehead events search
  $.initTypehead = function(id, f) {
    $('#' + id).keyup(function(event) {
      $('.tt-suggestion').hover(function() {
        $('.tt-suggestion').removeClass('tt-cursor');
        $(this).addClass('tt-cursor');
      });
    });
    $('#' + id).keypress(function(e) {
      // || e.which == 8
      if (e.which == 13) {
        f(id);
      }
    });

    $('.typeahead').on('typeahead:selected', function(object, datum) {
      $(this).trigger('typeahead:_done', [object, datum]);
    }).on('typeahead:autocompleted', function(object, datum) {
      $(this).trigger('typeahead:_done', [object, datum]);
    }).on('change', function() {
      // $(this).trigger('typeahead:_changed');
    }).on('typeahead:_changed', function() {
      // f(id);
    }).on('typeahead:_done', function(evt, object, datum) {
      f(id);
      // This event is triggered ONLY when the user selects or
      // autocompletes
      // with an entry from the suggestions.
    });

  }

  $.followers = function() {
    if (malls.followers_template == null) {
      getTemplateAjax('js/templates/followers_modal.html?', function(
              template) {
        malls.followers_template = template;
        showFollowers();
      });
    } else {
      showFollowers();
    }
    function showFollowers() {
      if (malls.data) {
        malls.data.token = _preferences.token();
        var html = malls.followers_template(malls.data);
        $('#followers_modal').html(html);
        $('#followers_modal').modal('show');
      }
    }

  }
  $.errorImage = function(el, id) {
    
    $.ajax({
      method: "GET",
      url: DOMAIN + "deleteProduct.json?id=" + id + '&token=' + _preferences.token()
    }).success(function(json){
      var imgEl = $(el).parent().parent();
      imgEl.parent().masonry('remove', imgEl)
          .masonry('layout');
      
      console.log('success');
    })
  }
})(jQuery);
// UUID
/**
 * Generates UUID v4 https://gist.github.com/duzun/d1bfb5406a362e06eccd
 * 
 * @node There is a bug in Chrome's Math.random() according to
 *       http://devoluk.com/google-chrome-math-random-issue.html For that reason
 *       we use Date.now() as well.
 */
$.UUID = function() {
  function s(n) {
    return h((Math.random() * (1 << (n << 2))) ^ Date.now()).slice(-n);
  }
  function h(n) {
    return (n | 0).toString(16);
  }
  return [s(4) + s(4), s(4), '4' + s(3), // 
  h(8 | (Math.random() * 4)) + s(3), // {8|9|A|B}xxx
  // s(4) + s(4) + s(4),
  Date.now().toString(16).slice(-10) + s(2) // Use timestamp to avoid
  // collisions
  ].join('-');
}

$.fn.masonryImagesReveal = function($items) {
  var msnry = this.data('masonry');
  var itemSelector = msnry.options.itemSelector;
  // hide by default
  $items.hide();
  // append to container
  this.append($items);

  $items.imagesLoaded().progress(function(imgLoad, image) {
    // get item
    // image is imagesLoaded class, not <img>, <img> is image.img
    var $item = $(image.img).parents(itemSelector);
    // un-hide item
    $item.show();
    // masonry does its thing
    msnry.appended($item);
  });

  return this;
};
// load on scroll
function scrollBottom(cb) {
  var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(
          window).height();
  var scrolltrigger = 0.95;
  // scrolld tracks whether user has scrolled && ($('#scrolld').val() == "0")
  if (winheight + wintop >= docheight - 200) {
    // if ((wintop / (docheight - winheight)) > scrolltrigger) {
    cb();
  }
}

var contactModal = {
  modal_template: null,
  loadModalTemplate: function(cb) {
    getTemplateAjax('js/templates/contact_modal.html', function(template) {
      // console.log("loaded - products");
      contactModal.modal_template = template;
      cb();
    });
  },
  modal: function(id) {
    // console.log(id);
    if (contactModal.modal_template == null) {
      contactModal.loadModalTemplate(function() {
        // call success once products template is loaded
        contactModal.openModal(id);
      });
    } else {
      contactModal.openModal(id);
    }
  },
  // call after navigation loads
  openModal: function(id) {
    var json = {}
    json.token = _preferences.token();
    json.url = window.location.href;
    // console.log(json);
    var html = contactModal.modal_template(json);
    $('#contact_modal').html(html);
    $.shareButton($(html));
    $('#contact_modal').modal('show');
  },
  submit: function() {
    
  }
}

var affiliateModal = {
  modal_template: null,
  loadModalTemplate: function(cb) {
    getTemplateAjax('js/templates/affiliate_modal.html', function(template) {
      // console.log("loaded - products");
      affiliateModal.modal_template = template;
      cb();
    });
  },
  modal: function(id) {
    // console.log(id);
    if (affiliateModal.modal_template == null) {
      affiliateModal.loadModalTemplate(function() {
        // call success once products template is loaded
        affiliateModal.openModal(id);
      });
    } else {
      affiliateModal.openModal(id);
    }
  },
  // call after navigation loads
  openModal: function(id) {
    var json = {}
    json.token = _preferences.token();
    json.url = window.location.href;
    // console.log(json);
    var html = affiliateModal.modal_template(json);
    $('#affiliate_modal').html(html);
    $.shareButton($(html));
    $('#affiliate_modal').modal('show');
  },
  submit: function() {

  }
}

var previewModal = {
  modal_template: null,
  loadModalTemplate: function(cb) {
    getTemplateAjax('js/templates/preview_modal.html', function(template) {
      // console.log("loaded - products");
      previewModal.modal_template = template;
      cb();
    });
  },
  modal: function(id) {
    // console.log(id);
    if (previewModal.modal_template == null) {
      previewModal.loadModalTemplate(function() {
        // call success once products template is loaded
        previewModal.openModal(id);
      });
    } else {
      previewModal.openModal(id);
    }
  },
  // call after navigation loads
  openModal: function(id) {
    var json = {}
    json.merchant_id = $(id).attr('data-m_id');
    json.merchant = $(id).attr('data-merchant');
    json.image_url = $(id).attr('data-image');
    json.url = $(id).attr('data-url');
    json.msg = $(id).attr('data-msg');
    json.type = $(id).attr('data-type');
    json.token = $.cookie('token');
    // console.log(json);
    var html = previewModal.modal_template(json);
    $('#preview_modal').html(html);
    $.shareButton($(html));
    $('#preview_modal').modal('show');
  }
};

var login = {
  modal_template: null,
  getInfo: function() {
    if ($.cookie('login') == undefined) { return {
      name: "",
      email: "",
      fbId: "",
      mallId:undefined
    }; }
    return JSON.parse($.cookie('login'));
  },
  modal: function() {
    login.openModal();
  },
  init: function() {
    var _fprefs = login.getInfo();
    if (_fprefs.name != "") {
      $('#usernamelbl').html(_fprefs.name);
    } else {
      $('#usernamelbl').html("Login");
    }
    $('#login').show();
  },
  openModal: function() {
    var _fprefs = login.getInfo();
    $('#email').val(_fprefs.email);
    $('#name').val(_fprefs.name);
    $('#fbId').val(_fprefs.fbId);
    $('#login_modal').modal('show');
  },
  saveChanges: function() {
    var _fprefs = {}
    _fprefs.email = $('#email').val();
    _fprefs.name = $('#name').val();
    _fprefs.fbId = $('#fbId').val();

    if (_fprefs.name != "") {
      $('#usernamelbl').html(_fprefs.name);
      $('#mall_lbl').html(
              _fprefs.name
                      + "'<span style='text-transform:lowercase'>s </span> ");
    } else {
      $('#usernamelbl').html('Login');
      $('#mall_lbl').html('Create your');
    }

    $.ajax(
            {
              method: "GET",
              url: DOMAIN + "login.json?email="
                      + encodeURIComponent(_fprefs.email) + '&name='
                      + _fprefs.name + '&fbId=' + _fprefs.fbId + '&token='
                      + _preferences.token()
            }).done(function(msg) {
      // save this mal id
      $('#mallId').val(msg.mallId);
      // store cookie
      _fprefs.mallId = $('#mallId').val();
      $.cookie('login', JSON.stringify(_fprefs), {
        expires: 3650,
        path: '/',
        domain: domain_name
      });

      $('#login_modal').modal('hide');
    });
  },
  checkLoginState: function() {
    FB.getLoginStatus(function(response) {
      login.FBStatusChangeCallback(response);
    });
  },
  loginStatus: function() {
    FB.api('/me', {
      locale: 'en_US',
      fields: 'name, email'
    }, function(response) {
      $('#fbId').val(response.id);
      $('#email').val(response.email)
      $('#name').val(response.name)
    });
  },
  loginFB: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        access_token = response.authResponse.accessToken; // get
        user_id = response.authResponse.userID; // get
        login.loginStatus();
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: 'publish_stream,email'
    });
  },

  FBStatusChangeCallback: function(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      login.loginStatus();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
    }
  }
}
var _preferences = {
  isFilter: false, 
  modal_template: null,
  // http://www.sitepoint.com/eat-those-cookies-with-jquery/
  token: function() {

    // console.log('token:called');
    if ($.cookie('token') == undefined) {
      $.cookie('token', $.UUID(), {
        expires: 3650,
        path: '/',
        domain: domain_name
      });
    }
    return $.cookie('token');
  },
  setToken: function(json) {
    json.token = _preferences.token();
    return json;
  },
  getURL: function() {
    return DOMAIN + 'getCities.json?token=' + _preferences.token();
  },
  json: undefined,
  ready: function(callback) {
    var flag = false;
    // console.log($.cookie('token'));
    if ($.cookie('token') == undefined) {
      flag = true;
    }
    _preferences.token();// set the token
    navigation.init(function() {
      if (navigation.json.contest != undefined) {
        contest.modal();
      } else if (flag) {
        // _preferences.modal();
      }
      if(_preferences.isFilter){
        navigation.addFilter();//stores.html
        $('.selectpicker').selectpicker();
      }
      $('#pprofile').show();
      
      callback();
    });
    // $(document).ready(function() {
    // _preferences.initCity(callback);
    // });
  },
  initCity: function(callback) {
    // set cookie
    $.getJSON(_preferences.getURL(), function(json) {
      json = _preferences.setToken(json);
      if ($.cookie("current_city") == undefined) {
        $.cookie("current_city", json.current_city, {
          expires: 3650,
          path: '/',
          domain: domain_name
        });
      }
      _preferences.json = json;
      _preferences.onSuccessCity(json);
      callback(json);
    });
  },
  getCurrentCity: function() {
    if ($.cookie("current_city") != undefined) {
      return $.cookie("current_city");
    } else if (_preferences.json != undefined) { return _preferences.json.current_city; }
    return null;
  },
  getCities: function() {
    var lst = [];
    $.each(_preferences.json.cities, function() {
      var obj = {}
      obj.value = this;
      obj.text = this;
      lst.push(obj);
    });
    return lst;
  },
  onSuccessCity: function(json) {
    // if the select city drop down exists
    if ($("#selectcity").length > 0) {
      // populate the drop down menu
      var value = _preferences.getCurrentCity();
      // console.log(value);
      var source = _preferences.getCities();
      // toggle `popup` / `inline` mode
      $.fn.editable.defaults.mode = 'popup';
      $('#selectcity').editable({
        title: 'Select city',
        placement: 'bottom',
        showbuttons: false,
        value: value,
        source: source,
        success: function(response, newValue) {
          // console.log(response);
          $.cookie("current_city", newValue, {
            expires: 3650,
            path: '/',
            domain: domain_name
          });
          window.location.reload(false);
        }
      });
      $('.selectcity').show();
    }
  },
  loadModalTemplate: function(cb) {
    getTemplateAjax('js/templates/preferences_modal.html?' + Math.random(),
            function(template) {
              // console.log("loaded - products");
              _preferences.modal_template = template;
              cb();
            });
  },
  modal: function() {
    if (_preferences.modal_template == null) {
      _preferences.loadModalTemplate(function() {
        // call success once products template is loaded
        _preferences.openModal();
      });
    } else {
      _preferences.openModal();
    }
  },
  // call after navigation loads
  openModal: function() {
    var json = navigation.json;
    var html = _preferences.modal_template(json);
    $('#pref_modal').html(html);
    $('#pref_modal').modal('show');
    $("#prefTab a").click(function(e) {
      e.preventDefault();
      $(this).tab('show');
    });
    $('.selectpicker').selectpicker();
    _preferences.applySettings();
  },
  applySettings: function() {
    var _fprefs = $.cookie('_fprefs');
    if (_fprefs == undefined) return;

    _fprefs = JSON.parse(_fprefs);
    $('#email').val(_fprefs.email);
    $('#name').val(_fprefs.name);
    $('.selectpicker').selectpicker('refresh')
    // Check the selected attribute for the real select
    /*
     * $('#btype').val(_fprefs.bodytype); $('#pref').val(_fprefs.pref);
     * $('input[name=age][value="'+_fprefs.age+'"]').prop('checked', 'checked');
     */
    $('input[name=size][value="' + _fprefs.size + '"]').prop('checked',
            'checked');
    $('input[name=budget][value="' + _fprefs.budget + '"]').prop('checked',
            'checked');
    $('input[name=store][value="' + _fprefs.store + '"]').prop('checked',
            'checked');
    $('input[name=discovery][value="' + _fprefs.discovery + '"]').prop(
            'checked', 'checked');
    /*
     * // clothing // color for (var j = 0; j < _fprefs.clothing.color.length;
     * j++) { $('#color-panel ul li a').each(function(i, el) { if
     * (_fprefs.clothing.color[j] == $(el).css('background-color')) {
     * $(el).parent().toggleClass('active'); $('#color-panel>h3>a').show();
     * return false; } }); } // price for (var j = 0; j <
     * _fprefs.clothing.price.length; j++) { $('#price-panel ul li
     * a').each(function(i, el) { if (_fprefs.clothing.price[j] == $(el).text()) {
     * $(el).parent().toggleClass('active'); $('#price-panel>h3>a').show();
     * return false; } }); } for (var j = 0; j < _fprefs.clothing.size.length;
     * j++) { $('#size-panel ul li a').each(function(i, el) { if
     * (_fprefs.clothing.size[j] == $(el).text()) {
     * $(el).parent().toggleClass('active'); $('#size-panel>h3>a').show();
     * return false; } }); } // shoes // color for (var j = 0; j <
     * _fprefs.shoes.color.length; j++) { $('#scolor-panel ul li
     * a').each(function(i, el) { if (_fprefs.shoes.color[j] ==
     * $(el).css('background-color')) { $(el).parent().toggleClass('active');
     * $('#scolor-panel>h3>a').show(); return false; } }); } // price for (var j =
     * 0; j < _fprefs.shoes.price.length; j++) { $('#sprice-panel ul li
     * a').each(function(i, el) { if (_fprefs.shoes.price[j] == $(el).text()) {
     * $(el).parent().toggleClass('active'); $('#sprice-panel>h3>a').show();
     * return false; } }); } for (var j = 0; j < _fprefs.shoes.size.length; j++) {
     * $('#ssize-panel ul li a').each(function(i, el) { if
     * (_fprefs.shoes.size[j] == $(el).text()) {
     * $(el).parent().toggleClass('active'); $('#ssize-panel>h3>a').show();
     * return false; } }); }
     */
  },
  applyFilter: function(el, id) {
    $(el).toggleClass('active');

    if ($('#' + id + ' ul li.active').length > 0) {
      $('#' + id + '>h3>a').show()
    } else {
      $('#' + id + '>h3>a').hide()
    }
  },
  clearFilter: function(id) {
    $('#' + id).find('li.active').removeClass('active');
    $('#' + id + '>h3>a').hide();
  },
  saveChanges: function() {
    var _fprefs = {}
    _fprefs.email = $('#email').val();
    _fprefs.name = $('#name').val();
    /*
     * _fprefs.bodytype = $('#btype').val(); _fprefs.pref = $('#pref').val();
     * _fprefs.age = $('input[name=age]:checked').val();
     */
    _fprefs.size = $('input[name=size]:checked').val();
    _fprefs.store = $('input[name=store]:checked').val();
    _fprefs.budget = $('input[name=budget]:checked').val();
    _fprefs.discovery = $('input[name=discovery]:checked').val();
    /*
     * _fprefs.clothing = {}; _fprefs.clothing.color = [];
     * _fprefs.clothing.price = []; _fprefs.clothing.size = [];
     * 
     * _fprefs.shoes = {}; _fprefs.shoes.color = []; _fprefs.shoes.price = [];
     * _fprefs.shoes.size = [];
     * 
     * $('#color-panel ul li.active a').each(function(i, el) {
     * _fprefs.clothing.color.push($(el).css('background-color')); });
     * $('#price-panel ul li.active a').each(function(i, el) {
     * _fprefs.clothing.price.push($(el).text()); }); $('#size-panel ul
     * li.active a').each(function(i, el) {
     * _fprefs.clothing.size.push($(el).text()); });
     * 
     * $('#scolor-panel ul li.active a').each(function(i, el) {
     * _fprefs.shoes.color.push($(el).css('background-color')); });
     * $('#sprice-panel ul li.active a').each(function(i, el) {
     * _fprefs.shoes.price.push($(el).text()); }); $('#ssize-panel ul li.active
     * a').each(function(i, el) { _fprefs.shoes.size.push($(el).text()); });
     */
    $.cookie('_fprefs', JSON.stringify(_fprefs), {
      expires: 3650,
      path: '/',
      domain: domain_name
    });
    var str = JSON.stringify(_fprefs);
    $.ajax(
            {
              method: "GET",
              url: DOMAIN + "savePreferences.json?fprefs="
                      + encodeURIComponent(str) + '&token='
                      + _preferences.token()
            }).done(function(msg) {
    });
  }
}

var contest = {
  modal_template: null,
  getURL: function() {
    return DOMAIN + 'enrollInContest.json?token=' + _preferences.token();
  },
  json: undefined,
  modal: function() {
    if (contest.modal_template == null) {
      contest.loadModalTemplate(function() {
        contest.openModal();
      });
    } else {
      contest.openModal();
    }
  },
  loadModalTemplate: function(cb) {
    getTemplateAjax('js/templates/contest_modal.html', function(template) {
      contest.modal_template = template;
      cb();
    });
  },
  openModal: function() {
    var json = navigation.json.contest;
    var html = contest.modal_template(json);
    $('#contact_modal').html(html);
    $('#contact_modal').modal('show');
  },
  submit: function() {
    // validation
    var pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
    var email_rgx = new RegExp(pattern);
    var email = $('#email_c').val();
    if (!email_rgx.test(email)) {
      $('#contest_form>div:first').addClass("has-error");
      $('#contest_form>div:first p').show();
      return;
    } else {
      $('#contest_form>div:first').removeClass("has-error");
      $('#contest_form>div:first p').hide();
    }

    var price = $('#price_c').val();
    if (!price) {
      $('#contest_form>div:nth-child(2)').addClass("has-error");
      $('#contest_form>div:nth-child(2) p').show();
      return;
    } else {
      $('#contest_form>div:nth-child(2)').removeClass("has-error");
      $('#contest_form>div:nth-child(2) p').hide();
    }

    var request = $.ajax({
      url: contest.getURL(),
      method: "GET",
      data: {
        email: encodeURIComponent(email),
        value: encodeURIComponent(price)
      },
      dataType: "html"
    });

    request.done(function(msg) {
      alert(msg);
      $('#contact_modal').modal('hide');
    });

    request.fail(function(jqXHR, textStatus) {
      alert("Contest not available! Please try again later!");
    });
    //
  }
}
// old code -- unused
// category related functions
// var bloggers = {
// data : null,
// stores : {},
// getJSON : function(onsuccess, start, end, callback) {
//
// if (bloggers.data != null && bloggers.data.length > 0) {
// onsuccess(bloggers.data.slice(start, end), callback);
// } else {
// $.getJSON(DOMAIN + 'getBlogfeeds.json?city='
// + _preferences.getCurrentCity() + '&token='
// + _preferences.token(), (function(json) {
// json = _preferences.setToken(json);
// bloggers.data = json;
// $.each(bloggers.data, function(i, str) {
// if (!(str.blogger in bloggers.stores)) {
// bloggers.stores[str.blogger] = [];
// }
// bloggers.stores[str.blogger].push(str);
// });
// onsuccess(json.slice(start, end), callback);
// }));
// }
// },
// init : function(start, end, onSuccess, callback) {
// bloggers.getJSON(onSuccess, start, end, callback);
// },
// onSuccessCarousel : function(json, cb) {
// var theTemplateScript = $("#blogger-template").html();
// // Compile the template
// var theTemplate = Handlebars.compile(theTemplateScript);
// $("#blogger-item-carousel").html(theTemplate(json));
// $("#blogger-item-carousel").carousel();
// cb();
// },
// onSuccessMasonry : function(json, callback) {
// $.loader.close('bloggers_loader');
// var theTemplateScript = $("#blogger-template").html();
// // Compile the template
// var theTemplate = Handlebars.compile(theTemplateScript);
// var html = $.parseHTML(theTemplate(json));
// $("#bloggers").append(html);
// var msnry = new Masonry('#bloggers', {
// // options
// itemSelector : '.pin'
// });
// callback(html);
// },
// filter : function(q) {
// if (bloggers.data != null) {
// var matches, substringRegex;
// // an array that will be populated with substring matches
// matches = [];
// // regex used to determine if a string contains the substring `q`
// substrRegex = new RegExp(q, 'i');
// // iterate through the pool of strings and for any string that
// // contains the substring `q`, add it to the `matches` array
// $.each(bloggers.data, function(i, str) {
//
// if (substrRegex.test(str.blogger)) {
// matches.push(str);
// }
// });
// return matches;
// }
// }
// }
// old code -- unused
//
// var trends = {
// data : null,
// stores : {},
// getJSON : function(onsuccess, start, end, callback) {
//
// if (trends.data != null && trends.data.length > 0) {
// onsuccess(trends.data.slice(start, end), callback);
// } else {
// $.getJSON(DOMAIN + 'getUpdates.json?city='
// + _preferences.getCurrentCity() + '&token='
// + _preferences.token(), (function(json) {
// json = _preferences.setToken(json);
// trends.data = json;
// $.each(trends.data, function(i, str) {
// if (!(str.merchant in bloggers.stores)) {
// trends.stores[str.merchant] = [];
// }
// trends.stores[str.merchant].push(str);
// });
// onsuccess(json.slice(start, end), callback);
// }));
// }
// },
// init : function(start, end, onSuccess, callback) {
// trends.getJSON(onSuccess, start, end, callback);
// },
// onSuccessCarousel : function(json, cb) {
// var theTemplateScript = $("#trends-template").html();
// // Compile the template
// var theTemplate = Handlebars.compile(theTemplateScript);
// $("#trends-item-carousel").html(theTemplate(json));
// $("#trends-item-carousel").carousel();
// cb();
// },
// onSuccessMasonry : function(json, callback) {
// $.loader.close('trends_loader');
// var theTemplateScript = $("#trends-template").html();
// // Compile the template
// var theTemplate = Handlebars.compile(theTemplateScript);
// var html = $.parseHTML(theTemplate(json));
// $("#trends").append(html);
// var msnry = new Masonry('#trends', {
// // options
// itemSelector : '.pin',
// columnWidth : 25,
// percentPosition : true
// });
// callback(html);
// },
// filter : function(q) {
// if (trends.data != null) {
// var matches, substringRegex;
// // an array that will be populated with substring matches
// matches = [];
// // regex used to determine if a string contains the substring `q`
// substrRegex = new RegExp(q, 'i');
// // iterate through the pool of strings and for any string that
// // contains the substring `q`, add it to the `matches` array
// $.each(trends.data, function(i, str) {
// if (substrRegex.test(str.merchant)) {
// matches.push(str);
// }
// });
// return matches;
// }
// }
// }

$.loadStoresSearch = function() {
  // https://us.locogram.com/locogram/getStoreNames.json
  var stores = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    // url points to a json file that contains an array of country names,
    // see
    // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
    prefetch: DOMAIN + 'getStoreNames.json?token=' + _preferences.token()
  });
  $('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  }, {
    name: 'stores',
    source: stores
  });
}
// latest styles section and latest styles page
var styles = {
  limit: 12,
  data: null,
  stores: {},
  $masonry_container: null,
  loading: false,
  page: undefined,
  getURL: function(offset, query) {
    var url = DOMAIN + 'getUpdates.json?token=' + _preferences.token();
    url += "&limit=" + styles.limit + "&offset=" + offset;
    if (query != '') {
      url += "&merchant=" + encodeURIComponent(query);
    }
    if (styles.page != undefined) {
      url += "&page=index";
    }
    return url;
  },
  getJSON: function(offset, query, onsuccess, callback) {
    if (!styles.loading) {
      styles.loading = true;
      $.getJSON(styles.getURL(offset, query), function(json) {
        styles.data = json;
        json = _preferences.setToken(json);
        styles.loading = false;
        onsuccess(json, callback);
      }).done(function() {
        // styles.loading = false;// to generate one query at a time
      });
    }
  },
  init: function(offset, query, onsuccess, callback) {
    styles.getJSON(offset, query, onsuccess, callback);
  },
  onSuccess: function(json, callback) {
    $.loader.close('styles_loader');
    var theTemplateScript = $("#style-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $($.parseHTML(theTemplate(json)));

    if (styles.$masonry_container == null) {
      styles.$masonry_container = $('#styles').masonry({
        itemSelector: '.pin',
        columnWidth: 46,
        percentPosition: true
      });
    }
    styles.$masonry_container.masonryImagesReveal(html);

    callback(html);
  },
  removeItemsMasonry: function() {
    if (styles.$masonry_container != null) {
      styles.$masonry_container.masonry('destroy');
    }
    styles.$masonry_container = null;
  },
  filter: function(offset, query, cb) {
    // fetch the json
    $.getJSON(styles.getURL(offset, query), function(json) {
      styles.data = json;
      json = _preferences.setToken(json);
      cb(json);
    });
  },
  loadTrends: function() {
    $('#loader').show();
    var offset = parseInt($('#end_idx').val());
    var query = $('#search_box').val();
    styles.init(offset, query, styles.onSuccess, function(data) {
      $('#loader').hide();
      $.initPrettyPhoto(data);
      $('#end_idx').val(offset + styles.limit);
      $.checkScroll(data.length, styles.loadTrends);
    });

    // }
  }
}
// for offers.html and offers section in index.html
var offers = {
  limit: 12,
  data: null,
  stores: {},
  $masonry_container: null,
  loading: false,
  page: undefined,
  getURL: function(offset, query) {
    var url = DOMAIN + 'getOffers.json?token=' + _preferences.token();
    url += "&limit=" + styles.limit + "&offset=" + offset;
    if (query != '') {
      url += "&merchant=" + encodeURIComponent(query);
    }
    if (offers.page != undefined) {
      url += "&page=index";
    }

    return url;
  },
  getJSON: function(offset, query, onsuccess, callback) {
    if (!offers.loading) {
      offers.loading = true;
      $.getJSON(offers.getURL(offset, query), function(json) {
        offers.data = json;
        json = _preferences.setToken(json);
        offers.loading = false;
        onsuccess(json, callback);

      }).done(function() {
        // offers.loading = false;// to generate one query at a time
      });
    }
  },
  init: function(offset, query, onsuccess, callback) {
    offers.getJSON(offset, query, onsuccess, callback);
  },
  onSuccess: function(json, callback) {
    $.loader.close('offer_loader');
    var theTemplateScript = $("#offer-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $($.parseHTML(theTemplate(json)));

    if (offers.$masonry_container == null) {
      offers.$masonry_container = $('#offers').masonry({
        itemSelector: '.pin',
        columnWidth: 40,
        percentPosition: true
      });
    }
    offers.$masonry_container.masonryImagesReveal(html);
    callback(html);
  },
  removeItemsMasonry: function() {
    if (offers.$masonry_container != null) {
      offers.$masonry_container.masonry('destroy');
    }
    offers.$masonry_container = null;
  },
  filter: function(offset, query, cb) {
    // fetch the json
    $.getJSON(offers.getURL(offset, query), function(json) {
      offers.data = json;
      json = _preferences.setToken(json);
      cb(json);
    });
  },
  loadOffers: function() {
    $('#loader').show();

    var offset = parseInt($('#end_idx').val());
    var query = $('#search_box').val();
    offers.init(offset, query, offers.onSuccess, function(data) {
      $('#loader').hide();
      $.initPrettyPhoto(data);
      $('#end_idx').val(offset + offers.limit);
      $.checkScroll(data.length, offers.loadOffers);
    });

    /* } */
  }
}

var malls = {
  limit: 8,
  data: null,
  loading: false,
  offsetLoadedMall: [],
  offsetLoadedStores: [],
  offsetLoadedWishlist: [],
  mallInfoTemplate: null,
  storeTemplate: null,
  mallTemplate: null,
  productTemplate: null,
  followers_template: null,
  $storeMasonryContainer: null,
  $mallMasonryContainer: null,
  $productMasonryContainer: null,
  getURL: function(page) {
    if (page == "index") {
      var url = DOMAIN + 'getMalls.json?token=' + _preferences.token()
      url += "&limit=" + malls.limit + '&page=index';
    } else if (page == "all") {
      var offset = $('#mallOffset').val();
      var url = DOMAIN + 'getMalls.json?token=' + _preferences.token()
      url += "&limit=" + malls.limit + '&page=all&offset=' + offset;
    } else {
      var query = '&id=' + $.QueryString['id'];
      var url = DOMAIN + 'getMallDetails.json?token=' + _preferences.token()
              + query;
    }
    return url;
  },
  getJSON: function(page, onsuccess, callback) {
    if (!malls.loading) {
      malls.loading = true;
      $.getJSON(malls.getURL(page), function(json) {
        malls.data = json;
        // show only those stores which has an image
        json = _preferences.setToken(json);
        malls.loading = false;
        onsuccess(json, callback);
      }).done(function(json) {
        malls.loading = false;// to generate one query at a time
      });
    }
  },
  init: function(page, onsuccess, callback) {
    var _fprefs = login.getInfo();
    $('#createMall').click(
            function() {
              var _fprefs = login.getInfo();

              if (_fprefs.name == '') {
                login.openModal();
              } else {
                window.location.href = "mall.html?token="
                        + _preferences.token() + "&id=" + _fprefs.mallId;
              }
            });
    if (_fprefs.name != '') {
      $('#mall_lbl').html(
              _fprefs.name
                      + "'<span style='text-transform:lowercase'>s </span> ");
    } else {
      $('#mall_lbl').html("Create your");
    }

    malls.getJSON(page, onsuccess, callback);
  },
  onSuccess: function(json, callback) {

    // execute and create the carousel
    var theTemplateScript = $("#malls-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $.parseHTML(theTemplate(json));

    $("#crsl-wrap-mall").append(html);
    callback(html);
    $('#crsl-wrap-mall-item').rcarousel({
      visible: 4,
      itemMinWidth: 200,
      itemMargin: 1,
      autoRotate: 4000
    });
  },
  onSuccessMasonry: function(json, callback) {

    var theTemplateScript = $("#malls-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $($.parseHTML(theTemplate(json)));

    if (malls.$mallMasonryContainer == null) {
      malls.$mallMasonryContainer = $('#malls').masonry({
        itemSelector: '.pin',
        columnWidth: 25,
        percentPosition: true
      });
    }
    var offset = parseInt($('#mallOffset').val());
    var limit = offset + malls.limit;
    $('#mallOffset').val(limit);
    malls.$mallMasonryContainer.masonryImagesReveal(html);
    callback(html);
    $.loader.close('loader');
  },
  isMyMall: function(json) {

    if (!json.mymall) {
      $('#store-title').html("<i>Stores</i>");
      $('#mall-title').html("<i>Malls</i>");
      $('#wishlist-title').html("<i>Wishlist</i>");
      $('#add-mall-button').html("");
      $('#add-store-button').html("");
    }

    $('#store-section').show();
    $('#mall-section').show();
    $('#wishlist-section').show();
  },
  loadSections: function(json, callback) {
    malls.isMyMall(json);

    getTemplateAjax('js/templates/mall_info.html?' + Math.random(), function(
            template) {
      malls.mallInfoTemplate = template;
      malls.loadMallInfo(callback);
    });
    getTemplateAjax('js/templates/store.html?', function(template) {
      malls.storeTemplate = template;
      malls.loadStore(callback);
    });
    getTemplateAjax('js/templates/mall.html?' + Math.random(), function(
            template) {
      malls.mallTemplate = template;
      malls.loadMall(callback);
    });
    getTemplateAjax('js/templates/products.hbs', function(template) {
      malls.productTemplate = template;
      malls.loadProduct(callback);
    });
  },
  toggleShowBtn: function(id, limit, length, flag) {
    if (flag || limit > length) {
      $('#' + id).hide();
      $('#add-' + id).show();
    }
  },
  loadMallInfo: function(callback) {
    var html = $(malls.mallInfoTemplate(malls.data));
    var shareStr = '<a href="javascript:void(0);"><i class="fa fa-share-square-o"></i> Share Your Mall</a>';
    $('#shop_info').html(html);
    $.shareButton(html, 'bottom right', shareStr);

    $('.shop_section').css('background-image',
            'url(' + malls.data.image_url + ')');
  },
  loadStore: function(callback) {
    if (malls.data.stores.length == 0) {
      $('#store-content').html(
              '<div style="text-align:center">No results found.</div>');
      $('#store-button').hide();
      $('#add-store-button').show();
      return;
    }
    var offset = parseInt($('#storeOffset').val());
    var json = {};
    json.stores = malls.data.stores.slice(offset, offset + malls.limit);
    json.token = malls.data.token;
    var html = $($.parseHTML(malls.storeTemplate(json)));

    if (malls.$storeMasonryContainer == null) {
      malls.$storeMasonryContainer = $('#store-content').masonry({
        itemSelector: '.pin',
        columnWidth: 40,
        percentPosition: true
      });
    }
    malls.$storeMasonryContainer.masonryImagesReveal(html);
    var limit = offset + malls.limit;
    $('#storeOffset').val(limit);
    malls.toggleShowBtn('store-button', limit, malls.data.stores.length);
  },
  loadMalls: function() {
    $('#loader').show();
    var offset = parseInt($('#mallOffset').val());
    malls.init("all", malls.onSuccessMasonry, function(data) {
      $('#loader').hide();
      $('#mallOffset').val(offset + malls.limit);
      $.checkScroll(data.length, malls.loadMalls);
    });
  },
  loadMall: function(callback) {
    if (malls.data.malls.length == 0) {
      $('#mall-content').html(
              '<div style="text-align:center">No results found.</div>');
      $('#mall-button').hide();
      $('#add-mall-button').show();
      return;
    }
    var offset = parseInt($('#mallOffset').val());
    var json = {};
    json.malls = malls.data.malls.slice(offset, offset + malls.limit);
    json.token = malls.data.token;
    var html = $($.parseHTML(malls.mallTemplate(json)));

    if (malls.$mallMasonryContainer == null) {
      malls.$mallMasonryContainer = $('#mall-content').masonry({
        itemSelector: '.pin',
        columnWidth: 40,
        percentPosition: true
      });
    }
    malls.$mallMasonryContainer.masonryImagesReveal(html);
    var limit = offset + malls.limit;
    $('#mallOffset').val(limit);
    malls.toggleShowBtn('mall-button', limit, malls.data.malls.length);
  },
  loadProduct: function(callback) {
    if (malls.data.favorites.length == 0) {
      // $('#wishlist-section').hide();
      $('#wishlist-content').html(
              '<div style="text-align:center">No results found.</div>');
      // $('#add-wishlist-button').show();
      return;
    }
    var offset = parseInt($('#productOffset').val());
    var json = malls.data.favorites.slice(offset, offset + malls.limit);
    var html = $($.parseHTML(malls.productTemplate(json)));

    if (malls.$productMasonryContainer == null) {
      malls.$productMasonryContainer = $('#wishlist-content').masonry({
        itemSelector: '.pin',
        columnWidth: 40,
        percentPosition: true
      });
    }
    malls.$productMasonryContainer.masonryImagesReveal(html);
    var limit = offset + malls.limit;
    $('#productOffset').val(limit);
    // to ensure that if there is no scroll then add more prod.
    $.checkScroll(malls.data.favorites.length, malls.loadProduct);
  },
  changePhoto: function() {
    $('#photo_modal').modal('show');
  },
  uploadFile: function() {
    var file = document.getElementById("filechooser").files[0];
    var data = new FormData();
    data.append("image", file);
    var url = DOMAIN + 'uploadMallImage.json?id=' + $.QueryString['id']
            + '&token=' + _preferences.token();
    jQuery
            .ajax({
              url: url,
              data: data,
              cache: false,
              contentType: false,
              processData: false,
              type: 'POST',
              success: function(data) {
                if (data.status == "SUCCESS") {
                  $('img.avatar').attr('src', data.photo_url);

                  $('#photo_modal').modal('hide');
                } else {
                  alert('Oops! Something went wrong. Please send email us the error and we will fix it asap.');
                }
              }
            });
  },
  getLink: function(el) {
    var id = $(el).data('id');
    var url = $(el).data('url');
    //$('#share_link').text('http://locogram.com/mall.html?id=' + id);
    $('#share_link').text(url);
    $('#share_modal').modal('show');
  }
};

var stores = {
  limit: 12,
  data: null,
  stores: {},
  loading: false,
  $masonry_container: null,
  page: undefined,
  getURL: function(offset, query) {
    var url = DOMAIN + 'getStores.json?token=' + _preferences.token();
    url += "&limit=" + styles.limit + "&offset=" + offset;
    if (query != '') {
      url += "&merchant=" + encodeURIComponent(query);
    }
    if (stores.page != undefined) {
      url += "&page=index";
    }
    
    if ($('#filters:visible select[name=city]').length > 0) {
      var p = $('#filters:visible select[name=city]').val();
      url += "&city="+ p;
    }
    
    if ($('#filters:visible select[name=stores]').length > 0) {
      var p = $('#filters:visible select[name=stores]').val();
      url += "&stores="+ p;
    }
    
    if ($('#filters:visible select[name=sortby]').length > 0) {
      var p = $('#filters:visible select[name=sortby]').val();
      url += "&sortby="+ p;
    }
    
    return url;
  },
  getJSON: function(offset, query, onsuccess, callback) {
    if (!stores.loading) {
      stores.loading = true;
      $.getJSON(stores.getURL(offset, query), function(json) {
        stores.data = json;
        // show only those stores which has an image
        json = _preferences.setToken(json);
        stores.loading = false;
        onsuccess(json, callback);
      }).done(function(json) {
        stores.loading = false;// to generate one query at a time
      });
    }
  },
  init: function(offset, query, onsuccess, callback) {
    stores.getJSON(offset, query, onsuccess, callback);
  },
  onSuccess: function(json, callback) {
    // execute and create the carousel
    var theTemplateScript = $("#shop-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $.parseHTML(theTemplate(json));

    $("#crsl-wrap").append(html);
    callback(html);
    $('#crsl-wrap-store-item').rcarousel({
      visible: 4,
      itemMinWidth: 200,
      itemMargin: 1,
      autoRotate: 4000
    });
    // $('.crsl-items').on('initCarousel', function(event, defaults, obj){
    // // Hide controls
    // $('#'+defaults.navigation).find('.previous, .next').css({ opacity: 0
    // });
    // // Show controls on gallery hover
    // // #gallery-07 wraps .crsl-items and .crls-nav
    // // .stop() prevent queue
    // $('#gallery-07').hover( function(){
    // $(this).find('.previous').css({ left: 0 }).stop(true, true).animate({
    // left: '20px', opacity: 1 });
    // $(this).find('.next').css({ right: 0 }).stop(true, true).animate({
    // right: '20px', opacity: 1 });
    // }, function(){
    // $(this).find('.previous').animate({ left: 0, opacity: 0 });
    // $(this).find('.next').animate({ right: 0, opacity: 0 });
    // });
    // });

  },
  onSuccessMasonry: function(json, callback) {
    //load the masonry
    $.loader.close('store_loader');
    var theTemplateScript = $("#store-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $($.parseHTML(theTemplate(json)));

    if (stores.$masonry_container == null) {
      stores.$masonry_container = $('#stores').masonry({
        itemSelector: '.pin',
        columnWidth: 25,
        percentPosition: true
      });
    }

    stores.$masonry_container.masonryImagesReveal(html);
    callback(html);
  },
  removeItemsMasonry: function() {
    if (stores.$masonry_container != null) {
      stores.$masonry_container.masonry('destroy');
    }
    stores.$masonry_container = null;
  },
  filter: function(offset, query, cb) {
    // fetch the json
    $.getJSON(stores.getURL(offset, query), function(json) {
      stores.data = json;
      json = _preferences.setToken(json);
      cb(json);
    });
  },
  loadStores: function() {
    /*
     * var wintop = $(window).scrollTop(), docheight = $(document) .height(),
     * winheight = $(window).height(); var scrolltrigger = 0.95;
     * 
     * if ((wintop / (docheight - winheight)) > scrolltrigger) {
     */
    $('#loader').show();
    var offset = parseInt($('#end_idx').val());
    var query = $('#search_box').val();
    stores.init(offset, query, stores.onSuccessMasonry, function(data) {
      $('#loader').hide();
      $('#end_idx').val(offset + offers.limit);
      $.checkScroll(data.length, stores.loadStores);

    });

    /* } */
  },
  reloadPage: function(){
    //reload complete stores.loadStores
    $('#stores').empty();
    $('#results').empty();
    $('#end_idx').val(0);
    stores.removeItemsMasonry();
    $.getJSON(stores.getURL(0, ""), function(json) {
      stores.data = json;
      json = _preferences.setToken(json);
      stores.onSuccessMasonry(json, function(data) {
      });
      $('#end_idx').val(json.length);
    });
    
  }

}

var products = {
  // the json url
  getURL: function() {
    return DOMAIN + 'getProducts.json?limit=9&token=' + _preferences.token();
  },
  template: null,
  data: null,
  modal_template: null,
  $container: $('#results'),
  $masonry_container: null,
  // loads the handlebar template
  offsetLoaded: {},
  loading: false,
  menu_data: null,
  init: function(id, scroll) {
    $('#offset').val(0);
    products.$container = $('#' + id);
    var url = products.getURL() + products.getFilters();
    products.getJSON(url, products.onSuccess, false, $('#offset').val());

    if (scroll) {
      products.scroll();
    }
    // $('#filter_results').html(products.getFiltersHTML());

  },
  initSearch: function() {
    $('#search_box_1').val("");
    $('#search_box_2').val("");

    $("#search_menu li a").click(function() {
      // if title
      if ($(this).text() == "Name") {
        // hide the menu
        $('span.twitter-typeahead').hide();
        $('#search_box_2').show();
        $('#search_box_1').val("");

      } else {
        $('span.twitter-typeahead').show();
        $('#search_box_2').hide();
        $('#search_box_2').val("");
      }

      $("#search_box_menu").text($(this).text());
      $("#search_box_menu").val($(this).text());

    });

    $("#search_box_1").keyup(function(event) {
      if (event.keyCode == 13) {
        products.reloadPage();
      }
      $('.tt-suggestion').hover(function() {
        $('.tt-suggestion').removeClass('tt-cursor');
        $(this).addClass('tt-cursor');
      });
    });
    $("#search_box_2").keyup(function(event) {
      if (event.keyCode == 13) {
        products.reloadPage();
      }
    });
  },
  initStoreFilter: function() {

    $('.typeahead').on('typeahead:selected', function(object, datum) {
      $(this).trigger('typeahead:_done', [object, datum]);
    }).on('typeahead:autocompleted', function(object, datum) {
      $(this).trigger('typeahead:_done', [object, datum]);
    }).on('change', function() {
      // $(this).trigger('typeahead:_changed');
    }).on('typeahead:_changed', function() {
      // products.applyStoreFilter();
    }).on('typeahead:_done', function(evt, object, datum) {
      products.applyStoreFilter();
    });
  },
  loadTemplate: function(cb) {
    getTemplateAjax('js/templates/products.hbs', function(template) {
      // console.log("loaded - products");
      products.template = template;
      cb();
    });
  },
  loadModalTemplate: function(cb) {
    getTemplateAjax('js/templates/product_modal.html?' + Math.random(),
            function(template) {
              products.modal_template = template;
              cb();
            });
  },
  getJSON: function(url, onsuccess, append, offset) {
    if (!products.loading) {
      products.loading = true;
      $('#loader').show();
      $.getJSON(url, (function(json) {
        products.data = json;
        json = _preferences.setToken(json);
        // load
        if (products.template == null) {
          products.loadTemplate(function() {
            // call success once products template is loaded
            onsuccess(json, append);
            // cleanup
            $('#loader').hide();
            products.loading = false;// to generate one
            // query at
            // a time
            products.offsetLoaded[offset] = true;
            $.checkScroll(products.data.length, products.loadProducts);
          });
        } else {
          onsuccess(json, append);
          // cleanup
          $('#loader').hide();
          products.loading = false;// to generate one query
          // at a
          // time
          products.offsetLoaded[offset] = true;
          $.checkScroll(products.data.length, products.loadProducts);
        }
      })).done(function() {
      });
    }
  },
  onSuccess: function(json, append) {
    var html = $($.parseHTML(products.template(json)));
    if (products.$masonry_container == null) {
      append = false;
    }
    if (append) {
      products.$masonry_container.masonryImagesReveal(html);
    } else {
      products.$masonry_container = products.$container.masonry({
        itemSelector: '.pin',
        columnWidth: 45,
        transitionDuration: 0
      });

      products.$masonry_container.masonryImagesReveal(html);

      if (json.length == 0) {
        products.$container.html("<div><br>No results found.</div>");
      }
    }
    if (json.length > 0) {
      $('#offset').val(parseInt($('#offset').val()) + json.length);
    }

    // reload the sizing panel
    $('#filter_results').html(products.getFiltersHTML());
    $('#loader').hide();
  },

  getFiltersHTML: function() {
    var filter = "<span>Showing results for ";
    // categroy
    // if (!isEmpty($.QueryString['c'])) {
    // filter += "\"" + $.QueryString['c'] + " ";
    // }
    // subcategrous
    if (!isEmpty($.QueryString['s'])) {
      filter += "\"" + $.QueryString['s'];

      if (!isEmpty($.QueryString['s1'])) {
        filter += " > " + $.QueryString['s1'];
      }
      filter += "\" </span>";
    }
    if (!isEmpty($('#search_box').val())) {
      filter += " in \"" + $('#search_box').val() + "\"";
    }
    // pick the price that are active and applyt the filter
    var c = "";

    if ($('#filters:visible select[name=price]').length > 0) {
      var p = $('#filters:visible select[name=price]').val();
      if (p != "") {
        c += "<span><a onclick='products.removeFilter(this, \"price\")' class='filter_price' href='javascript:void(0);'>"
                + p + " <i class='fa fa-times'> </i></a></span>";
      }
    } else {
      var price = $('.price-panel').find('.active');
      if (price.length > 0) {
        price.each(function() {
          var p = $(this).find('a').text();
          c += "<span><a onclick='products.removeFilter(this, \""
                  + $(this).attr("id")
                  + "\")' class='filter_price' href='javascript:void(0);'>" + p
                  + " <i class='fa fa-times'> </i></a></span>";
        });
      }
      var p = "";
      if ($('#low-price').val() != undefined && $('#low-price').val() != "") {
        if ($('#high-price').val() != "") {
          p += $('#low-price').val() + " - " + $('#high-price').val();
        } else {
          p += $('#low-price').val() + " - ";
        }
        c += "<span><a onclick='products.removeFilter(this, \"price\")' class='filter_price' href='javascript:void(0);'>"
                + p + "<i class='fa fa-times'> </i></a></span>";
      } else if ($('#high-price').val() != undefined
              && $('#high-price').val() != "") {
        p += "0-" + $('#high-price').val();
        c += "<span><a onclick='products.removeFilter(this, \"price\")' class='filter_price' href='javascript:void(0);'>"
                + p + " <i class='fa fa-times'> </i></a></span>";
      }
    }

    // pick the size
    if ($('#filters:visible select[name=size]').length > 0) {
      var p = $('#filters:visible select[name=size]').val();
      if (p != "") {
        c += "<span><a onclick='products.removeFilter(this, \"size\")' class='filter_price' href='javascript:void(0);'>"
                + p + " <i class='fa fa-times'> </i></a></span>";
      }
    } else {
      var sizes = $('.size-panel').find('.active');
      if (sizes.length > 0) {
        sizes.each(function() {
          var s = $(this).find('a').text();
          c += "<span><a onclick='products.removeFilter(this, \""
                  + $(this).attr("id")
                  + "\")' class='filter_price' href='javascript:void(0);'>" + s
                  + " <i class='fa fa-times'> </i></a></span>";
        });
      }
    }

    if ($('#filters:visible select[name=color]').length > 0) {
      var p = $('#filters:visible select[name=color]').val();
      if (p != "") {
        c += "<span><a onclick='products.removeFilter(this, \"color\")' class='filter_price' href='javascript:void(0);'>"
                + p + " <i class='fa fa-times'> </i></a></span>";
      }
    } else {
      // pick the colors that are active and apply the filter
      var colors = $('.color-panel').find('.active');
      if (colors.length > 0) {
        colors
                .each(function() {
                  var col = $(this).find('a').css('background-color');
                  c += "<span><a onclick='products.removeFilter(this, \""
                          + $(this).attr("id")
                          + "\")' class='filter_color' style='background-color:"
                          + col
                          + "' href='javascript:void(0);'> <i class='fa fa-times'> </i></a></span>";
                });
      }
    }

    if ($('#filters:visible select[name=city]').length > 0) {
      var p = $('#filters:visible select[name=city]').val();
      if (p != "") {
        c += "<span><a onclick='products.removeFilter(this, \"city\")' class='filter_price' href='javascript:void(0);'>"
                + p + " <i class='fa fa-times'> </i></a></span>";
      }
    } else {

    }

    if ($('#filters:visible select[name=stores]').length > 0) {
      var p = $('#filters:visible select[name=stores]').val();
      if (p != "") {
        c += "<span><a onclick='products.removeFilter(this, \"stores\")' class='filter_price' href='javascript:void(0);'>"
                + p + " <i class='fa fa-times'> </i></a></span>";
      }
    } else {

    }

    if (c != "") {
      c = " : " + c;
      filter += c;
    }
    if ($('#search_box_2').length > 0 && $('#search_box_2').val() != "") {
      filter += " : <span><strong>\"" + $('#search_box_2').val()
              + "\"</strong></span>"
    }
    if ($('#search_box_1').length > 0 && $('#search_box_1').val() != "") {
      filter += " : <span><strong>\"" + $('#search_box_1').val()
              + "\"</strong></span>"
    }
    return filter;
  },
  getFilters: function() {
    var filter = "&";
    // categroy

    if (!isEmpty($.QueryString['id'])) {
      filter += "merchant_id=" + encodeURIComponent($.QueryString['id']) + "&";
    }

    if (!isEmpty($.QueryString['c'])) {
      filter += "category=" + encodeURIComponent($.QueryString['c']) + "&";
    }
    // subcategrous
    if (!isEmpty($.QueryString['s'])) {
      filter += "subcategory=" + encodeURIComponent($.QueryString['s']) + "&";
    }

    if (!isEmpty($.QueryString['s1'])) {
      filter += "subsubcategory=" + encodeURIComponent($.QueryString['s1'])
              + "&";
    }
    // if (!isEmpty($('#search_box').val())) {
    // filter += "merchant=" + encodeURIComponent($('#search_box').val()) +
    // "&";
    // }
    // add price;
    if ($('#filters:visible select[name=price]').length > 0) {
      if ($('#filters:visible select[name=price]').val() != "") {
        filter += "price="
                + encodeURIComponent($('#filters:visible select[name=price]')
                        .val()) + "&";
      }
    } else {
      var price = $('.price-panel').find('.active');

      if (price.length > 0) {
        filter += "price=";
        price.each(function() {
          var p = $(this).find('a').text();
          filter += encodeURIComponent(p + ",");
        });

        // textbox price
        if ($('#low-price').val() != "") {
          if ($('#high-price').val() != "") {
            filter += encodeURIComponent("$" + $('#low-price').val() + " - "
                    + "$" + $('#high-price').val() + ",");
          } else {
            filter += encodeURIComponent("$" + $('#low-price').val() + " - ,");
          }
        } else if ($('#high-price').val() != "") {
          filter += encodeURIComponent("$0-" + "$" + $('#high-price').val()
                  + ",");
        }

        filter += "&";
        $('.price-panel>h3>a').removeClass("hide");
      } else {

        if ($('#low-price').val() != undefined && $('#low-price').val() != "") {
          filter += "price=";
          if ($('#high-price').val() != "") {
            filter += encodeURIComponent("$" + $('#low-price').val() + " - "
                    + "$" + $('#high-price').val());
          } else {
            filter += encodeURIComponent("$" + $('#low-price').val() + " - ");
          }
        } else if ($('#high-price').val() != undefined
                && $('#high-price').val() != "") {
          filter += "price=";
          filter += encodeURIComponent("$0-" + "$" + $('#high-price').val());
        }
        filter += "&"
        $('.price-panel>h3>a').addClass("hide");
      }
    }

    // color filter
    if ($('#filters:visible select[name=color]').length > 0) {
      if ($('#filters:visible select[name=color]').val() != "") {
        filter += "color="
                + encodeURIComponent($('#filters:visible select[name=color]')
                        .val()) + "&";
      }
    } else {
      var colors = $('.color-panel').find('.active');
      if (colors.length > 0) {
        filter += "color=";
        colors.each(function() {
          var col = $(this).find('a').css('background-color');
          filter += encodeURIComponent(col + ",");
        });
        filter += "&";
        $('.color-panel>h3>a').removeClass("hide");
      } else {
        $('.color-panel>h3>a').addClass("hide");
      }
    }

    if ($('#filters:visible select[name=size]').length > 0) {
      if ($('#filters:visible select[name=size]').val() != "") {
        filter += "size="
                + encodeURIComponent($('#filters:visible select[name=size]')
                        .val()) + "&";
      }
    } else {
      var sizes = $('.size-panel').find('.active');
      if (sizes.length > 0) {
        filter += "size=";
        sizes.each(function() {
          var s = encodeURIComponent($(this).find('a').text());
          filter += s + ",";
        });
        filter += "&";
        $('.size-panel>h3>a').removeClass("hide");
      } else {
        $('.size-panel>h3>a').addClass("hide");
      }
    }

    if ($('#filters:visible select[name=stores]').length > 0) {
      if ($('#filters:visible select[name=stores]').val() != "") {
        filter += "stores="
                + encodeURIComponent($('#filters select[name=stores]').val())
                + "&";
      }
    }

    if ($('#filters:visible select[name=city]').length > 0) {
      if ($('#filters:visible select[name=city]').val() != "") {
        filter += "city="
                + encodeURIComponent($('#filters:visible select[name=city]')
                        .val()) + "&";
      }
    }
    // sort by
    if ($('#sortby').val() != "") {
      filter += "sort=" + encodeURIComponent($('#sortby').val()) + "&";
    }

    // #search
    if ($('#search_box_2').length > 0 && $('#search_box_2').val() != "") {
      filter += "search=" + encodeURIComponent($('#search_box_2').val()) + "&";
    }

    if ($('#search_box_1').length > 0 && $('#search_box_1').val() != "") {
      filter += "merchant=" + encodeURIComponent($('#search_box_1').val())
              + "&";
    }

    return filter;
  },
  scroll: function() {
    $(window).scroll(function() {
      if (products.data == null || products.data.length > 0) {
        scrollBottom(products.loadProducts);
      }
    });
  },
  loadProducts: function() {
    var offset = $('#offset').val();
    // console.log(products.offsetLoaded[offset]);
    if (products.offsetLoaded[offset] == undefined) {
      var url = products.getURL() + "&offset=" + offset + products.getFilters();
      products.getJSON(url, products.onSuccess, true, offset);
    }
  },
  getModalData: function(id, ref) {
    var url = DOMAIN + "getProductDetails.json?id=" + id + '&token='
            + _preferences.token() + '&' + ref;
    // console.log(url);
    $
            .getJSON(
                    url,
                    function(json) {
                      json = _preferences.setToken(json);
                      // json.favorite= false;
                      var html = products.modal_template(json);
                      var shareStr = '<a class="add_bag" href="javascript:void(0)"><i class="fa fa-share-square-o"></i> Share</a>';
                      $('#myModal1').html(html);
                      $.shareButton($(html), 'top right', shareStr);
                      $.carousel_connected();
                      $('#myModal1').modal('show');
                    });
  },
  modal: function(id, ref) {
    // console.log(id);
    if (products.modal_template == null) {
      products.loadModalTemplate(function() {
        // call success once products template is loaded
        products.getModalData(id, ref);
      });
    } else {
      products.getModalData(id, ref);
    }

  },
  loadProductModal: function(el) {
    var id = $(el).data('id');
    var ref = $(el).data('ref');
    var url = DOMAIN + 'getProductDetails.json?id=' + id + '&token='
            + _preferences.token() + '&' + ref;
    $
            .getJSON(
                    url,
                    function(json) {
                      json = _preferences.setToken(json);
                      // json.favorite= false;
                      var html = products.modal_template(json);
                      var shareStr = '<a class="add_bag" href="javascript:void(0)"><i class="fa fa-share-square-o"></i> Share</a>';
                      $('#myModal1').html(html);
                      $.shareButton($(html), 'top right', shareStr);

                      $.carousel_connected();
                    });
  },
  changeCategory: function(el, category, subc, subsubc) {
    // change to active link
    $('.activelink').removeClass('activelink');
    $(el).addClass('activelink');
    $('#accordian').toggleClass('hidden-xs');
    //
    $.QueryString['s'] = subc;
    if (subc != subsubc) {
      $.QueryString['s1'] = subsubc;
    } else {
      $.QueryString['s1'] = undefined;
    }
    // products.json['subcategory'] = category;
    // init--and toggle the Clear option in getFilters
    products.reloadPage();
    navigation.loadSizePanel();
  },
  reloadPage: function() {
    $('#loader').show();
    products.offsetLoaded = {};
    products.$container.empty();
    products.$container.masonry('destroy');
    $('#offset').val(0);
    var url = products.getURL() + products.getFilters() + "&offset=0";
    products.getJSON(url, products.onSuccess, false, $('#offset').val());
    // $('#filter_results').html(products.getFiltersHTML());
  },
  applyStoreFilter: function() {
    // reloads the page and applying the filter
    products.reloadPage();
  },
  applyFilter: function(el) {
    $(el).toggleClass('active');
    products.reloadPage();
  },
  removeFilter: function(el, id) {
    if ($('#filters:visible').length > 0) {
      $('#filters select[name=' + id + ']').selectpicker('val', '');
    } else {
      $('#' + id).removeClass('active');
    }
    $(el).remove();

    if (id == 'price') {
      $('#high-price').val("");
      $('#low-price').val("");
    }

    products.reloadPage();

    // $('#filter_results').html(products.getFiltersHTML());
  },
  clearFilter: function(id) {
    $('.' + id).find('li.active').each(function(i, el) {
      $(el).toggleClass('active');
    });
    // $('#filter_results').html(products.getFiltersHTML());
    products.reloadPage();
  }

}

var shops = {
  getURL: function() {
    return DOMAIN + 'getStoreDetails.json?token=' + _preferences.token();
  },
  $container: null,
  $offer_container: $('#updates_offers'),
  $masonry_container: null,
  template: null,
  offers_template: null,
  right_nav_template: null,
  json: null,
  offset: 12,// number of update objects to use for display initially
  offsetLoaded: {},
  init: function(id) {
    shops.$container = $('#' + id);
    var url = shops.getURL() + "&id=" + $.QueryString['id'];// +
    // products.getFilters();
    // loads the template and gets the json
    shops.getJSON(url, shops.onSuccess);
    // enable scrolling
    shops.scroll();
  },
  initSearch: function() {
    $("#search_box_2").val("");
    $("#search_box_2").keyup(function(event) {
      if (event.keyCode == 13) {
        products.reloadPage();
      }
    });
  },
  // the template for the shop banner
  loadTemplate: function(cb) {
    getTemplateAjax('js/templates/shop.hbs', function(template) {
      shops.template = template;
      cb();
    });
  },
  // template for offers and styles
  loadOffersandUpdates: function(json) {
    getTemplateAjax('js/templates/offers.hbs', function(template) {
      shops.offers_template = template;
      if (json.offers.length == 0 && json.updates.length == 0) {
        $('#offer_section').hide();
        return;
      }
      $('#offer_section').show();

      var data = json.offers.slice(0, shops.offset);

      var html = $($.parseHTML(template(data)));
      $.initPrettyPhoto(html);
      shops.$masonry_container = shops.$offer_container.masonry({
        itemSelector: '.pin',
        columnWidth: 45
      });
      // console.log(html);

      shops.$masonry_container.masonryImagesReveal(html);
      // if category is empty expand offers
      if (json.category.length == 0) {
        // without setting
        shops.toggleUpdates();
      }
    });
  },
  loadRighNav: function(json) {
    if (shops.right_nav_template == null) {
      // fetch the stuff
      getTemplateAjax('js/templates/shop_right_navbar.hbs?' + Math.random(),
              function(template) {
                // load the template
                var htmlstr = template(json).replace('&#8203;', '');
                $('#right-navbar').html(htmlstr);
                $('#filters').html($('#refine-content').html())
                navigation.loadSizePanel();
              });
    } else {
      var htmlstr = shops.template(json).replace('&#8203;', '');
      $('#right-navbar').html(htmlstr);
      $('#filters').html($('#refine-content').html())
      navigation.loadSizePanel();
    }
  },
  getJSON: function(url, onsuccess) {
    $.getJSON(url, (function(json) {
      json = _preferences.setToken(json);
      // combine the updates and the offers
      json.offers = json.offers.concat(json.updates);
      shops.json = json;
      $('#map-container').storeLocator({
        "data": json.locations,
        "merchant_name": json.name
      });
      if (shops.template == null) {
        shops.loadTemplate(function() {
          // call success once products template is loaded
          onsuccess(json);
        });
      } else {
        onsuccess(json);
      }
      // Offers commented by Navin
      if(json.category.length==0){
        shops.loadOffersandUpdates(json);
      }
      
      shops.loadRighNav(json);
      if ($("#sortby").length > 0) {
        var select = $("#sortby");
        select.empty();
        select.append("<option value=''>Sort results by</option>")
        $.each(json.sort, function() {
          if (this.check) {
            select.append($("<option selected/>").val(this.option).text(
                    this.option));
          } else {
            select.append($("<option />").val(this.option).text(this.option));
          }
        });
        select.selectpicker('refresh');
      }
      if (json.category.length > 0) {
        if (json.selected.category != '') {
          $.QueryString['s'] = json.selected.category;
        } else {
          // select the first category by default
          $.QueryString['s'] = json.category[0];
        }
        json['selected_cat'] = $.QueryString['s'];

        if (json.selected.subcategory != '') {
          $.QueryString['s1'] = json.selected.subcategory;
        } else {
          $.QueryString['s1'] = '';
        }
        json['selected_subcat'] = $.QueryString['s1'];

        shops.loadProducts(false);
      } else {
        $('#products').hide();
      }

    }));
  },
  onSuccess: function(json) {
    var html = $.parseHTML(shops.template(json));
    shops.$container.html(html);

    $('.shop_section').css('background-image', 'url(' + json.image_url + ')');

  },
  scroll: function() {
    $(window).scroll(function() {
      if (products.data == null || products.data.length > 0) {
        scrollBottom(function() {
          if ($('#products').is(':visible')) {
            shops.loadProducts(true);
          }
        });
      }
    });
  },
  loadProducts: function(append) {
    var offset = $('#offset').val();

    // load only if the offset is not been previously loaded
    if (products.offsetLoaded[offset] == undefined) {
      // use the same product filters
      var filters = products.getFilters();
      // used this because; product filters doesnt capture id as merchant
      // id
      // var merchant_id = $.QueryString['id']
      // + "&merchant_id=" + merchant_id
      var url = products.getURL() + "&offset=" + offset + filters;
      products.getJSON(url, products.onSuccess, append, offset);
    }
  },
  toggleUpdates: function() {
    // hide/show the offers/updates section in the shop page
    var id = '#offers_btn';
    // var offer_loader = $('#offer_loader');
    // offer_loader.show();
    if ($(id).attr('val') == "View All") {
      $(id).attr('val', "Show Less");
      $(id).text("Show Less");
      var data = shops.json.offers.slice(shops.offset,
              shops.json.updates.length);
      data = _preferences.setToken(data);
      var html = $($.parseHTML(shops.offers_template(data)));
      // append remaining updates
      if (shops.$masonry_container == null) {
        shops.$masonry_container = shops.$offer_container.masonry({
          itemSelector: '.pin',
          columnWidth: 45
        });
      }
      shops.$masonry_container.masonryImagesReveal(html);
      $.initPrettyPhoto(html);

    } else {
      $(id).attr('val', "View All");
      $(id).text("View All");
      // remove everything and start over
      var d1 = shops.json.offers.slice(0, shops.offset);
      d1 = _preferences.setToken(d1);
      var html = $($.parseHTML(shops.offers_template(d1)));
      shops.$offer_container.empty();// !important-else css breaks
      shops.$masonry_container.masonry('destroy');
      shops.$masonry_container = shops.$offer_container.masonry({
        itemSelector: '.pin',
        columnWidth: 45
      });

      shops.$masonry_container.masonryImagesReveal(html);
      $.initPrettyPhoto(html);
    }
  }
}

var favorites = {
  $container: $('#results'),
  $masonry_container: null,
  offsetLoaded: {},
  loading: false,
  getURL: function() {
    return DOMAIN + 'getFavorites.json?limit=9&token=' + _preferences.token();
  },

  init: function(id, scroll) {
    $('#offset').val(0);
    favorites.offsetLoaded = {};
    var url = favorites.getURL();
    favorites.getJSON(url, favorites.onSuccess, false, $('#offset').val());
    if (scroll) {
      favorites.scroll();
    }
  },
  getJSON: function(url, onsuccess, append, offset) {
    if (!favorites.loading) {
      favorites.loading = true;
      $.getJSON(url, (function(json) {
        json = _preferences.setToken(json);
        // TODO: need to change url pattern based on query paramter
        // json = json.slice(0, 10);// tmep
        if (products.template == null) {
          products.loadTemplate(function() {
            // call success once products template is loaded
            onsuccess(json, append);
          });
        } else {
          onsuccess(json, append);
        }
      })).done(function() {
        favorites.loading = false;// to generate one query at a time
        favorites.offsetLoaded[offset] = true;
      });
    }

  },
  onSuccess: function(json, append) {
    var html = $($.parseHTML(products.template(json)));
    if (favorites.$masonry_container == null) {
      append = false;
    }
    if (append) {
      favorites.$masonry_container.masonryImagesReveal(html);
    } else {
      favorites.$masonry_container = favorites.$container.masonry({
        itemSelector: '.pin',
        columnWidth: 40
      });

      favorites.$masonry_container.masonryImagesReveal(html);
      if (json.length == 0) {
        favorites.$container.html("<div><br>No results found.</div>");
      }
    }
    if (json.length > 0) {
      $('#offset').val(parseInt($('#offset').val()) + json.length);
    }
    $('#loader').hide();
  },
  scroll: function() {
    $(window).scroll(function() {
      scrollBottom(favorites.loadProducts);
    });
  },
  loadProducts: function() {
    var offset = $('#offset').val();
    // console.log(products.offsetLoaded[offset]);
    if (favorites.offsetLoaded[offset] == undefined) {
      var url = favorites.getURL() + "&offset=" + offset;
      favorites.getJSON(url, favorites.onSuccess, true, offset);
    }
  },
  reloadPage: function() {
    $('#loader').show();
    favorites.offsetLoaded = {};
    favorites.$container.empty();
    favorites.$container.masonry('destroy');
    $('#offset').val(0);
    var url = favorites.getURL() + "&offset=0";
    favorites.getJSON(url, favorites.onSuccess, false, $('#offset').val());
  },

}

var isEmpty = function(str) {
  return str == undefined || str == "undefined" || str == "";
}

// /\
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    // an array that will be populated with substring matches
    matches = [];
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

function getTemplateAjax(path, callback) {
  var source;
  var template;
  $.ajax({
    url: path,
    success: function(data) {
      source = $(data).html();
      template = Handlebars.compile(source);
      // execute the callback if passed
      if (callback) callback(template);
    }
  });
}

var navigation = {
  getURL: function() {
    return DOMAIN + 'getCategoriesAndFilterOptions.json?token='
            + _preferences.token();
  },
  json: null,
  shop_template: null,
  right_nav_prod_template: null,
  right_nav_url: 'js/templates/right_navbar.hbs?' + Math.random(),
  init: function(callback) {
    getTemplateAjax('js/templates/navbar.hbs', function(template) {
      $.getJSON(navigation.getURL(), function(json) {
        navigation.checkVersion(json);

        json = _preferences.setToken(json)
        navigation.json = json;
        // var contest = {"title":"Guess the Price?","subtitle":"Be the
        // first to guess the price and get the entire look for
        // free!","image":"https:\/\/i.ytimg.com\/vi\/-v-1ODEr36Y\/maxresdefault.jpg","placeholder":"Price?"};
        // navigation.json.contest = JSON.stringify(contest);
        navigation.load_navigation_url(template, json);
        callback(json);
      });
    });
  },
  checkVersion: function(json) {
    var version = $.cookie('version');

    if (json.version != version) {
      for ( var cookie in $.cookie()) {
        console.log(cookie);
        $.removeCookie(cookie, {
          path: '/',
          domain: domain_name
        });
      }
      $.cookie('version', json.version, {
        expires: 3650,
        path: '/',
        domain: domain_name
      });
    }
  },
  load_navigation_url: function(template, json) {
    var html = template(json);
    $('#navbar-collapse-1').html(html);
  },
  initSort: function(json) {
    if ($("#sortby").length > 0) {

      var select = $("#sortby");
      $.each(json.sort, function() {
        if (this.check) {
          select.append($("<option selected/>").val(this.option).text(
                  this.option));
        } else {
          select.append($("<option />").val(this.option).text(this.option));
        }
      });
      select.selectpicker('refresh');
    }
  },
  initRightNav: function(cb) {
    if (navigation.right_nav_prod_template == null) {
      getTemplateAjax(navigation.right_nav_url, function(template) {
        navigation.right_nav_prod_template = template;
        // do something with compiled template
        if (navigation.json == null) {
          $.getJSON(navigation.getURL(), function(json) {
            json = _preferences.setToken(json);
            navigation.json = json;
            navigation.initSort(json);
            navigation.loadRightNav(template, json, cb);
          });
        } else {
          navigation.initSort(navigation.json);
          navigation.loadRightNav(template, navigation.json, cb);
        }

      });
    } else {
      navigation.initSort(navigation.json);
      navigation.loadRightNav(navigation.right_nav_prod_template,
              navigation.json);
    }
  },
  loadRightNav: function(template, json, cb) {
    var category = $.QueryString['c'];
    json['selected_cat'] = category;
    json['selected_subcat'] = $.QueryString['s'];
    json['selected_listcat'] = json[category];// used for category
    // iteratopm
    var htmlstr = template(json).replace('&#8203;', '');
    $('#right-navbar').html(htmlstr);
    // console.log($('#refine-content').html());
    // console.log($('#filters'));
    $('#filters').html($('#refine-content').html());
    // $('#filters').html($('#refine-content').html());
    navigation.loadSizePanel();
    $('#filters select').selectpicker();
    cb();
  },
  compileNavTemplate: function() {
    if (navigation.shop_template == null) {
      var theTemplateScript = $("#size-template").html();
      // Compile the template
      var theTemplate = Handlebars.compile(theTemplateScript);
      navigation.shop_template = theTemplate;
    }
  },
  addFilter: function(){
    var theTemplateScript = $("#filter-template").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var html = $($.parseHTML(theTemplate(navigation.json)));
    $('#filters').html(html);
  },
  loadSizePanel: function() {
    $('.size-panel').remove();
    // used by either shop or products page
    if (shops.json != null) {
      var obj = shops.json;
    } else {
      var obj = navigation.json;
    }
    // load the template
    navigation.compileNavTemplate();
    // show json if defined
    if (obj.SIZE != undefined) {
      if ($.QueryString['s1'] != undefined
              && obj.SIZE[$.QueryString['s1']] != undefined) {
        var json = obj.SIZE[$.QueryString['s1']];
        var html = $.parseHTML(navigation.shop_template(json).replace(
                '&#8203;', ''));
      } else if ($.QueryString['s'] != undefined
              && obj.SIZE[$.QueryString['s']] != undefined) {
        var json = obj.SIZE[$.QueryString['s']];
        var html = $.parseHTML(navigation.shop_template(json).replace(
                '&#8203;', ''));
      } else if ($.QueryString['c'] != undefined
              && obj.SIZE[$.QueryString['c']] != undefined) {
        var json = obj.SIZE[$.QueryString['c']];
        var html = $.parseHTML(navigation.shop_template(json).replace(
                '&#8203;', ''));
      }
    }

    $('#refine').append(html);
    $('#filters').append($('#size-selectmenu').html());
    $('#size-selectmenu').html("");
  }
}

jQuery(document).ready(function() {
  var offset = 220;
  var duration = 500;
  jQuery(window).scroll(function() {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.back-to-top').fadeIn(duration);
    } else {
      jQuery('.back-to-top').fadeOut(duration);
    }
  });

  jQuery('.back-to-top').click(function(event) {
    event.preventDefault();
    jQuery('html, body').animate({
      scrollTop: 0
    }, duration);
    return false;
  })
});

function changeMenuPage(token, cat, sub_cat) {
  // products.html?token={{../../../../token}}&amp;c={{../../this}}&amp;s={{this}}
  window.location = "products.html?token=" + token + "&c="
          + encodeURIComponent(cat) + "&s=" + encodeURIComponent(sub_cat);
}

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&version=v2.6";//
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
  FB.init({
    appId: '385036888214910',
    cookie: true, // enable cookies to allow the server to access
    // the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.5' // use graph api version 2.5
  });
  FB.getLoginStatus(function(response) {
    login.FBStatusChangeCallback(response);
  });
};

function seeAllStores() {
  window.location.href = 'stores.html?token=' + _preferences.token();
}
function seeAllMalls() {
  window.location.href = 'malls.html?token=' + _preferences.token();
}
function seeProducts() {
  window.location.href = 'products.html?token=' + _preferences.token()
          + '&c=CLOTHING&s=Dresses';
}