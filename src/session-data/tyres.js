
export const tyreClass = (driver, lastStint) => {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  const tyreAge = lastStint.get('tyreAge') === 0 ? 'new' : 'used';
  const tyreType = lastStint.get('tyre');
  return `${tyreAge}-${tyreType}`;
};

export const tyreText = (driver, lastStint) => {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  const code = lastStint.get('tyre');
  switch (code) {
    case 'E': return 'US';
    case 'V': return 'SS';
    case 'S': return 'S';
    case 'M': return 'M';
    case 'H': return 'H';
    default: return code;
  }
};

export const tyrePrompt = (driver, lastStint) => {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  const tyreAge = lastStint.get('tyreAge') === 0 ? 'new' : 'used';
  const code = lastStint.get('tyre');
  switch (code) {
    case 'E': return `${tyreAge} ultra soft`;
    case 'V': return `${tyreAge} super soft`;
    case 'S': return `${tyreAge} soft`;
    case 'M': return `${tyreAge} medium`;
    case 'H': return `${tyreAge} hard`;
    default: return '';
  }
};
