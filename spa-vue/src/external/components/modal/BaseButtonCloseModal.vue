<template>
  <div class="btn-fechar-modal">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21">
      <path
        id="Icon_awesome-window-close"
        data-name="Icon awesome-window-close"
        d="M21.75,1.5H2.25A2.251,2.251,0,0,0,0,3.75v16.5A2.251,2.251,0,0,0,2.25,22.5h19.5A2.251,2.251,0,0,0,24,20.25V3.75A2.251,2.251,0,0,0,21.75,1.5ZM17.831,15.117a.577.577,0,0,1,0,.816l-1.9,1.9a.577.577,0,0,1-.816,0L12,14.686,8.883,17.831a.577.577,0,0,1-.816,0l-1.9-1.9a.577.577,0,0,1,0-.816L9.314,12,6.169,8.883a.577.577,0,0,1,0-.816l1.9-1.9a.577.577,0,0,1,.816,0L12,9.314l3.117-3.145a.577.577,0,0,1,.816,0l1.9,1.9a.577.577,0,0,1,0,.816L14.686,12l3.145,3.117Z"
        transform="translate(0 -1.5)"
        fill="#f55b5b"
      />
    </svg>
  </div>
</template>
<style scoped>
.btn-fechar-modal {
  cursor: pointer;
  display: block;
  position: absolute;
  top: 15px;
  right: 15px;
  height: 20px;
  width: 20px;
}

.btn-fechar-modal:before {
  right: 6px;
  transform: rotate(45deg);
}

.btn-fechar-modal:hover {
  opacity: 0.6;
}
</style>
