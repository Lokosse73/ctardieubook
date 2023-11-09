document.addEventListener("scroll", function(event) {
    const title = document.querySelector(".headerTitleSmall");
    const img = document.querySelector(".headerImgSmall");
    if (window.scrollY > 450) {
        title.classList.add("headerTitle--small");
        img.classList.add("headerImg--small");
    }else{
        title.classList.remove("headerTitle--small");
        img.classList.remove("headerImg--small");
    }
});