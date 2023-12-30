let btn1 =  document.querySelector('.btn1');
let btn2 =  document.querySelector('.btn2');
let itemwrap = document.querySelector('.item-list');
let img = document.querySelector('#hinhday');



btn1.addEventListener('mouseenter', ()=>{
  btn1.style.transform = "translateY(200px)";
})

btn1.addEventListener('transitionend', ()=>{
  btn1.style.transform = "translateY(0)";
})

btn2.addEventListener('click', ()=>{
  itemwrap.classList.add('item-active')
  img.classList.add('active')
})