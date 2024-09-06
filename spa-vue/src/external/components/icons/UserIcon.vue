<template>
  <svg
    id="Componente_117_1"
    data-name="Componente 117 – 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    :style="{ height: size, width: size }"
  >
    <circle id="Elipse_49" data-name="Elipse 49" cx="17" cy="17" r="17" fill="#e1e2e6" />
    <path
      id="Icon_material-person"
      data-name="Icon material-person"
      d="M13,13A3.5,3.5,0,1,0,9.5,9.5,3.5,3.5,0,0,0,13,13Zm0,1.75c-2.336,0-7,1.173-7,3.5V20H20V18.25C20,15.923,15.336,14.75,13,14.75Z"
      transform="translate(4 3)"
      fill="#fff"
    />
  </svg>
</template>

<script>
export default {
  name: 'UserIcon',
  props: {
    size: {
      type: String,
      default: '24px'
    },
    color: {
      type: String,
      default: '#35528C'
    }
  }
}
</script>

<style scoped></style>
