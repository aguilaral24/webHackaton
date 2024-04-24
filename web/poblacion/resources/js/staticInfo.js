document.addEventListener('DOMContentLoaded', function() {
    var collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(function(collapsible) {
      var header = collapsible.querySelector('.collapsible-header');
      var arrowIcon = collapsible.querySelector('.arrow-icon');
      
      header.addEventListener('click', function() {
        collapsible.classList.toggle('open');
        arrowIcon.classList.toggle('arrow-up');
      });
    });
  });