
document.addEventListener('DOMContentLoaded', (event) => {
  let select = document.querySelector(".submit-on-toggle");
  select.addEventListener('change', (event) => {
    let form = event.target.closest('form');
    form.submit();
  })


})

let product = (function () {
  return {
    wiishlistProduct: function (prodId) {
      alert("product wishlisted")
    }
  }
})()

export const wishlistProduct = product.wishlistProduct;
