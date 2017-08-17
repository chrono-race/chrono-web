
function toDriverTimeStructure(driver) {
  return driver.get('cumulativeTime');
}

function toTimeStructure(session) {
  return session.get('drivers').map(driver => toDriverTimeStructure(driver));
}

export default toTimeStructure;
