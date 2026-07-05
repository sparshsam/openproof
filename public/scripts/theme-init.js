(function(){
  var t=localStorage.getItem('openproof-theme');
  if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}
  document.documentElement.setAttribute('data-theme',t);
})();
