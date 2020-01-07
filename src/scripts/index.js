
document.addEventListener('DOMContentLoaded', (event) => {
  let select = document.querySelector(".submit-on-toggle");
  select.addEventListener('change', (event) => {
    let form = event.target.closest('form');
    form.submit();
  })

  document.querySelectorAll('.bi-heart').forEach(elem=>elem.addEventListener('click', product.wishlistProduct))
  document.querySelectorAll('.bi-heart-fill').forEach(elem=>elem.addEventListener('click', product.unWishlistProduct))

})

let product = (function () {
  return {
    wishlistProduct: function () {
      const heart = event.target;
      const id = heart.closest('.card').getAttribute('data-id');
      const heartFill = heart.closest('.card').querySelector('.bi-heart-fill')
      heart.style.visibility='hidden';
      heartFill.style.visibility = 'visible';
      //alert(`product ${id} wishlisted`)
    },
    unWishlistProduct: function(){
      const heartFill = event.target;
      const id = heartFill.closest('.card').getAttribute('data-id');
      const heart = heartFill.closest('.card').querySelector('.bi-heart')
      heartFill.style.visibility='hidden';
      heart.style.visibility = 'visible';
    }
  }
})()

export const wishlistProduct = product.wishlistProduct;
