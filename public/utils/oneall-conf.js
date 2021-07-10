var _oneall = _oneall || [];
_oneall.push([
  "social_login",
  "set_callback_uri",
  `https://final-project-gift-registry.herokuapp.com/api/callback?redirect=${window.location.origin}&page=${window.location.pathname}`,
]);
_oneall.push(["social_login", "set_providers", ["facebook", "google"]]);
_oneall.push(["social_login", "set_custom_css_uri", "https://secure.oneallcdn.com/css/api/themes/flat_w32_h32_wc_v1.css"]);
_oneall.push(["social_login", "attach_onclick_popup_ui", "oa_social_login_link"]);
