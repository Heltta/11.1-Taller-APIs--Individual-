/**
 * @typedef BootstrapType
 * @type {"primary"|"secondary"|"success"|"danger"|"warning"|"info"|"light"|"dark"}
 */

/**
 *
 * @param {BootstrapType} type - Bootstrap alert type
 * @param {String} message - The alert message
 * @param {String} heading - The alert heading
 * @param {Date} date - The period date/time
 */
function createAlert(type, message, heading, date) {
  const wrapper = document.createElement('div');
  wrapper.className = `alert alert-${type}`;
  wrapper.role = 'alert';
  wrapper.innerHTML = [
    `<h4 class="alert-heading">${heading}</h4>`,
    `<div>${date.toDateString()}</div>`,
    `<div>${message}</div>`,
  ].join('');

  return wrapper;
}

export { createAlert };
