import bcrypt from 'bcrypt'

const rounds = 10

export const hash = (text: string) => bcrypt.hash(text, rounds)
export const compareHash = async (text: string, encrypted: string) => bcrypt.compare(text, encrypted)