const xssFilters = require('xss-filters')

/* sanitize deeply nested Object */
module.exports = function sanitizeValues(value) {
  if (typeof value === 'string') {
    return xssFilters.inHTMLData(value)
  } else if (isArray(value)) {
    return sanitizeArray(value)
  } else if ((typeof value === 'object') && (value !== null)) {
    return sanitizeObject(value)
  }
  // bool
  return value
}

function sanitizeArray(array) {
  if (!isArray(array)) {
    console.log('NOT AN ARRAY DUDE')
    return false
  }
  return array.map((item, i) => {
     if (isArray(item)) {
       // recurse
       return sanitizeArray(item)
     } else if ((typeof item === 'object') && (item !== null)) {
       // recurse
       return sanitizeObject(item)
     }
     // do the sanitizing
     if (typeof item === 'string') {
       return xssFilters.inHTMLData(item)
     }
     // return bool/num
     return item
  });
}

function sanitizeObject(obj) {
  if (typeof obj !== 'object') {
    console.log('NOT AN OBJECT DUDE')
    return false
  }
  const array = Object.keys(obj)
  return array.reduce((done, curr, i, keys) => {
     const key = keys[i]
     const item = obj[key]
     // default return bool/numbers
     done[key] = item

     if (isArray(item)) {
       // recurse
       done[key] = sanitizeArray(item)
     } else if ((typeof item === 'object') && (item !== null)) {
       // recurse
       done[key] = sanitizeObject(item)
     }
     // do the sanitizing
     if (typeof item === 'string') {
       done[key] = xssFilters.inHTMLData(item)
     }
     // return clean values
     return done
  }, {})
}

function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}
