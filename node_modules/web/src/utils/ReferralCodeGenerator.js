export function generateReferralCode(userId = null) {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const timestamp = Date.now().toString(36).toUpperCase();
  
  let code = 'VITYU-';
  
  if (userId) {
    const userPart = userId.toString(36).toUpperCase().slice(-3).padStart(3, '0');
    code += userPart + '-';
  }
  
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  code += '-' + timestamp.slice(-3);
  
  return code;
}

export function getReferralLink(code) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/?ref=${code}`;
}

export function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      return Promise.resolve();
    } catch (err) {
      textArea.remove();
      return Promise.reject(err);
    }
  }
}