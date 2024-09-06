<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21.227"
    viewBox="0 0 21.227 16.506"
    :style="{ height: size, width: size }"
  >
    <path
      id="Icon_awesome-home"
      data-name="Icon awesome-home"
      d="M10.331,6.536l-6.794,5.6V18.17a.59.59,0,0,0,.59.59l4.129-.011a.59.59,0,0,0,.587-.59V14.633a.59.59,0,0,1,.59-.59H11.79a.59.59,0,0,1,.59.59v3.524a.59.59,0,0,0,.59.591l4.128.011a.59.59,0,0,0,.59-.59V12.127L10.895,6.536A.449.449,0,0,0,10.331,6.536Zm10.731,3.8L17.982,7.8V2.7a.442.442,0,0,0-.442-.442H15.476a.442.442,0,0,0-.442.442V5.371l-3.3-2.714a1.769,1.769,0,0,0-2.248,0L.159,10.339a.442.442,0,0,0-.059.623L1.04,12.1a.442.442,0,0,0,.623.06l8.668-7.139a.449.449,0,0,1,.564,0l8.668,7.139a.442.442,0,0,0,.623-.059l.94-1.142a.442.442,0,0,0-.063-.624Z"
      transform="translate(0.001 -2.254)"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'HomeIcon',
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
