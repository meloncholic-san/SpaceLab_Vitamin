export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function setQueryParam(name, value) {
  const url = new URL(window.location.href);

  if (value === 'all' || !value) {
    url.searchParams.delete(name);
  } else {
    url.searchParams.set(name, value);
  }

  history.pushState({}, '', url);
}