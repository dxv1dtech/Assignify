document.addEventListener('DOMContentLoaded', function() {
  const dropdownBtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  
  if (dropdownBtn && dropdownContent) {
    // Toggle dropdown when button is clicked
    dropdownBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownContent.classList.toggle('show');
      
      // Add/remove rotation for dropdown arrow
      if (dropdownContent.classList.contains('show')) {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      } else {
        this.style.transform = '';
        this.style.boxShadow = '';
      }
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
      if (dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
        if (dropdownBtn) {
          dropdownBtn.style.transform = '';
          dropdownBtn.style.boxShadow = '';
        }
      }
    });
    
    // Prevent clicks inside dropdown from closing it
    dropdownContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // Add focus styling for form elements
    const formInputs = dropdownContent.querySelectorAll('input, select');
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.position = 'relative';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.position = '';
      });
    });
  }
});