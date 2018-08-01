const ID_LENGTH = 36
const START_LETTERS_ASCII = 97 // Use 64 for uppercase
const ALPHABET_LENGTH = 26

export const uniqueID = () => [...new Array(ID_LENGTH)]
    .map(() => String.fromCharCode(START_LETTERS_ASCII + Math.random() * ALPHABET_LENGTH))
    .join("")

// Or just math random with numbers
