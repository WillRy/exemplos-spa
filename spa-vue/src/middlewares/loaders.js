import NProgress from 'nprogress'

export function iniciaLoader(to, from, next) {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
}

export function terminaLoader() {
  NProgress.done()
}
