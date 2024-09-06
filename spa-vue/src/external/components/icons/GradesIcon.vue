<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 18.285 18.285"
    :style="{ height: size, width: size }"
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Retângulo_389"
          data-name="Retângulo 389"
          width="18.285"
          height="18.285"
          :fill="color"
        />
      </clipPath>
    </defs>
    <g clip-path="url(#clip-path)">
      <path
        d="M9.141,0a9.142,9.142,0,1,0,9.144,9.144A9.141,9.141,0,0,0,9.141,0m0,1.974A1.942,1.942,0,1,1,7.2,3.916,1.944,1.944,0,0,1,9.141,1.974M1.859,7.431A1.94,1.94,0,1,1,3.8,9.373,1.938,1.938,0,0,1,1.859,7.431m4.157,7.92a1.94,1.94,0,1,1,1.942-1.942,1.939,1.939,0,0,1-1.942,1.942m3.124-4.9a1.074,1.074,0,1,1,1.074-1.074,1.073,1.073,0,0,1-1.074,1.074m3.124,4.9a1.94,1.94,0,1,1,1.942-1.942,1.939,1.939,0,0,1-1.942,1.942m2.218-5.978a1.94,1.94,0,1,1,1.942-1.942,1.942,1.942,0,0,1-1.942,1.942"
        transform="translate(0)"
        :fill="color"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'GradesIcon',
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
