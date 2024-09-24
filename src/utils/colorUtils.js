// src/utils/colorUtils.js

/**
 * Generates a hex color code based on the input string.
 * @param {string} str - The input string (e.g., user_id).
 * @returns {string} - The generated hex color code.
 */
export const getColorFromUserId = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // Simple hash function to generate a unique number based on the string
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to hex color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      // Extract byte by shifting
      const value = (hash >> (i * 8)) & 0xff;
      // Convert to hex and pad with zero if needed
      color += (`00${value.toString(16)}`).slice(-2);
    }
    return color;
  };
  