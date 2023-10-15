/**
 * @typedef {import('./openweather.js').SafetyColor} SafetyColor
 * @typedef {import('./openweather.js').LaundrySafetyReport} LaundrySafetyReport
 */
/**
 * @typedef BootstrapType
 * @type {"primary"|"secondary"|"success"|"danger"|"warning"|"info"|"light"|"dark"}
 */

function colorToBootstrapType(givenColor) {
  // Create an array pair to use as a map
  // between report color and alert type
  /**
   * @type {Array<SafetyColor>}
   */
  const colors = ['green', 'yellow', 'orange', 'red'];
  /**
   * @type {Array<BootstrapType>}
   */
  const alertTypes = ['success', 'info', 'warning', 'danger', 'dark'];

  // Convert color to alert type
  const alertType =
    alertTypes[colors.findIndex((color) => color === givenColor)];
  return alertType;
}

/**
 *
 * @param {BootstrapType} type - Bootstrap alert type
 * @param {HTMLHeadingElement} heading - The alert heading
 * @param {HTMLDivElement} content - The alert message
 * @param {HTMLDivElement} additionalContent - The alert message
 */
function createAlert(type, heading, content, additionalContent) {
  const wrapper = document.createElement('div');
  wrapper.className = `alert alert-${type}`;
  wrapper.role = 'alert';

  if (heading) {
    wrapper.className += ' alert-heading';
    wrapper.append(heading);
  }
  if (content) {
    wrapper.append(content);
    if (additionalContent) {
      wrapper.append(document.createElement('hr'));
      wrapper.append(additionalContent);
    }
  }

  // wrapper.innerHTML = [
  //   `<h4 class="alert-heading">${heading}</h4>`,
  //   '<div class="d-flex justify-content-between">',
  //   `<span>${date.toLocaleString()}</span>`,
  //   `<span>${score.toFixed(2)}</span>`,
  //   '</div>',
  //   '<hr>',
  //   `<div>${message}</div>`,
  // ].join('');

  return wrapper;
}

/**
 *
 * @param {LaundrySafetyReport} report
 * @returns - Dom element of the alert report
 */
function createPeriodReportAlert(report) {
  const date = new Date(report.dt * 1000);
  const alertTypeToShow = colorToBootstrapType(report.safetyColor);

  const heading = document.createElement('h4');
  heading.textContent = report.title;

  const content = document.createElement('div');
  content.className = 'd-flex justify-content-between';
  content.textContent = date.toLocaleString();

  const additionalContent = document.createElement('div');
  additionalContent.textContent = report.message;
  return createAlert(alertTypeToShow, heading, content, additionalContent);
}

export { createAlert, createPeriodReportAlert };
